import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { BUCKET } from "@/lib/portal/files";
import { loadScreening, passCookieName, passCookieValue, screeningState } from "@/lib/portal/screenings";
import { createAdminClient } from "@/lib/supabase/admin";

/** The family keeps a copy: same gate as the page, then a short signed download link. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const admin = createAdminClient();
  const found = await loadScreening(admin, token);
  if (!found || screeningState(found.screening) !== "open" || !found.screening.allow_download || !found.screening.file_id) {
    return new NextResponse("Not available", { status: 404 });
  }
  const { screening } = found;
  if (screening.passcode) {
    const store = await cookies();
    if (store.get(passCookieName(screening.id))?.value !== passCookieValue(screening.id, screening.passcode)) {
      return NextResponse.redirect(new URL(`/screening/${token}`, _request.url));
    }
  }
  const { data: file } = await admin.from("project_files").select("path, name").eq("id", screening.file_id).maybeSingle();
  if (!file) return new NextResponse("Not available", { status: 404 });
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(file.path, 300, { download: file.name });
  if (error || !data) return new NextResponse("Unavailable", { status: 502 });
  return NextResponse.redirect(data.signedUrl, { status: 302, headers: { "Cache-Control": "private, no-store" } });
}
