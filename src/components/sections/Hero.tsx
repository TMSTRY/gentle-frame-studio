"use client";

import { useEffect, useRef } from "react";
import Timecode from "@/components/fx/Timecode";
import { site } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onIntroDone, prefersReducedMotion } from "@/lib/motion";

const HEADLINE = [
  { words: ["Where", "memories"], italic: false },
  { words: ["meet"], italic: false, tail: { word: "imagination.", italic: true } },
];

/**
 * The opening scene. Two brand frames draw themselves around the
 * headline and drift on separate depth layers under the cursor —
 * two frames reacting to each other, memories meeting
 * imagination. A film HUD (timecode, coordinates) grounds the
 * cinematic framing; scrolling pushes the whole take gently
 * out of frame.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const q = gsap.utils.selector(section);
    const one = (selector: string) => section.querySelector<HTMLElement>(selector);

    if (prefersReducedMotion()) {
      gsap.set(q("[data-hero-back] rect, [data-hero-front] rect, [data-hero-front] line"), {
        strokeDashoffset: 0,
      });
      gsap.set(q(".reveal-word"), { yPercent: 0, y: 0 });
      gsap.set(q("[data-hero-fade]"), { opacity: 1 });
      return;
    }

    // --- Entrance, held until the intro card lifts -----------------
    gsap.set(q("[data-hero-fade]"), { opacity: 0 });
    // Re-express the CSS hide (translateY 115%) in GSAP's own
    // transform space so the reveal tween can drive it.
    gsap.set(q(".reveal-word"), { yPercent: 115, y: 0 });

    let entrance: gsap.core.Timeline | null = null;
    const play = () => {
      entrance = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(q("[data-hero-back] rect"), { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0)
        .to(q("[data-hero-front] rect"), { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.35)
        .to(q("[data-hero-front] line"), { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 1.3)
        .to(q(".reveal-word"), { yPercent: 0, duration: 1.2, stagger: 0.09 }, 0.5)
        .to(q("[data-hero-fade]"), { opacity: 1, duration: 1.4, stagger: 0.12 }, 1.4);
    };
    const cancelIntro = onIntroDone(play);

    // --- Mouse depth: layers react to each other --------------------
    const back = one("[data-hero-back]");
    const front = one("[data-hero-front]");
    const glow = one("[data-hero-glow]");
    const head = one("[data-hero-head]");

    const movers =
      back && front && glow && head
        ? {
            backX: gsap.quickTo(back, "x", { duration: 1.1, ease: "power3.out" }),
            backY: gsap.quickTo(back, "y", { duration: 1.1, ease: "power3.out" }),
            frontX: gsap.quickTo(front, "x", { duration: 0.8, ease: "power3.out" }),
            frontY: gsap.quickTo(front, "y", { duration: 0.8, ease: "power3.out" }),
            glowX: gsap.quickTo(glow, "x", { duration: 1.6, ease: "power3.out" }),
            headX: gsap.quickTo(head, "x", { duration: 1.3, ease: "power3.out" }),
          }
        : null;

    const onMove = (event: MouseEvent) => {
      if (!movers) return;
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      movers.backX(nx * -18);
      movers.backY(ny * -12);
      movers.frontX(nx * 26);
      movers.frontY(ny * 18);
      movers.glowX(nx * 46);
      movers.headX(nx * 8);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // --- Scroll exit: the take drifts out of frame ------------------
    const exit = gsap.to(stage, {
      yPercent: -14,
      scale: 1.07,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      cancelIntro();
      window.removeEventListener("mousemove", onMove);
      entrance?.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] items-center justify-center overflow-hidden"
      aria-label="Gentle Frame Studio — where memories meet imagination"
    >
      <div ref={stageRef} className="relative flex h-full w-full items-center justify-center">
        {/*
          Every mouse-depth layer is split in two: a static outer
          element owns the CSS centering transform, an inner element
          owns the GSAP-driven drift — so they never fight over the
          same transform.
        */}

        {/* Ambient warm light */}
        <div className="absolute top-1/2 left-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2">
          <div data-hero-glow className="h-full w-full">
            <div
              className="animate-breathe h-full w-full rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(230,213,179,0.13), rgba(194,161,101,0.05) 55%, transparent 75%)",
              }}
            />
          </div>
        </div>

        {/* Back frame — memory */}
        <div className="absolute top-1/2 left-1/2 w-[min(74vw,760px)] -translate-x-[62%] -translate-y-[60%]">
          <svg
            data-hero-back
            viewBox="0 0 100 82"
            fill="none"
            aria-hidden="true"
            className="w-full text-champagne/40"
          >
            <rect
              x="4" y="4" width="92" height="74" rx="9"
              stroke="currentColor" strokeWidth="0.5" pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </div>

        {/* Front frame + crossbar — imagination. The bar follows the
            mark's proportions: ~40% down the frame, reaching a quarter
            frame-width past the left edge and 38% into the interior. */}
        <div className="absolute top-1/2 left-1/2 w-[min(74vw,760px)] -translate-x-[38%] -translate-y-[40%]">
          <svg
            data-hero-front
            viewBox="0 0 100 82"
            fill="none"
            aria-hidden="true"
            className="w-full text-champagne/65"
          >
            <rect
              x="4" y="4" width="92" height="74" rx="9"
              stroke="currentColor" strokeWidth="0.5" pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
            <line
              x1="-19.2" y1="33.4" x2="39.3" y2="33.4"
              stroke="currentColor" strokeWidth="0.5" pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </div>

        {/* Atmosphere: strokes sink away behind the headline */}
        <div
          className="absolute top-1/2 left-1/2 h-[64vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
          style={{
            background: "radial-gradient(closest-side, rgba(10,9,8,0.92), rgba(10,9,8,0.55) 55%, transparent 78%)",
          }}
        />

        {/* Headline */}
        <div data-hero-head className="relative z-10 px-6 text-center">
          <p data-hero-fade className="text-eyebrow mb-8">
            A cinematic creative studio — {site.location}, working worldwide
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,8.25rem)] leading-[1.02] font-medium tracking-[-0.01em] text-cream">
            {HEADLINE.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.words.map((word) => (
                  <span key={word} className="reveal-slot mr-[0.28em] last:mr-0">
                    <span className="reveal-word" style={{ transform: "translateY(115%)" }}>
                      {word}
                    </span>
                  </span>
                ))}
                {line.tail ? (
                  <span className="reveal-slot">
                    <span
                      className="reveal-word text-gold italic"
                      style={{ transform: "translateY(115%)" }}
                    >
                      {line.tail.word}
                    </span>
                  </span>
                ) : null}
              </span>
            ))}
          </h1>
          <p data-hero-fade className="mx-auto mt-10 max-w-md text-sm leading-relaxed font-light text-taupe md:text-base">
            We craft memorial films, luxury visuals and quiet software —
            with new tools and an old-fashioned heart.
          </p>
        </div>
      </div>

      {/* Film HUD */}
      <div
        data-hero-fade
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-8 text-[0.62rem] tracking-[0.26em] text-taupe uppercase md:px-12"
      >
        <div className="flex items-center gap-3">
          <span className="animate-rec h-1.5 w-1.5 rounded-full bg-gold" />
          <Timecode />
        </div>
        <div className="flex flex-col items-center gap-3" aria-hidden="true">
          <span className="block h-12 w-px overflow-hidden bg-line">
            <span className="block h-full w-full origin-top animate-pulse bg-champagne/70" />
          </span>
          <span>Scroll</span>
        </div>
        <div className="hidden md:block">{site.coordinates} — {site.location}</div>
      </div>
    </section>
  );
}
