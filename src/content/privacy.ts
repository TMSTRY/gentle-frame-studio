/**
 * Privacy notice, English and Dutch. Written from what the site
 * actually does: a contact form, a client portal, analytics without
 * cookies, and the memorial work. Update the "Last updated" date
 * whenever a section changes.
 */

export type PrivacyLocale = "en" | "nl";

export interface PrivacySection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyCopy {
  locale: PrivacyLocale;
  path: string;
  otherPath: string;
  otherLabel: string;
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: PrivacySection[];
}

const UPDATED = "2026-09-11";

const en: PrivacyCopy = {
  locale: "en",
  path: "/privacy",
  otherPath: "/nl/privacy",
  otherLabel: "Lees dit in het Nederlands",
  meta: {
    title: "Privacy",
    description: "How Gentle Frame Studio handles your data: what we collect, why, how long we keep it, and your rights.",
  },
  eyebrow: "Privacy notice",
  title: "What we do with your data, plainly.",
  intro:
    "We run a small studio and we handle your information the way we handle your stories: carefully, and only as much as needed. This page explains what we collect, why, how long we keep it and what you can ask of us.",
  updated: `Last updated ${UPDATED}`,
  sections: [
    {
      title: "Who is responsible",
      paragraphs: [
        "Gentle Frame Studio, Belgium, is the controller of the data described here. You can reach us at hello@gentleframestudio.com. Company registration details will be added here once the studio is registered.",
      ],
    },
    {
      title: "When you write to us",
      paragraphs: [
        "The contact form asks for your name, your email address, what your message is about and the message itself; the memorial intake may also ask for a date. We use this only to answer you and to prepare a conversation. Messages are sent to our mailbox through Resend (our email provider) and kept in that mailbox for as long as the conversation is relevant, at most two years after our last exchange.",
        "To keep bots out, the form quietly discards submissions that show automated behaviour. Nothing about you is stored for that purpose.",
      ],
    },
    {
      title: "When you become a client",
      paragraphs: [
        "If we work together, we create a client record with your name, email address and, when needed for documents, your company name, VAT number and address. You sign in to the client portal with a one-time link sent to your email; there is no password. In the portal we keep your projects, the updates we write to you, quotes, invoices and contracts, payment records and, when you sign a contract online, your typed name, email address, the time, your IP address, your browser type and a fingerprint of the document you agreed to. That record is what makes the signature valid.",
        "Invoices and their supporting records are kept for the period Belgian accounting law requires (currently seven years). Other client data is removed when the relationship ends and you ask us to, or after five years of inactivity.",
      ],
    },
    {
      title: "Memorial films",
      paragraphs: [
        "For a memorial film you share photographs, videos, voice messages and stories about someone who has died, and often about living family members too. We treat this material as confidential. It is used only to make your film, is never published, reused or shown without the family’s written consent, and is deleted from our working files on request once the film is delivered. The finished film is yours.",
      ],
    },
    {
      title: "Where your data lives",
      paragraphs: [
        "The site and the portal run on Vercel; the portal database and file storage run on Supabase in Frankfurt (EU); email is sent through Resend and received through ImprovMX. These providers process data on our behalf under their own data processing agreements. Some of them may transfer data outside the EU under the safeguards the GDPR allows.",
      ],
    },
    {
      title: "Visitor statistics",
      paragraphs: [
        "We use Vercel Web Analytics to see which pages are visited and from which country. It does not use cookies and does not identify you; it stores no personal data, which is why you don’t see a cookie banner here. The site sets a small technical value in your browser to remember that you have seen the opening animation, and a session cookie when you sign in to the portal.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "You can ask us at any time what we hold about you, ask us to correct or delete it, ask for a copy, or object to a use you disagree with. Write to hello@gentleframestudio.com and we answer within a month. If you feel we handled your data badly, you can complain to the Belgian Data Protection Authority (gegevensbeschermingsautoriteit.be), though we would rather hear from you first.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "If we change how we handle data, we update this page and the date at the top. Substantial changes are announced to clients in the portal.",
      ],
    },
  ],
};

