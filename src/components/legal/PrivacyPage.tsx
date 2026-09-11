import Link from "next/link";
import HtmlLang from "@/components/fx/HtmlLang";
import Reveal from "@/components/fx/Reveal";
import type { PrivacyCopy } from "@/content/privacy";

/** A calm, readable legal page: one column of serif headings and light body text. */
export default function PrivacyPage({ copy }: { copy: PrivacyCopy }) {
  return (
    <main id="main" className="relative">
      <HtmlLang lang={copy.locale} />
      <div className="mx-auto max-w-[1680px] px-6 pt-40 pb-28 md:px-12 md:pt-52 md:pb-40">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow mb-6">{copy.eyebrow}</p>
            <h1 className="font-display text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.05] font-medium text-cream">{copy.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 text-base leading-[1.9] font-light text-cream/75 md:text-lg">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 text-[0.66rem] tracking-[0.26em] text-taupe uppercase">
              <span>{copy.updated}</span>
              <Link href={copy.otherPath} hrefLang={copy.locale === "en" ? "nl" : "en"} className="link-line transition-colors hover:text-cream">
                {copy.otherLabel}
              </Link>
            </div>
          </Reveal>

          <div className="mt-20">
            {copy.sections.map((section, index) => (
              <Reveal key={section.title} delay={Math.min(index * 0.04, 0.2)}>
                <section className="border-t border-line py-10 md:py-12">
                  <h2 className="font-display text-2xl leading-tight font-medium text-cream md:text-3xl">{section.title}</h2>
                  <div className="mt-5 space-y-5 text-[0.95rem] leading-[1.9] font-light text-cream/70">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
