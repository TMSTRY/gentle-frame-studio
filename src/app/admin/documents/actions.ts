"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { computeTotals, loadDocumentBundle } from "@/lib/portal/documents";
import { documentMail } from "@/lib/portal/document-mail";
import { requireAdmin } from "@/lib/portal/guard";
import { DOCUMENT_KINDS, LINE_SLOTS, formatMoney, parseMoney, type DocumentKind, type DocumentStatus } from "@/lib/portal/labels";
import { getResend, MAIL_FROM } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";

const text = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);
const orNull = (value: string) => (value ? value : null);

function readLines(fd: FormData) {
  const lines: { position: number; description: string; quantity: number; unit_price_cents: number; line_total_cents: number }[] = [];
  for (let i = 0; i < LINE_SLOTS; i++) {
    const description = text(fd, `line_desc_${i}`, 400);
    if (!description) continue;
    const quantity = Number(String(fd.get(`line_qty_${i}`) ?? "1").replace(",", ".")) || 1;
    const unit = parseMoney(text(fd, `line_unit_${i}`, 30));
    lines.push({ position: lines.length, description, quantity, unit_price_cents: unit, line_total_cents: Math.round(quantity * unit) });
  }
  return lines;
}

/** Create or update a draft; lines are replaced wholesale. */
export async function saveDocumentAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const kindRaw = text(formData, "kind", 20);
  const kind: DocumentKind = (DOCUMENT_KINDS as readonly string[]).includes(kindRaw) ? (kindRaw as DocumentKind) : "other";
  const lines = readLines(formData);
  const vatRate = Math.max(0, Math.min(100, Number(text(formData, "vat_rate", 6).replace(",", ".")) || 0));
  const values = {
    kind,
    client_id: text(formData, "client_id", 60),
    project_id: orNull(text(formData, "project_id", 60)),
    title: text(formData, "title", 160),
    issue_date: text(formData, "issue_date", 10) || new Date().toISOString().slice(0, 10),
    due_date: orNull(text(formData, "due_date", 10)),
    vat_rate: vatRate,
    body: orNull(text(formData, "body", 20000)),
    notes: orNull(text(formData, "notes", 4000)),
    ...computeTotals(lines, vatRate),
  };
  const back = id ? `/admin/documents/${id}` : `/admin/documents/new?client=${values.client_id}&kind=${kind}`;
  if (!values.client_id || values.title.length < 2) redirect(`${back}${back.includes("?") ? "&" : "?"}error=invalid`);

  const admin = createAdminClient();
  let documentId = id;
  if (id) {
    const { data: existing } = await admin.from("documents").select("status").eq("id", id).maybeSingle();
    if (!existing || existing.status !== "draft") redirect(`/admin/documents/${id}?error=locked`);
    const { error } = await admin.from("documents").update(values).eq("id", id);
    if (error) redirect(`/admin/documents/${id}?error=save`);
    await admin.from("document_lines").delete().eq("document_id", id);
  } else {
    const { data, error } = await admin.from("documents").insert({ ...values, status: "draft" }).select("id").single();
    if (error || !data) redirect(`${back}${back.includes("?") ? "&" : "?"}error=save`);
    documentId = data.id;
  }
  if (lines.length) {
    await admin.from("document_lines").insert(lines.map((line) => ({ ...line, document_id: documentId })));
  }
  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${documentId}?saved=1`);
}

/** Numbers the document (first time), marks it sent and mails the client. */
export async function sendDocumentAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const admin = createAdminClient();
  const bundle = await loadDocumentBundle(admin, id);
  if (!bundle) redirect("/admin/documents");

  let number = bundle.document.number;
  if (!number) {
    const { data, error } = await admin.rpc("next_document_number", { p_kind: bundle.document.kind });
    if (error || !data) redirect(`/admin/documents/${id}?error=number`);
    number = data as string;
  }

  const resend = getResend();
  if (!resend) redirect(`/admin/documents/${id}?error=mail`);
  const isMoney = bundle.document.kind === "quote" || bundle.document.kind === "invoice";
  const mail = documentMail({
    kind: bundle.document.kind,
    number,
    title: bundle.document.title,
    clientName: bundle.client.name,
    language: bundle.client.language,
    url: `${site.url}/portal/documents/${id}`,
    totalLabel: isMoney ? formatMoney(bundle.document.total_cents, bundle.document.currency) : undefined,
  });
  const { error: mailError } = await resend.emails.send({
    from: MAIL_FROM,
    to: bundle.client.email,
    replyTo: site.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (mailError) redirect(`/admin/documents/${id}?error=mail`);

  await admin
    .from("documents")
    .update({ number, status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);
  if (bundle.document.kind === "quote" && bundle.project) {
    await admin.from("projects").update({ status: "quoted" }).eq("id", bundle.project.id).eq("status", "inquiry");
  }
  revalidatePath(`/admin/documents/${id}`);
  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${id}?sent=1`);
}

const MANUAL: DocumentStatus[] = ["accepted", "signed", "paid", "cancelled", "overdue"];

