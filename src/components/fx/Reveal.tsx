"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to hold back after the trigger fires. */
  delay?: number;
  /** Vertical travel in pixels. */
  y?: number;
}

/**
 * Fades and lifts its children into view the first time they
 * enter the viewport. Content stays visible without JavaScript
 * (see the `noscript` override in the root layout).
 */
export default function Reveal({ children, className, delay = 0, y = 32 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      element,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);

  return (
    <div ref={ref} data-reveal className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

/** Refresh ScrollTrigger measurements after images/fonts settle. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
