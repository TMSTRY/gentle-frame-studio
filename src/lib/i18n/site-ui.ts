import type { Locale } from "@/lib/i18n/locale";

/**
 * Every piece of interface text on the marketing site, in both
 * languages. Long-form content (services, cases, memorial, privacy)
 * lives in src/content with its own nl fields; this file holds the
 * connective tissue: eyebrows, headings, buttons, footer, nav.
 */
const UI = {
  en: {
    nav: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "Studio", href: "#studio" },
      { label: "Process", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
    header: { backToTop: "Gentle Frame Studio, back to top", openMenu: "Open menu", closeMenu: "Close menu", switchTo: "NL", switchLabel: "Nederlands" },
    hero: {
      eyebrow: (location: string) => `A cinematic creative studio · ${location}, working worldwide`,
      headline: [
        { words: ["Where", "memories"] },
        { words: ["meet"], tail: "imagination." },
      ],
      lede1: "We craft memorial films, luxury visuals and quiet software.",
      lede2: "With new tools and an old-fashioned heart.",
      scroll: "Scroll",
      ariaLabel: "Gentle Frame Studio, where memories meet imagination",
    },
    manifesto: {
      eyebrow: "The studio · a founding statement",
      statement: "We are a small studio for big feelings. With AI, code and cinema we tell the oldest stories: love, loss, joy, wonder. The technology is our instrument. The emotion is the work.",
      facts: [
        ["Est. 2025", "Belgium · worldwide"],
        ["Films · Visuals · Software", "One craft, many frames"],
        ["Human first", "Always"],
      ],
    },
    services: { eyebrow: "Services · seven ways in", title: "What we make", lede: "Every discipline shares one brief: make someone feel something true.", readMore: "Read more" },
    work: {
      eyebrow: "Selected work · the archive",
      title: "Frames we’ve kept",
      lede: "Films, platforms and experiments. The archive grows slowly, on purpose.",
      slate: "Yours could be the next frame.",
      start: "Start a project",
      caseTag: "Gentle Frames · Case",
      readCase: "Read the case →",
      openProject: "Open project ↗",
      playFilm: "Play the film ▶",
      screenshot: (title: string) => `${title}, screenshot`,
      ariaLabel: "Selected work",
    },
    about: {
      eyebrow: "The studio · a human story",
      title1: "The person behind",
      title2: "the frames",
      p1: "Before there was a studio, there were night shifts. Years spent as a correctional officer, keeping watch through the quietest hours of a prison, learning that presence matters more than words, and that everyone carries a story worth keeping.",
      p2: "Somewhere along the way, the stories asked for form. Music got written. Code got shipped. Films got made. The tools kept changing (guitars, cameras, neural networks), but the job stayed the same: make someone feel something true.",
      p3: "Gentle Frames is that job, taken seriously. A one-person studio in Belgium working with families, artists and brands worldwide, using AI the way a craftsman uses any instrument: quietly, precisely, in service of the human on the other side.",
      signature: "Tim, founder",
      roles: ["Correctional officer", "AI filmmaker", "Musician", "Developer", "Maker"],
      founder: "The founder",
      portraitAlt: "Tim Mostrey, founder of Gentle Frame Studio, black-and-white portrait",
      portraitLabel: "Portrait of Tim Mostrey, hover to reveal",
      cardAlt: "Gentle Frames business card, black paper with champagne foil",
      cardLine: "Crafted in Belgium. At home anywhere.",
      ariaLabel: "About the studio",
    },
    process: {
      eyebrow: "How we work, the quiet method",
      title: "Five frames, one film",
      lede: "No tickets, no black box. You talk to the person making the work, at every phase.",
      ariaLabel: "How we work",
    },
    testimonials: { eyebrow: "Kind words", showQuote: (n: number) => `Show quote ${n}`, ariaLabel: "Testimonials" },
    contact: {
      eyebrow: "Start something gentle",
      title1: "Let’s create something",
      title2: "worth remembering.",
      lede: "A memory, a product, a song, an idea that needs a frame, write to us and we’ll listen first.",
    },
    footer: {
      menu: "Menu",
      memorial: "Memorial Films",
      memorialHref: "/memorial-films",
      portal: "Client portal",
      writeUs: "Write us",
      worldwide: (location: string) => `${location}, working worldwide`,
      tagline: "Two frames overlapping, where memories meet imagination",
      privacy: "Privacy",
      privacyHref: "/privacy",
    },
    preloader: { name: "GENTLE FRAMES", tagline: "Memories. Reimagined. Forever." },
    notFound: {
      eyebrow: "404 · Off the reel",
      title1: "This frame",
      title2: "was never shot.",
      body: "The page you’re looking for doesn’t exist, or has quietly moved. The studio is still right here.",
      back: "Back to the studio",
      work: "See the work",
    },
    caseUi: { back: "← Selected work", previous: "← Previous", next: "Next →", backTo: "← Back to", backToNext: "Back to →", archive: "The archive", openProject: "Open project", readMore: "Read more", playFilm: "Play the film" },
  },
  nl: {
    nav: [
      { label: "Werk", href: "#work" },
      { label: "Diensten", href: "#services" },
      { label: "Studio", href: "#studio" },
      { label: "Werkwijze", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
    header: { backToTop: "Gentle Frame Studio, terug naar boven", openMenu: "Menu openen", closeMenu: "Menu sluiten", switchTo: "EN", switchLabel: "English" },
    hero: {
      eyebrow: (location: string) => `Een cinematografische creatieve studio · ${location === "Belgium" ? "België" : location}, wereldwijd aan het werk`,
      headline: [
        { words: ["Waar", "herinnering"] },
        { words: ["en"], tail: "verbeelding samenkomen." },
      ],
      lede1: "We maken herinneringsfilms, luxebeelden en stille software.",
      lede2: "Met nieuwe werktuigen en een ouderwets hart.",
      scroll: "Scroll",
      ariaLabel: "Gentle Frame Studio, waar herinnering en verbeelding samenkomen",
    },
    manifesto: {
      eyebrow: "De studio · een beginselverklaring",
      statement: "We zijn een kleine studio voor grote gevoelens. Met AI, code en cinema vertellen we de oudste verhalen: liefde, verlies, vreugde, verwondering. De technologie is ons instrument. De emotie is het werk.",
      facts: [
        ["Sinds 2025", "België · wereldwijd"],
        ["Films · Beelden · Software", "Eén ambacht, veel kaders"],
        ["De mens eerst", "Altijd"],
      ],
    },
    services: { eyebrow: "Diensten · zeven ingangen", title: "Wat we maken", lede: "Elke discipline deelt één opdracht: iemand iets echts laten voelen.", readMore: "Lees meer" },
    work: {
      eyebrow: "Geselecteerd werk · het archief",
      title: "Kaders die we bewaarden",
      lede: "Films, platformen en experimenten. Het archief groeit traag, met opzet.",
      slate: "Het volgende kader kan het jouwe zijn.",
      start: "Start een project",
      caseTag: "Gentle Frames · Case",
      readCase: "Lees de case →",
      openProject: "Open project ↗",
      playFilm: "Bekijk de film ▶",
      screenshot: (title: string) => `${title}, schermafbeelding`,
      ariaLabel: "Geselecteerd werk",
    },
    about: {
      eyebrow: "De studio · een menselijk verhaal",
      title1: "De mens achter",
      title2: "de kaders",
      p1: "Voor er een studio was, waren er nachtshiften. Jaren als penitentiair beambte, wakend door de stilste uren van een gevangenis, en daar geleerd dat aanwezigheid meer telt dan woorden, en dat iedereen een verhaal draagt dat het bewaren waard is.",
      p2: "Onderweg vroegen de verhalen om vorm. Er werd muziek geschreven. Code uitgebracht. Films gemaakt. De werktuigen bleven veranderen (gitaren, camera’s, neurale netwerken), maar het werk bleef hetzelfde: iemand iets echts laten voelen.",
      p3: "Gentle Frames is dat werk, ernstig genomen. Een eenmansstudio in België die werkt met families, artiesten en merken wereldwijd, en AI gebruikt zoals een vakman elk instrument gebruikt: stil, precies, in dienst van de mens aan de andere kant.",
      signature: "Tim, oprichter",
      roles: ["Penitentiair beambte", "AI-filmmaker", "Muzikant", "Ontwikkelaar", "Maker"],
      founder: "De oprichter",
      portraitAlt: "Tim Mostrey, oprichter van Gentle Frame Studio, zwart-witportret",
      portraitLabel: "Portret van Tim Mostrey, beweeg eroverheen om te tonen",
      cardAlt: "Visitekaartje van Gentle Frames, zwart papier met champagnefolie",
      cardLine: "Gemaakt in België. Overal thuis.",
      ariaLabel: "Over de studio",
    },
    process: {
      eyebrow: "Hoe we werken, de stille methode",
      title: "Vijf kaders, één film",
      lede: "Geen tickets, geen zwarte doos. Je praat met wie het werk maakt, in elke fase.",
      ariaLabel: "Hoe we werken",
    },
    testimonials: { eyebrow: "Lieve woorden", showQuote: (n: number) => `Toon citaat ${n}`, ariaLabel: "Getuigenissen" },
    contact: {
      eyebrow: "Begin iets zachts",
      title1: "Laten we iets maken",
      title2: "dat het onthouden waard is.",
      lede: "Een herinnering, een product, een lied, een idee dat een kader nodig heeft: schrijf ons, en we luisteren eerst.",
    },
    footer: {
      menu: "Menu",
      memorial: "Herinneringsfilms",
      memorialHref: "/nl/herinneringsfilms",
      portal: "Klantenportaal",
      writeUs: "Schrijf ons",
      worldwide: (location: string) => `${location === "Belgium" ? "België" : location}, wereldwijd aan het werk`,
      tagline: "Twee kaders die overlappen, waar herinnering en verbeelding samenkomen",
      privacy: "Privacy",
      privacyHref: "/nl/privacy",
    },
    preloader: { name: "GENTLE FRAMES", tagline: "Herinneringen. Opnieuw verbeeld. Voor altijd." },
    notFound: {
      eyebrow: "404 · Buiten de rol",
      title1: "Dit kader",
      title2: "is nooit geschoten.",
      body: "De pagina die je zoekt bestaat niet, of is stil verhuisd. De studio is er nog.",
      back: "Terug naar de studio",
      work: "Bekijk het werk",
    },
    caseUi: { back: "← Geselecteerd werk", previous: "← Vorige", next: "Volgende →", backTo: "← Terug naar", backToNext: "Terug naar →", archive: "Het archief", openProject: "Open project", readMore: "Lees meer", playFilm: "Bekijk de film" },
  },
} as const;

export type SiteUi = (typeof UI)["en"];

export function siteUi(locale: Locale): SiteUi {
  return UI[locale] as SiteUi;
}
