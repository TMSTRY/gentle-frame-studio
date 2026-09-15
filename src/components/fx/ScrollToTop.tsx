"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/scroll";

/**
 * Mounted by pages that must open at the top. Smooth scrolling lives
 * in the root layout and survives client-side navigation, so the
 * archive's scroll position would otherwise carry into a case.
 */
export default function ScrollToTop() {
  useEffect(() => {
    if (window.location.hash) return;
    window.history.scrollRestoration = "manual";
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, []);
  return null;
}
