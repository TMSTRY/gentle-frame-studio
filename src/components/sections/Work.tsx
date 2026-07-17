"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FrameMark from "@/components/brand/FrameMark";
import Reveal from "@/components/fx/Reveal";
import WorkLightbox from "@/components/sections/WorkLightbox";
import { projects, type Project } from "@/content/projects";
import { gsap } from "@/lib/gsap";

/**
 * Selected work as a horizontal archive. On large screens the
 * section pins and scroll drives a sideways tracking shot along
 * the covers; on small screens it falls back to a native
 * snap-scroll carousel.
 */
export default function Work() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [screening, setScreening] = useState<Project | null>(null);

  useEffect(() => {
    const pinArea = pinRef.current;
    const track = trackRef.current;
    if (!pinArea || !track) return;

    const mm = gsap.matchMedia();

    // The carousel is natively scrollable by default; only when
    // pinning takes over does scroll drive the tracking shot.
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      track.style.overflowX = "visible";
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinArea,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        track.style.overflowX = "";
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" className="scroll-mt-24" aria-label="Selected work">
      <div className="mx-auto max-w-[1680px] px-6 pt-36 pb-16 md:px-12 md:pt-56">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow mb-6">Selected work — the archive</p>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">
                Frames we&rsquo;ve kept
                <span className="text-taupe align-super text-[0.3em] tracking-[0.2em]">
                  {"  "}( {String(projects.length).padStart(2, "0")} )
                </span>
              </h2>
            </div>
            <p className="max-w-xs pb-2 text-sm leading-relaxed text-taupe">
              Films, platforms and experiments. The archive grows slowly — on purpose.
            </p>
          </div>
        </Reveal>
      </div>

      <div ref={pinRef} className="flex min-h-[100svh] flex-col justify-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max max-w-[100vw] snap-x snap-mandatory items-stretch gap-[4vw] overflow-x-auto px-6 py-10 [-ms-overflow-style:none] [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <CoverCard
              key={project.id}
              project={project}
              index={index}
              onPlay={() => setScreening(project)}
            />
          ))}

          {/* Closing slate */}
          <div className="flex w-[70vw] max-w-[420px] snap-center flex-col items-center justify-center gap-8 text-center md:w-[420px]">
            <FrameMark className="w-14 text-champagne/50" strokeWidth={3.5} />
            <p className="font-display max-w-[240px] text-2xl leading-snug text-cream/80 italic">
              Yours could be the next frame.
            </p>
            <a
              href="#contact"
              className="link-line text-[0.68rem] tracking-[0.3em] text-champagne uppercase"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>

      {/* Fixed overlay lives outside the pinned, transformed track —
          a transform would otherwise become its containing block. */}
      {screening ? <WorkLightbox project={screening} onClose={() => setScreening(null)} /> : null}
    </section>
  );
}

function CoverCard({
  project,
  index,
  onPlay,
}: {
  project: Project;
  index: number;
  onPlay: () => void;
}) {
  const number = String(index + 1).padStart(2, "0");
  const playable = Boolean(project.video || project.youtube);
  const cardClass =
    "group relative block aspect-[3/4] w-[78vw] max-w-[460px] shrink-0 snap-center overflow-hidden rounded-md border border-line text-left transition-transform duration-700 ease-out hover:-translate-y-2 md:w-[440px]";

  const cover = project.image ? (
    <>
      {project.imageB ? (
        <>
          {/* Diagonal split: two views of one world, hinged on a
              champagne seam that drifts up as you hover */}
          <Image
            src={project.image}
            alt={`${project.title} — screenshot`}
            fill
            sizes="(max-width: 900px) 78vw, 440px"
            className="object-cover object-top saturate-[0.88] transition-[transform,clip-path] duration-700 ease-out group-hover:scale-[1.03] [clip-path:polygon(0_0,100%_0,100%_38%,0_62%)] group-hover:[clip-path:polygon(0_0,100%_0,100%_34%,0_58%)]"
          />
          <Image
            src={project.imageB}
            alt=""
            fill
            sizes="(max-width: 900px) 78vw, 440px"
            className="object-cover object-center saturate-[0.88] transition-[transform,clip-path] duration-700 ease-out group-hover:scale-[1.03] [clip-path:polygon(0_62%,100%_38%,100%_100%,0_100%)] group-hover:[clip-path:polygon(0_58%,100%_34%,100%_100%,0_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute top-[50%] -left-[10%] h-[2px] w-[120%] -rotate-[17.7deg] bg-champagne/60 shadow-[0_0_18px_rgba(230,213,179,0.35)] transition-[top] duration-700 ease-out group-hover:top-[46%]"
          />
        </>
      ) : (
        <Image
          src={project.image}
          alt={`${project.title} — screenshot`}
          fill
          sizes="(max-width: 900px) 78vw, 440px"
          className="object-cover object-top saturate-[0.88] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      {/* Readability veil: always present at the edges, deepens on
          hover so the text overlay never fights the screenshot */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,9,8,0.62), transparent 26%), linear-gradient(to top, rgba(10,9,8,0.88) 8%, rgba(10,9,8,0.35) 38%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-ink/45 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
    </>
  ) : (
    <>
      {/* Generative cover light */}
      <div
        className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
        style={{
          opacity: 0.65,
          background: `radial-gradient(120% 90% at ${project.tone.light}, ${project.tone.glow}33, transparent 62%), linear-gradient(160deg, ${project.tone.glow}14, transparent 45%)`,
        }}
      />
      {/* Frame watermark */}
      <FrameMark
        className="absolute -right-10 -bottom-10 w-56 text-cream opacity-[0.05] transition-transform duration-700 group-hover:scale-105"
        strokeWidth={2}
      />
    </>
  );

  const content = (
    <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
      <div className="flex items-start justify-between text-[0.6rem] tracking-[0.28em] text-cream/60 uppercase">
        <span>Gentle Frames — Case</span>
        <span className="tabular">N°{number}</span>
      </div>

      <div>
        <p className="text-eyebrow mb-4" style={{ color: project.tone.glow }}>
          {project.category} — {project.year}
        </p>
        <h3 className="font-display text-[clamp(2rem,3.2vw,2.9rem)] leading-[1.05] font-medium text-cream">
          {project.title}
        </h3>
        <p
          className={`mt-5 max-w-[300px] text-[0.82rem] leading-relaxed font-light text-cream/60 ${
            project.image
              ? "translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              : ""
          }`}
        >
          {project.blurb}
        </p>
        {project.url ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-champagne uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            Open project ↗
          </p>
        ) : playable ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-champagne uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            Play the film ▶
          </p>
        ) : project.note ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-taupe uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {project.note}
          </p>
        ) : null}
      </div>
    </div>
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Visit"
        aria-label={`${project.title} — opens in a new tab`}
        className={cardClass}
        style={{ backgroundColor: project.tone.base }}
      >
        {cover}
        {content}
      </a>
    );
  }

  if (playable) {
    return (
      <button
        type="button"
        onClick={onPlay}
        data-cursor="Play"
        aria-label={`${project.title} — play the film`}
        className={cardClass}
        style={{ backgroundColor: project.tone.base }}
      >
        {cover}
        {content}
      </button>
    );
  }

  return (
    <article data-cursor="View" className={cardClass} style={{ backgroundColor: project.tone.base }}>
      {cover}
      {content}
    </article>
  );
}
