"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FrameMark from "@/components/brand/FrameMark";
import Wordmark from "@/components/brand/Wordmark";
import { navLinks, site } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { onIntroDone, prefersReducedMotion } from "@/lib/motion";

/**
 * Fixed header that retreats while scrolling down and returns on
 * the way up. On small screens it opens a full-screen chapter
 * menu with staggered display links.
 */
export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Entrance after the intro card lifts.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (prefersReducedMotion()) {
      gsap.set(header, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(header, { opacity: 0, y: -16 });
    return onIntroDone(() => {
      gsap.to(header, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });
    });
  }, []);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const header = headerRef.current;
      if (header && !menuOpen) {
        const goingDown = y > lastY && y > 160;
        header.style.transform = goingDown ? "translateY(-100%)" : "translateY(0)";
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Animate the overlay menu links in when it opens.
  useEffect(() => {
    if (!menuOpen || !overlayRef.current) return;
    const links = overlayRef.current.querySelectorAll("[data-menu-link]");
    gsap.fromTo(
      links,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", delay: 0.15 },
    );
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goTo = useCallback((href: string) => {
    setMenuOpen(false);
    // Section anchors live on the home page; from any other route,
    // hand over to a full navigation and let SmoothScroll anchor.
    if (window.location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    // Wait a beat so the overlay releases the scroll lock first.
    requestAnimationFrame(() => scrollToTarget(href));
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled && !menuOpen
            ? "border-b border-line bg-ink/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
        style={{ transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), background-color 0.5s, border-color 0.5s" }}
      >
        <div className="mx-auto flex h-20 max-w-[1680px] items-center justify-between px-6 md:px-12">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              goTo("#top");
            }}
            className="flex items-center gap-4"
            aria-label="Gentle Frame Studio — back to top"
          >
            <FrameMark className="w-9 text-champagne" strokeWidth={5} />
            <Wordmark className="hidden sm:flex" />
          </a>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(link.href);
                }}
                className="link-line text-[0.7rem] font-normal tracking-[0.28em] text-cream/80 uppercase transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className={`block h-px w-7 bg-cream transition-transform duration-500 ${
                menuOpen ? "translate-y-1 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-7 bg-cream transition-transform duration-500 ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[65] flex flex-col justify-between bg-ink-deep px-6 pt-32 pb-10"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <nav className="flex flex-col gap-2" aria-label="Menu">
            {navLinks.map((link, index) => (
              <span key={link.href} className="overflow-hidden">
                <a
                  data-menu-link
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(link.href);
                  }}
                  className="font-display block text-5xl font-medium text-cream"
                >
                  <span className="mr-4 align-super text-xs tracking-[0.3em] text-taupe">
                    0{index + 1}
                  </span>
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
          <div className="flex items-end justify-between">
            <a href={`mailto:${site.email}`} className="text-sm tracking-wide text-taupe">
              {site.email}
            </a>
            <FrameMark className="w-10 text-champagne/60" strokeWidth={5} />
          </div>
        </div>
      ) : null}
    </>
  );
}
