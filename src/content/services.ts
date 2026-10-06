/**
 * The studio's services - each one rendered as an editorial
 * "chapter" rather than a card. The `motif` key selects the
 * ambient visual treatment for the chapter.
 *
 * Eight chapters, numbered in reading order. The number lives in
 * `index` and in the "Reel 0X" prefix of both kickers, so renumber
 * all three together.
 */

export type ServiceMotif =
  | "glow"
  | "sheen"
  | "waveform"
  | "tiles"
  | "terminal"
  | "constellation"
  | "asterisk"
  /** A quiet browser window: outline, hairline top bar, a block of light */
  | "frame"
  /** A dot riding an easing curve between two keyframes, driven by scroll */
  | "keyframe";

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
    id: "websites",
    index: "01",
    title: "Websites",
    kicker: "Reel 01 · The first thing they see",
    lede: "Websites for companies, practices and brands that would rather be understood than be loud.",
    body: "A website is the first room a customer walks into. We write, design and build it as one piece: the words, the images, the film at the top of the page and the code underneath. Fast, accessible, easy for you to update, and made by the same hands that shot the film, so nothing gets lost between the studio and the screen.",
    tags: ["Design", "Development", "Copy", "Launch films"],
    motif: "frame",
    nl: {
      title: "Websites",
      kicker: "Reel 01 · Het eerste wat ze zien",
      lede: "Websites voor bedrijven, praktijken en merken die liever begrepen worden dan luid zijn.",
      body: "Een website is de eerste kamer waar een klant binnenstapt. We schrijven, ontwerpen en bouwen ze als één geheel: de woorden, de beelden, de film bovenaan de pagina en de code eronder. Snel, toegankelijk, makkelijk zelf aan te passen, en gemaakt door dezelfde handen die de film draaiden, zodat er niets verloren gaat tussen studio en scherm.",
      tags: ["Ontwerp", "Ontwikkeling", "Tekst", "Lanceerfilms"],
    },
  },
  {
    id: "product-films",
    index: "02",
    title: "Brand & Product Films",
    kicker: "Reel 02 · Worth a closer look",
    lede: "Brand films, commercials and launch films that make a product, an app or a company feel inevitable.",
    body: "Light, texture and rhythm, composed like cinema rather than advertising. A bottle, an app, a company nobody has filmed before: we build the whole world around it. The hero film, the cutdowns, the stills, and the short presentation film that shows what you made doing what it does best, on the largest screen in the room or in someone’s hand.",
    tags: ["Brand films", "Commercials", "App & product launches", "Company films"],
    motif: "sheen",
    nl: {
      title: "Merk- en productfilms",
      kicker: "Reel 02 · Een tweede blik waard",
      lede: "Merkfilms, commercials en lanceerfilms die een product, een app of een bedrijf onvermijdelijk doen voelen.",
      body: "Licht, textuur en ritme, gecomponeerd als cinema in plaats van reclame. Een fles, een app, een bedrijf dat nog nooit gefilmd werd: we bouwen er de hele wereld rond. De herofilm, de cutdowns, de stills, en de korte voorstellingsfilm die laat zien wat je maakte, op zijn best, op het grootste scherm in de kamer of in iemands hand.",
      tags: ["Merkfilms", "Commercials", "App- en productlanceringen", "Bedrijfsfilms"],
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
    id: "motion-design",
    index: "04",
    title: "Motion Design",
    kicker: "Reel 04 · Movement with intent",
    lede: "Titles, animation and explainer films that make an idea, an app or a brand easy to follow.",
    body: "Logo animations, title sequences, interface walkthroughs, animated explainers, the moving parts of a website or a pitch: motion that explains and persuades without raising its voice. Timed like music, drawn with restraint, and delivered in every format you need, from a trade-show wall to a story on a phone.",
    tags: ["Title sequences", "Logo & brand animation", "App & interface walkthroughs", "Explainers"],
    motif: "keyframe",
    nl: {
      title: "Motion design",
      kicker: "Reel 04 · Beweging met bedoeling",
      lede: "Titels, animatie en uitlegfilms die een idee, een app of een merk makkelijk te volgen maken.",
      body: "Logo-animaties, titelsequenties, interfacedemonstraties, geanimeerde uitlegfilms, de bewegende delen van een website of een pitch: beweging die uitlegt en overtuigt zonder luid te worden. Getimed als muziek, getekend met terughoudendheid, en geleverd in elk formaat dat je nodig hebt, van een beurswand tot een story op een telefoon.",
      tags: ["Titelsequenties", "Logo- en merkanimatie", "App- en interfacedemo’s", "Uitlegfilms"],
    },
  },
  {
    id: "ai-visual-production",
    index: "05",
    title: "AI Visual Production",
    kicker: "Reel 05 · The new darkroom",
    lede: "Generated images and footage for campaigns, films and websites, with taste as the constraint.",
    body: "We treat generative tools like a camera: something you point with intent. Concept development, art direction and production of visuals that hold up in print, on billboards and in motion, with a human eye on every frame.",
    tags: ["Image generation", "Generated footage", "Creative concepts", "Art direction"],
    motif: "tiles",
    nl: {
      title: "AI-beeldproductie",
      kicker: "Reel 05 · De nieuwe donkere kamer",
      lede: "Gegenereerde beelden en footage voor campagnes, films en websites, met smaak als enige beperking.",
      body: "We behandelen generatieve tools als een camera: iets wat je met bedoeling richt. Conceptontwikkeling, art direction en productie van beelden die overeind blijven in druk, op affiches en in beweging, met een menselijk oog op elk beeld.",
      tags: ["Beeldgeneratie", "Gegenereerde footage", "Creatieve concepten", "Art direction"],
    },
  },
  {
    id: "memorial-films",
    index: "06",
    title: "Memorial Films",
    kicker: "Reel 06 · For the ones we carry",
    lede: "Respectful, cinematic tributes to the people we love and lost.",
    body: "From photographs, voices and fragments of a life, we craft serene films that let a memory breathe again. Made slowly, gently, in close dialogue with the family, never generic, never rushed. A place to return to, forever.",
    tags: ["Tribute films", "Restored memories", "Family archives", "Ceremony visuals"],
    motif: "glow",
    href: "/memorial-films",
    linkLabel: "Read how a memorial film comes to be",
    nl: {
      title: "Herinneringsfilms",
      kicker: "Reel 06 · Voor wie we meedragen",
      lede: "Respectvolle, filmische eerbetonen aan de mensen die we liefhadden en verloren.",
      body: "Uit foto’s, stemmen en fragmenten van een leven maken we serene films die een herinnering opnieuw laten ademen. Traag gemaakt, zacht, in nauw overleg met de familie: nooit generiek, nooit gehaast. Een plek om naar terug te keren, voor altijd.",
      tags: ["Eerbetoonfilms", "Herstelde herinneringen", "Familiearchieven", "Beelden voor de dienst"],
      href: "/nl/herinneringsfilms",
      linkLabel: "Lees hoe een herinneringsfilm tot stand komt",
    },
  },
  {
    id: "apps",
    index: "07",
    title: "Apps & Platforms",
    kicker: "Reel 07 · Tools that get out of the way",
    lede: "Apps, tools, client portals and platforms for your team or your customers, designed and built end to end.",
    body: "A mobile app, a web app, the tool your company has been faking in spreadsheets for years, a learning platform, a community, a marketplace: we design the architecture, craft the experience and ship the whole thing, from first sketch to the store or the server. Built the way we make films: reduced to what matters, finished with care, and genuinely pleasant to use every day, with a studio that stays around after launch.",
    tags: ["Web & mobile apps", "Client portals", "Platforms & SaaS", "Automation"],
    motif: "terminal",
    nl: {
      title: "Apps en platformen",
      kicker: "Reel 07 · Tools die niet in de weg lopen",
      lede: "Apps, tools, klantenportalen en platformen voor je team of je klanten, ontworpen en gebouwd van begin tot eind.",
      body: "Een mobiele app, een webapp, de tool die je bedrijf al jaren in spreadsheets nabootst, een leerplatform, een community, een marktplaats: we ontwerpen de architectuur, maken de ervaring en leveren het geheel op, van eerste schets tot store of server. Gemaakt zoals we films maken: teruggebracht tot wat telt, met zorg afgewerkt, en oprecht aangenaam om elke dag te gebruiken, met een studio die na de lancering in de buurt blijft.",
      tags: ["Web- en mobiele apps", "Klantenportalen", "Platformen en SaaS", "Automatisering"],
    },
  },
  {
    id: "creative-consulting",
    index: "08",
    title: "Creative Consulting",
    kicker: "Reel 08 · Thinking partner",
    lede: "Strategic guidance on AI, creativity and what to build first, without the hype.",
    body: "For companies, studios, brands and teams wondering what these tools mean for their work, or simply where to begin: a website, a film, a tool, a platform. We help you find the honest answer: what to make and in which order, where AI belongs in your process, where it doesn’t, and how to keep the soul in the work.",
    tags: ["AI strategy", "Creative R&D", "Workshops", "What to build first"],
    motif: "asterisk",
    nl: {
      title: "Creatief advies",
      kicker: "Reel 08 · Meedenkende partner",
      lede: "Strategisch advies over AI, creativiteit en wat je eerst bouwt, zonder de hype.",
      body: "Voor bedrijven, studio’s, merken en teams die zich afvragen wat deze tools betekenen voor hun werk, of gewoon waar te beginnen: een website, een film, een tool, een platform. We helpen je het eerlijke antwoord te vinden: wat je maakt en in welke volgorde, waar AI in je proces thuishoort, waar niet, en hoe je de ziel in het werk houdt.",
      tags: ["AI-strategie", "Creatieve R&D", "Workshops", "Wat je eerst bouwt"],
    },
  },
];
