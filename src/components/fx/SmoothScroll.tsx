"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Mounts Lenis smooth scrolling and keeps GSAP's ScrollTrigger
 * in sync with it. Renders nothing; disabled for users who
 * prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
    });
    setLenis(lenis);

    // Honor hash deep-links. Anchoring must happen after the section
    // effects in this same commit have registered their pinned
    // ScrollTriggers (their spacers stretch the document), and again
    // after the load-time ScrollTrigger refresh — unless the visitor
    // has started scrolling themselves by then.
    let interacted = false;
    const markInteracted = () => {
      interacted = true;
    };
    const anchorToHash = () => {
      if (interacted || !window.location.hash) return;
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(window.location.hash);
      } catch {
        return; // malformed external hash — nothing to anchor to
      }
      if (target) lenis.scrollTo(target, { immediate: true });
    };
    const onLoad = () => setTimeout(anchorToHash, 0);
    if (window.location.hash) {
      window.addEventListener("wheel", markInteracted, { once: true, passive: true });
      window.addEventListener("touchstart", markInteracted, { once: true, passive: true });
      setTimeout(anchorToHash, 0);
      window.addEventListener("load", onLoad, { once: true });
    }

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("wheel", markInteracted);
      window.removeEventListener("touchstart", markInteracted);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
