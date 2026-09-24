"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FrameMark from "@/components/brand/FrameMark";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";
import WorkLightbox from "@/components/sections/WorkLightbox";
import Link from "next/link";
import { caseIndex } from "@/content/cases";
import { projects, type Project } from "@/content/projects";
import { localePath, useLocale, type Locale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";
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
  const timelineRef = useRef<HTMLDivElement>(null);
  const [screening, setScreening] = useState<Project | null>(null);
  const locale = useLocale();
  const t = siteUi(locale).work;

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

      // The edit timeline under the reel: a playhead and the frame number
      // it is on, written straight to the DOM from the tween's own progress
      // (so it follows the smoothed picture, not the raw scroll).
      const timeline = timelineRef.current;
      const playhead = timeline?.querySelector<HTMLElement>("[data-playhead]");
      const counter = timeline?.querySelector<HTMLElement>("[data-frame-now]");
      const total = projects.length;
      let shown = -1;
      if (timeline) timeline.hidden = false;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        onUpdate() {
          const progress = this.progress();
          if (playhead) playhead.style.transform = `scaleX(${progress})`;
          const frame = Math.min(total, Math.floor(progress * total) + 1);
          if (counter && frame !== shown) {
            shown = frame;
            counter.textContent = String(frame).padStart(2, "0");
          }
        },
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

      // Depth inside each cover: the picture drifts a little slower than
      // its card, like looking through a window as the camera tracks.
      const drifts = Array.from(track.querySelectorAll<HTMLElement>("[data-cover-media]")).map((media) =>
        gsap.fromTo(
          media,
          { xPercent: -3.5, scale: 1.08 },
          {
            xPercent: 3.5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: media.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        ),
      );

      return () => {
        track.style.overflowX = "";
        if (timeline) timeline.hidden = true;
        drifts.forEach((drift) => {
          drift.scrollTrigger?.kill();
          drift.kill();
        });
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" className="scroll-mt-24" aria-label={t.ariaLabel}>
      <div className="mx-auto max-w-[1680px] px-6 pt-36 pb-16 md:px-12 md:pt-56">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal y={10}>
              <p className="text-eyebrow mb-6">{t.eyebrow}</p>
            </Reveal>
            <TitleReveal className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">
              {t.title}
              <span className="text-taupe align-super text-[0.3em] tracking-[0.2em]">
                {"  "}( {String(projects.length).padStart(2, "0")} )
              </span>
            </TitleReveal>
          </div>
          <Reveal delay={0.25}>
            <p className="max-w-xs pb-2 text-sm leading-relaxed text-taupe">
              {t.lede}
            </p>
          </Reveal>
        </div>
      </div>

      <div ref={pinRef} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max max-w-[100vw] snap-x snap-mandatory items-stretch gap-[4vw] overflow-x-auto px-6 py-10 [-ms-overflow-style:none] [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <CoverCard
              key={project.id}
              project={project}
              index={index}
              locale={locale}
              onPlay={() => setScreening(project)}
            />
          ))}

          {/* Closing slate */}
          <div className="flex w-[70vw] max-w-[420px] snap-center flex-col items-center justify-center gap-8 text-center md:w-[420px]">
            <FrameMark className="w-14 text-champagne/50" strokeWidth={3.5} />
            <p className="font-display max-w-[240px] text-2xl leading-snug text-cream/80 italic">
              {t.slate}
            </p>
            <a
              href="#contact"
              className="link-line text-[0.68rem] tracking-[0.3em] text-champagne uppercase"
            >
              {t.start}
            </a>
          </div>
        </div>

        {/* The reel as an edit timeline: one tick per frame, a playhead,
            and the frame it is on. Only while the tracking shot runs. */}
        <div
          ref={timelineRef}
          hidden
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 px-12"
        >
          <div className="mx-auto flex max-w-[1680px] items-center gap-6 text-[0.6rem] tracking-[0.28em] text-taupe uppercase">
            <span className="tabular w-12">
              N°<span data-frame-now>01</span>
            </span>
            <div className="relative h-px flex-1 bg-line">
              <div data-playhead className="absolute inset-0 origin-left bg-champagne/70" style={{ transform: "scaleX(0)" }} />
              {projects.map((project, index) => (
                <span
                  key={project.id}
                  className="absolute -top-[3px] h-[7px] w-px bg-champagne/35"
                  style={{ left: `${(index / projects.length) * 100}%` }}
                />
              ))}
            </div>
            <span className="tabular w-12 text-right">{String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* Fixed overlay lives outside the pinned, transformed track -
          a transform would otherwise become its containing block. */}
      {screening ? <WorkLightbox project={screening} onClose={() => setScreening(null)} /> : null}
    </section>
  );
}

