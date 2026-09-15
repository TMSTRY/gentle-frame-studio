import Image from "next/image";
import Link from "next/link";
import FrameMark from "@/components/brand/FrameMark";
import Parallax from "@/components/fx/Parallax";
import Reveal from "@/components/fx/Reveal";
import CaseFilm from "@/components/work/CaseFilm";
import type { CaseStudy } from "@/content/cases";
import type { Project } from "@/content/projects";
import { projects } from "@/content/projects";
import { localePath, type Locale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";

interface CasePageProps {
  project: Project;
  study: CaseStudy;
  prev: Project | null;
  next: Project | null;
  locale: Locale;
}

const number = (project: Project) => String(projects.findIndex((p) => p.id === project.id) + 1).padStart(2, "0");

/**
 * One case as a magazine feature: a tall cover with the project's own
 * tone, a standfirst, facts in the margin, the story in a single
 * column, the film where there is one, and the way to the next case.
 */
export default function CasePage({ project, study, prev, next, locale }: CasePageProps) {
  const external = project.url;
  const isMemorial = project.id === "memorial-films";
  const t = siteUi(locale).caseUi;
  const nl = locale === "nl" ? project.nl : undefined;
  const home = localePath(locale, "/");
  const memorialHref = locale === "nl" ? "/nl/herinneringsfilms" : "/memorial-films";

  return (
    <main id="main" className="relative">
      {/* Cover */}
      <section className="relative min-h-[88svh] overflow-hidden" style={{ backgroundColor: project.tone.base }}>
        {project.image ? (
          <Parallax speed={-0.1} className="absolute inset-0 scale-[1.06]">
            <Image src={project.image} alt="" fill priority sizes="100vw" className="object-cover object-top opacity-45 saturate-[0.85]" />
          </Parallax>
        ) : null}
        <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at ${project.tone.light}, ${project.tone.glow}33, transparent 62%)` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />
        <FrameMark className="absolute -right-16 -bottom-16 w-[min(60vw,560px)] text-cream opacity-[0.05]" strokeWidth={1.5} />

        <div className="relative mx-auto flex min-h-[88svh] w-full max-w-[1680px] flex-col justify-end px-6 pt-44 pb-16 md:px-12 md:pb-24">
          <Reveal>
            <div className="flex items-baseline gap-6 text-[0.62rem] tracking-[0.28em] text-cream/60 uppercase">
              <Link href={`${home}#work`} className="link-line transition-colors hover:text-cream">{t.back}</Link>
              <span className="tabular">N°{number(project)}</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-eyebrow mt-10 mb-6" style={{ color: project.tone.glow }}>
              {nl?.category ?? project.category} · {nl?.year ?? project.year}
            </p>
            <h1 className="font-display max-w-5xl text-[clamp(3rem,8vw,7.5rem)] leading-[0.98] font-medium text-cream">{project.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-display mt-10 max-w-3xl text-xl leading-snug text-champagne/90 italic md:text-2xl">{study.standfirst}</p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-[1680px] gap-14 px-6 py-24 md:grid-cols-12 md:px-12 md:py-36">
        <aside className="md:col-span-4 lg:col-span-3">
          <Reveal>
            <dl className="md:sticky md:top-32">
              {study.facts.map((fact) => (
                <div key={fact.label} className="border-t border-line py-5">
                  <dt className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-cream/80">{fact.value}</dd>
                </div>
              ))}
              {external ? (
                <div className="border-t border-line pt-8">
                  <a
                    href={external}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Visit"
                    className="inline-block rounded-full border border-champagne/50 px-7 py-4 text-[0.66rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink"
                  >
                    {study.visitLabel ?? t.openProject} ↗
                  </a>
                </div>
              ) : isMemorial ? (
                <div className="border-t border-line pt-8">
                  <Link href={memorialHref} className="inline-block rounded-full border border-champagne/50 px-7 py-4 text-[0.66rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink">
                    {study.visitLabel ?? t.readMore}
                  </Link>
                </div>
              ) : null}
            </dl>
          </Reveal>
        </aside>

        <div className="md:col-span-8 lg:col-span-7 lg:col-start-5">
          {(project.video || project.youtube) && project.image ? (
            <Reveal>
              <div className="mb-16">
                <CaseFilm project={project} poster={project.image} label={t.playFilm} />
              </div>
            </Reveal>
          ) : null}
          {study.sections.map((section, index) => (
            <Reveal key={section.title} delay={Math.min(index * 0.05, 0.2)}>
              <section className={index === 0 ? "" : "mt-16 border-t border-line pt-14"}>
                <h2 className="font-display text-3xl leading-tight font-medium text-cream md:text-4xl">{section.title}</h2>
                <div className="mt-7 space-y-6 text-[0.98rem] leading-[1.95] font-light text-cream/72">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
          <Reveal delay={0.1}>
            <p className="font-display mt-20 max-w-2xl text-2xl leading-snug text-champagne italic md:text-3xl">{study.closing}</p>
          </Reveal>
        </div>
      </section>

      {/* Prev / next */}
      <nav className="border-t border-line" aria-label="More work">
        <div className="mx-auto grid max-w-[1680px] md:grid-cols-2">
          {[prev, next].map((neighbour, i) =>
            neighbour ? (
              <Link
                key={neighbour.id}
                href={localePath(locale, `/work/${neighbour.id}`)}
                className={`group flex flex-col gap-3 px-6 py-14 transition-colors hover:bg-ink-soft md:px-12 md:py-20 ${i === 1 ? "md:items-end md:text-right md:border-l md:border-line" : ""}`}
              >
                <span className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">{i === 0 ? t.previous : t.next}</span>
                <span className="font-display text-3xl font-medium text-cream md:text-4xl">{neighbour.title}</span>
                <span className="text-[0.66rem] tracking-[0.26em] uppercase" style={{ color: neighbour.tone.glow }}>{neighbour.category}</span>
              </Link>
            ) : (
              <Link key={`archive-${i}`} href={`${home}#work`} className={`flex flex-col gap-3 px-6 py-14 transition-colors hover:bg-ink-soft md:px-12 md:py-20 ${i === 1 ? "md:items-end md:text-right md:border-l md:border-line" : ""}`}>
                <span className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">{i === 0 ? t.backTo : t.backToNext}</span>
                <span className="font-display text-3xl font-medium text-cream md:text-4xl">{t.archive}</span>
              </Link>
            ),
          )}
        </div>
      </nav>
    </main>
  );
}
