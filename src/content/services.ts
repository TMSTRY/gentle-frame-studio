/**
 * The studio's services - each one rendered as an editorial
 * "chapter" rather than a card. The `motif` key selects the
 * ambient visual treatment for the chapter.
 */

export type ServiceMotif =
  | "glow"
  | "sheen"
  | "waveform"
  | "tiles"
  | "terminal"
  | "constellation"
  | "asterisk";

export interface Service {
  id: string;
  index: string;
  title: string;
  kicker: string;
  lede: string;
  body: string;
  tags: string[];
  motif: ServiceMotif;
  /** Optional deep-dive page for this service */
  href?: string;
  linkLabel?: string;
  /** Dutch copy; the section falls back to English when absent */
  nl?: { title: string; kicker: string; lede: string; body: string; tags: string[]; href?: string; linkLabel?: string };
}

export const services: Service[] = [
  {
    id: "memorial-films",
    index: "01",
    title: "Memorial Films",
    kicker: "Reel 01 · For the ones we carry",
    lede: "Respectful, cinematic tributes to the people we love and lost.",
    body: "From photographs, voices and fragments of a life, we craft serene films that let a memory breathe again. Made slowly, gently, in close dialogue with the family, never generic, never rushed. A place to return to, forever.",
    tags: ["Tribute films", "Restored memories", "Family archives", "Ceremony visuals"],
    motif: "glow",
    href: "/memorial-films",
    linkLabel: "Read how a memorial film comes to be",
    nl: {
      title: "Herinneringsfilms",
      kicker: "Reel 01 · Voor wie we meedragen",
      lede: "Respectvolle, filmische eerbetonen aan de mensen die we liefhadden en verloren.",
      body: "Uit foto’s, stemmen en fragmenten van een leven maken we serene films die een herinnering opnieuw laten ademen. Traag gemaakt, zacht, in nauw overleg met de familie: nooit generiek, nooit gehaast. Een plek om naar terug te keren, voor altijd.",
      tags: ["Eerbetoonfilms", "Herstelde herinneringen", "Familiearchieven", "Beelden voor de dienst"],
      href: "/nl/herinneringsfilms",
      linkLabel: "Lees hoe een herinneringsfilm tot stand komt",
    },
  },
  {
    id: "product-films",
    index: "02",
    title: "Product Films",
    kicker: "Reel 02 · Objects of desire",
    lede: "Luxury commercials and campaign films that make products feel inevitable.",
    body: "Light, texture and rhythm, composed like fashion cinema. We build full campaign worlds around a product: hero films, cutdowns, stills and placement visuals that belong on the largest screen in the room.",
    tags: ["Commercials", "Product placement", "Campaign visuals", "Advertising"],
    motif: "sheen",
    nl: {
      title: "Productfilms",
      kicker: "Reel 02 · Objecten van verlangen",
      lede: "Luxecommercials en campagnefilms die producten onvermijdelijk doen voelen.",
      body: "Licht, textuur en ritme, gecomponeerd als modecinema. We bouwen een volledige campagnewereld rond een product: herofilms, cutdowns, stills en placementbeelden die thuishoren op het grootste scherm in de kamer.",
      tags: ["Commercials", "Productplaatsing", "Campagnebeelden", "Advertising"],
    },
  },
  {
    id: "music-videos",
    index: "03",
    title: "Music Videos",
    kicker: "Reel 03 · Sound, framed",
    lede: "Cinematic storytelling for artists who take their world seriously.",
    body: "We translate a track into imagery: creative direction, visual identity and a finished film that extends the music instead of decorating it. Built with artists, for artists, by someone who writes and releases music too.",
    tags: ["Artist visuals", "Creative direction", "Visualizers", "Cover worlds"],
    motif: "waveform",
    nl: {
      title: "Muziekvideo’s",
      kicker: "Reel 03 · Geluid, in beeld gevat",
      lede: "Filmische verhalen voor artiesten die hun wereld ernstig nemen.",
      body: "We vertalen een track naar beeld: creatieve richting, visuele identiteit en een afgewerkte film die de muziek verlengt in plaats van ze te versieren. Gebouwd met artiesten, voor artiesten, door iemand die zelf muziek schrijft en uitbrengt.",
      tags: ["Artiestenbeelden", "Creatieve richting", "Visualizers", "Coverwerelden"],
    },
  },
  {
    id: "ai-visual-production",
    index: "04",
    title: "AI Visual Production",
    kicker: "Reel 04 · The new darkroom",
    lede: "Image generation and campaign visuals with taste as the constraint.",
    body: "We treat generative tools like a camera: something you point with intent. Concept development, art direction and production of visuals that hold up in print, on billboards and in motion, with a human eye on every frame.",
    tags: ["Image generation", "Creative concepts", "Campaign visuals", "Art direction"],
    motif: "tiles",
    nl: {
      title: "AI-beeldproductie",
      kicker: "Reel 04 · De nieuwe donkere kamer",
      lede: "Beeldgeneratie en campagnebeelden, met smaak als enige beperking.",
      body: "We behandelen generatieve tools als een camera: iets wat je met bedoeling richt. Conceptontwikkeling, art direction en productie van beelden die overeind blijven in druk, op affiches en in beweging, met een menselijk oog op elk beeld.",
      tags: ["Beeldgeneratie", "Creatieve concepten", "Campagnebeelden", "Art direction"],
    },
  },
  {
    id: "apps",
    index: "05",
    title: "Apps",
    kicker: "Reel 05 · Quiet software",
    lede: "Custom software and AI applications that feel calm to use.",
    body: "Internal tools, automations and products, designed and engineered end to end. We build software the way we make films: reduced to what matters, finished with care, and genuinely pleasant to live with.",
    tags: ["Custom software", "AI applications", "Automation", "Internal tools"],
    motif: "terminal",
    nl: {
      title: "Apps",
      kicker: "Reel 05 · Stille software",
      lede: "Maatsoftware en AI-toepassingen die rustig aanvoelen in gebruik.",
      body: "Interne tools, automatiseringen en producten, van ontwerp tot bouw. We maken software zoals we films maken: teruggebracht tot wat telt, met zorg afgewerkt, en oprecht aangenaam om mee te leven.",
      tags: ["Maatsoftware", "AI-toepassingen", "Automatisering", "Interne tools"],
    },
  },
  {
    id: "platforms",
    index: "06",
    title: "Platforms",
    kicker: "Reel 06 · Places, not pages",
    lede: "Digital platforms, communities and marketplaces built to last.",
    body: "From learning platforms to creative communities and SaaS products: we design the architecture, craft the experience and ship the whole thing. Scalable foundations wrapped in an interface people actually enjoy.",
    tags: ["Platforms", "Communities", "SaaS", "Marketplaces"],
    motif: "constellation",
    nl: {
      title: "Platformen",
      kicker: "Reel 06 · Plekken, geen pagina’s",
      lede: "Digitale platformen, communities en marktplaatsen die blijven.",
      body: "Van leerplatformen tot creatieve communities en SaaS-producten: we ontwerpen de architectuur, maken de ervaring en leveren het geheel op. Schaalbare fundamenten in een interface waar mensen echt graag in werken.",
      tags: ["Platformen", "Communities", "SaaS", "Marktplaatsen"],
    },
  },
  {
    id: "creative-consulting",
    index: "07",
    title: "Creative Consulting",
    kicker: "Reel 07 · Thinking partner",
    lede: "Strategic guidance on AI and creativity, without the hype.",
    body: "For studios, brands and teams wondering what these tools mean for their craft. We help you find the honest answer: where AI belongs in your process, where it doesn't, and how to keep the soul in the work.",
    tags: ["AI strategy", "Creative R&D", "Workshops", "Direction"],
    motif: "asterisk",
    nl: {
      title: "Creatief advies",
      kicker: "Reel 07 · Meedenkende partner",
      lede: "Strategisch advies over AI en creativiteit, zonder de hype.",
      body: "Voor studio’s, merken en teams die zich afvragen wat deze tools betekenen voor hun vak. We helpen je het eerlijke antwoord te vinden: waar AI in je proces thuishoort, waar niet, en hoe je de ziel in het werk houdt.",
      tags: ["AI-strategie", "Creatieve R&D", "Workshops", "Richting"],
    },
  },
];
