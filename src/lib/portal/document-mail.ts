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
    const subject = `${KIND_LABEL_NL[kind]} ${number} · ${title}`;
    const html = wrapMail(
      `Dag ${first},`,
      mailParagraph(`Er staat een nieuwe ${label} voor je klaar in je portaal: <strong>${title}</strong>${totalLabel ? ` (${totalLabel})` : ""}.`) +
        mailButton(url, `Open de ${label}`) +
        mailParagraph("Inloggen kan met dit e-mailadres: je ontvangt een inloglink, er is geen wachtwoord. Vragen? Antwoord gewoon op deze mail.") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio"),
    );
    const text = `Dag ${first},\n\nEr staat een nieuwe ${label} voor je klaar: ${title}${totalLabel ? ` (${totalLabel})` : ""}.\n${url}\n\nInloggen kan met dit e-mailadres, je ontvangt een inloglink.\n\nWarm, Tim`;
    return { subject, html, text };
  }
  const label = KIND_LABEL[kind].toLowerCase();
  const subject = `${KIND_LABEL[kind]} ${number} · ${title}`;
  const html = wrapMail(
    `Hello ${first},`,
    mailParagraph(`A new ${label} is waiting in your portal: <strong>${title}</strong>${totalLabel ? ` (${totalLabel})` : ""}.`) +
      mailButton(url, `Open the ${label}`) +
      mailParagraph("Sign in with this email address: you’ll receive a sign-in link, there is no password. Questions? Just reply to this email.") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio"),
  );
  const text = `Hello ${first},\n\nA new ${label} is waiting in your portal: ${title}${totalLabel ? ` (${totalLabel})` : ""}.\n${url}\n\nSign in with this email address, you’ll receive a sign-in link.\n\nWarmly, Tim`;
  return { subject, html, text };
}

/** Confirmation to the client after signing, with a link to their signed copy. */
export function signedMail({ language, clientName, number, title, url }: { language: "nl" | "en"; clientName: string; number: string; title: string; url: string }) {
  const first = clientName.split(" ")[0];
  if (language === "nl") {
    const subject = `Getekend: contract ${number} · ${title}`;
    const html = wrapMail(
      `Dag ${first},`,
      mailParagraph(`Dank je. Het contract <strong>${title}</strong> is getekend en bewaard. Je vindt je exemplaar, met het handtekeningblok, altijd terug in je portaal.`) +
        mailButton(url, "Bekijk het contract") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio"),
    );
    return { subject, html, text: `Dag ${first},\n\nHet contract ${title} is getekend en bewaard: ${url}\n\nWarm, Tim` };
  }
  const subject = `Signed: contract ${number} · ${title}`;
  const html = wrapMail(
    `Hello ${first},`,
    mailParagraph(`Thank you. The contract <strong>${title}</strong> has been signed and stored. Your copy, with the signature block, is always available in your portal.`) +
      mailButton(url, "View the contract") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio"),
  );
  return { subject, html, text: `Hello ${first},\n\nThe contract ${title} has been signed and stored: ${url}\n\nWarmly, Tim` };
}

/** Sent when an invoice is marked paid - closing the loop with a thank-you. */
export function paymentReceivedMail({ language, clientName, number, title, total, url }: { language: "nl" | "en"; clientName: string; number: string; title: string; total: string; url: string }) {
  const first = clientName.split(" ")[0];
  if (language === "nl") {
    const subject = `Betaling ontvangen: factuur ${number}`;
    const html = wrapMail(
      `Dag ${first},`,
      mailParagraph(`We hebben je betaling van <strong>${total}</strong> voor factuur ${number} (${title}) goed ontvangen. Dank je, ook voor het vertrouwen.`) +
        mailButton(url, "Bekijk de factuur") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio"),
    );
    return { subject, html, text: `Dag ${first},\n\nJe betaling van ${total} voor factuur ${number} (${title}) is goed ontvangen. Dank je.\n${url}\n\nWarm, Tim` };
  }
  const subject = `Payment received: invoice ${number}`;
  const html = wrapMail(
    `Hello ${first},`,
    mailParagraph(`We’ve received your payment of <strong>${total}</strong> for invoice ${number} (${title}). Thank you: for the payment, and for the trust.`) +
      mailButton(url, "View the invoice") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio"),
  );
  return { subject, html, text: `Hello ${first},\n\nWe’ve received your payment of ${total} for invoice ${number} (${title}). Thank you.\n${url}\n\nWarmly, Tim` };
}
