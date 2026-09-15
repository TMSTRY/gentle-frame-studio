import Image from "next/image";
import Parallax from "@/components/fx/Parallax";
import Timecode from "@/components/fx/Timecode";
import type { Project } from "@/content/projects";

interface FilmStillProps {
  project: Project;
  number: string;
}

/**
 * One chosen still from the archive reel, hung as a vertical strip:
 * sprocket holes down both edges, a sliver of the frames above and
 * below, and the screenshot whole and sharp in a portrait frame with
 * its number and the studio's running timecode.
 */
export default function FilmStill({ project, number }: FilmStillProps) {
  if (!project.image) return null;
  const holes = Array.from({ length: 16 });
  const Sprockets = () => (
    <div className="flex flex-col justify-between py-3" aria-hidden="true">
      {holes.map((_, i) => (
        <span key={i} className="h-3.5 w-2.5 rounded-[2px] border border-champagne/25 bg-ink" />
      ))}
    </div>
  );
  const Ghost = () => (
    <div className="mx-3 h-8 rounded-sm border border-champagne/10 bg-ink/60" aria-hidden="true" />
  );

  return (
    <Parallax speed={0.05}>
      <figure className="relative mx-auto w-full max-w-[400px]">
        {/* Warm lightbox glow behind the strip */}
        <div
          className="absolute -inset-10 rounded-[40px] blur-2xl"
          aria-hidden="true"
          style={{ background: `radial-gradient(closest-side, ${project.tone.glow}33, transparent 72%)` }}
        />
        <div className="relative grid grid-cols-[28px_1fr_28px] overflow-hidden rounded-md border border-champagne/25 bg-ink-deep shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <Sprockets />
          <div className="flex flex-col gap-3 py-3">
            <Ghost />
            <div className="relative overflow-hidden rounded-sm border border-champagne/15" style={{ aspectRatio: "3 / 4" }}>
              {project.imageB ? (
                <>
                  <Image src={project.image} alt={project.title} fill priority sizes="(max-width: 768px) 90vw, 400px" className="object-cover object-top [clip-path:polygon(0_0,100%_0,100%_38%,0_62%)]" />
                  <Image src={project.imageB} alt="" fill sizes="(max-width: 768px) 90vw, 400px" className="object-cover object-left [clip-path:polygon(0_62%,100%_38%,100%_100%,0_100%)]" />
                  <div aria-hidden="true" className="absolute top-[50%] -left-[10%] h-[2px] w-[120%] -rotate-[17.7deg] bg-champagne/60 shadow-[0_0_18px_rgba(230,213,179,0.35)]" />
                </>
              ) : (
                <Image src={project.image} alt={project.title} fill priority sizes="(max-width: 768px) 90vw, 400px" className="object-cover object-top" />
              )}
              {/* Frame markings, as on a contact sheet */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-3 text-[0.58rem] tracking-[0.28em] text-cream/70 uppercase">
                <span>Frame {number}</span>
                <span><Timecode /></span>
              </div>
              <div className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t border-l border-champagne/60" aria-hidden="true" />
              <div className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t border-r border-champagne/60" aria-hidden="true" />
            </div>
            <Ghost />
          </div>
          <Sprockets />
        </div>
        <figcaption className="mt-4 flex items-center justify-between text-[0.58rem] tracking-[0.28em] text-taupe uppercase">
          <span>Gentle Frames · Archive</span>
          <span>{project.category}</span>
        </figcaption>
      </figure>
    </Parallax>
  );
}
