import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";
import FrameMark from "@/components/brand/FrameMark";
import { requireAdmin } from "@/lib/portal/guard";
import { screeningUrl } from "@/lib/portal/screenings";
import type { Screening } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Keepsake card", robots: { index: false, follow: false } };

const COPY = {
  nl: { watch: "Bekijk de film", code: "Kijkcode", scan: "Scan de code of typ het adres", made: "Met zorg gemaakt door Gentle Frame Studio", print: "Afdrukken", hint: "A6, kraft of crèmekarton, 300 g. Print op ware grootte, zonder schaling." },
  en: { watch: "Watch the film", code: "Viewing code", scan: "Scan the code or type the address", made: "Made with care by Gentle Frame Studio", print: "Print", hint: "A6, kraft or cream card, 300 gsm. Print at actual size, no scaling." },
};

/**
 * A print-ready A6 card for the memorial print or the keepsake box:
 * title, dates, a QR to the private screening room and the code.
 * Cream paper, ink type, the mark; nothing that shouts.
 */
export default async function KeepsakeCardPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data } = await createAdminClient().from("screenings").select("*, clients(language)").eq("id", id.slice(0, 60)).maybeSingle();
  if (!data) notFound();
  const room = data as Screening & { clients: { language: "nl" | "en" } | null };
  const t = COPY[room.clients?.language === "nl" ? "nl" : "en"];
  const url = screeningUrl(room.token);
  const qr = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: "#0a0908", light: "#00000000" } });

  return (
    <div className="min-h-[100svh] bg-[#e9e2d3] text-[#0a0908] print:bg-white">
      <style>{`@page { size: A6; margin: 0; } @media print { .no-print { display: none !important; } body { background: #fff !important; } }`}</style>
      <div className="no-print mx-auto flex max-w-[105mm] items-center justify-between px-2 pt-6 pb-4 text-[0.62rem] tracking-[0.26em] text-[#6b6255] uppercase">
        <a href={`/admin/projects/${room.project_id}#screening`} className="hover:text-[#0a0908]">← Back</a>
        <a href={`/admin/screenings/${room.id}/qr`} className="hover:text-[#0a0908]">QR as SVG</a>
      </div>

      <div className="mx-auto flex h-[148mm] w-[105mm] flex-col items-center bg-[#f2ead9] px-[9mm] pt-[11mm] pb-[9mm] text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)] print:shadow-none">
        <FrameMark className="w-[9mm] text-[#0a0908]" strokeWidth={5} />
        <h1 className="mt-[8mm] font-display text-[9.5mm] leading-[1.05] font-medium">{room.title}</h1>
        {room.subtitle ? <p className="mt-[2.5mm] text-[2.6mm] tracking-[0.34em] uppercase text-[#6b6255]">{room.subtitle}</p> : null}
        <p className="mt-[8mm] text-[2.4mm] tracking-[0.3em] uppercase text-[#6b6255]">{t.watch}</p>
        <div className="mt-[3mm] h-[34mm] w-[34mm] [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
        <p className="mt-[3mm] max-w-[80mm] text-[2.3mm] leading-[1.6] text-[#6b6255]">{t.scan}</p>
        <p className="mt-[1mm] font-mono text-[2.5mm] break-all text-[#0a0908]">{url.replace(/^https:\/\//, "")}</p>
        {room.passcode ? (
          <p className="mt-[4mm] text-[2.4mm] tracking-[0.3em] uppercase text-[#6b6255]">
            {t.code} <span className="ml-[1.5mm] text-[#0a0908]">{room.passcode}</span>
          </p>
        ) : null}
        <p className="mt-auto text-[2.1mm] tracking-[0.28em] uppercase text-[#a09585]">{t.made}</p>
      </div>

      <p className="no-print mx-auto mt-6 max-w-[105mm] px-2 text-center text-xs leading-relaxed text-[#6b6255]">
        {t.hint} <span className="whitespace-nowrap">⌘P / Ctrl+P</span> · {t.print}
      </p>
    </div>
  );
}
