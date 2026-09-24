"use client";

import { useEffect, useRef } from "react";
import FrameMark from "@/components/brand/FrameMark";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";
import { services, type Service, type ServiceMotif } from "@/content/services";
import { useLocale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Seven services, treated as editorial chapters - each with its
 * own reel number, copy and ambient motif - rather than a grid
 * of interchangeable cards.
 */
export default function Services() {
  const locale = useLocale();
  const t = siteUi(locale).services;
  return (
    <section id="services" className="relative scroll-mt-24" aria-label="Services">
      <div className="mx-auto max-w-[1680px] px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-20">
          <div>
            <Reveal y={10}>
              <p className="text-eyebrow mb-6">{t.eyebrow}</p>
            </Reveal>
            <TitleReveal className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">
              {t.title}
            </TitleReveal>
          </div>
          <Reveal delay={0.25}>
            <p className="max-w-xs pb-2 text-sm leading-relaxed text-taupe">
              {t.lede}
            </p>
          </Reveal>
        </div>

        <div>
          {services.map((service) => (
            <ServiceChapter key={service.id} service={locale === "nl" && service.nl ? { ...service, ...service.nl } : service} readMore={t.readMore} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceChapter({ service, readMore }: { service: Service; readMore: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = ref.current;
    if (!article) return;

    // The chapter being read: its sticky numeral takes the light.
    const current = ScrollTrigger.create({
      trigger: article,
      start: "top 55%",
      end: "bottom 55%",
      toggleClass: { targets: article, className: "is-current" },
    });
    if (prefersReducedMotion()) return () => current.kill();

    const motif = article.querySelector<HTMLElement>("[data-motif]");
    const kind = motif?.dataset.motif as ServiceMotif | undefined;
    const tweens: gsap.core.Animation[] = [];
    const cleanups: (() => void)[] = [];

    if (motif && kind === "sheen") {
      // One sweep of light when the chapter arrives, another on hover.
      const bar = motif.querySelector<HTMLElement>("[data-sheen]");
      const sweep = () =>
        bar?.animate(
          [{ transform: "translateX(-140%) skewX(-18deg)" }, { transform: "translateX(240%) skewX(-18deg)" }],
          { duration: 1700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      const onEnter = ScrollTrigger.create({ trigger: motif, start: "top 80%", once: true, onEnter: () => sweep() });
      article.addEventListener("mouseenter", sweep);
      cleanups.push(() => {
        onEnter.kill();
        article.removeEventListener("mouseenter", sweep);
      });
    }

    if (motif && kind === "waveform") {
      // The signal moves when you move, and rests when you rest.
      tweens.push(
        gsap.fromTo(
          motif.querySelector("[data-wave]"),
          { strokeDashoffset: 0 },
          { strokeDashoffset: -140, ease: "none", scrollTrigger: { trigger: article, start: "top bottom", end: "bottom top", scrub: true } },
        ),
      );
    }

    if (motif && kind === "asterisk") {
      // Turned by the scroll, like a focus ring: a quarter turn per chapter.
      tweens.push(
        gsap.fromTo(
          motif,
          { rotation: -45 },
          { rotation: 45, ease: "none", scrollTrigger: { trigger: article, start: "top bottom", end: "bottom top", scrub: true } },
        ),
      );
    }

    if (motif && kind === "tiles") {
      // The grid develops once, tile by tile in no particular order, then rests.
      const tiles = motif.querySelectorAll("[data-tile]");
      gsap.set(tiles, { opacity: 0 });
      tweens.push(
        gsap.to(tiles, {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          stagger: { each: 0.06, from: "random" },
          scrollTrigger: { trigger: motif, start: "top 80%", once: true },
        }),
      );
    }

    if (motif && kind === "constellation") {
      // Lines draw from star to star, then the stars come on.
      const lines = motif.querySelectorAll("[data-link]");
      const stars = motif.querySelectorAll("[data-star]");
      gsap.set(lines, { strokeDashoffset: 1 });
      gsap.set(stars, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
      tweens.push(
        gsap
          .timeline({ scrollTrigger: { trigger: motif, start: "top 80%", once: true } })
          .to(lines, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.12 })
          .to(stars, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", stagger: 0.08 }, 0.5),
      );
    }

    return () => {
      current.kill();
      tweens.forEach((tween) => {
        (tween as gsap.core.Tween).scrollTrigger?.kill();
        tween.kill();
      });
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <article
      ref={ref}
      id={service.id}
      className="group grid gap-10 border-t border-line py-16 md:grid-cols-[140px_1fr_260px] md:gap-16 md:py-24"
    >
      <div className="md:sticky md:top-32 md:self-start">
        <Reveal>
          <span className="chapter-numeral font-display block text-6xl leading-none font-medium md:text-7xl">
            {service.index}
          </span>
        </Reveal>
      </div>

      <div className="max-w-2xl">
        <Reveal y={10}>
          <p className="text-eyebrow mb-5">{service.kicker}</p>
        </Reveal>
        <TitleReveal as="h3" className="font-display text-[clamp(2.1rem,4.4vw,3.9rem)] leading-[1.05] font-medium text-cream">
          {service.title}
        </TitleReveal>
        <Reveal delay={0.15}>
          <p className="font-display mt-7 text-xl leading-snug text-champagne/90 italic md:text-2xl">
            {service.lede}
          </p>
          <p className="mt-6 text-sm leading-[1.9] font-light text-taupe md:text-base">
            {service.body}
          </p>
          <p className="mt-8 text-[0.65rem] tracking-[0.24em] text-cream/50 uppercase">
            {service.tags.join("  /  ")}
          </p>
          {service.href ? (
            <a
              href={service.href}
              className="link-line mt-8 inline-block text-[0.68rem] tracking-[0.3em] text-champagne uppercase"
            >
              {service.linkLabel ?? readMore} →
            </a>
          ) : null}
        </Reveal>
      </div>

      <div className="hidden items-start justify-center md:flex md:sticky md:top-40 md:self-start">
        <Reveal delay={0.2}>
          <Motif kind={service.motif} />
        </Reveal>
      </div>
    </article>
  );
}

/**
 * Ambient chapter visuals - small, quiet, each one built from
 * strokes and light rather than stock imagery.
 */
function Motif({ kind }: { kind: ServiceMotif }) {
  switch (kind) {
    case "glow":
      return (
        <div data-motif="glow" className="relative flex h-52 w-52 items-center justify-center">
          <FrameMark
            className="animate-breathe w-28 text-champagne"
            strokeWidth={2.5}
          />
          <div
            className="absolute h-40 w-40 rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, rgba(230,213,179,0.16), transparent 70%)" }}
          />
        </div>
      );
    case "sheen":
      return (
        <div data-motif="sheen" className="relative h-52 w-52 overflow-hidden rounded-md border border-line bg-ink-soft">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(150deg, rgba(194,161,101,0.22), transparent 55%)" }}
          />
          <div
            data-sheen
            className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-cream/12 to-transparent"
            style={{ transform: "translateX(-140%) skewX(-18deg)" }}
          />
          <span className="font-display absolute bottom-4 left-4 text-xs tracking-[0.3em] text-champagne/70">
            LUMIÈRE
          </span>
        </div>
      );
    case "waveform":
      return (
        <svg data-motif="waveform" viewBox="0 0 200 200" fill="none" className="h-52 w-52 text-champagne/80" aria-hidden="true">
          <path
            data-wave
            d="M10 100 Q 25 40 40 100 T 70 100 Q 80 140 90 100 T 120 100 Q 135 30 150 100 T 190 100"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="6 8"
          />
          <path
            d="M10 100 H 190"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
      );
    case "tiles":
      return (
        <div data-motif="tiles" className="grid h-52 w-52 grid-cols-4 gap-2" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              data-tile
              className="rounded-[3px]"
              style={{
                background: `linear-gradient(140deg, rgba(230,213,179,${0.06 + (index % 5) * 0.05}), rgba(194,161,101,${0.04 + (index % 3) * 0.06}))`,
              }}
            />
          ))}
        </div>
      );
    case "terminal":
      return (
        <div data-motif="terminal" className="h-52 w-52 rounded-md border border-line bg-ink-deep p-5">
          <div className="mb-6 flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-taupe/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-taupe/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-taupe/20" />
          </div>
          <p className="text-[0.62rem] leading-6 tracking-[0.18em] text-champagne/70 uppercase">
            building
            <br />
            quiet tools
            <span className="animate-caret ml-1 inline-block h-3 w-[5px] translate-y-[2px] bg-champagne/80" />
          </p>
        </div>
      );
    case "constellation":
      return (
        <svg data-motif="constellation" viewBox="0 0 200 200" fill="none" className="h-52 w-52" aria-hidden="true">
          <g stroke="rgba(230,213,179,0.25)" strokeWidth="0.6">
            {[
              [40, 60, 110, 40], [110, 40, 160, 90], [160, 90, 120, 150],
              [120, 150, 55, 130], [55, 130, 40, 60], [110, 40, 120, 150],
            ].map(([x1, y1, x2, y2], index) => (
              <line key={index} data-link x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} strokeDasharray={1} />
            ))}
          </g>
          {[
            [40, 60], [110, 40], [160, 90], [120, 150], [55, 130],
          ].map(([cx, cy], index) => (
            <circle key={index} data-star cx={cx} cy={cy} r="3" fill="#e6d5b3" opacity={0.85} />
          ))}
        </svg>
      );
    case "asterisk":
      return (
        <svg
          data-motif="asterisk"
          viewBox="0 0 200 200"
          fill="none"
          className="h-52 w-52 text-champagne/70"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <line
              key={index}
              x1="100"
              y1="30"
              x2="100"
              y2="70"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              transform={`rotate(${index * 45} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="6" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
  }
}
