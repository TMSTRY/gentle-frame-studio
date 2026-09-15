import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { enterScreeningAction } from "@/app/screening/[token]/actions";
import FrameMark from "@/components/brand/FrameMark";
import { buttonClass, inputClass, labelClass } from "@/components/portal/ui";
import { loadScreening, passCookieName, passCookieValue, screeningMedia, screeningState, SCREENING_UI } from "@/lib/portal/screenings";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Private screening", robots: { index: false, follow: false, noarchive: true } };

/**
 * The family's own screening room: one film, no platform, no feed.
 * Reachable only through an unguessable link, optionally behind a
 * code the family hands out. The film streams from private storage
 * through a signed URL that lives a few hours.
 */
export default async function ScreeningPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ wrong?: string }> }) {
  const { token } = await params;
  const flags = await searchParams;
  const admin = createAdminClient();
  const found = await loadScreening(admin, token);
  if (!found) notFound();
  const { screening, language } = found;
  const t = SCREENING_UI[language];
  const state = screeningState(screening);

  const frame = (inner: React.ReactNode) => (
    <div className="flex min-h-[100svh] flex-col bg-ink-deep text-cream">
      <header className="flex items-center justify-center pt-10 pb-4">
        <FrameMark className="w-8 text-champagne/70" strokeWidth={5} />
      </header>
      <main id="main" className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-5 pb-16 md:px-10">
        {inner}
      </main>
      <footer className="pb-10 text-center text-[0.6rem] tracking-[0.3em] text-taupe/80 uppercase">
        <a href="https://gentleframestudio.com" className="hover:text-champagne">{t.madeBy}</a>
      </footer>
    </div>
  );

  if (state !== "open") {
    return frame(
      <div className="my-auto max-w-md text-center">
        <h1 className="font-display text-3xl font-medium text-cream">{t.closed}</h1>
        <p className="mt-5 text-sm leading-relaxed text-taupe">{t.closedBody}</p>
      </div>,
    );
  }

  if (screening.passcode) {
    const store = await cookies();
    const ok = store.get(passCookieName(screening.id))?.value === passCookieValue(screening.id, screening.passcode);
    if (!ok) {
      return frame(
        <form action={enterScreeningAction} className="my-auto w-full max-w-sm text-center">
          <input type="hidden" name="token" value={token} />
          <h1 className="font-display text-3xl font-medium text-cream">{t.private}</h1>
          <p className="mt-4 text-sm leading-relaxed text-taupe">{t.enterCode}</p>
          <div className="mt-10 text-left">
            <label htmlFor="code" className={labelClass}>{t.code}</label>
            <input id="code" name="code" required autoComplete="off" autoCapitalize="off" autoFocus className={`${inputClass} text-center tracking-[0.3em]`} />
          </div>
          {flags.wrong ? <p className="mt-4 text-sm text-gold" role="alert">{t.wrong}</p> : null}
          <button type="submit" className={`${buttonClass} mt-10`}>{t.enter}</button>
        </form>,
      );
    }
  }

  const { source, poster } = await screeningMedia(admin, screening);
  // Best-effort audience count; a race here only ever miscounts by one.
  void admin.from("screenings").update({ view_count: screening.view_count + 1, last_viewed_at: new Date().toISOString() }).eq("id", screening.id).then(() => undefined);

  return frame(
    <>
      <div className="mt-6 text-center md:mt-10">
        <h1 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] font-medium text-cream">{screening.title}</h1>
        {screening.subtitle ? <p className="mt-4 text-[0.7rem] tracking-[0.34em] text-champagne/80 uppercase">{screening.subtitle}</p> : null}
      </div>
      <div className="mt-10 w-full border border-champagne/25 bg-black shadow-[0_0_120px_rgba(230,213,179,0.08)] md:mt-14">
        {source?.kind === "video" ? (
          <video src={source.url} poster={poster ?? undefined} controls playsInline preload="metadata" controlsList="nodownload" className="block aspect-video w-full bg-black" />
        ) : source?.kind === "embed" ? (
          <iframe src={source.url} title={screening.title} allow="fullscreen; picture-in-picture" allowFullScreen className="block aspect-video w-full" />
        ) : source?.kind === "link" ? (
          <div className="flex aspect-video items-center justify-center">
            <a href={source.url} target="_blank" rel="noopener" className={buttonClass}>{t.open} ↗</a>
          </div>
        ) : (
          <div className="aspect-video" />
        )}
      </div>
      {screening.dedication ? (
        <p className="font-display mt-10 max-w-2xl text-center text-xl leading-snug text-champagne/90 italic md:text-2xl">{screening.dedication}</p>
      ) : null}
      {screening.allow_download && source?.kind === "video" ? (
        <a href={`/screening/${token}/download`} className={`${buttonClass} mt-12`}>{t.download}</a>
      ) : null}
    </>,
  );
}
