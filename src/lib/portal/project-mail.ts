import { escapeHtml, mailButton, mailParagraph, wrapMail } from "@/lib/mail-layout";

type Lang = "nl" | "en";
const first = (name: string) => escapeHtml(name.split(" ")[0]);

/** To the client right after they approve the final version. */
export function approvedMail({ language, clientName, projectTitle, url, invoiceFollows }: { language: Lang; clientName: string; projectTitle: string; url: string; invoiceFollows: boolean }) {
  const title = escapeHtml(projectTitle);
  if (language === "nl") {
    const subject = `Goedgekeurd: ${projectTitle}`;
    const html = wrapMail(
      `Dag ${first(clientName)},`,
      mailParagraph(`Dank je. <strong>${title}</strong> is goedgekeurd en staat nu op opgeleverd. De definitieve bestanden vind je in je portaal, of ze volgen daar binnenkort.`) +
        (invoiceFollows ? mailParagraph("De saldofactuur verschijnt binnenkort in je portaal.") : "") +
        mailButton(url, "Open je project") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio"),
    );
    return { subject, html, text: `Dag ${clientName.split(" ")[0]},\n\n${projectTitle} is goedgekeurd en opgeleverd. ${invoiceFollows ? "De saldofactuur volgt in je portaal. " : ""}${url}\n\nWarm, Tim` };
  }
  const subject = `Approved: ${projectTitle}`;
  const html = wrapMail(
    `Hello ${first(clientName)},`,
    mailParagraph(`Thank you. <strong>${title}</strong> is approved and now marked as delivered. The final files are in your portal, or will appear there shortly.`) +
      (invoiceFollows ? mailParagraph("The balance invoice will appear in your portal soon.") : "") +
      mailButton(url, "Open your project") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio"),
  );
  return { subject, html, text: `Hello ${clientName.split(" ")[0]},\n\n${projectTitle} is approved and delivered. ${invoiceFollows ? "The balance invoice follows in your portal. " : ""}${url}\n\nWarmly, Tim` };
}

/** To the client when a new cut is ready to watch. */
export function cutReadyMail({ language, clientName, projectTitle, version, url }: { language: Lang; clientName: string; projectTitle: string; version: number; url: string }) {
  const title = escapeHtml(projectTitle);
  if (language === "nl") {
    const subject = `Nieuwe versie om te bekijken: ${projectTitle}`;
    const html = wrapMail(
      `Dag ${first(clientName)},`,
      mailParagraph(`Versie ${version} van <strong>${title}</strong> staat klaar in je portaal. Bekijk ze rustig. Wil je iets aanpassen, klik dan op een moment in de film en schrijf erbij wat je opvalt. Klopt alles, dan kun je de versie meteen goedkeuren.`) +
        mailButton(url, "Bekijk de versie") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio"),
    );
    return { subject, html, text: `Dag ${clientName.split(" ")[0]},\n\nVersie ${version} van ${projectTitle} staat klaar in je portaal: ${url}\n\nWarm, Tim` };
  }
  const subject = `A new cut to watch: ${projectTitle}`;
  const html = wrapMail(
    `Hello ${first(clientName)},`,
    mailParagraph(`Cut ${version} of <strong>${title}</strong> is ready in your portal. Take your time. If something should change, click a moment in the film and write what you notice. If it all feels right, you can approve it straight away.`) +
      mailButton(url, "Watch the cut") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio"),
  );
  return { subject, html, text: `Hello ${clientName.split(" ")[0]},\n\nCut ${version} of ${projectTitle} is ready in your portal: ${url}\n\nWarmly, Tim` };
}

/** To the client when the studio adds a file to their project. */
export function fileDeliveredMail({ language, clientName, projectTitle, fileName, url }: { language: Lang; clientName: string; projectTitle: string; fileName: string; url: string }) {
  const title = escapeHtml(projectTitle);
  const file = escapeHtml(fileName);
  if (language === "nl") {
    const subject = `Nieuw bestand: ${projectTitle}`;
    const html = wrapMail(
      `Dag ${first(clientName)},`,
      mailParagraph(`Er staat een nieuw bestand voor je klaar bij <strong>${title}</strong>: ${file}. Je vindt het onder Bestanden in je portaal en kunt het daar downloaden.`) +
        mailButton(url, "Open je project") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio"),
    );
    return { subject, html, text: `Dag ${clientName.split(" ")[0]},\n\nNieuw bestand bij ${projectTitle}: ${fileName}\n${url}\n\nWarm, Tim` };
  }
  const subject = `New file: ${projectTitle}`;
  const html = wrapMail(
    `Hello ${first(clientName)},`,
    mailParagraph(`A new file is waiting for you in <strong>${title}</strong>: ${file}. You’ll find it under Files in your portal, ready to download.`) +
      mailButton(url, "Open your project") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio"),
  );
  return { subject, html, text: `Hello ${clientName.split(" ")[0]},\n\nNew file in ${projectTitle}: ${fileName}\n${url}\n\nWarmly, Tim` };
}

/** One sentence, once a year, on the family's date. No news, no offers. */
export function remembranceMail({ language, clientName, projectTitle, url }: { language: Lang; clientName: string; projectTitle: string; url: string }) {
  const title = escapeHtml(projectTitle);
  if (language === "nl") {
    const subject = `Vandaag denken we aan jullie · ${projectTitle}`;
    const html = wrapMail(
      `Dag ${first(clientName)},`,
      mailParagraph(`Vandaag denken we even aan jullie. De film <strong>${title}</strong> staat er nog altijd, voor wie hem wil zien.`) +
        mailButton(url, "Bekijk de film") +
        mailParagraph("Warm,<br/>Tim · Gentle Frame Studio") +
        `<p style="margin:28px 0 0;font-size:12px;color:#978c78;">Je vroeg ons dit berichtje één keer per jaar te sturen. Liever niet meer? Zet het uit in je portaal, of antwoord gewoon op deze mail.</p>`,
    );
    return { subject, html, text: `Dag ${clientName.split(" ")[0]},\n\nVandaag denken we even aan jullie. De film ${projectTitle} staat er nog altijd: ${url}\n\nWarm, Tim\n\nLiever geen jaarlijks berichtje meer? Zet het uit in je portaal of antwoord op deze mail.` };
  }
  const subject = `Thinking of you today · ${projectTitle}`;
  const html = wrapMail(
    `Hello ${first(clientName)},`,
    mailParagraph(`We’re thinking of you today. The film <strong>${title}</strong> is still there, for whoever wants to see it.`) +
      mailButton(url, "Watch the film") +
      mailParagraph("Warmly,<br/>Tim · Gentle Frame Studio") +
      `<p style="margin:28px 0 0;font-size:12px;color:#978c78;">You asked us to send this note once a year. Rather not? Switch it off in your portal, or simply reply to this email.</p>`,
  );
  return { subject, html, text: `Hello ${clientName.split(" ")[0]},\n\nWe’re thinking of you today. The film ${projectTitle} is still there: ${url}\n\nWarmly, Tim\n\nRather no yearly note? Switch it off in your portal or reply to this email.` };
}
