"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/content/projects";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";

interface WorkLightboxProps {
  project: Project;
  onClose: () => void;
}

/**
 * A quiet screening room: dimmed page, one frame of light. Plays
 * either a self-hosted film or a chrome-less YouTube embed.
 * Closes on Escape, backdrop click or the close control.
 */
export default function WorkLightbox({ project, onClose }: WorkLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.96, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.05 },
      );
    });

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [onClose]);

  const youtubeSrc = project.youtube
    ? `https://www.youtube-nocookie.com/embed/${project.youtube}?autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`
    : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-deep/90 p-4 backdrop-blur-sm md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}, film`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className="w-full max-w-5xl">
        <div className="overflow-hidden rounded-lg border border-champagne/25 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
          <div className="aspect-video w-full">
            {project.video ? (
              <video
                src={project.video}
                controls
                autoPlay
                playsInline
                className="h-full w-full bg-black object-contain"
              />
            ) : youtubeSrc ? (
              <iframe
                src={youtubeSrc}
                title={project.title}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-6 px-1">
          <p className="font-display text-xl text-cream italic md:text-2xl">{project.title}</p>
          <div className="flex items-baseline gap-8">
            {project.caption ? (
              <p className="hidden text-[0.62rem] tracking-[0.24em] text-taupe uppercase sm:block">
                {project.caption}
              </p>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="link-line text-[0.68rem] tracking-[0.3em] text-champagne uppercase"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