function CoverCard({
  project,
  index,
  locale,
  onPlay,
}: {
  project: Project;
  index: number;
  locale: Locale;
  onPlay: () => void;
}) {
  const t = siteUi(locale).work;
  const nl = locale === "nl" ? project.nl : undefined;
  const number = String(index + 1).padStart(2, "0");
  const playable = Boolean(project.video || project.youtube);
  const hasCase = caseIndex.has(project.id);
  const cardClass =
    "group relative block aspect-[3/4] w-[78vw] max-w-[460px] shrink-0 snap-center overflow-hidden rounded-md border border-line text-left transition-colors duration-700 ease-out hover:border-champagne/35 md:w-[440px]";

  const cover = project.image ? (
    <>
      <div data-cover-media className="absolute inset-0">
      {project.imageB ? (
        <>
          {/* Diagonal split: two views of one world, hinged on a
              champagne seam that drifts up as you hover */}
          <Image
            src={project.image}
            alt={t.screenshot(project.title)}
            fill
            sizes="(max-width: 900px) 78vw, 440px"
            className="object-cover object-top saturate-[0.88] transition-[transform,clip-path] duration-700 ease-out group-hover:scale-[1.03] [clip-path:polygon(0_0,100%_0,100%_38%,0_62%)] group-hover:[clip-path:polygon(0_0,100%_0,100%_34%,0_58%)]"
          />
          <Image
            src={project.imageB}
            alt=""
            fill
            sizes="(max-width: 900px) 78vw, 440px"
            className="object-cover object-left saturate-[0.88] transition-[transform,clip-path] duration-700 ease-out group-hover:scale-[1.03] [clip-path:polygon(0_62%,100%_38%,100%_100%,0_100%)] group-hover:[clip-path:polygon(0_58%,100%_34%,100%_100%,0_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute top-[50%] -left-[10%] h-[2px] w-[120%] -rotate-[17.7deg] bg-champagne/60 shadow-[0_0_18px_rgba(230,213,179,0.35)] transition-[top] duration-700 ease-out group-hover:top-[46%]"
          />
        </>
      ) : (
        <Image
          src={project.image}
          alt={t.screenshot(project.title)}
          fill
          sizes="(max-width: 900px) 78vw, 440px"
          className="object-cover object-top saturate-[0.88] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      </div>
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
    <>
    {/* Viewfinder marks: they close in on hover, like focus locking on */}
    <span className="viewfinder pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
    <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
      <div className="flex items-start justify-between text-[0.6rem] tracking-[0.28em] text-cream/60 uppercase">
        <span>{t.caseTag}</span>
        <span className="tabular">N°{number}</span>
      </div>

      <div>
        <p className="text-eyebrow mb-4" style={{ color: project.tone.glow }}>
          {nl?.category ?? project.category} · {nl?.year ?? project.year}
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
          {nl?.blurb ?? project.blurb}
        </p>
        {hasCase ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-champagne uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {t.readCase}
          </p>
        ) : project.url ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-champagne uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {t.openProject}
          </p>
        ) : playable ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-champagne uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {t.playFilm}
          </p>
        ) : project.note ? (
          <p className="mt-6 translate-y-3 text-[0.66rem] tracking-[0.3em] text-taupe uppercase opacity-0 transition-all delay-75 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {nl?.note ?? project.note}
          </p>
        ) : null}
      </div>
    </div>
    </>
  );

  if (hasCase) {
    return (
      <Link
        href={localePath(locale, `/work/${project.id}`)}
        data-cursor="Read"
        aria-label={`${project.title}, read the case`}
        className={cardClass}
        style={{ backgroundColor: project.tone.base }}
      >
        {cover}
        {content}
      </Link>
    );
  }

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Visit"
        aria-label={`${project.title}, opens in a new tab`}
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
        aria-label={`${project.title}, play the film`}
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
