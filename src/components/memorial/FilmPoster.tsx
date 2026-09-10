"use client";

import Image from "next/image";
import { useState } from "react";
import WorkLightbox from "@/components/sections/WorkLightbox";
import { projects } from "@/content/projects";

interface FilmPosterProps {
  poster: string;
  title: string;
  playLabel: string;
  caption: string;
}

/**
 * A still from the film with a single play control. Opens the same
 * screening room as the work archive, with localized title/caption.
 */
export default function FilmPoster({ poster, title, playLabel, caption }: FilmPosterProps) {
  const [open, setOpen] = useState(false);
  const film = projects.find((project) => project.id === "memorial-films");
  if (!film?.video) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="Play"
        aria-label={`${playLabel} · ${title}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-champagne/25 text-left"
      >
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover saturate-[0.9] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-ink/35 transition-colors duration-700 group-hover:bg-ink/15" />
        <span className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/70 bg-ink/40 backdrop-blur-sm transition-transform duration-700 ease-out group-hover:scale-110 md:h-24 md:w-24">
          <span className="ml-1 text-lg text-champagne">▶</span>
        </span>
        <span className="absolute bottom-5 left-6 text-[0.64rem] tracking-[0.3em] text-cream/80 uppercase md:bottom-6">
          {playLabel}
        </span>
        <span className="absolute right-6 bottom-5 hidden text-[0.64rem] tracking-[0.3em] text-cream/60 uppercase md:bottom-6 md:block">
          {caption}
        </span>
      </button>

      {open ? (
        <WorkLightbox project={{ ...film, title, caption }} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
