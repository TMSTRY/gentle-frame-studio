"use client";

import type { siteUi } from "@/lib/i18n/site-ui";

type Scenes = ReturnType<typeof siteUi>["portal"]["scenes"];

const eyebrow = "text-[0.5rem] tracking-[0.26em] text-taupe uppercase";
const hair = "border-t border-champagne/15";

/**
 * Five moments from the client portal, drawn with the portal's own
 * design system and fictional data: crisp at any size, honest about
 * what the client sees, and never out of date the way a screenshot is.
 */
export function SceneFollow({ t }: { t: Scenes }) {
  return (
    <div className="flex h-full flex-col p-5">
      <p className={eyebrow}>{t.service}</p>
      <p className="font-display mt-2 text-[1.35rem] leading-tight text-cream">{t.project}</p>
      <ol className="mt-5 grid grid-cols-3 gap-px border border-champagne/20 bg-champagne/20">
        {t.steps.map((step, i) => {
          const reached = i <= 3;
          const current = i === 3;
          return (
            <li key={step} className={`bg-ink p-2.5 ${reached ? "" : "opacity-40"}`}>
              <span className="font-display block text-base leading-none text-transparent [-webkit-text-stroke:1px_rgba(230,213,179,0.35)]">{String(i + 1).padStart(2, "0")}</span>
              <span className={`mt-1.5 block text-[0.42rem] tracking-[0.2em] uppercase ${current ? "text-champagne" : "text-cream/70"}`}>{step}</span>
            </li>
          );
        })}
      </ol>
      <ul className="mt-5">
        {t.updates.map((u, i) => (
          <li key={u} className={`${hair} py-3`}>
            <span className={eyebrow}>{i === 0 ? "12 sep" : "19 sep"}</span>
            <p className="mt-1 text-[0.72rem] leading-relaxed text-cream/85">{u}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SceneShare({ t }: { t: Scenes }) {
  return (
    <div className="flex h-full flex-col p-5">
      <p className={eyebrow}>{t.filesTitle}</p>
      <ul className="mt-3">
        {t.files.map(([name, size], i) => (
          <li key={name} className={`${hair} flex items-baseline justify-between gap-3 py-2.5 text-[0.7rem]`} style={{ animation: `portal-tick 0.6s ${0.3 + i * 0.25}s both` }}>
            <span className="truncate text-cream/90">{name}</span>
            <span className="shrink-0 text-taupe">{size}</span>
            <span className="shrink-0 text-champagne">✓</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto border border-dashed border-champagne/30 p-5 text-center">
        <p className="text-[0.68rem] leading-relaxed text-cream/70">{t.drop}</p>
        <span className="mt-4 inline-block rounded-full border border-champagne/50 px-5 py-2.5 text-[0.48rem] tracking-[0.3em] text-champagne uppercase">+</span>
      </div>
    </div>
  );
}

export function SceneReview({ t }: { t: Scenes }) {
  return (
    <div className="flex h-full flex-col p-5">
      <p className={eyebrow}>{t.cut}</p>
      <div className="relative mt-3 aspect-video w-full overflow-hidden border border-champagne/25 bg-black">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 45%, rgba(194,161,101,0.35), transparent 70%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-cream/85" />
        </div>
        <div className="absolute inset-x-3 bottom-2.5">
          <div className="relative h-px bg-cream/25">
            <div className="absolute top-0 left-0 h-px w-[38%] bg-champagne" />
            <span className="absolute -top-[3px] left-[38%] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-champagne shadow-[0_0_10px_rgba(230,213,179,0.8)]" />
          </div>
          <div className="mt-1 flex justify-between text-[0.42rem] tracking-[0.2em] text-cream/60 uppercase">
            <span>{t.noteAt}</span>
            <span>1:52</span>
          </div>
        </div>
      </div>
      <ul className="mt-4">
        <li className={`${hair} py-3`}>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-base text-champagne">{t.noteAt}</span>
            <span className={eyebrow}>{t.noteBy}</span>
          </div>
          <p className="mt-1 text-[0.74rem] leading-relaxed text-cream/90">{t.note}</p>
        </li>
        <li className={`${hair} py-3 opacity-80`}>
          <div className="flex items-baseline gap-3">
            <span className={eyebrow}>Studio</span>
            <span className="text-[0.42rem] tracking-[0.2em] text-champagne/70 uppercase">✓</span>
          </div>
          <p className="mt-1 text-[0.74rem] leading-relaxed text-cream/80">{t.reply}</p>
        </li>
      </ul>
    </div>
  );
}

export function SceneApprove({ t }: { t: Scenes }) {
  return (
    <div className="flex h-full flex-col p-5">
      <p className={eyebrow}>{t.service}</p>
      <p className="font-display mt-2 text-[1.35rem] leading-tight text-cream">{t.project}</p>
      <div className={`${hair} mt-6 pt-5`}>
        <label className="flex items-start gap-3 text-[0.74rem] leading-relaxed text-cream/85">
          <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-champagne bg-champagne text-[0.55rem] text-ink">✓</span>
          <span>{t.approveCheck}</span>
        </label>
        <span className="mt-5 inline-block rounded-full border border-champagne bg-champagne px-5 py-2.5 text-[0.48rem] tracking-[0.3em] text-ink uppercase">{t.approveButton}</span>
      </div>
      <div className={`${hair} mt-auto pt-4`} style={{ animation: "portal-tick 0.8s 0.9s both" }}>
        <span className="text-[0.5rem] tracking-[0.26em] text-champagne uppercase">{t.delivered}</span>
        <p className="mt-1.5 text-[0.68rem] text-taupe">{t.invoice}</p>
      </div>
    </div>
  );
}

export function SceneRoom({ t }: { t: Scenes }) {
  return (
    <div className="flex h-full flex-col items-center bg-ink-deep p-5 text-center">
      <span className="mt-1 block h-4 w-4 rounded-[2px] border border-champagne/60" aria-hidden="true" />
      <p className="font-display mt-6 text-[1.9rem] leading-none text-cream">{t.roomTitle}</p>
      <p className="mt-2 text-[0.46rem] tracking-[0.34em] text-champagne/80 uppercase">{t.roomDates}</p>
      <div className="relative mt-5 aspect-video w-full border border-champagne/25 bg-black shadow-[0_0_50px_rgba(230,213,179,0.1)]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 45%, rgba(194,161,101,0.3), transparent 70%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-cream/85" />
        </div>
      </div>
      <p className="mt-4 text-[0.5rem] tracking-[0.24em] text-taupe uppercase">
        {t.roomCode} <span className="ml-1 tracking-[0.3em] text-champagne">marie47</span>
      </p>
      <span className="mt-4 inline-block rounded-full border border-champagne/50 px-5 py-2.5 text-[0.46rem] tracking-[0.3em] text-champagne uppercase">{t.roomKeep}</span>
      <p className="mt-auto text-[0.42rem] tracking-[0.26em] text-taupe/70 uppercase">{t.roomMade}</p>
    </div>
  );
}
