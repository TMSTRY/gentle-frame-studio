"use server";

import type { ContactLang, ContactVariant } from "@/content/contact";
import { site } from "@/content/site";
import { confirmationMail, notificationMail, type ContactPayload } from "@/lib/contact-mail";
import { getResend, MAIL_FROM } from "@/lib/resend";

export interface ContactState {
  status: "idle" | "sent" | "error";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (formData: FormData, key: string, max: number) =>
  String(formData.get(key) ?? "").trim().slice(0, max);

/**
 * Handles both contact variants. Bots are answered with a silent
 * "sent": a filled honeypot or a sub-2.5s submission never reaches
 * the inbox. Real failures return an error the form can show.
 */
export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const honeypot = text(formData, "website", 200);
  const renderedAt = Number(formData.get("ts") ?? 0);
  if (honeypot || (renderedAt && Date.now() - renderedAt < 2500)) {
    return { status: "sent" };
  }

  const payload: ContactPayload = {
    name: text(formData, "name", 120),
    email: text(formData, "email", 200),
    topic: text(formData, "topic", 80),
    message: text(formData, "message", 4000),
    date: text(formData, "date", 120),
    lang: (text(formData, "lang", 2) === "nl" ? "nl" : "en") as ContactLang,
    variant: (text(formData, "variant", 10) === "memorial" ? "memorial" : "studio") as ContactVariant,
  };

  if (payload.name.length < 2 || !EMAIL.test(payload.email) || payload.message.length < 2) {
    return { status: "error" };
  }

  const resend = getResend();
  if (!resend) return { status: "error" };

  const notification = notificationMail(payload);
  const confirmation = confirmationMail(payload);

  const [toStudio, toVisitor] = await Promise.all([
    resend.emails.send({
      from: MAIL_FROM,
      to: site.email,
      replyTo: payload.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    }),
    resend.emails.send({
      from: MAIL_FROM,
      to: payload.email,
      replyTo: site.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    }),
  ]);

  // The studio copy is the one that matters; a failed confirmation
  // shouldn't turn a delivered inquiry into an error for the visitor.
  if (toStudio.error) return { status: "error" };
  void toVisitor;
  return { status: "sent" };
}
