import { mailButton, mailParagraph, wrapMail } from "@/lib/mail-layout";

/** The invitation a client receives, in their language, with a one-time sign-in link. */
export function inviteMail(name: string, language: "nl" | "en", link: string) {
  const first = name.split(" ")[0];
  if (language === "nl") {
    const subject = "Je portaal bij Gentle Frame Studio";
    const html = wrapMail(
      `Dag ${first},`,
      mailParagraph(
        "We hebben een rustige plek voor je klaargezet: je eigen portaal bij Gentle Frame Studio. Daar volg je je project, vind je offertes, facturen en documenten terug, en kun je betalen of tekenen wanneer dat nodig is.",
      ) +
        mailButton(link, "Open mijn portaal") +
        mailParagraph(
          "De link is een uur geldig en werkt één keer. Verlopen? Vraag op de inlogpagina gewoon een nieuwe aan met dit e-mailadres — er is geen wachtwoord.",
        ) +
        mailParagraph("Warm,<br/>Tim — Gentle Frame Studio"),
    );
    const text = `Dag ${first},\n\nJe portaal bij Gentle Frame Studio staat klaar: ${link}\n\nDe link is een uur geldig en werkt één keer. Verlopen? Vraag op de inlogpagina een nieuwe aan.\n\nWarm, Tim`;
    return { subject, html, text };
  }
  const subject = "Your portal at Gentle Frame Studio";
  const html = wrapMail(
    `Hello ${first},`,
    mailParagraph(
      "We’ve prepared a quiet place for you: your own portal at Gentle Frame Studio. Follow your project, find quotes, invoices and documents, and pay or sign when the time comes.",
    ) +
      mailButton(link, "Open my portal") +
      mailParagraph(
        "The link is valid for an hour and works once. Expired? Simply request a new one on the sign-in page with this email address — there is no password.",
      ) +
      mailParagraph("Warmly,<br/>Tim — Gentle Frame Studio"),
  );
  const text = `Hello ${first},\n\nYour portal at Gentle Frame Studio is ready: ${link}\n\nThe link is valid for an hour and works once. Expired? Request a new one on the sign-in page.\n\nWarmly, Tim`;
  return { subject, html, text };
}
