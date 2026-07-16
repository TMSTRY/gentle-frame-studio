/**
 * The studio's services — each one rendered as an editorial
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
}

export const services: Service[] = [
  {
    id: "memorial-films",
    index: "01",
    title: "Memorial Films",
    kicker: "Reel 01 — For the ones we carry",
    lede: "Respectful, cinematic tributes to the people we love and lost.",
    body: "From photographs, voices and fragments of a life, we craft serene films that let a memory breathe again. Made slowly, gently, in close dialogue with the family — never generic, never rushed. A place to return to, forever.",
    tags: ["Tribute films", "Restored memories", "Family archives", "Ceremony visuals"],
    motif: "glow",
  },
  {
    id: "product-films",
    index: "02",
    title: "Product Films",
    kicker: "Reel 02 — Objects of desire",
    lede: "Luxury commercials and campaign films that make products feel inevitable.",
    body: "Light, texture and rhythm — composed like fashion cinema. We build full campaign worlds around a product: hero films, cutdowns, stills and placement visuals that belong on the largest screen in the room.",
    tags: ["Commercials", "Product placement", "Campaign visuals", "Advertising"],
    motif: "sheen",
  },
  {
    id: "music-videos",
    index: "03",
    title: "Music Videos",
    kicker: "Reel 03 — Sound, framed",
    lede: "Cinematic storytelling for artists who take their world seriously.",
    body: "We translate a track into imagery — creative direction, visual identity and a finished film that extends the music instead of decorating it. Built with artists, for artists, by someone who writes and releases music too.",
    tags: ["Artist visuals", "Creative direction", "Visualizers", "Cover worlds"],
    motif: "waveform",
  },
  {
    id: "ai-visual-production",
    index: "04",
    title: "AI Visual Production",
    kicker: "Reel 04 — The new darkroom",
    lede: "Image generation and campaign visuals with taste as the constraint.",
    body: "We treat generative tools like a camera: something you point with intent. Concept development, art direction and production of visuals that hold up in print, on billboards and in motion — with a human eye on every frame.",
    tags: ["Image generation", "Creative concepts", "Campaign visuals", "Art direction"],
    motif: "tiles",
  },
  {
    id: "apps",
    index: "05",
    title: "Apps",
    kicker: "Reel 05 — Quiet software",
    lede: "Custom software and AI applications that feel calm to use.",
    body: "Internal tools, automations and products — designed and engineered end to end. We build software the way we make films: reduced to what matters, finished with care, and genuinely pleasant to live with.",
    tags: ["Custom software", "AI applications", "Automation", "Internal tools"],
    motif: "terminal",
  },
  {
    id: "platforms",
    index: "06",
    title: "Platforms",
    kicker: "Reel 06 — Places, not pages",
    lede: "Digital platforms, communities and marketplaces built to last.",
    body: "From learning platforms to creative communities and SaaS products: we design the architecture, craft the experience and ship the whole thing. Scalable foundations wrapped in an interface people actually enjoy.",
    tags: ["Platforms", "Communities", "SaaS", "Marketplaces"],
    motif: "constellation",
  },
  {
    id: "creative-consulting",
    index: "07",
    title: "Creative Consulting",
    kicker: "Reel 07 — Thinking partner",
    lede: "Strategic guidance on AI and creativity, without the hype.",
    body: "For studios, brands and teams wondering what these tools mean for their craft. We help you find the honest answer: where AI belongs in your process, where it doesn't, and how to keep the soul in the work.",
    tags: ["AI strategy", "Creative R&D", "Workshops", "Direction"],
    motif: "asterisk",
  },
];
