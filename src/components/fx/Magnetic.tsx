"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element leans toward the cursor (0–1). */
  strength?: number;
}

/**
 * Makes its child lean gently toward the cursor while hovered,
 * settling back with an elastic ease on leave.
 */
export default function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });

    const onMove = (event: MouseEvent) => {
      const bounds = element.getBoundingClientRect();
      const relX = event.clientX - (bounds.left + bounds.width / 2);
      const relY = event.clientY - (bounds.top + bounds.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", onMove);
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