const nl: PrivacyCopy = {
  locale: "nl",
  path: "/nl/privacy",
  otherPath: "/privacy",
  otherLabel: "Read this in English",
  meta: {
    title: "Privacy",
    description: "Hoe Gentle Frame Studio met je gegevens omgaat: wat we verzamelen, waarom, hoe lang we het bewaren en welke rechten je hebt.",
  },
  eyebrow: "Privacyverklaring",
  title: "Wat we met je gegevens doen, gewoon gezegd.",
  intro:
    "We zijn een kleine studio en we gaan met je gegevens om zoals met je verhalen: zorgvuldig, en niet meer dan nodig. Deze pagina legt uit wat we verzamelen, waarom, hoe lang we het bewaren en wat je van ons mag vragen.",
  updated: `Laatst bijgewerkt ${UPDATED}`,
  sections: [
    {
      title: "Wie verantwoordelijk is",
      paragraphs: [
        "Gentle Frame Studio, België, is de verwerkingsverantwoordelijke voor de gegevens die hier beschreven staan. Je bereikt ons via hello@gentleframestudio.com. Het ondernemingsnummer wordt hier toegevoegd zodra de studio geregistreerd is.",
      ],
    },
    {
      title: "Wanneer je ons schrijft",
      paragraphs: [
        "Het contactformulier vraagt je naam, je e-mailadres, waarover je bericht gaat en het bericht zelf; de intake voor herinneringsfilms kan ook een datum vragen. We gebruiken dit alleen om je te antwoorden en een gesprek voor te bereiden. Berichten komen via Resend (onze e-mailprovider) in onze mailbox en blijven daar zolang het gesprek relevant is, hoogstens twee jaar na ons laatste contact.",
        "Om bots buiten te houden gooit het formulier inzendingen met geautomatiseerd gedrag stil weg. Daarvoor wordt niets over jou bewaard.",
      ],
    },
    {
      title: "Wanneer je klant wordt",
      paragraphs: [
        "Werken we samen, dan maken we een klantfiche met je naam, e-mailadres en, als dat nodig is voor documenten, je bedrijfsnaam, btw-nummer en adres. Je logt in op het klantenportaal met een eenmalige link per e-mail; er is geen wachtwoord. In het portaal bewaren we je projecten, de updates die we je schrijven, offertes, facturen en contracten, betalingsgegevens en, als je een contract online tekent, je getypte naam, e-mailadres, het tijdstip, je IP-adres, je browsertype en een vingerafdruk van het document waarmee je akkoord ging. Dat is wat de handtekening geldig maakt.",
        "Facturen en hun onderliggende stukken bewaren we zolang de Belgische boekhoudwetgeving dat vereist (momenteel zeven jaar). Andere klantgegevens verwijderen we als de samenwerking stopt en jij erom vraagt, of na vijf jaar zonder activiteit.",
      ],
    },
    {
      title: "Herinneringsfilms",
      paragraphs: [
        "Voor een herinneringsfilm deel je foto’s, video’s, spraakberichten en verhalen over iemand die overleden is, en vaak ook over levende familieleden. We behandelen dat materiaal als vertrouwelijk. Het wordt alleen gebruikt om jouw film te maken, wordt nooit gepubliceerd, hergebruikt of getoond zonder schriftelijke toestemming van de familie, en wordt op vraag uit onze werkbestanden verwijderd zodra de film is opgeleverd. De afgewerkte film is van jou.",
      ],
    },
    {
      title: "Waar je gegevens staan",
      paragraphs: [
        "De site en het portaal draaien op Vercel; de database en de bestandsopslag van het portaal draaien op Supabase in Frankfurt (EU); e-mail wordt verstuurd via Resend en ontvangen via ImprovMX. Deze leveranciers verwerken gegevens in onze opdracht onder hun eigen verwerkersovereenkomst. Sommige kunnen gegevens buiten de EU doorgeven onder de waarborgen die de AVG toelaat.",
      ],
    },
    {
      title: "Bezoekersstatistieken",
      paragraphs: [
        "We gebruiken Vercel Web Analytics om te zien welke pagina’s bezocht worden en vanuit welk land. Het gebruikt geen cookies en identificeert je niet; het bewaart geen persoonsgegevens, en daarom zie je hier geen cookiebanner. De site zet één kleine technische waarde in je browser om te onthouden dat je de openingsanimatie al zag, en een sessiecookie wanneer je inlogt op het portaal.",
      ],
    },
    {
      title: "Je rechten",
      paragraphs: [
        "Je mag ons altijd vragen wat we over je bewaren, vragen om het te verbeteren of te verwijderen, een kopie vragen, of bezwaar maken tegen een gebruik waar je het niet mee eens bent. Schrijf naar hello@gentleframestudio.com; we antwoorden binnen een maand. Vind je dat we slecht met je gegevens omgingen, dan kun je klacht indienen bij de Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be), al horen we het liever eerst van jou.",
      ],
    },
    {
      title: "Wijzigingen",
      paragraphs: [
        "Verandert er iets aan hoe we met gegevens omgaan, dan passen we deze pagina en de datum bovenaan aan. Grote wijzigingen melden we aan klanten in het portaal.",
      ],
    },
  ],
};

export const privacyCopy: Record<PrivacyLocale, PrivacyCopy> = { en, nl };
