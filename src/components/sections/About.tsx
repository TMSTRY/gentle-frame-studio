"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Parallax from "@/components/fx/Parallax";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";

/**
 * The human behind the studio - a story, a place reserved for a
 * portrait, and the brand made physical.
 */
export default function About() {
  const t = siteUi(useLocale()).about;
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // The business card opens like a frame as it scrolls in: it starts as a
  // smaller, rounded window and widens to the full picture.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      card,
      { clipPath: "inset(10% 12% 10% 12% round 22px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 12px)",
        ease: "none",
        scrollTrigger: { trigger: card, start: "top 92%", end: "top 28%", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="studio" className="scroll-mt-24" aria-label={t.ariaLabel}>
      <div className="mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56">
        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          {/* Portrait - two cards held like a hand of playing cards.
              The monogram card sits on top; hovering fans it right
              while the portrait behind it fans left into view. */}
          <div className="mb-8 md:col-span-5 md:mb-0">
            <Reveal>
              <Parallax speed={0.08}>
                <figure
                  className="group relative mx-auto max-w-[420px] cursor-pointer outline-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:data-[open=true]:scale-[0.8]"
                  tabIndex={0}
                  data-cursor="Meet"
                  data-open={open}
                  aria-label={t.portraitLabel}
                  onClick={() => setOpen((value) => !value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpen((value) => !value);
                    }
                  }}
                >
                  <div className="absolute -top-4 -left-4 h-full w-full rounded-xl border border-champagne/25" aria-hidden="true" />

                  {/* Portrait card - behind, fans left on hover */}
                  <div className={`absolute inset-0 origin-bottom overflow-hidden rounded-xl border border-champagne/40 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "" : "animate-peek-back"} group-hover:[animation:none] group-focus-visible:[animation:none] group-hover:-translate-x-[18%] md:group-hover:-translate-x-[30%] lg:group-hover:-translate-x-[34%] xl:group-hover:-translate-x-[44%] group-hover:-rotate-[8deg] group-focus-visible:-translate-x-[18%] md:group-focus-visible:-translate-x-[30%] lg:group-focus-visible:-translate-x-[34%] xl:group-focus-visible:-translate-x-[44%] group-focus-visible:-rotate-[8deg] group-data-[open=true]:-translate-x-[18%] md:group-data-[open=true]:-translate-x-[30%] lg:group-data-[open=true]:-translate-x-[34%] xl:group-data-[open=true]:-translate-x-[44%] group-data-[open=true]:-rotate-[8deg]`}>
                    <Image
                      src="/brand/artistiek.png"
                      alt={t.portraitAlt}
                      fill
                      sizes="(max-width: 768px) 90vw, 420px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" aria-hidden="true" />
                  </div>

                  {/* Monogram card - on top, fans right on hover */}
                  <div className={`relative aspect-[4/5] origin-bottom overflow-hidden rounded-xl border border-champagne/50 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "" : "animate-peek-top"} group-hover:[animation:none] group-focus-visible:[animation:none] group-hover:translate-x-[18%] md:group-hover:translate-x-[30%] lg:group-hover:translate-x-[34%] xl:group-hover:translate-x-[44%] group-hover:rotate-[8deg] group-focus-visible:translate-x-[18%] md:group-focus-visible:translate-x-[30%] lg:group-focus-visible:translate-x-[34%] xl:group-focus-visible:translate-x-[44%] group-focus-visible:rotate-[8deg] group-data-[open=true]:translate-x-[18%] md:group-data-[open=true]:translate-x-[30%] lg:group-data-[open=true]:translate-x-[34%] xl:group-data-[open=true]:translate-x-[44%] group-data-[open=true]:rotate-[8deg]`}>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(110% 90% at 50% 20%, rgba(230,213,179,0.13), transparent 60%), linear-gradient(175deg, #17130e, #0a0908 70%)",
                      }}
                    />
                    <Image
                      src="/brand/monogram.png"
                      alt=""
                      width={300}
                      height={300}
                      className="absolute top-1/2 left-1/2 w-40 -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-80"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-[0.6rem] tracking-[0.28em] text-taupe uppercase">
                      <span>{t.founder}</span>
                      <span>Tim Mostrey</span>
                    </figcaption>
                  </div>

                  {/* The cue: two little cards that fan the same way, and a word */}
                  <p
                    className="pointer-events-none absolute inset-x-0 -bottom-12 flex items-center justify-center gap-3 text-[0.6rem] tracking-[0.28em] text-taupe uppercase transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0 group-data-[open=true]:opacity-0"
                    aria-hidden="true"
                  >
                    <span className="relative block h-5 w-8">
                      <span className="absolute inset-y-0 left-1 w-4 origin-bottom rounded-[3px] border border-champagne/50 bg-ink animate-peek-back" />
                      <span className="absolute inset-y-0 left-2.5 w-4 origin-bottom rounded-[3px] border border-champagne bg-ink-soft animate-peek-top" />
                    </span>
                    <span className="[@media(hover:none)]:hidden">{t.portraitHint}</span>
                    <span className="hidden [@media(hover:none)]:inline">{t.portraitTap}</span>
                  </p>
                </figure>
              </Parallax>
            </Reveal>
          </div>

          {/* The story */}
          <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
            <Reveal y={10}>
              <p className="text-eyebrow mb-6">{t.eyebrow}</p>
            </Reveal>
            <TitleReveal className="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.05] font-medium text-cream">
              {t.title1}
              <br />
              {t.title2}
            </TitleReveal>

            <Reveal delay={0.1}>
              <div className="mt-10 space-y-7 text-[0.95rem] leading-[2] font-light text-cream/70">
                <p>{t.p1}</p>
                <p>{t.p2}</p>
                <p>{t.p3}</p>
              </div>
              <p className="font-display mt-10 text-2xl text-champagne italic">{t.signature}</p>
              <p className="mt-12 border-t border-line pt-8 text-[0.65rem] tracking-[0.26em] text-taupe uppercase">
                {t.roles.join("  ·  ")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* The brand, made physical */}
      <div className="mx-auto max-w-[1680px] px-6 pb-36 md:px-12 md:pb-56">
        <Reveal>
          <div ref={cardRef} className="relative h-[52vh] overflow-hidden rounded-xl border border-line md:h-[74vh]">
            <Parallax speed={-0.12} className="absolute inset-0 scale-[1.18]">
              <Image
                src="/brand/business-card.jpg"
                alt={t.cardAlt}
                fill
                sizes="(max-width: 1680px) 100vw, 1680px"
                className="object-cover"
              />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <p className="font-display absolute bottom-6 left-6 text-xl text-cream/90 italic md:bottom-10 md:left-10 md:text-3xl">
              {t.cardLine}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
