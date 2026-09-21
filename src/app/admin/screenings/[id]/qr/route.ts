import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/portal/guard";
import { screeningUrl } from "@/lib/portal/screenings";
import { createAdminClient } from "@/lib/supabase/admin";

/** The screening-room link as a crisp vector QR, ink on transparent, ready for print. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data: room } = await createAdminClient().from("screenings").select("token, title").eq("id", id.slice(0, 60)).maybeSingle();
  if (!room) return new NextResponse("Not found", { status: 404 });
  const svg = await QRCode.toString(screeningUrl(room.token), { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#0a0908", light: "#00000000" } });
  const name = `qr-${room.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "screening"}.svg`;
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "private, no-store" },
  });
}
