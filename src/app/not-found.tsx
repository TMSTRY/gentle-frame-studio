import type { Metadata } from "next";
import Link from "next/link";
import FrameMark from "@/components/brand/FrameMark";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * A missing page, treated like a missing frame: the mark glows
 * faintly behind a single line, and the way back is one step.
 */
export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <FrameMark className="animate-breathe w-[min(88vw,900px)] text-champagne/15 blur-[1.5px]" strokeWidth={0.8} />
      </div>

      <div className="relative z-10 text-center">
        <p className="text-eyebrow mb-8">404 · Off the reel</p>
        <h1 className="font-display text-[clamp(2.6rem,7vw,6.4rem)] leading-[1.05] font-medium text-cream">
          This frame
          <br />
          <span className="text-gold italic">was never shot.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-taupe">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or has quietly moved.
          The studio is still right here.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <Link
            href="/"
            className="inline-block rounded-full border border-champagne/50 px-8 py-4 text-[0.68rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink"
          >
            Back to the studio
          </Link>
          <Link href="/#work" className="link-line text-[0.68rem] tracking-[0.3em] text-cream/70 uppercase">
            See the work
          </Link>
        </div>
      </div>
    </main>
  );
}
