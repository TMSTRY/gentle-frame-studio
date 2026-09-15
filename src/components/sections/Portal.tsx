"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/fx/Reveal";
import Timecode from "@/components/fx/Timecode";
import { SceneApprove, SceneFollow, SceneReview, SceneRoom, SceneShare } from "@/components/sections/PortalScenes";
import { useLocale } from "@/lib/i18n/locale";
import { localePath } from "@/lib/i18n/paths";
import { siteUi } from "@/lib/i18n/site-ui";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const ROTATE_MS = 5000;

/**
 * The client portal, shown as five moments in the client's own words.
 * On wide screens the moments scroll past a film strip that stays put
 * and changes frame; on phones the strip sits on top and the moments
 * turn by themselves until someone taps one. The frames are the real
 * portal design with fictional data, not screenshots.
 */
export default function Portal() {
  const locale = useLocale();
  const t = siteUi(locale).portal;
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const scenes = [SceneFollow, SceneShare, SceneReview, SceneApprove, SceneRoom];

  // Desktop: whichever moment sits at the middle of the viewport lights the frame.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const items = Array.from(list.querySelectorAll<HTMLElement>("[data-moment]"));
      const triggers = items.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        }),
      );
      return () => triggers.forEach((tr) => tr.kill());
    });
    return () => mm.revert();
  }, []);

  // Phones: a slow carousel until the visitor takes over.
  useEffect(() => {
    if (touched || prefersReducedMotion()) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % 5), ROTATE_MS);
    return () => clearInterval(id);
  }, [touched]);

  const holes = Array.from({ length: 18 });
  const Sprockets = () => (
    <div className="flex flex-col justify-between py-3" aria-hidden="true">
      {holes.map((_, i) => (
        <span key={i} className="h-3.5 w-2.5 rounded-[2px] border border-champagne/25 bg-ink" />
      ))}
    </div>
  );
  const Ghost = () => <div className="mx-3 h-8 rounded-sm border border-champagne/10 bg-ink/60" aria-hidden="true" />;

  const frame = (
    <figure className="relative mx-auto w-full max-w-[380px]">
      <div className="absolute -inset-10 rounded-[40px] blur-2xl" aria-hidden="true" style={{ background: "radial-gradient(closest-side, rgba(230,213,179,0.22), transparent 72%)" }} />
      <div className="relative grid grid-cols-[28px_1fr_28px] overflow-hidden rounded-md border border-champagne/25 bg-ink-deep shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        <Sprockets />
        <div className="flex flex-col gap-3 py-3">
          <Ghost />
          <div className="relative overflow-hidden rounded-sm border border-champagne/15 bg-ink" style={{ aspectRatio: "3 / 4" }}>
            {scenes.map((Scene, i) => (
              <div
                key={i}
                aria-hidden={i !== active}
                className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ opacity: i === active ? 1 : 0, transform: i === active ? "scale(1)" : "scale(1.03)", pointerEvents: i === active ? "auto" : "none" }}
              >
                {i === active ? <Scene t={t.scenes} /> : null}
              </div>
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent px-4 pt-8 pb-3 text-[0.58rem] tracking-[0.28em] text-cream/70 uppercase">
              <span>Frame 0{active + 1}</span>
              <span><Timecode /></span>
            </div>
            <div className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t border-l border-champagne/60" aria-hidden="true" />
            <div className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t border-r border-champagne/60" aria-hidden="true" />
          </div>
          <Ghost />
        </div>
        <Sprockets />
      </div>
      <figcaption className="mt-4 flex items-center justify-between text-[0.58rem] tracking-[0.28em] text-taupe uppercase">
        <span>{t.frameTag}</span>
        <span>0{active + 1} / 05</span>
      </figcaption>
    </figure>
  );

  return (
    <section id="portal" className="scroll-mt-24 border-t border-line" aria-label={t.ariaLabel}>
      <div className="mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 pb-20 lg:pb-28">
            <div>
              <p className="text-eyebrow mb-6">{t.eyebrow}</p>
              <h2 className="font-display max-w-4xl text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">{t.title}</h2>
            </div>
            <p className="max-w-sm pb-2 text-sm leading-relaxed text-taupe">{t.lede}</p>
          </div>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* The strip: sticky beside the moments on wide screens, on top elsewhere. */}
          <div className="order-first lg:order-last lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-[14vh]">
              <Reveal>{frame}</Reveal>
            </div>
          </div>

          <div className="lg:col-span-6">
            {/* Phones: five numerals to tap. */}
            <div className="mb-10 flex gap-6 lg:hidden" role="tablist" aria-label={t.ariaLabel}>
              {t.moments.map((m, i) => (
                <button
                  key={m.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => {
                    setTouched(true);
                    setActive(i);
                  }}
                  className={`font-display border-b pb-2 text-lg transition-colors ${i === active ? "border-champagne text-champagne" : "border-transparent text-taupe"}`}
                >
                  0{i + 1}
                </button>
              ))}
            </div>

            <ol ref={listRef}>
              {t.moments.map((m, i) => (
                <li
                  key={m.title}
                  data-moment
                  className={`${i === active ? "" : "hidden lg:block"} lg:flex lg:min-h-[46vh] lg:items-center`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setTouched(true);
                      setActive(i);
                    }}
                    className="group flex w-full gap-8 text-left lg:gap-12"
                  >
                    <span className={`font-display shrink-0 pt-1 text-xl transition-colors duration-700 lg:text-2xl ${i === active ? "text-champagne" : "text-taupe/50"}`}>0{i + 1}</span>
                    <span className="border-t border-line pt-1 lg:border-0 lg:pt-0">
                      <span className={`font-display block text-[1.9rem] leading-[1.05] font-medium transition-colors duration-700 lg:text-[2.4rem] ${i === active ? "text-cream" : "text-cream/45 group-hover:text-cream/70"}`}>{m.title}</span>
                      <span className={`mt-4 block max-w-md text-[0.95rem] leading-[1.85] font-light transition-colors duration-700 ${i === active ? "text-taupe" : "text-taupe/50"}`}>{m.line}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <Reveal>
              <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8 lg:mt-8">
                <p className="max-w-md text-sm leading-relaxed text-taupe">{t.trust}</p>
                <Link href="/portal/login" className="link-line text-[0.66rem] tracking-[0.28em] text-champagne uppercase" data-cursor="Open">
                  {t.cta} →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
