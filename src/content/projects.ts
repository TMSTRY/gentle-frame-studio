/**
 * Selected work — rendered as magazine covers in a horizontal
 * gallery. Add a new project by appending an entry here; the
 * gallery, numbering and cover art adapt automatically.
 *
 * `tone` drives the generative cover treatment: two colors and
 * a light position, composed with grain and the frame motif.
 *
 * `image` (optional) swaps the generative cover for a screenshot:
 * drop the file in public/work/ named after the id, portrait 3:4,
 * ideally 1200x1600 JPG under ~600 KB (a tall browser capture at
 * ~1200px wide works well — the card crops from the top).
 * `url` (optional) makes the whole card a link, opened in a new tab.
 */

export interface ProjectTone {
  /** Deep base color of the cover */
  base: string;
  /** Warm highlight color of the cover */
  glow: string;
  /** Position of the light source, CSS percentage pair */
  light: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  blurb: string;
  tone: ProjectTone;
  /** Screenshot cover, e.g. "/work/ruimteschool.jpg" (public/work/) */
  image?: string;
  /** Live project URL — the card links here in a new tab */
  url?: string;
}

export const projects: Project[] = [
  {
    id: "ruimteschool",
    title: "Ruimteschool",
    category: "Learning Platform",
    year: "2026",
    blurb: "A space-themed learning universe where children practice math and French between the stars.",
    tone: { base: "#0b0d16", glow: "#8b9dc9", light: "72% 18%" },
    image: "/work/ruimteschool.jpg",
    url: "https://ruimteschool.com/",
  },
  {
    id: "quietwalk",
    title: "QuietWalk",
    category: "Wellbeing App",
    year: "2026",
    blurb: "A pocket companion for slow walks — presence, breath and attention, nothing else.",
    tone: { base: "#0d120d", glow: "#a8bd9a", light: "30% 24%" },
  },
  {
    id: "shift-planning",
    title: "Shift Planning Tool",
    category: "Custom Software",
    year: "2026",
    blurb: "Scheduling software for night-shift teams — built inside the walls it serves.",
    tone: { base: "#0e1014", glow: "#7f96b8", light: "50% 85%" },
  },
  {
    id: "memorial-films",
    title: "AI Memorial Films",
    category: "Memorial Films",
    year: "Ongoing",
    blurb: "Tributes in light. Films that give families a place to return to.",
    tone: { base: "#141009", glow: "#e3c893", light: "50% 30%" },
  },
  {
    id: "music-videos",
    title: "Music Videos",
    category: "Artist Visuals",
    year: "Ongoing",
    blurb: "Cinematic worlds for original music — written, produced and framed in-house.",
    tone: { base: "#120b10", glow: "#c98ba4", light: "20% 70%" },
  },
  {
    id: "nft-collections",
    title: "NFT Collections",
    category: "Digital Artifacts",
    year: "2025",
    blurb: "Five on-chain drops — collectible artifacts excavated from a fictional mining world.",
    tone: { base: "#100e0a", glow: "#c9a96a", light: "80% 60%" },
  },
  {
    id: "creative-experiments",
    title: "Creative Experiments",
    category: "The Lab",
    year: "Always",
    blurb: "Shaders, engines, easter eggs and small strange machines. Where the next thing starts.",
    tone: { base: "#0a0f12", glow: "#89bdb4", light: "40% 12%" },
  },
  {
    id: "future-products",
    title: "Future Products",
    category: "In Development",
    year: "Soon",
    blurb: "Quiet tools and new rituals, currently taking shape in the studio.",
    tone: { base: "#0f0c12", glow: "#a795c9", light: "60% 40%" },
  },
];
