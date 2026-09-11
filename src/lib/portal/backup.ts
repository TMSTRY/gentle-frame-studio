import type { SupabaseClient } from "@supabase/supabase-js";

const TABLES = ["clients", "projects", "project_updates", "documents", "document_lines", "payments", "signatures", "settings", "document_counters"] as const;

/**
 * Full JSON snapshot of the portal's data into the private `documents`
 * bucket under backups/. Keeps the last 12 (roughly three months of
 * weekly runs). Returns a one-line summary for the digest.
 */
export async function runBackup(db: SupabaseClient): Promise<string> {
  const snapshot: Record<string, unknown[]> = {};
  let rows = 0;
  for (const table of TABLES) {
    const { data, error } = await db.from(table).select("*");
    if (error) return `Backup FAILED reading ${table}: ${error.message}`;
    snapshot[table] = data ?? [];
    rows += data?.length ?? 0;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = `backups/portal-${stamp}.json`;
  const body = JSON.stringify({ taken_at: new Date().toISOString(), tables: snapshot }, null, 0);
  const { error: upErr } = await db.storage.from("documents").upload(path, body, { contentType: "application/json", upsert: false });
  if (upErr) return `Backup FAILED uploading: ${upErr.message}`;

  const { data: list } = await db.storage.from("documents").list("backups", { sortBy: { column: "name", order: "desc" } });
  const stale = (list ?? []).slice(12).map((f) => `backups/${f.name}`);
  if (stale.length) await db.storage.from("documents").remove(stale);

  return `Backup written: ${path} (${rows} rows, ${Math.round(body.length / 1024)} KB)${stale.length ? `, ${stale.length} old removed` : ""}`;
}
