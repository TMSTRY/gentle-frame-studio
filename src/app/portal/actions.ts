"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/content/site";

export interface LoginState {
  status: "idle" | "sent" | "error";
  message?: string;
  email?: string;
}

/**
 * Sends a magic link. We never reveal whether an address is known -
 * the reply is the same either way.
 */
export async function sendMagicLink(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/portal");
  const nl = String(formData.get("lang") ?? "") === "nl";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: nl ? "Dat ziet er niet uit als een e-mailadres." : "That doesn’t look like an email address.", email };
  }

  const headerList = await headers();
  const origin = headerList.get("origin") ?? site.url;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      // Invite-only: strangers get the same neutral reply but no account.
      shouldCreateUser: false,
    },
  });

  // "Signups not allowed" means an unknown address: answer as if sent, reveal nothing.
  if (error && !/signup|not allowed|user not found/i.test(error.message)) {
    return { status: "error", message: nl ? "De link kon nu niet verstuurd worden. Probeer het over een minuut opnieuw." : "We couldn’t send the link just now. Please try again in a minute.", email };
  }
  return { status: "sent", email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

/**
 * A client accepts a sent quote. Ownership is proven by reading the
 * document as the signed-in user (RLS); the write then runs with the
 * service role. The studio gets a short notification.
 */
export async function acceptQuoteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").slice(0, 60);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: document } = await supabase
    .from("documents")
    .select("id, kind, status, project_id, title, number")
    .eq("id", id)
    .maybeSingle();
  if (!document || document.kind !== "quote" || document.status !== "sent") redirect(`/portal/documents/${id}`);

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  await admin.from("documents").update({ status: "accepted" }).eq("id", id);
  if (document.project_id) {
    await admin.from("projects").update({ status: "accepted" }).eq("id", document.project_id).in("status", ["inquiry", "quoted"]);
  }

  const { getResend, MAIL_FROM } = await import("@/lib/resend");
  const { adminEmail } = await import("@/lib/supabase/env");
  const resend = getResend();
  if (resend) {
    await resend.emails.send({
      from: MAIL_FROM,
      to: adminEmail() || site.email,
      subject: `Quote accepted · ${document.number ?? ""} ${document.title}`,
      text: `${user.email} accepted quote ${document.number ?? ""} "${document.title}".\n${site.url}/admin/documents/${id}`,
    });
  }
  redirect(`/portal/documents/${id}?accepted=1`);
}

/**
 * Click-to-sign for contracts. The client types their name and
 * confirms; we record who, when, from where, and a hash of exactly
 * what they agreed to. Both sides get a confirmation.
 */
export async function signContractAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").slice(0, 60);
  const signerName = String(formData.get("signer_name") ?? "").trim().slice(0, 120);
  const agreed = formData.get("agree") === "on";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/portal/login");
  if (signerName.length < 2 || !agreed) redirect(`/portal/documents/${id}?error=sign`);

  const { loadDocumentBundle, documentHash } = await import("@/lib/portal/documents");
  const bundle = await loadDocumentBundle(supabase, id);
  if (!bundle || bundle.document.kind !== "contract" || bundle.document.status !== "sent") {
    redirect(`/portal/documents/${id}`);
  }

  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  const userAgent = headerList.get("user-agent")?.slice(0, 300) ?? null;

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { error } = await admin.from("signatures").insert({
    document_id: id,
    signer_name: signerName,
    signer_email: user.email,
    method: "click",
    document_hash: documentHash(bundle.document, bundle.lines),
    ip,
    user_agent: userAgent,
  });
  if (error) redirect(`/portal/documents/${id}?error=sign`);
  await admin.from("documents").update({ status: "signed" }).eq("id", id);

  const { getResend, MAIL_FROM } = await import("@/lib/resend");
  const { adminEmail } = await import("@/lib/supabase/env");
  const { signedMail } = await import("@/lib/portal/document-mail");
  const resend = getResend();
  if (resend) {
    const nl = bundle.client.language === "nl";
    const mail = signedMail({
      language: nl ? "nl" : "en",
      clientName: bundle.client.name,
      number: bundle.document.number ?? "",
      title: bundle.document.title,
      url: `${site.url}/portal/documents/${id}`,
    });
    await Promise.all([
      resend.emails.send({ from: MAIL_FROM, to: bundle.client.email, replyTo: site.email, subject: mail.subject, html: mail.html, text: mail.text }),
      resend.emails.send({
        from: MAIL_FROM,
        to: adminEmail() || site.email,
        subject: `Contract signed · ${bundle.document.number ?? ""} ${bundle.document.title}`,
        text: `${signerName} (${user.email}) signed contract ${bundle.document.number ?? ""} "${bundle.document.title}".\n${site.url}/admin/documents/${id}`,
      }),
    ]);
  }
  redirect(`/portal/documents/${id}?signed=1`);
}

