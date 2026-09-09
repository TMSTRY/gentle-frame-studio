import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { loadDocumentBundle } from "@/lib/portal/documents";
import { requireAdmin } from "@/lib/portal/guard";
import { renderDocumentPdf } from "@/lib/pdf/render";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const bundle = await loadDocumentBundle(createAdminClient(), id);
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
