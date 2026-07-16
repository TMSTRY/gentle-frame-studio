/**
 * Small shared helpers for the motion system.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Event fired once the intro (preloader) has finished. */
export const INTRO_DONE_EVENT = "gf:intro-done";

/** Session key so the intro only plays on first arrival. */
export const INTRO_SEEN_KEY = "gf-intro-seen";

export function dispatchIntroDone() {
  document.documentElement.dataset.introDone = "true";
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function onIntroDone(callback: () => void): () => void {
  if (document.documentElement.dataset.introDone === "true") {
    callback();
    return () => undefined;
  }
  window.addEventListener(INTRO_DONE_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, callback);
}
