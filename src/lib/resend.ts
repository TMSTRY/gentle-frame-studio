import { Resend } from "resend";

let client: Resend | null = null;

/** Lazily constructed Resend client; null when the key isn't configured. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export const MAIL_FROM = "Gentle Frame Studio <hello@gentleframestudio.com>";
