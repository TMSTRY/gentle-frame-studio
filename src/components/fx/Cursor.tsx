"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Custom cursor: a champagne dot with a trailing ring. Elements
 * annotated with `data-cursor="View"` expand the ring into a
 * labelled lens; links and buttons enlarge it slightly.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hoveringLink, setHoveringLink] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    setEnabled(true);
    document.documentElement.dataset.cursor = "on";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      setAwake(true);
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) {
        setLabel(labelled.dataset.cursor);
        setHoveringLink(false);
        return;
      }
      setLabel(null);
      setHoveringLink(Boolean(target.closest("a, button")));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!enabled) {
    return (
      <div aria-hidden="true" className="hidden">
        <div ref={dotRef} />
        <div ref={ringRef} />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[95] transition-opacity duration-300 ${
        awake ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Outer elements carry the GSAP position; inner ones center themselves. */}
      <div ref={ringRef} className="absolute top-0 left-0">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-500 ease-out ${
            label
              ? "h-20 w-20 border border-champagne/0 bg-champagne text-ink"
              : hoveringLink
                ? "h-12 w-12 border border-champagne/60 bg-transparent"
                : "h-8 w-8 border border-champagne/35 bg-transparent"
          }`}
        >
          {label ? (
            <span className="text-[0.55rem] font-normal tracking-[0.3em] uppercase">{label}</span>
          ) : null}
        </div>
      </div>
      <div ref={dotRef} className="absolute top-0 left-0">
        <div
          className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne transition-opacity duration-300 ${
            label ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}
