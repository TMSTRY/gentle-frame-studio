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
