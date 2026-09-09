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
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/settings", label: "Settings" },
];

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ---------------------------------------------------------------- documents

export const DOCUMENT_KINDS = ["quote", "invoice", "contract", "other"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];
export const KIND_LABEL: Record<DocumentKind, string> = {
  quote: "Quote",
  invoice: "Invoice",
  contract: "Contract",
  other: "Document",
};
export const KIND_LABEL_NL: Record<DocumentKind, string> = {
  quote: "Offerte",
  invoice: "Factuur",
  contract: "Contract",
  other: "Document",
};

export const DOCUMENT_STATUSES = ["draft", "sent", "accepted", "signed", "paid", "overdue", "cancelled"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];
export const DOC_STATUS_LABEL: Record<DocumentStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  signed: "Signed",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

/** 123456 → "€ 1.234,56" (Belgian formatting, cents in, string out). */
export function formatMoney(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency, minimumFractionDigits: 2 }).format(cents / 100);
}

/** "1.250,50" | "1250.50" | "1250" → 125050 (cents). Empty/invalid → 0. */
export function parseMoney(input: string): number {
  const raw = input.replace(/[€\s]/g, "");
  if (!raw) return 0;
  let normalized = raw;
  if (raw.includes(",") && raw.includes(".")) normalized = raw.replace(/\./g, "").replace(",", ".");
  else if (raw.includes(",")) normalized = raw.replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

/** Line rows offered in the document editor (empty ones are ignored). */
export const LINE_SLOTS = 8;
