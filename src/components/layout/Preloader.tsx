"use client";

import { useEffect, useRef, useState } from "react";
import FrameMark from "@/components/brand/FrameMark";
import { gsap } from "@/lib/gsap";
import { dispatchIntroDone, INTRO_SEEN_KEY, prefersReducedMotion } from "@/lib/motion";

/**
 * Opening title card: the mark draws itself stroke by stroke,
 * the name settles in, then the curtain lifts. Plays once per
 * session and is skipped entirely under reduced motion.
 */
export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
    if (seen || prefersReducedMotion()) {
      setFinished(true);
      dispatchIntroDone();
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          sessionStorage.setItem(INTRO_SEEN_KEY, "true");
          dispatchIntroDone();
          setFinished(true);
        },
      });

      tl.to(".gf-back", { strokeDashoffset: 0, duration: 0.9 }, 0.2)
        .to(".gf-front", { strokeDashoffset: 0, duration: 0.9 }, 0.55)
        .to(".gf-bar", { strokeDashoffset: 0, duration: 0.5 }, 1.1)
        .fromTo(
          "[data-intro-name]",
          { opacity: 0, letterSpacing: "0.55em" },
          { opacity: 1, letterSpacing: "0.22em", duration: 1.1, ease: "power3.out" },
          0.9,
        )
        .fromTo(
          "[data-intro-tag]",
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          1.5,
        )
        .to(
          "[data-intro-panel]",
          { yPercent: -6, opacity: 0, duration: 0.6, ease: "power2.in" },
          2.5,
        )
        .to(
          overlay,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" },
          2.7,
        );
    }, overlay);

    return () => ctx.revert();
  }, []);

  if (finished) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink-deep"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div data-intro-panel className="flex flex-col items-center">
        <FrameMark drawable className="w-24 text-champagne md:w-28" strokeWidth={3} />
        <p
          data-intro-name
          className="font-display mt-10 text-xl font-medium tracking-[0.22em] text-cream opacity-0 md:text-2xl"
        >
          GENTLE FRAMES
        </p>
        <p data-intro-tag className="text-eyebrow mt-4 opacity-0">
          Memories. Reimagined. Forever.
        </p>
      </div>
    </div>
  );
}
