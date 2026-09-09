/**
 * Copy for the Memorial Films landing page, in English and Dutch.
 * Both versions share one layout (components/memorial/MemorialPage);
 * only the words differ. Keep the two dictionaries in step.
 */

export type MemorialLocale = "en" | "nl";

export interface MemorialStep {
  index: string;
  title: string;
  body: string;
}

export interface MemorialCopy {
  locale: MemorialLocale;
  ogLocale: string;
  path: string;
  otherPath: string;
  otherLabel: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: [string, string]; lede: string; scroll: string };
  intro: { eyebrow: string; title: string; paragraphs: string[] };
  film: { eyebrow: string; title: string; body: string; play: string; caption: string };
  steps: { eyebrow: string; title: string; items: MemorialStep[] };
  promises: { eyebrow: string; title: string; items: { title: string; body: string }[] };
  practical: { eyebrow: string; title: string; items: { label: string; value: string }[]; note: string };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  cta: { eyebrow: string; title: [string, string]; body: string; reassurance: string };
}

const en: MemorialCopy = {
  locale: "en",
  ogLocale: "en_US",
  path: "/memorial-films",
  otherPath: "/nl/herinneringsfilms",
  otherLabel: "Lees dit in het Nederlands",
  meta: {
    title: "Memorial Films",
    description:
      "Respectful, cinematic memorial films made from photographs, voices and fragments of a life. Crafted slowly with the family in Belgium, delivered worldwide. Nothing invented, nothing shared without consent.",
  },
  hero: {
    eyebrow: "Memorial Films — For the ones we carry",
    title: ["A place to return to,", "for as long as you need."],
    lede:
      "A memorial film gathers what remains — photographs, voices, small fragments of a life — and lets a memory breathe again. Made slowly, with the family, never from a template.",
    scroll: "Take your time",
  },
  intro: {
    eyebrow: "What it is",
    title: "Not a slideshow. A film.",
    paragraphs: [
      "Most of us are left with a phone full of photos, a few voice messages and a box of prints nobody has looked at in years. A memorial film brings those pieces into one quiet, cinematic story — one you can play at the ceremony, send to family abroad, and return to on the hard days.",
      "We work from what you have. Old prints are restored and gently brought to life; voice notes become narration; a favourite song sets the pace. Nothing is invented. We never put words in someone’s mouth, or moments in their life that weren’t there.",
      "The result runs from thirty seconds to about three minutes — longer when the story asks for it — finished with the care of a small film, because that is what it is.",
    ],
  },
  film: {
    eyebrow: "A film we were allowed to share",
    title: "Rudy",
    body:
      "A husband, a father, a man who painted his own walls and polished his own Harley. His family asked for something they could play at the service and keep afterwards. This is it.",
    play: "Play the film",
    caption: "Shared with the family’s blessing",
  },
  steps: {
    eyebrow: "How it goes",
    title: "Slowly, together.",
    items: [
      {
        index: "I",
        title: "A conversation",
        body: "We start with a call or a visit, at your pace. Who was this person? Which moments matter? What should the film feel like? There is no form to fill in.",
      },
      {
        index: "II",
        title: "Gathering",
        body: "You share what you have: photos, video fragments, voice messages, letters, a song. We take it from there — scanning and restoring included.",
      },
      {
        index: "III",
        title: "Crafting",
        body: "We build the film slowly, layer by layer, and show you a first cut early. You watch it in your own time and tell us what feels true and what doesn’t.",
      },
      {
        index: "IV",
        title: "Refining",
        body: "Every detail is adjusted until the family says: that’s them. Usually two rounds. Sometimes more. We don’t count.",
      },
      {
        index: "V",
        title: "Delivery",
        body: "You receive a private link and a file to keep, plus a version prepared for the ceremony screen if you need one. And we stay reachable afterwards.",
      },
    ],
  },
  promises: {
    eyebrow: "What we promise",
    title: "Dignity first, always.",
    items: [
      {
        title: "Nothing leaves the room",
        body: "Your material and the finished film are yours. We never share, publish or reuse them without the family’s written blessing — and we delete everything on request.",
      },
      {
        title: "No templates",
        body: "Every film is composed from scratch around one person. No stock music, no generic transitions, no filler.",
      },
      {
        title: "Honest use of new tools",
        body: "We use AI to restore, colour and gently animate what already exists — never to fabricate. No invented words, no invented scenes.",
      },
      {
        title: "Unhurried, but on time",
        body: "Grief has no schedule; ceremonies do. If there is a date, we make it. The care stays the same.",
      },
    ],
  },
  practical: {
    eyebrow: "Practical",
    title: "The details, plainly.",
    items: [
      { label: "Length", value: "From thirty seconds to about three minutes, depending on the material and the setting. Longer is possible when the story asks for it — every extra minute is real work, and priced as such." },
      { label: "Timeline", value: "Typically two to four weeks. A ceremony version can be ready in days when it has to be." },
      { label: "Material", value: "Photos (prints or files), video fragments, voice messages, letters, music. Any quality — we restore." },
      { label: "Languages", value: "Dutch and English. Other languages in collaboration with the family." },
      { label: "Where", value: "Belgium in person, everywhere remotely." },
      { label: "Investment", value: "Quoted after the first conversation. There is no price list, because there is no standard family." },
    ],
    note: "The first conversation is free and without obligation. You decide afterwards, in your own time.",
  },
  faq: {
    eyebrow: "Questions families ask",
    title: "Before you write.",
    items: [
      {
        q: "Can it be ready for the funeral?",
        a: "Often, yes. Tell us the date in your first message and we plan around it. A shorter ceremony version can be ready within days; the full film follows when it is ready.",
      },
      {
        q: "What do you need from us?",
        a: "Whatever you have — even if it feels like too little. A handful of photos and one voice message can already carry a film. We help you gather the rest.",
      },
      {
        q: "How do you use AI, exactly?",
        a: "As a restoration tool: to repair old photographs, recover colour, steady shaky footage and gently bring stills to life. Never to invent a voice, a sentence or a moment that didn’t happen.",
      },
      {
        q: "Who will see the film?",
        a: "Only the people you choose. The film lives on a private link. Nothing is shown publicly unless the family explicitly asks us to — as Rudy’s family did.",
      },
      {
        q: "What does it cost?",
        a: "Every film is different, so we quote after the first conversation. You’ll know the full amount before anything starts, and there are no surprises afterwards.",
      },
    ],
  },
  cta: {
    eyebrow: "Whenever you’re ready",
    title: ["Tell us about them.", "We’ll listen first."],
    body: "Write a few lines — or just a name. We answer within two working days, gently.",
    reassurance: "No forms, no obligation. Just a conversation.",
  },
};

