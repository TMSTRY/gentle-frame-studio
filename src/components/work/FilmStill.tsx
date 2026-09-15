import Image from "next/image";
import Parallax from "@/components/fx/Parallax";
import Timecode from "@/components/fx/Timecode";
import type { Project } from "@/content/projects";

interface FilmStillProps {
  project: Project;
  number: string;
  /** Sharp screenshot: never scaled past its natural crop */
}

/**
 * One chosen still from the archive reel: the screenshot sits in a
 * lightbox between two rows of sprocket holes, with a frame number
 * and the studio's running timecode. It reads as film, not as a card.
 */
export default function FilmStill({ project, number }: FilmStillProps) {
  if (!project.image) return null;
  const holes = Array.from({ length: 14 });
  const Sprockets = () => (
    <div className="flex justify-between px-3" aria-hidden="true">
      {holes.map((_, i) => (
        <span key={i} className="h-2.5 w-3.5 rounded-[2px] border border-champagne/25 bg-ink" />
      ))}
    </div>
  );

  return (
    <Parallax speed={0.05}>
      <figure className="relative mx-auto w-full max-w-[560px]">
        {/* Warm lightbox glow behind the strip */}
        <div
          className="absolute -inset-10 rounded-[40px] blur-2xl"
          aria-hidden="true"
          style={{ background: `radial-gradient(closest-side, ${project.tone.glow}33, transparent 72%)` }}
        />
        <div className="relative rounded-md border border-champagne/25 bg-ink-deep py-3 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <Sprockets />
          <div className="mx-3 my-3 overflow-hidden rounded-sm border border-champagne/15" style={{ aspectRatio: "16 / 10" }}>
            <div className="relative h-full w-full">
              {project.imageB ? (
                <>
                  <Image src={project.image} alt={project.title} fill priority sizes="(max-width: 768px) 92vw, 560px" className="object-cover object-top [clip-path:polygon(0_0,100%_0,100%_38%,0_62%)]" />
                  <Image src={project.imageB} alt="" fill sizes="(max-width: 768px) 92vw, 560px" className="object-cover object-left [clip-path:polygon(0_62%,100%_38%,100%_100%,0_100%)]" />
                  <div aria-hidden="true" className="absolute top-[50%] -left-[10%] h-[2px] w-[120%] -rotate-[13deg] bg-champagne/60 shadow-[0_0_18px_rgba(230,213,179,0.35)]" />
                </>
              ) : (
                <Image src={project.image} alt={project.title} fill priority sizes="(max-width: 768px) 92vw, 560px" className="object-cover object-top" />
              )}
              {/* Frame markings, as on a contact sheet */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-3 text-[0.58rem] tracking-[0.28em] text-cream/70 uppercase">
                <span>Frame {number}</span>
                <span className="hidden sm:inline"><Timecode /></span>
              </div>
              <div className="pointer-events-none absolute top-3 left-4 h-4 w-4 border-t border-l border-champagne/60" aria-hidden="true" />
              <div className="pointer-events-none absolute top-3 right-4 h-4 w-4 border-t border-r border-champagne/60" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-3 left-4 h-4 w-4 border-b border-l border-champagne/60" aria-hidden="true" />
              <div className="pointer-events-none absolute right-4 bottom-3 h-4 w-4 border-r border-b border-champagne/60" aria-hidden="true" />
            </div>
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
