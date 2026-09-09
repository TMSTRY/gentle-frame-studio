import { KIND_LABEL, KIND_LABEL_NL, type DocumentKind } from "@/lib/portal/labels";
import { mailButton, mailParagraph, wrapMail } from "@/lib/mail-layout";

interface DocumentMailInput {
  kind: DocumentKind;
  number: string;
  title: string;
  clientName: string;
  language: "nl" | "en";
  url: string;
  totalLabel?: string;
}

/** "A new quote/invoice/contract is waiting in your portal", in the client's language. */
export function documentMail({ kind, number, title, clientName, language, url, totalLabel }: DocumentMailInput) {
  const first = clientName.split(" ")[0];
  if (language === "nl") {
    const label = KIND_LABEL_NL[kind].toLowerCase();
    const subject = `${KIND_LABEL_NL[kind]} ${number} — ${title}`;
    const html = wrapMail(
      `Dag ${first},`,
      mailParagraph(`Er staat een nieuwe ${label} voor je klaar in je portaal: <strong>${title}</strong>${totalLabel ? ` (${totalLabel})` : ""}.`) +
        mailButton(url, `Open de ${label}`) +
        mailParagraph("Inloggen kan met dit e-mailadres — je ontvangt een inloglink, er is geen wachtwoord. Vragen? Antwoord gewoon op deze mail.") +
        mailParagraph("Warm,<br/>Tim — Gentle Frame Studio"),
    );
    const text = `Dag ${first},\n\nEr staat een nieuwe ${label} voor je klaar: ${title}${totalLabel ? ` (${totalLabel})` : ""}.\n${url}\n\nInloggen kan met dit e-mailadres — je ontvangt een inloglink.\n\nWarm, Tim`;
    return { subject, html, text };
  }
  const label = KIND_LABEL[kind].toLowerCase();
  const subject = `${KIND_LABEL[kind]} ${number} — ${title}`;
  const html = wrapMail(
    `Hello ${first},`,
    mailParagraph(`A new ${label} is waiting in your portal: <strong>${title}</strong>${totalLabel ? ` (${totalLabel})` : ""}.`) +
      mailButton(url, `Open the ${label}`) +
      mailParagraph("Sign in with this email address — you’ll receive a sign-in link, there is no password. Questions? Just reply to this email.") +
      mailParagraph("Warmly,<br/>Tim — Gentle Frame Studio"),
  );
  const text = `Hello ${first},\n\nA new ${label} is waiting in your portal: ${title}${totalLabel ? ` (${totalLabel})` : ""}.\n${url}\n\nSign in with this email address — you’ll receive a sign-in link.\n\nWarmly, Tim`;
  return { subject, html, text };
}