const nl: MemorialCopy = {
  locale: "nl",
  ogLocale: "nl_BE",
  path: "/nl/herinneringsfilms",
  otherPath: "/memorial-films",
  otherLabel: "Read this in English",
  meta: {
    title: "Herinneringsfilms",
    description:
      "Respectvolle, filmische herinneringsfilms gemaakt uit foto’s, stemmen en fragmenten van een leven. Traag gemaakt samen met de familie, in België en op afstand. Niets verzonnen, niets gedeeld zonder toestemming.",
  },
  hero: {
    eyebrow: "Herinneringsfilms — Voor wie we meedragen",
    title: ["Een plek om naar terug te keren,", "zo lang als je wil."],
    lede:
      "Een herinneringsfilm verzamelt wat overblijft — foto’s, stemmen, kleine fragmenten van een leven — en laat een herinnering opnieuw ademen. Traag gemaakt, samen met de familie, nooit uit een sjabloon.",
    scroll: "Neem je tijd",
  },
  intro: {
    eyebrow: "Wat het is",
    title: "Geen diavoorstelling. Een film.",
    paragraphs: [
      "De meesten van ons blijven achter met een telefoon vol foto’s, een paar spraakberichten en een doos afdrukken waar al jaren niemand naar kijkt. Een herinneringsfilm brengt die stukken samen in één rustig, filmisch verhaal — om te tonen op de uitvaart, te sturen naar familie ver weg, en om naar terug te keren op de moeilijke dagen.",
      "We werken met wat je hebt. Oude afdrukken worden hersteld en voorzichtig tot leven gebracht; spraakberichten worden vertelstem; een lievelingslied bepaalt het tempo. Niets wordt verzonnen. We leggen niemand woorden in de mond en voegen geen momenten toe aan een leven waar ze niet in zaten.",
      "Het resultaat duurt van dertig seconden tot ongeveer drie minuten — langer als het verhaal erom vraagt — afgewerkt met de zorg van een kleine film, want dat is het.",
    ],
  },
  film: {
    eyebrow: "Een film die we mochten delen",
    title: "Rudy",
    body:
      "Een echtgenoot, een vader, een man die zijn eigen muren schilderde en zijn eigen Harley oppoetste. Zijn familie vroeg iets dat ze op de dienst konden tonen en daarna konden bewaren. Dit is het.",
    play: "Bekijk de film",
    caption: "Gedeeld met de zegen van de familie",
  },
  steps: {
    eyebrow: "Hoe het gaat",
    title: "Traag, samen.",
    items: [
      {
        index: "I",
        title: "Een gesprek",
        body: "We beginnen met een telefoontje of een bezoek, op jouw tempo. Wie was deze mens? Welke momenten tellen? Hoe moet de film voelen? Er is geen formulier.",
      },
      {
        index: "II",
        title: "Verzamelen",
        body: "Je deelt wat je hebt: foto’s, videofragmenten, spraakberichten, brieven, een lied. Wij nemen het van daar over — scannen en herstellen inbegrepen.",
      },
      {
        index: "III",
        title: "Maken",
        body: "We bouwen de film traag op, laag per laag, en tonen je vroeg een eerste versie. Je bekijkt die in je eigen tijd en zegt wat klopt en wat niet.",
      },
      {
        index: "IV",
        title: "Verfijnen",
        body: "Elk detail wordt bijgesteld tot de familie zegt: dat is hem, dat is haar. Meestal twee rondes. Soms meer. We tellen niet.",
      },
      {
        index: "V",
        title: "Overhandigen",
        body: "Je krijgt een privélink en een bestand om te bewaren, plus een versie voor het scherm op de dienst als je die nodig hebt. En we blijven bereikbaar, ook daarna.",
      },
    ],
  },
  promises: {
    eyebrow: "Wat we beloven",
    title: "Waardigheid eerst, altijd.",
    items: [
      {
        title: "Niets verlaat de kamer",
        body: "Jouw materiaal en de afgewerkte film zijn van jou. We delen, publiceren of hergebruiken niets zonder de schriftelijke zegen van de familie — en we verwijderen alles op vraag.",
      },
      {
        title: "Geen sjablonen",
        body: "Elke film wordt van nul opgebouwd rond één mens. Geen stockmuziek, geen standaardovergangen, geen opvulling.",
      },
      {
        title: "Eerlijk met nieuwe technologie",
        body: "We gebruiken AI om te herstellen, in te kleuren en voorzichtig te animeren wat al bestaat — nooit om te verzinnen. Geen bedachte woorden, geen bedachte scènes.",
      },
      {
        title: "Zonder haast, maar op tijd",
        body: "Verdriet heeft geen agenda; een uitvaart wel. Is er een datum, dan halen we die. De zorg blijft dezelfde.",
      },
    ],
  },
  practical: {
    eyebrow: "Praktisch",
    title: "De details, gewoon gezegd.",
    items: [
      { label: "Lengte", value: "Van dertig seconden tot ongeveer drie minuten, afhankelijk van het materiaal en de gelegenheid. Langer kan als het verhaal erom vraagt — elke extra minuut is echt werk, en wordt ook zo geprijsd." },
      { label: "Doorlooptijd", value: "Meestal twee tot vier weken. Een versie voor de dienst kan in enkele dagen klaar zijn als het moet." },
      { label: "Materiaal", value: "Foto’s (afdrukken of bestanden), videofragmenten, spraakberichten, brieven, muziek. Elke kwaliteit — wij herstellen." },
      { label: "Talen", value: "Nederlands en Engels. Andere talen in samenspraak met de familie." },
      { label: "Waar", value: "In België ter plaatse, overal op afstand." },
      { label: "Investering", value: "Een prijs na het eerste gesprek. Er is geen prijslijst, omdat er geen standaardfamilie is." },
    ],
    note: "Het eerste gesprek is gratis en vrijblijvend. Je beslist daarna, in je eigen tijd.",
  },
  faq: {
    eyebrow: "Wat families ons vragen",
    title: "Voor je schrijft.",
    items: [
      {
        q: "Kan het klaar zijn voor de uitvaart?",
        a: "Vaak wel. Vermeld de datum in je eerste bericht en we plannen ernaar. Een kortere versie voor de dienst kan binnen enkele dagen klaar zijn; de volledige film volgt wanneer hij af is.",
      },
      {
        q: "Wat hebben jullie van ons nodig?",
        a: "Wat je hebt — ook als het weinig lijkt. Een handvol foto’s en één spraakbericht kunnen al een film dragen. De rest verzamelen we samen.",
      },
      {
        q: "Hoe gebruiken jullie AI precies?",
        a: "Als herstelgereedschap: om oude foto’s te repareren, kleur terug te halen, bewogen beelden te stabiliseren en stilstaande beelden voorzichtig tot leven te brengen. Nooit om een stem, een zin of een moment te verzinnen dat er niet was.",
      },
      {
        q: "Wie ziet de film?",
        a: "Alleen de mensen die jij kiest. De film staat op een privélink. Niets wordt publiek getoond tenzij de familie het ons uitdrukkelijk vraagt — zoals de familie van Rudy deed.",
      },
      {
        q: "Wat kost het?",
        a: "Elke film is anders, dus we maken een prijs na het eerste gesprek. Je kent het volledige bedrag voor er iets start, en achteraf zijn er geen verrassingen.",
      },
    ],
  },
  cta: {
    eyebrow: "Wanneer je er klaar voor bent",
    title: ["Vertel ons over hen.", "Wij luisteren eerst."],
    body: "Schrijf een paar regels — of gewoon een naam. We antwoorden binnen twee werkdagen, zacht.",
    reassurance: "Geen formulieren, geen verplichting. Gewoon een gesprek.",
  },
};

export const memorialCopy: Record<MemorialLocale, MemorialCopy> = { en, nl };
