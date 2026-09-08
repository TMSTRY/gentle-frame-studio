/** Shared vocabularies for the portal and admin — mirrors the Postgres enums. */

export const PROJECT_STATUSES = [
  "inquiry",
  "quoted",
  "accepted",
  "in_production",
  "review",
  "delivered",
  "closed",
  "cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  inquiry: "Inquiry",
  quoted: "Quote sent",
  accepted: "Accepted",
  in_production: "In production",
  review: "In review",
  delivered: "Delivered",
  closed: "Closed",
  cancelled: "Cancelled",
};

/** The linear path a project normally walks; closed/cancelled sit outside it. */
export const STATUS_TRACK: ProjectStatus[] = [
  "inquiry",
  "quoted",
  "accepted",
  "in_production",
  "review",
  "delivered",
];

export const SERVICES = [
  "memorial_film",
  "product_film",
  "music_video",
  "ai_visual",
  "app",
  "platform",
  "consulting",
  "other",
] as const;
export type ServiceKind = (typeof SERVICES)[number];

export const SERVICE_LABEL: Record<ServiceKind, string> = {
  memorial_film: "Memorial film",
  product_film: "Product film",
  music_video: "Music video",
  ai_visual: "AI visual production",
  app: "App",
  platform: "Platform",
  consulting: "Creative consulting",
  other: "Other",
};

export const LANGUAGES = [
  { value: "nl", label: "Nederlands" },
  { value: "en", label: "English" },
] as const;

export const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
];

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
