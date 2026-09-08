import type { ContactLang, ContactVariant } from "@/content/contact";
import { site } from "@/content/site";

export interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
  date: string;
  lang: ContactLang;
  variant: ContactVariant;
}

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

const wrap = (title: string, inner: string) => `
<!doctype html><html><body style="margin:0;background:#f2ead9;font-family:Georgia,'Times New Roman',serif;color:#0a0908;">
  <div style="max-width:560px;margin:0 auto;padding:48px 28px;">
    <p style="margin:0 0 28px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#978c78;">Gentle Frame Studio</p>
    <h1 style="margin:0 0 24px;font-size:28px;font-weight:500;line-height:1.2;">${title}</h1>
    ${inner}
    <p style="margin:40px 0 0;padding-top:20px;border-top:1px solid rgba(10,9,8,0.12);font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#978c78;">${site.legalName} — ${site.location} — ${site.domain}</p>
  </div>
</body></html>`;

const row = (label: string, value: string) =>
  value
    ? `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;"><span style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#978c78;display:block;margin-bottom:4px;">${label}</span>${escape(value).replace(/\n/g, "<br/>")}</p>`
    : "";

/** Internal notification to the studio inbox. */
export function notificationMail(p: ContactPayload) {
  const isMemorial = p.variant === "memorial";
  const subject = isMemorial
    ? `Memorial film inquiry — ${p.name}`
    : `New message — ${p.topic || "General"} — ${p.name}`;
  const html = wrap(
    isMemorial ? "A family wrote to us." : "Someone wrote to us.",
    row("Name", p.name) +
      row("Email", p.email) +
      row("About", isMemorial ? "Memorial film" : p.topic) +
      row(isMemorial ? "Date to know about" : "", p.date) +
      row("Message", p.message) +
      row("Language", p.lang === "nl" ? "Nederlands" : "English"),
  );
  const text = `${subject}\n\nName: ${p.name}\nEmail: ${p.email}\nAbout: ${isMemorial ? "Memorial film" : p.topic}\n${p.date ? `Date: ${p.date}\n` : ""}\n${p.message}`;
  return { subject, html, text };
}

/** Confirmation to the person who wrote, in their language. */
export function confirmationMail(p: ContactPayload) {
  const nl = p.lang === "nl";
  const subject = nl ? "We hebben je bericht ontvangen" : "We’ve received your message";
  const title = nl ? "Dank je om te schrijven." : "Thank you for writing.";
  const body = nl
    ? `Je bericht is aangekomen bij Gentle Frame Studio. We lezen het met aandacht en antwoorden binnen twee werkdagen — door een mens, niet door een machine.`
    : `Your message has arrived at Gentle Frame Studio. We read it with care and answer within two working days — by a human, not a machine.`;
  const echoLabel = nl ? "Wat je schreef" : "What you wrote";
  const closing = nl ? "Warm,<br/>Tim — Gentle Frame Studio" : "Warmly,<br/>Tim — Gentle Frame Studio";
  const html = wrap(
    title,
    `<p style="margin:0 0 22px;font-size:17px;line-height:1.7;">${body}</p>` +
      row(echoLabel, p.message) +
      `<p style="margin:28px 0 0;font-size:17px;line-height:1.7;">${closing}</p>`,
  );
  const text = `${title}\n\n${body}\n\n${echoLabel}:\n${p.message}\n\n${closing.replace("<br/>", "\n")}`;
  return { subject, html, text };
}
