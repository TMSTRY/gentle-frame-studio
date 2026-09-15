"use client";

import Reveal from "@/components/fx/Reveal";
import ScrubWords from "@/components/fx/ScrubWords";
import { useLocale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";

/** The studio's founding statement, brightening word by word. */
export default function Manifesto() {
  const t = siteUi(useLocale()).manifesto;
  return (
    <section className="relative mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56" aria-label="Manifesto">
      <Reveal>
        <p className="text-eyebrow mb-12">{t.eyebrow}</p>
      </Reveal>
      <ScrubWords
        text={t.statement}
        className="font-display max-w-5xl text-[clamp(1.75rem,4.2vw,3.9rem)] leading-[1.25] font-medium text-cream"
      />
      <Reveal delay={0.15}>
        <dl className="mt-24 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
          {t.facts.map(([term, detail]) => (
            <div key={term}>
              <dt className="text-eyebrow">{term}</dt>
              <dd className="mt-3 text-sm text-cream/60">{detail}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
