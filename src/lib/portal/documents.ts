import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_STUDIO, type Client, type DocumentLine, type DocumentRecord, type StudioSettings } from "@/lib/portal/types";

/** Studio details from `settings.studio`, with sane defaults for anything unset. */
export async function loadStudio(db: SupabaseClient): Promise<StudioSettings> {
  const { data } = await db.from("settings").select("value").eq("key", "studio").maybeSingle();
  return { ...DEFAULT_STUDIO, ...((data?.value as Partial<StudioSettings> | undefined) ?? {}) };
}

export interface DocumentBundle {
  document: DocumentRecord;
  lines: DocumentLine[];
  client: Client;
  studio: StudioSettings;
  project: { id: string; title: string } | null;
}

/**
 * Everything a document view or PDF needs, in one go. Works with the
 * user-scoped client (RLS decides visibility) or the service client.
 */
export async function loadDocumentBundle(db: SupabaseClient, id: string): Promise<DocumentBundle | null> {
  const { data: document } = await db.from("documents").select("*").eq("id", id).maybeSingle();
  if (!document) return null;
  const [{ data: lines }, { data: client }, studio, projectRes] = await Promise.all([
    db.from("document_lines").select("*").eq("document_id", id).order("position"),
    db.from("clients").select("*").eq("id", document.client_id).maybeSingle(),
    loadStudio(db),
    document.project_id
      ? db.from("projects").select("id, title").eq("id", document.project_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (!client) return null;
  return {
    document: document as DocumentRecord,
    lines: (lines ?? []) as DocumentLine[],
    client: client as Client,
    studio,
    project: (projectRes.data as { id: string; title: string } | null) ?? null,
  };
}

/** Sum lines and apply the VAT rate; all integer cents. */
export function computeTotals(lines: { quantity: number; unit_price_cents: number }[], vatRate: number) {
  const subtotal = lines.reduce((sum, line) => sum + Math.round(line.quantity * line.unit_price_cents), 0);
  const vat = Math.round((subtotal * vatRate) / 100);
  return { subtotal_cents: subtotal, vat_cents: vat, total_cents: subtotal + vat };
}
