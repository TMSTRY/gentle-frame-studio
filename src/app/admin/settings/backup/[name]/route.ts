import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/portal/guard";
import { createAdminClient } from "@/lib/supabase/admin";

/** Hands the studio one snapshot to keep outside Supabase: a short signed download link. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  await requireAdmin();
  const { name } = await params;
  const safe = name.replace(/[^\w.-]/g, "");
  if (!safe.endsWith(".json")) return new NextResponse("Not found", { status: 404 });
  const { data, error } = await createAdminClient().storage.from("documents").createSignedUrl(`backups/${safe}`, 120, { download: safe });
  if (error || !data) return new NextResponse("Not found", { status: 404 });
  return NextResponse.redirect(data.signedUrl, { status: 302, headers: { "Cache-Control": "private, no-store" } });
}
