"use client";

import { useEffect, useRef } from "react";
import Timecode from "@/components/fx/Timecode";
import { site } from "@/content/site";
import { useLocale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";
import { gsap } from "@/lib/gsap";
import { onIntroDone, prefersReducedMotion } from "@/lib/motion";

/**
 * The opening scene, in three beats.
 *
 * 1. Arrival. Two brand frames draw themselves around the headline and
 *    drift on separate depth layers under the cursor: memory and
 *    imagination, reacting to each other.
 * 2. Scroll, while the scene holds still. The supporting copy dims away
 *    and the two frames glide into one, the headline's promise acted
 *    out. At the moment they coincide the frame takes the light.
 * 3. Release. As the scene scrolls on, the camera pushes through the
 *    single frame and the headline lifts back into its masks.
 *
 * Layering rule: an element with a Tailwind translate never gets a GSAP
 * transform (GSAP would freeze the percentage centering into pixels).
 * Every animated layer is its own wrapper: centering (CSS) > converge
 * (scroll) > drift (cursor) > draw (stroke).
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = siteUi(locale).hero;
  const HEADLINE = t.headline.map((line) => ({ words: [...line.words], tail: "tail" in line ? { word: line.tail as string } : undefined }));

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const q = gsap.utils.selector(section);
    const one = (selector: string) => section.querySelector<HTMLElement>(selector);

    if (prefersReducedMotion()) {
      gsap.set(q("[data-hero-back] rect, [data-hero-front] rect"), { strokeDashoffset: 0 });
      gsap.set(q(".reveal-word"), { yPercent: 0, y: 0 });
      gsap.set(q("[data-hero-fade]"), { opacity: 1 });
      return;
    }

    // --- Beat 1: entrance, held until the intro card lifts ------------
    gsap.set(q("[data-hero-fade]"), { opacity: 0 });
    gsap.set(q("[data-hero-bar]"), { scaleX: 0, transformOrigin: "left center" });
    // Re-express the CSS hide (translateY 115%) in GSAP's own
    // transform space so the reveal tween can drive it.
    gsap.set(q(".reveal-word"), { yPercent: 115, y: 0 });

    let entrance: gsap.core.Timeline | null = null;
    const play = () => {
      entrance = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(q("[data-hero-back] rect"), { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0)
        .to(q("[data-hero-front] rect"), { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.35)
        .to(q("[data-hero-bar]"), { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 1.3)
        .to(q(".reveal-word"), { yPercent: 0, duration: 1.2, stagger: 0.09 }, 0.5)
        .to(q("[data-hero-fade]"), { opacity: 1, duration: 1.4, stagger: 0.12 }, 1.4);
    };
    const cancelIntro = onIntroDone(play);

    // --- Cursor depth: layers react to each other ----------------------
    // Its reach fades out as the frames converge, so at the moment they
    // coincide they truly are one frame, whatever the cursor does.
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

    let nx = 0;
    let ny = 0;
    let reach = 1;
    const drift = () => {
      if (!movers) return;
      movers.backX(nx * -18 * reach);
      movers.backY(ny * -12 * reach);
      movers.frontX(nx * 26 * reach);
      movers.frontY(ny * 18 * reach);
      movers.glowX(nx * 46 * (0.4 + 0.6 * reach));
      movers.headX(nx * 8 * reach);
    };
    const onMove = (event: MouseEvent) => {
      nx = (event.clientX / window.innerWidth) * 2 - 1;
      ny = (event.clientY / window.innerHeight) * 2 - 1;
      drift();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // --- Beat 2: the frames come together (the scene is held by CSS sticky)
    // Offsets mirror the centering classes: back sits at -72% / -65%,
    // front at -28% / -35%; one frame means both at -50% / -50%.
    //
    // The single frame centres on the headline and, where the headline is
    // taller than the frame (a phone, where it breaks into four lines),
    // grows until the text sits inside with room to breathe. A frame edge
    // must never run through a line of text: it would read as a strike.
    const h1 = section.querySelector("h1");
    const fit = () => {
      if (!h1) return { scale: 1, dy: 0 };
      const text = h1.getBoundingClientRect();
      const scene = stage.getBoundingClientRect();
      const width = Math.min(window.innerWidth * 0.74, 760);
      const frameW = width * 0.92; // the rect spans 92 of the 100 viewBox units
      const frameH = width * 0.74; // and 74 of the 82
      const room = Math.max(26, text.height * 0.14);
      const needed = (text.height + room * 2) / frameH;
      const widest = (window.innerWidth - 28) / frameW;
      return {
        scale: Math.min(Math.max(1, needed), Math.max(1, widest)),
        dy: text.top + text.height / 2 - (scene.top + scene.height / 2),
      };
    };
    let fitted = fit();

    const converge = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          fitted = fit();
        },
        onUpdate: (self) => {
          reach = 1 - self.progress;
          drift();
        },
      },
    });
    converge
      .to(q("[data-hero-hud]"), { autoAlpha: 0, y: 14, duration: 0.16 }, 0)
      .to(q("[data-hero-out-top]"), { autoAlpha: 0, y: -16, duration: 0.3 }, 0.03)
      .to(q("[data-hero-out-lede]"), { autoAlpha: 0, y: 16, duration: 0.3 }, 0.05)
      .to(q("[data-hero-out-bar]"), { scaleX: 0, autoAlpha: 0, duration: 0.34, ease: "power2.in" }, 0.05)
      .to(
        q("[data-hero-converge-back]"),
        { xPercent: 22, yPercent: 15, y: () => fitted.dy, scale: () => fitted.scale, duration: 0.8, ease: "power2.inOut" },
        0.1,
      )
      .to(
        q("[data-hero-converge-front]"),
        { xPercent: -22, yPercent: -15, y: () => fitted.dy, scale: () => fitted.scale, duration: 0.8, ease: "power2.inOut" },
        0.1,
      )
      // The lock: the back frame dissolves into the front one, which takes the light.
      .to(q("[data-hero-back]"), { opacity: 0, duration: 0.1 }, 0.84)
      .to(q("[data-hero-lock-stroke]"), { opacity: 1, duration: 0.12 }, 0.82)
      .to(q("[data-hero-lock-light]"), { opacity: 1, duration: 0.16 }, 0.8);

    // --- Beat 3: release, the camera pushes through the frame ---------
    const release = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    release
      // Hold the scene back a little as it scrolls off: a slower exit reads as depth.
      .to(stage, { y: () => window.innerHeight * 0.3, duration: 1 }, 0)
      .to(q("[data-hero-frames]"), { scale: 1.32, duration: 1, ease: "power1.in" }, 0)
      .to(q("[data-hero-frames]"), { autoAlpha: 0, duration: 0.4 }, 0.15)
      .to(q("[data-hero-lift]"), { yPercent: -120, duration: 0.45, stagger: 0.04, ease: "power2.in" }, 0.06);

    return () => {
      cancelIntro();
      window.removeEventListener("mousemove", onMove);
      entrance?.kill();
      converge.scrollTrigger?.kill();
      converge.kill();
      release.scrollTrigger?.kill();
      release.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[160svh] md:h-[172svh] motion-reduce:h-[100svh]"
      aria-label={t.ariaLabel}
    >
      {/* The scene holds still while the frames converge, then scrolls on. */}
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div ref={stageRef} className="relative flex h-full w-full items-center justify-center">
          <div data-hero-frames className="absolute inset-0">
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

            {/* The light that comes up when the two frames become one */}
            <div
              data-hero-lock-light
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-[62vmin] w-[84vmin] -translate-x-1/2 -translate-y-1/2 opacity-0"
              style={{ background: "radial-gradient(closest-side, rgba(230,213,179,0.11), transparent 72%)" }}
            />

            {/* Back frame - memory. The spread between the frames follows
                the mark: the back frame's right edge cuts through the
                middle of the front frame, its bottom edge through the
                front frame's lower third. */}
            <div className="absolute top-1/2 left-1/2 w-[min(74vw,760px)] -translate-x-[72%] -translate-y-[65%]">
              <div data-hero-converge-back>
                <svg
                  data-hero-back
                  viewBox="0 0 100 82"
                  fill="none"
                  aria-hidden="true"
                  className="w-full text-champagne/40"
                >
                  <rect
                    x="4" y="4" width="92" height="74" rx="9"
                    stroke="currentColor" strokeWidth="0.7" pathLength={1}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                </svg>
              </div>
            </div>

            {/* Front frame - imagination */}
            <div className="absolute top-1/2 left-1/2 w-[min(74vw,760px)] -translate-x-[28%] -translate-y-[35%]">
              <div data-hero-converge-front>
                <svg
                  data-hero-front
                  viewBox="0 0 100 82"
                  fill="none"
                  aria-hidden="true"
                  className="w-full text-champagne/65"
                >
                  <rect
                    x="4" y="4" width="92" height="74" rx="9"
                    stroke="currentColor" strokeWidth="0.7" pathLength={1}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                  {/* Same frame, brighter: it only shows once the two frames coincide */}
                  <rect
                    data-hero-lock-stroke
                    x="4" y="4" width="92" height="74" rx="9"
                    stroke="#f2ead9" strokeOpacity="0.85" strokeWidth="0.7" pathLength={1}
                    opacity={0}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                </svg>
              </div>
            </div>

            {/* Atmosphere: strokes sink away behind the headline */}
            <div
              className="absolute top-1/2 left-1/2 h-[64vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
              style={{
                background: "radial-gradient(closest-side, rgba(10,9,8,0.92), rgba(10,9,8,0.55) 55%, transparent 78%)",
              }}
            />
          </div>

          {/* Headline */}
          <div data-hero-head className="relative z-10 px-6 text-center">
            <div data-hero-out-top>
              <p data-hero-fade className="text-eyebrow relative mb-8">
                {/* Soft scrim so frame strokes melt away behind the text */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-16 -inset-y-8 -z-10"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(10,9,8,0.9), rgba(10,9,8,0.5) 55%, transparent 78%)",
                  }}
                />
                {t.eyebrow(site.location)}
              </p>
            </div>
            <h1 className="font-display text-[clamp(3rem,9vw,8.25rem)] leading-[1.02] font-medium tracking-[-0.01em] text-cream">
              {HEADLINE.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.words.map((word) => (
                    <span key={word} className="reveal-slot mr-[0.28em] last:mr-0">
                      <span data-hero-lift className="inline-block">
                        <span className="reveal-word" style={{ transform: "translateY(115%)" }}>
                          {word}
                        </span>
                      </span>
                    </span>
                  ))}
                  {line.tail ? (
                    <span className="reveal-slot">
                      <span data-hero-lift className="inline-block">
                        <span
                          className="reveal-word text-gold italic"
                          style={{ transform: "translateY(115%)" }}
                        >
                          {line.tail.word}
                        </span>
                      </span>
                    </span>
                  ) : null}
                </span>
              ))}
            </h1>
            {/* The mark's crossbar. Vertically it tracks the headline so
                it can never land behind the text; horizontally it derives
                from the frames' own width so it starts inside the back
                frame and reaches 38% into the front one, like the logo.
                When the frames become one it has nothing left to join,
                and folds into the centre. */}
            <div data-hero-out-bar aria-hidden="true" className="relative mt-3 h-[3px] md:mt-4 md:h-1">
              <span
                data-hero-bar
                className="absolute inset-y-0 bg-champagne/65"
                style={{
                  left: "calc(50% - 0.61 * min(74vw, 760px))",
                  width: "calc(0.72 * min(74vw, 760px))",
                }}
              />
            </div>
            <div data-hero-out-lede>
              <p data-hero-fade className="relative mx-auto mt-12 max-w-md text-sm leading-relaxed font-light text-taupe md:text-base">
                {/* Soft scrim so frame strokes melt away behind the text */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-20 -inset-y-10 -z-10"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(10,9,8,0.92), rgba(10,9,8,0.55) 55%, transparent 78%)",
                  }}
                />
                {t.lede1}
                <br />
                {t.lede2}
              </p>
            </div>
          </div>
        </div>

        {/* Film HUD */}
        <div data-hero-fade className="absolute inset-x-0 bottom-0 z-10">
          <div
            data-hero-hud
            className="grid grid-cols-[1fr_auto_1fr] items-end px-6 pb-8 text-[0.62rem] tracking-[0.26em] text-taupe uppercase md:px-12"
          >
            <div className="flex items-center gap-3">
              <span className="animate-rec h-1.5 w-1.5 rounded-full bg-gold" />
              <Timecode />
            </div>
            <div className="flex flex-col items-center gap-3" aria-hidden="true">
              <span className="relative block h-12 w-px overflow-hidden bg-line">
                <span className="animate-scroll-drop absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent via-champagne to-transparent" />
              </span>
              <span>{t.scroll}</span>
            </div>
            <div className="hidden text-right md:block">{site.coordinates} · {t.place}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