/** Manual status changes; "paid" also books a manual payment for the full amount. */
export async function setDocumentStatusAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const status = text(formData, "status", 20) as DocumentStatus;
  if (!MANUAL.includes(status)) redirect(`/admin/documents/${id}`);

  const admin = createAdminClient();
  const { data: document } = await admin.from("documents").select("id, kind, total_cents, project_id").eq("id", id).maybeSingle();
  if (!document) redirect("/admin/documents");

  await admin.from("documents").update({ status }).eq("id", id);
  if (status === "paid") {
    const bundle = await loadDocumentBundle(admin, id);
    const resend = getResend();
    if (bundle && bundle.document.kind === "invoice" && resend) {
      const { paymentReceivedMail } = await import("@/lib/portal/document-mail");
      const mail = paymentReceivedMail({
        language: bundle.client.language,
        clientName: bundle.client.name,
        number: bundle.document.number ?? "",
        title: bundle.document.title,
        total: formatMoney(bundle.document.total_cents, bundle.document.currency),
        url: `${site.url}/portal/documents/${id}`,
      });
      await resend.emails.send({ from: MAIL_FROM, to: bundle.client.email, replyTo: site.email, subject: mail.subject, html: mail.html, text: mail.text });
    }
    await admin.from("payments").insert({
      document_id: id,
      provider: "manual",
      kind: "full",
      amount_cents: document.total_cents,
      status: "paid",
      paid_at: new Date().toISOString(),
    });
  }
  if (status === "accepted" && document.kind === "quote" && document.project_id) {
    await admin.from("projects").update({ status: "accepted" }).eq("id", document.project_id).in("status", ["inquiry", "quoted"]);
  }
  revalidatePath(`/admin/documents/${id}`);
  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${id}?saved=1`);
}

/** Studio details used on every PDF. */
export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const value = {
    name: text(formData, "name", 120) || "Gentle Frame Studio",
    brand: text(formData, "brand", 120) || "Gentle Frames",
    email: text(formData, "email", 200) || site.email,
    website: text(formData, "website", 200) || site.url,
    country: (text(formData, "country", 2) || "BE").toUpperCase(),
    address_line1: orNull(text(formData, "address_line1", 200)),
    postal_code: orNull(text(formData, "postal_code", 20)),
    city: orNull(text(formData, "city", 120)),
    vat_number: orNull(text(formData, "vat_number", 40)),
    iban: orNull(text(formData, "iban", 60).replace(/\s+/g, " ")),
    default_vat_rate: Math.max(0, Math.min(100, Number(text(formData, "default_vat_rate", 6).replace(",", ".")) || 0)),
    payment_terms_days: Math.max(0, Number(text(formData, "payment_terms_days", 4)) || 14),
    invoice_footer: text(formData, "invoice_footer", 300) || "Thank you for trusting us with your story.",
  };
  const admin = createAdminClient();
  const { error } = await admin.from("settings").upsert({ key: "studio", value, updated_at: new Date().toISOString() });
  if (error) redirect("/admin/settings?error=save");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

/**
 * One click from an accepted quote to a draft invoice. "full" copies the
 * lines; "deposit" bills a percentage as a single line; "balance" copies
 * the lines and deducts what earlier deposit invoices from this quote
 * already billed. Needs migration 002 (documents.source_document_id).
 */
export async function invoiceFromQuoteAction(formData: FormData) {
  await requireAdmin();
  const quoteId = text(formData, "id", 60);
  const mode = text(formData, "mode", 10) as "full" | "deposit" | "balance";
  const pct = Math.max(1, Math.min(100, Number(text(formData, "pct", 5)) || 30));
  const admin = createAdminClient();
  const bundle = await loadDocumentBundle(admin, quoteId);
  if (!bundle || bundle.document.kind !== "quote") redirect(`/admin/documents/${quoteId}`);
  const { document: quote, lines, studio } = bundle;
  const ref = quote.number ?? quote.title;

  let invoiceLines: { description: string; quantity: number; unit_price_cents: number }[] = [];
  let title = quote.title;
  if (mode === "deposit") {
    const amount = Math.round((quote.subtotal_cents * pct) / 100);
    invoiceLines = [{ description: `Deposit ${pct}% — ${ref}`, quantity: 1, unit_price_cents: amount }];
    title = `${quote.title} — deposit ${pct}%`;
  } else {
    invoiceLines = lines.map((line) => ({ description: line.description, quantity: Number(line.quantity), unit_price_cents: line.unit_price_cents }));
    if (mode === "balance") {
      const { data: deposits } = await admin
        .from("documents")
        .select("number, subtotal_cents")
        .eq("source_document_id", quoteId)
        .eq("kind", "invoice")
        .neq("status", "cancelled")
        .ilike("title", "%deposit%");
      const billed = (deposits ?? []).reduce((sum, d) => sum + (d.subtotal_cents ?? 0), 0);
      if (billed > 0) {
        const numbers = (deposits ?? []).map((d) => d.number).filter(Boolean).join(", ");
        invoiceLines.push({ description: `Less: deposit already invoiced${numbers ? ` (${numbers})` : ""}`, quantity: 1, unit_price_cents: -billed });
      }
      title = `${quote.title} — balance`;
    }
  }

  const vatRate = Number(quote.vat_rate);
  const due = new Date(Date.now() + studio.payment_terms_days * 86400000).toISOString().slice(0, 10);
  const { data, error } = await admin
    .from("documents")
    .insert({
      kind: "invoice",
      status: "draft",
      client_id: quote.client_id,
      project_id: quote.project_id,
      source_document_id: quoteId,
      title,
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: due,
      vat_rate: vatRate,
      body: quote.body,
      notes: `Created from quote ${ref}.`,
      ...computeTotals(invoiceLines, vatRate),
    })
    .select("id")
    .single();
  if (error || !data) redirect(`/admin/documents/${quoteId}?error=${error?.code === "42703" ? "migration" : "save"}`);
  await admin.from("document_lines").insert(
    invoiceLines.map((line, position) => ({ ...line, position, document_id: data.id, line_total_cents: Math.round(line.quantity * line.unit_price_cents) })),
  );
  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${data.id}?saved=1`);
}
