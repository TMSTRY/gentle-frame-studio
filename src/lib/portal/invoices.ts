import type { SupabaseClient } from "@supabase/supabase-js";
import { computeTotals, loadDocumentBundle } from "@/lib/portal/documents";

export type InvoiceMode = "full" | "deposit" | "balance";

/**
 * One step from an accepted quote to a draft invoice. "full" copies the
 * lines; "deposit" bills a percentage as a single line; "balance" copies
 * the lines and deducts what earlier deposit invoices from this quote
 * already billed. Needs migration 002 (documents.source_document_id).
 * Used by the admin button and by the client's approval.
 */
export async function createInvoiceFromQuote(
  admin: SupabaseClient,
  quoteId: string,
  mode: InvoiceMode,
  pct = 30,
): Promise<{ id: string } | { error: "notfound" | "migration" | "save" }> {
  const bundle = await loadDocumentBundle(admin, quoteId);
  if (!bundle || bundle.document.kind !== "quote") return { error: "notfound" };
  const { document: quote, lines, studio } = bundle;
  const ref = quote.number ?? quote.title;

  let invoiceLines: { description: string; quantity: number; unit_price_cents: number }[] = [];
  let title = quote.title;
  if (mode === "deposit") {
    const amount = Math.round((quote.subtotal_cents * pct) / 100);
    invoiceLines = [{ description: `Deposit ${pct}% · ${ref}`, quantity: 1, unit_price_cents: amount }];
    title = `${quote.title}, deposit ${pct}%`;
  } else {
    invoiceLines = lines.map((line) => ({ description: line.description, quantity: Number(line.quantity), unit_price_cents: line.unit_price_cents }));
    if (mode === "balance") {
      const { data: deposits } = await admin
        .from("documents")
        .select("number, subtotal_cents")
        .eq("source_document_id", quoteId)
        .eq("kind", "invoice")
        .neq("status", "cancelled")
        .is("deleted_at", null)
        .ilike("title", "%deposit%");
      const billed = (deposits ?? []).reduce((sum, d) => sum + (d.subtotal_cents ?? 0), 0);
      if (billed > 0) {
        const numbers = (deposits ?? []).map((d) => d.number).filter(Boolean).join(", ");
        invoiceLines.push({ description: `Less: deposit already invoiced${numbers ? ` (${numbers})` : ""}`, quantity: 1, unit_price_cents: -billed });
      }
      title = `${quote.title}, balance`;
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
  if (error || !data) return { error: error?.code === "42703" ? "migration" : "save" };
  await admin.from("document_lines").insert(
    invoiceLines.map((line, position) => ({ ...line, position, document_id: data.id, line_total_cents: Math.round(line.quantity * line.unit_price_cents) })),
  );
  return { id: data.id };
}

/**
 * Which invoice still needs to be made for a quote once the work is
 * approved: nothing when a full or balance invoice already exists,
 * "balance" after deposits, otherwise "full".
 */
export async function remainingInvoiceMode(admin: SupabaseClient, quoteId: string): Promise<InvoiceMode | null> {
  const { data } = await admin
    .from("documents")
    .select("title")
    .eq("source_document_id", quoteId)
    .eq("kind", "invoice")
    .neq("status", "cancelled")
    .is("deleted_at", null);
  const rows = data ?? [];
  if (rows.some((row) => !/deposit/i.test(row.title))) return null;
  return rows.length ? "balance" : "full";
}
