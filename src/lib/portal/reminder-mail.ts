import { mailButton, mailParagraph, wrapMail } from "@/lib/mail-layout";

interface ReminderInput {
  language: "nl" | "en";
  clientName: string;
  number: string;
  title: string;
  total: string;
  dueDate: string;
  url: string;
  daysOverdue: number;
}

/** A gentle nudge about an invoice past its due date — never a threat. */
export function reminderMail({ language, clientName, number, title, total, dueDate, url, daysOverdue }: ReminderInput) {
  const first = clientName.split(" ")[0];
  const again = daysOverdue > 7;
  if (language === "nl") {
    const subject = `${again ? "Nog even" : "Kleine herinnering"}: factuur ${number} — ${title}`;
    const html = wrapMail(
      `Dag ${first},`,
      mailParagraph(
        again
          ? `We zagen dat factuur <strong>${number}</strong> (${total}, vervallen op ${dueDate}) nog openstaat. Misschien is hij aan de aandacht ontsnapt — dat gebeurt. Zou je hem willen bekijken?`
          : `Een kleine herinnering: factuur <strong>${number}</strong> (${total}) had als vervaldatum ${dueDate}. Geen zorgen als hij al onderweg is — dan mag je deze mail negeren.`,
      ) +
        mailButton(url, "Bekijk de factuur") +
        mailParagraph("Klopt er iets niet, of past betalen nu even niet? Antwoord gewoon op deze mail, dan zoeken we het samen uit.") +
        mailParagraph("Warm,<br/>Tim — Gentle Frame Studio"),
    );
    const text = `Dag ${first},\n\nFactuur ${number} (${total}, vervaldatum ${dueDate}) staat nog open: ${url}\n\nKlopt er iets niet? Antwoord gewoon op deze mail.\n\nWarm, Tim`;
    return { subject, html, text };
  }
  const subject = `${again ? "Still open" : "A small reminder"}: invoice ${number} — ${title}`;
  const html = wrapMail(
    `Hello ${first},`,
    mailParagraph(
      again
        ? `We noticed invoice <strong>${number}</strong> (${total}, due ${dueDate}) is still open. It may simply have slipped — that happens. Could you take a look?`
        : `A small reminder: invoice <strong>${number}</strong> (${total}) was due on ${dueDate}. If it’s already on its way, please ignore this note.`,
    ) +
      mailButton(url, "View the invoice") +
      mailParagraph("If something isn’t right, or paying now is difficult, just reply to this email and we’ll work it out together.") +
      mailParagraph("Warmly,<br/>Tim — Gentle Frame Studio"),
  );
  const text = `Hello ${first},\n\nInvoice ${number} (${total}, due ${dueDate}) is still open: ${url}\n\nIf something isn’t right, just reply to this email.\n\nWarmly, Tim`;
  return { subject, html, text };
}
