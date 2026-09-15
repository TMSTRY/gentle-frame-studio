import { createHmac, randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { site } from "@/content/site";
import { BUCKET } from "@/lib/portal/files";
import { sourceForUrl, type CutSource } from "@/lib/portal/review";
import type { Screening } from "@/lib/portal/types";

/** 22 url-safe characters: unguessable, still pastes cleanly into a message. */
export function newToken(): string {
  return randomBytes(16).toString("base64url").slice(0, 22);
}

export const screeningUrl = (token: string) => `${site.url}/screening/${token}`;

/** Cookie proving a visitor typed the right code; bound to this screening and its current code. */
export const passCookieName = (id: string) => `gfs_screen_${id.replace(/-/g, "").slice(0, 16)}`;
export function passCookieValue(id: string, passcode: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.CRON_SECRET ?? "gentle";
  return createHmac("sha256", secret).update(`${id}:${passcode}`).digest("hex");
}

export type ScreeningState = "open" | "closed" | "expired";

export function screeningState(s: Screening): ScreeningState {
  if (s.revoked_at) return "closed";
  if (s.expires_at && new Date(s.expires_at).getTime() < Date.now()) return "expired";
  return "open";
}

/** The screening behind a token, with its client's language. Service role: visitors aren't signed in. */
export async function loadScreening(admin: SupabaseClient, token: string) {
  const { data, error } = await admin
    .from("screenings")
    .select("*, clients(language, name), projects(deleted_at)")
    .eq("token", token.slice(0, 40))
    .maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as Screening & { clients: { language: "nl" | "en"; name: string } | null; projects: { deleted_at: string | null } | null };
  if (row.projects?.deleted_at) return null;
  return { screening: row as Screening, language: row.clients?.language === "nl" ? ("nl" as const) : ("en" as const) };
}

/** Where the film plays from: a long signed URL on the vault, or an outside embed. Poster likewise. */
export async function screeningMedia(admin: SupabaseClient, s: Screening, seconds = 6 * 3600): Promise<{ source: CutSource | null; poster: string | null; fileName: string | null }> {
  let source: CutSource | null = null;
  let poster: string | null = null;
  let fileName: string | null = null;
  const ids = [s.file_id, s.poster_file_id].filter((id): id is string => Boolean(id));
  const { data: files } = ids.length ? await admin.from("project_files").select("id, path, name").in("id", ids).is("deleted_at", null) : { data: [] };
  const byId = new Map((files ?? []).map((f) => [f.id, f]));
  const film = s.file_id ? byId.get(s.file_id) : undefined;
  if (film) {
    const { data } = await admin.storage.from(BUCKET).createSignedUrl(film.path, seconds);
    if (data) source = { kind: "video", url: data.signedUrl };
    fileName = film.name;
  } else if (s.external_url) {
    source = sourceForUrl(s.external_url);
  }
  const still = s.poster_file_id ? byId.get(s.poster_file_id) : undefined;
  if (still) {
    const { data } = await admin.storage.from(BUCKET).createSignedUrl(still.path, seconds);
    if (data) poster = data.signedUrl;
  }
  return { source, poster, fileName };
}

export async function listScreenings(db: SupabaseClient, projectId: string): Promise<Screening[]> {
  const { data, error } = await db.from("screenings").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Screening[];
}

export const SCREENING_UI = {
  nl: {
    private: "Deze film is privé.",
    enterCode: "Vul de kijkcode in die de familie met je deelde.",
    code: "Kijkcode",
    enter: "Bekijken",
    wrong: "Die code klopt niet. Probeer het nog eens.",
    closed: "Deze zaal is gesloten.",
    closedBody: "De familie heeft deze film niet langer gedeeld. Vragen? Schrijf naar hello@gentleframestudio.com.",
    download: "Bewaar de film",
    fullscreen: "Volledig scherm werkt via de knop in de speler.",
    madeBy: "Met zorg gemaakt door Gentle Frame Studio",
    open: "Open de film",
  },
  en: {
    private: "This film is private.",
    enterCode: "Enter the code the family shared with you.",
    code: "Viewing code",
    enter: "Watch",
    wrong: "That code isn’t right. Please try again.",
    closed: "This screening room is closed.",
    closedBody: "The family is no longer sharing this film. Questions? Write to hello@gentleframestudio.com.",
    download: "Keep the film",
    fullscreen: "Full screen is available from the player’s own button.",
    madeBy: "Made with care by Gentle Frame Studio",
    open: "Open the film",
  },
} as const;
