/**
 * Global site configuration — single source of truth for
 * brand copy, navigation, contact details and metadata.
 */

export const site = {
  name: "Gentle Frames",
  legalName: "Gentle Frame Studio",
  domain: "gentleframestudio.com",
  url: "https://gentleframestudio.com",
  tagline: "Memories. Reimagined. Forever.",
  description:
    "Gentle Frame Studio is a Belgian creative studio crafting memorial films, luxury product films, music videos, AI visual production and digital platforms — technology with a human heart.",
  email: "hello@gentleframestudio.com",
  location: "Belgium",
  coordinates: "50.85°N — 4.35°E",
  founded: "2025",
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
