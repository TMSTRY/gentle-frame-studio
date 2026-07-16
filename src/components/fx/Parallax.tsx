"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Relative drift while scrolling through the viewport.
   * Positive values lag behind, negative values run ahead.
   */
  speed?: number;
}

/** Gentle scroll-linked vertical drift for depth between layers. */
export default function Parallax({ children, className, speed = 0.14 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const travel = speed * 320;
    const tween = gsap.fromTo(
      element,
      { y: -travel },
      {
        y: travel,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
