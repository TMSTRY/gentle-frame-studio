import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { loadDocumentBundle } from "@/lib/portal/documents";
import { renderDocumentPdf } from "@/lib/pdf/render";
import { createClient } from "@/lib/supabase/server";

/** The client's own copy - RLS decides whether the document exists for them. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Sign in first", { status: 401 });
  const { id } = await params;
  const bundle = await loadDocumentBundle(supabase, id);
  if (!bundle) return new NextResponse("Not found", { status: 404 });
  const { buffer, filename } = await renderDocumentPdf(bundle);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
