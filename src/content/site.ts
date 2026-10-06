/**
 * Global site configuration - single source of truth for
 * brand copy, navigation, contact details and metadata.
 */

export const site = {
  name: "Gentle Frames",
  legalName: "Gentle Frame Studio",
  domain: "gentleframestudio.com",
  url: "https://gentleframestudio.com",
  /** Brand line (preloader, footer, JSON-LD slogan). English default; both languages in `taglines`. */
  tagline: "Stories. Reimagined. Forever.",
  taglines: {
    en: "Stories. Reimagined. Forever.",
    nl: "Verhalen. Opnieuw verbeeld. Voor altijd.",
  },
  /**
   * Descriptive line after "Gentle Frame Studio · " in the <title> and the
   * OG/Twitter title. Kept apart from the tagline on purpose: a search
   * result should say what we make, the slogan says who we are.
   */
  titleLines: {
    en: "Films, websites and apps, made with care",
    nl: "Films, websites en apps, met zorg gemaakt",
  },
  /** Positioning line: meta description, OG, JSON-LD. English default; both languages in `descriptions`. */
  description:
    "A small creative studio in Belgium that makes films, websites, motion design and software with cinema, code and AI, for families, artists and companies.",
  descriptions: {
    en: "A small creative studio in Belgium that makes films, websites, motion design and software with cinema, code and AI, for families, artists and companies.",
    nl: "Een kleine creatieve studio in België die films, websites, motion design en software maakt met cinema, code en AI, voor families, artiesten en bedrijven.",
  },
  email: "hello@gentleframestudio.com",
  location: "Belgium",
  coordinates: "50.85°N · 4.35°E",
  founded: "2025",
  founder: {
    name: "Tim Mostrey",
    role: "Founder, creative director and developer",
    url: "https://www.tmstry.com",
    /** Other places the same person is visibly behind; feeds the Person schema. */
    sameAs: ["https://www.tmstry.com", "https://strafwetboek.vercel.app", "https://excavara.com"],
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];
