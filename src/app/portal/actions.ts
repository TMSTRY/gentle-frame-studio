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
 * Sends a magic link. We never reveal whether an address is known —
 * the reply is the same either way.
 */
export async function sendMagicLink(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/portal");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That doesn’t look like an email address.", email };
  }

  const headerList = await headers();
  const origin = headerList.get("origin") ?? site.url;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { status: "error", message: "We couldn’t send the link just now. Please try again in a minute.", email };
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
      subject: `Quote accepted — ${document.number ?? ""} ${document.title}`,
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
        subject: `Contract signed — ${bundle.document.number ?? ""} ${bundle.document.title}`,
        text: `${signerName} (${user.email}) signed contract ${bundle.document.number ?? ""} "${bundle.document.title}".\n${site.url}/admin/documents/${id}`,
      }),
    ]);
  }
  redirect(`/portal/documents/${id}?signed=1`);
}