/**
 * The client approves the final version. One click does three things:
 * the project becomes "delivered", the balance (or full) invoice is
 * drafted from the accepted quote for the studio to check and send,
 * and both sides get a mail. Only possible while the project is in review.
 */
export async function approveProjectAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").slice(0, 60);
  const confirmed = formData.get("final") === "on";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/portal/login");
  if (!confirmed) redirect(`/portal/projects/${id}?error=approve`);

  // As the signed-in client: RLS proves the project is theirs.
  const { data: project } = await supabase.from("projects").select("id, title, status, client_id").eq("id", id).maybeSingle();
  if (!project || project.status !== "review") redirect(`/portal/projects/${id}`);

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { data: client } = await admin.from("clients").select("name, email, language").eq("id", project.client_id).maybeSingle();
  const nl = client?.language === "nl";

  await admin.from("projects").update({ status: "delivered" }).eq("id", id).eq("status", "review");
  await admin.from("project_updates").insert({
    project_id: id,
    visible_to_client: true,
    message: nl ? `Definitieve versie goedgekeurd door ${client?.name ?? user.email}.` : `Final version approved by ${client?.name ?? user.email}.`,
  });

  // The invoice that is still owed on the accepted quote, as a draft for the studio.
  const { data: quote } = await admin
    .from("documents")
    .select("id, number")
    .eq("project_id", id)
    .eq("kind", "quote")
    .eq("status", "accepted")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  let invoiceId: string | null = null;
  let invoiceNote = "No accepted quote on this project, so no invoice was drafted.";
  if (quote) {
    const { createInvoiceFromQuote, remainingInvoiceMode } = await import("@/lib/portal/invoices");
    const mode = await remainingInvoiceMode(admin, quote.id);
    if (!mode) invoiceNote = `Quote ${quote.number ?? ""} is already fully invoiced.`;
    else {
      const result = await createInvoiceFromQuote(admin, quote.id, mode);
      if ("id" in result) {
        invoiceId = result.id;
        invoiceNote = `A draft ${mode} invoice was created from quote ${quote.number ?? ""}. Check it and send it: ${site.url}/admin/documents/${result.id}`;
      } else invoiceNote = `Drafting the invoice failed (${result.error}). Make it by hand from quote ${quote.number ?? ""}.`;
    }
  }

  const { getResend, MAIL_FROM } = await import("@/lib/resend");
  const { adminEmail } = await import("@/lib/supabase/env");
  const resend = getResend();
  if (resend && client) {
    const { approvedMail } = await import("@/lib/portal/project-mail");
    const mail = approvedMail({ language: nl ? "nl" : "en", clientName: client.name, projectTitle: project.title, url: `${site.url}/portal/projects/${id}`, invoiceFollows: Boolean(invoiceId) });
    await Promise.all([
      resend.emails.send({ from: MAIL_FROM, to: client.email, replyTo: site.email, subject: mail.subject, html: mail.html, text: mail.text }),
      resend.emails.send({
        from: MAIL_FROM,
        to: adminEmail() || site.email,
        subject: `Approved · ${project.title}`,
        text: `${client.name} (${user.email}) approved the final version of "${project.title}". The project is now delivered.\n\n${invoiceNote}\n\n${site.url}/admin/projects/${id}`,
      }),
    ]);
  }
  redirect(`/portal/projects/${id}?approved=1`);
}

/**
 * The family decides whether they want one quiet note a year, on the
 * date the studio set. Ownership is proven by reading the project as
 * the signed-in client; the write runs with the service role.
 */
export async function setRemembranceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").slice(0, 60);
  const on = formData.get("on") === "1";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  const { data: project } = await supabase.from("projects").select("id, remembrance_date").eq("id", id).maybeSingle();
  if (!project || !project.remembrance_date) redirect(`/portal/projects/${id}`);
  const { createAdminClient } = await import("@/lib/supabase/admin");
  await createAdminClient().from("projects").update({ remembrance_optin: on }).eq("id", id);
  redirect(`/portal/projects/${id}?remembrance=${on ? "on" : "off"}#remembrance`);
}
