import type { SupabaseClient } from "@supabase/supabase-js";
import { BUCKET } from "@/lib/portal/files";
import type { ReviewCut, ReviewNote } from "@/lib/portal/types";

/** Where the player gets its picture from. */
export type CutSource = { kind: "video"; url: string } | { kind: "embed"; url: string } | { kind: "link"; url: string };

/** YouTube and Vimeo links become embeds; direct video files play natively; the rest is just a link. */
export function sourceForUrl(url: string): CutSource {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "embed", url: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return { kind: "video", url };
  return { kind: "link", url };
}

/**
 * Cuts and notes for a project, read as the caller (RLS or service
 * role). A cut that points at a file in the vault gets a two-hour
 * signed URL so the browser can play it straight from private storage.
 */
export async function loadReview(db: SupabaseClient, admin: SupabaseClient, projectId: string) {
  const { data: cutRows, error } = await db.from("review_cuts").select("*").eq("project_id", projectId).is("deleted_at", null).order("version", { ascending: false });
  if (error) return { available: error.code !== "42P01", cuts: [] as ReviewCut[], notes: [] as ReviewNote[], sources: new Map<string, CutSource>() };
  const cuts = (cutRows ?? []) as ReviewCut[];
  const { data: noteRows } = cuts.length
    ? await db.from("review_notes").select("*").eq("project_id", projectId).order("created_at")
    : { data: [] };
  const notes = ((noteRows ?? []) as ReviewNote[]).map((n) => ({ ...n, timecode: n.timecode === null ? null : Number(n.timecode) }));

  const sources = new Map<string, CutSource>();
  const fileIds = cuts.map((c) => c.file_id).filter((id): id is string => Boolean(id));
  const { data: files } = fileIds.length ? await db.from("project_files").select("id, path").in("id", fileIds) : { data: [] };
  const pathById = new Map((files ?? []).map((f) => [f.id, f.path]));
  for (const cut of cuts) {
    if (cut.file_id && pathById.has(cut.file_id)) {
      const { data } = await admin.storage.from(BUCKET).createSignedUrl(pathById.get(cut.file_id)!, 7200);
      if (data) sources.set(cut.id, { kind: "video", url: data.signedUrl });
    } else if (cut.external_url) {
      sources.set(cut.id, sourceForUrl(cut.external_url));
    }
  }
  return { available: true, cuts, notes, sources };
}

export function formatTimecode(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "";
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** "1:23" | "83" | "01:02:03" → seconds; empty or nonsense → null. */
export function parseTimecode(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;
  const parts = raw.split(":").map((p) => Number(p));
  if (parts.some((p) => !Number.isFinite(p) || p < 0)) return null;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}
