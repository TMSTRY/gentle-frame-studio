import type Lenis from "lenis";

/**
 * Shared handle to the Lenis instance so navigation components
 * can trigger smooth anchor scrolling from anywhere.
 */
let lenisInstance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function scrollToTarget(target: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.6 });
    return;
  }
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}
