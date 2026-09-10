"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/fx/Reveal";
import { processPhases } from "@/content/process";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * How we work - five frames on a filmstrip. Scroll pulls light
 * through the strip, illuminating each phase in turn.
 */
export default function Process() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    if (prefersReducedMotion()) {
      gsap.set(strip.querySelectorAll("[data-phase]"), { opacity: 1 });
      gsap.set("[data-strip-light]", { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-strip-light]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: strip, start: "top 70%", end: "bottom 40%", scrub: true },
        },
      );

      gsap.fromTo(
        strip.querySelectorAll("[data-phase]"),
        { opacity: 0.22 },
        {
          opacity: 1,
          stagger: 0.18,
          ease: "none",
          scrollTrigger: { trigger: strip, start: "top 70%", end: "bottom 40%", scrub: true },
        },
      );
    }, strip);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="scroll-mt-24 border-t border-line" aria-label="How we work">
      <div className="mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 pb-24">
            <div>
              <p className="text-eyebrow mb-6">How we work, the quiet method</p>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">
                Five frames, one film
              </h2>
            </div>
            <p className="max-w-xs pb-2 text-sm leading-relaxed text-taupe">
              No tickets, no black box. You talk to the person making the work, at every phase.
            </p>
          </div>
        </Reveal>

        <div ref={stripRef} className="relative">
          {/* The strip and its travelling light */}
          <div className="absolute top-9 right-0 left-0 hidden h-px bg-line lg:block" aria-hidden="true">
            <div
              data-strip-light
              className="h-px w-full origin-left bg-gradient-to-r from-champagne/20 via-champagne to-gold"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          {/* Vertical strip on small screens */}
          <div className="absolute top-0 bottom-0 left-9 w-px bg-line lg:hidden" aria-hidden="true" />

          <ol className="grid gap-14 lg:grid-cols-5 lg:gap-8">
            {processPhases.map((phase) => (
              <li key={phase.title} data-phase className="relative flex gap-8 lg:block">
                <div className="font-display flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-champagne/40 bg-ink text-xl text-champagne lg:mb-10">
                  {phase.index}
                </div>
                <div className="pt-2 lg:pt-0">
                  <h3 className="font-display text-2xl font-medium text-cream">{phase.title}</h3>
                  <p className="mt-4 max-w-[240px] text-sm leading-relaxed font-light text-taupe">
                    {phase.line}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
