import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { BUCKET } from "@/lib/portal/files";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Download a project file. The row is read as the signed-in user, so
 * RLS decides whether they may have it; the bytes then come through a
 * short-lived signed URL on the private bucket.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/portal/login", _request.url));
  const { data: file } = await supabase.from("project_files").select("path, name").eq("id", id.slice(0, 60)).maybeSingle();
  if (!file) return new NextResponse("Not found", { status: 404 });
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(file.path, 120, { download: file.name });
  if (error || !data) return new NextResponse("Unavailable", { status: 502 });
  return NextResponse.redirect(data.signedUrl, { status: 302, headers: { "Cache-Control": "private, no-store" } });
}
