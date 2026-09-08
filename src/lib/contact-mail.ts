import type { ContactLang, ContactVariant } from "@/content/contact";
import { mailParagraph, mailRow as row, wrapMail as wrap } from "@/lib/mail-layout";

export interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
  date: string;
  lang: ContactLang;
  variant: ContactVariant;
}

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
    ? "Je bericht is aangekomen bij Gentle Frame Studio. We lezen het met aandacht en antwoorden binnen twee werkdagen — door een mens, niet door een machine."
    : "Your message has arrived at Gentle Frame Studio. We read it with care and answer within two working days — by a human, not a machine.";
  const echoLabel = nl ? "Wat je schreef" : "What you wrote";
  const closing = nl ? "Warm,<br/>Tim — Gentle Frame Studio" : "Warmly,<br/>Tim — Gentle Frame Studio";
  const html = wrap(title, mailParagraph(body) + row(echoLabel, p.message) + mailParagraph(closing));
  const text = `${title}\n\n${body}\n\n${echoLabel}:\n${p.message}\n\n${closing.replace("<br/>", "\n")}`;
  return { subject, html, text };
}
