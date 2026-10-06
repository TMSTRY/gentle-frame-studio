import type { SupabaseClient } from "@supabase/supabase-js";
import type { ServiceKind } from "@/lib/portal/labels";
import type { ProjectFile } from "@/lib/portal/types";

/** Supabase's default per-file ceiling on the free plan; raise in the dashboard on Pro. */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const BUCKET = "documents";

/** "Foto's opa (1).JPG" → "fotos-opa-1.jpg"; keeps the extension, drops the rest. */
export function safeFileName(name: string): string {
  const trimmed = name.trim().slice(-120);
  const dot = trimmed.lastIndexOf(".");
  const base = (dot > 0 ? trimmed.slice(0, dot) : trimmed).normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "file";
  const ext = dot > 0 ? trimmed.slice(dot + 1).replace(/[^a-z0-9]/gi, "").toLowerCase() : "";
  return ext ? `${base}.${ext}` : base;
}

export function uploadPath(projectId: string, name: string): string {
  return `uploads/${projectId}/${crypto.randomUUID()}-${safeFileName(name)}`;
}

/** Everything still standing on a project, newest first. Works under RLS or the service role. */
export async function listProjectFiles(db: SupabaseClient, projectId: string): Promise<ProjectFile[]> {
  const { data, error } = await db.from("project_files").select("*").eq("project_id", projectId).is("deleted_at", null).order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as ProjectFile[];
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Apps and platforms ask for the same things; one list, two kinds. */
const APP_NL = [
  "Wat het moet doen, in een paar gewone zinnen",
  "Wie het gaat gebruiken, en op welke toestellen",
  "Schermen, schetsen of tools die je al gebruikt, ook ruwe",
  "Logo en huisstijl, als je die hebt",
  "De gegevens waarmee het moet werken, of een voorbeeld ervan",
];
const APP_EN = [
  "What it must do, in a few plain sentences",
  "Who will use it, and on which devices",
  "Screens, sketches or tools you already use, even rough ones",
  "Logo and brand assets, if you have them",
  "The data it needs to work with, or an example of it",
];

/** What we gently ask a client to share, per kind of work. */
export const CHECKLIST: Record<"nl" | "en", Partial<Record<ServiceKind, string[]>> & { default: string[] }> = {
  nl: {
    memorial_film: [
      "Foto’s, ook oude afdrukken (gewoon fotograferen met je telefoon)",
      "Filmpjes van de telefoon, hoe kort ook",
      "Spraakberichten of een opname van de stem",
      "Een lievelingslied of muziek die bij hem of haar past",
    ],
    music_video: ["De definitieve mix (WAV of hoge-kwaliteit MP3)", "De songtekst", "Referenties: beelden, kleuren, sfeer", "Foto’s van de artiest"],
    brand_film: [
      "Logo en huisstijl",
      "Het product zelf, of een plek waar we het kunnen filmen",
      "Wie er aan het woord komt, als er iemand spreekt: een oprichter, een collega, een klant",
      "Foto’s en beelden die je al hebt",
      "Referenties: films die je mooi vindt, het tempo en de sfeer",
    ],
    product_film: ["Productfoto’s, een link naar de app, of een adres waar we het product kunnen ophalen", "Logo en huisstijl", "De kernboodschap in één zin", "Referenties die je mooi vindt"],
    motion_design: [
      "Logo en huisstijl, liefst als vectorbestanden",
      "Het script of de verhaallijn, ook als het nog ruw is",
      "De formaten en lengtes die je nodig hebt, en waar het zal spelen",
      "Referenties: beweging die je mooi vindt, het tempo en de sfeer",
    ],
    ai_visual: ["Logo en huisstijl", "Referentiebeelden en sfeer", "Teksten die in beeld moeten", "Formaten waarin je het nodig hebt"],
    website: [
      "De teksten die je al hebt, of de pagina’s die je voor ogen hebt",
      "Logo en huisstijl, als je die hebt",
      "Foto’s van je team, je plek of je werk",
      "Toegang tot je huidige domein of hosting, of waar ze geregistreerd zijn",
      "Websites die je mooi vindt, en wat je er mooi aan vindt",
    ],
    app: APP_NL,
    platform: APP_NL,
    default: ["Alles wat helpt: teksten, logo’s, referenties, bestaand materiaal"],
  },
  en: {
    memorial_film: [
      "Photographs, old prints included (a phone photo of a print is fine)",
      "Phone videos, however short",
      "Voice messages or a recording of their voice",
      "A favourite song or music that suits them",
    ],
    music_video: ["The final mix (WAV or high-quality MP3)", "The lyrics", "References: images, colours, mood", "Photographs of the artist"],
    brand_film: [
      "Logo and brand assets",
      "The product itself, or a place where we can film it",
      "Who speaks in the film, if anyone: a founder, a colleague, a customer",
      "Photographs and footage you already have",
      "References: films you like, their pace and mood",
    ],
    product_film: ["Product photographs, a link to the app, or an address where we can collect the product", "Logo and brand assets", "The core message in one sentence", "References you like"],
    motion_design: [
      "Logo and brand assets, vector files if possible",
      "The script or storyline, even in rough form",
      "The formats and durations you need, and where it will play",
      "References: motion you like, its pace and mood",
    ],
    ai_visual: ["Logo and brand assets", "Reference images and mood", "Any text that must appear on screen", "The formats you need"],
    website: [
      "The texts you already have, or the pages you have in mind",
      "Logo and brand assets, if you have them",
      "Photographs of your team, your place or your work",
      "Access to your current domain or hosting, or where they are registered",
      "Websites you like, and what you like about them",
    ],
    app: APP_EN,
    platform: APP_EN,
    default: ["Anything that helps: texts, logos, references, existing material"],
  },
};

export function checklistFor(lang: "nl" | "en", service: ServiceKind): string[] {
  return CHECKLIST[lang][service] ?? CHECKLIST[lang].default;
}

/**
 * Removes the storage objects (and rows) of files that are gone for
 * good: those trashed longer than the cutoff, and every file of the
 * projects listed. Tolerates a missing table before migration 004.
 */
export async function purgeFiles(admin: SupabaseClient, projectIds: string[], trashedBefore?: string): Promise<number> {
  const doomed = new Map<string, string>();
  if (projectIds.length) {
    const { data, error } = await admin.from("project_files").select("id, path").in("project_id", projectIds);
    if (error?.code === "42P01") return 0;
    for (const row of data ?? []) doomed.set(row.id, row.path);
  }
  if (trashedBefore) {
    const { data, error } = await admin.from("project_files").select("id, path").lt("deleted_at", trashedBefore);
    if (error?.code === "42P01") return 0;
    for (const row of data ?? []) doomed.set(row.id, row.path);
  }
  if (!doomed.size) return 0;
  const paths = Array.from(doomed.values());
  for (let i = 0; i < paths.length; i += 100) await admin.storage.from(BUCKET).remove(paths.slice(i, i + 100));
  await admin.from("project_files").delete().in("id", Array.from(doomed.keys()));
  return doomed.size;
}
