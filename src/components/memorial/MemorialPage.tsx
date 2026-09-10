import Image from "next/image";
import Link from "next/link";
import FrameMark from "@/components/brand/FrameMark";
import ContactForm from "@/components/contact/ContactForm";
import HtmlLang from "@/components/fx/HtmlLang";
import Parallax from "@/components/fx/Parallax";
import Reveal from "@/components/fx/Reveal";
import FilmPoster from "@/components/memorial/FilmPoster";
import { contactCopy } from "@/content/contact";
import type { MemorialCopy } from "@/content/memorial";
import { site } from "@/content/site";

/**
 * The Memorial Films landing page - one calm layout shared by the
 * English and Dutch versions. Deliberately quieter than the home:
 * more air, one warm image, serif-led, nothing that startles a
 * visitor who arrives here grieving.
 */
export default function MemorialPage({ copy }: { copy: MemorialCopy }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: copy.meta.title,
    serviceType: "Memorial film production",
    description: copy.meta.description,
    url: `${site.url}${copy.path}`,
    inLanguage: copy.locale,
    availableLanguage: ["en", "nl"],
    areaServed: ["BE", "Worldwide"],
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
  };

  return (
    <main id="main" className="relative">
      <HtmlLang lang={copy.locale} />

      {/* ---- Hero -------------------------------------------------- */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden" aria-label={copy.meta.title}>
        <div className="absolute inset-0" aria-hidden="true">
          <Parallax speed={-0.1} className="absolute inset-0 scale-[1.08]">
            <Image
              src="/memorial/hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[30%_35%] opacity-55 saturate-[0.8]"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-[1680px] px-6 pt-44 pb-20 md:px-12 md:pb-28">
          <Reveal>
            <p className="text-eyebrow mb-8">{copy.hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display max-w-5xl text-[clamp(2.7rem,6.6vw,6.4rem)] leading-[1.03] font-medium text-cream">
              {copy.hero.title[0]}
              <br />
              <span className="text-gold italic">{copy.hero.title[1]}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-xl text-base leading-[1.9] font-light text-cream/75 md:text-lg">
              {copy.hero.lede}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
              <a href="#what" className="link-line text-[0.68rem] tracking-[0.3em] text-champagne uppercase">
                {copy.hero.scroll}
              </a>
              <Link
                href={copy.otherPath}
                hrefLang={copy.locale === "en" ? "nl" : "en"}
                className="link-line text-[0.68rem] tracking-[0.3em] text-taupe uppercase transition-colors hover:text-cream"
              >
                {copy.otherLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- What it is --------------------------------------------- */}
      <section id="what" className="scroll-mt-24">
        <div className="mx-auto grid max-w-[1680px] gap-12 px-6 py-28 md:grid-cols-12 md:px-12 md:py-40">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-eyebrow mb-6">{copy.intro.eyebrow}</p>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.05] font-medium text-cream">
                {copy.intro.title}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <div className="space-y-7 text-[0.98rem] leading-[2] font-light text-cream/70">
                {copy.intro.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- The film ----------------------------------------------- */}
      <section id="film" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-12 md:py-40">
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
              <div>
                <p className="text-eyebrow mb-6">{copy.film.eyebrow}</p>
                <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">
                  {copy.film.title}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-[1.9] font-light text-taupe">{copy.film.body}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <FilmPoster
              poster="/memorial/hero.jpg"
              title={copy.film.title}
              playLabel={copy.film.play}
              caption={copy.film.caption}
            />
          </Reveal>
        </div>
      </section>

      {/* ---- How it goes -------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-12 md:py-40">
          <Reveal>
            <p className="text-eyebrow mb-6">{copy.steps.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.05] font-medium text-cream">
              {copy.steps.title}
            </h2>
          </Reveal>
          <ol className="mt-16 md:mt-24">
            {copy.steps.items.map((step, index) => (
              <li
                key={step.index}
                className="grid gap-6 border-t border-line py-10 md:grid-cols-[120px_1fr_2fr] md:gap-12 md:py-14"
              >
                <Reveal delay={index * 0.05}>
                  <span className="font-display text-outline block text-5xl leading-none font-medium md:text-6xl">
                    {step.index}
                  </span>
                </Reveal>
                <Reveal delay={index * 0.05 + 0.05}>
                  <h3 className="font-display text-2xl leading-tight font-medium text-cream md:text-3xl">
                    {step.title}
                  </h3>
                </Reveal>
                <Reveal delay={index * 0.05 + 0.1}>
                  <p className="max-w-xl text-[0.95rem] leading-[1.9] font-light text-taupe">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Promises ----------------------------------------------- */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="pointer-events-none absolute top-1/2 right-[-12%] -translate-y-1/2" aria-hidden="true">
          <FrameMark className="w-[min(70vw,720px)] text-champagne/[0.07]" strokeWidth={0.8} />
        </div>
        <div className="relative mx-auto max-w-[1680px] px-6 py-28 md:px-12 md:py-40">
          <Reveal>
            <p className="text-eyebrow mb-6">{copy.promises.eyebrow}</p>
            <h2 className="font-display max-w-3xl text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.05] font-medium text-cream">
              {copy.promises.title}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-x-16 gap-y-14 md:mt-24 md:grid-cols-2">
            {copy.promises.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="border-t border-line pt-7">
                  <h3 className="font-display text-2xl font-medium text-champagne italic">{item.title}</h3>
                  <p className="mt-4 max-w-md text-[0.95rem] leading-[1.9] font-light text-taupe">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Practical ---------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1680px] gap-12 px-6 py-28 md:grid-cols-12 md:px-12 md:py-40">
          <div className="md:col-span-4">
            <Reveal>
              <p className="text-eyebrow mb-6">{copy.practical.eyebrow}</p>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.05] font-medium text-cream">
                {copy.practical.title}
              </h2>
              <p className="font-display mt-10 max-w-sm text-xl leading-snug text-champagne/90 italic">
                {copy.practical.note}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.1}>
              <dl>
                {copy.practical.items.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-2 border-t border-line py-6 md:grid-cols-[180px_1fr] md:gap-10"
                  >
                    <dt className="text-[0.66rem] tracking-[0.28em] text-cream/60 uppercase">{item.label}</dt>
                    <dd className="text-[0.95rem] leading-[1.9] font-light text-cream/75">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Questions ---------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1680px] gap-12 px-6 py-28 md:grid-cols-12 md:px-12 md:py-40">
          <div className="md:col-span-4">
            <Reveal>
              <p className="text-eyebrow mb-6">{copy.faq.eyebrow}</p>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.05] font-medium text-cream">
                {copy.faq.title}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.1}>
              <div>
                {copy.faq.items.map((item) => (
                  <details key={item.q} className="group border-t border-line">
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-8 py-6 [&::-webkit-details-marker]:hidden">
                      <span className="font-display text-xl leading-snug font-medium text-cream md:text-2xl">
                        {item.q}
                      </span>
                      <span
                        className="text-champagne transition-transform duration-500 group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-8 text-[0.95rem] leading-[1.9] font-light text-taupe">{item.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Invitation --------------------------------------------- */}
      <section
        id="contact"
        className="relative flex min-h-[80svh] scroll-mt-24 items-center justify-center overflow-hidden border-t border-line"
        aria-label="Contact"
      >
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <FrameMark className="animate-breathe w-[min(88vw,900px)] text-champagne/20 blur-[2px]" strokeWidth={0.8} />
        </div>
        <div className="relative z-10 px-6 text-center">
          <Reveal>
            <p className="text-eyebrow mb-10">{copy.cta.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mx-auto max-w-4xl text-[clamp(2.4rem,6.4vw,5.8rem)] leading-[1.05] font-medium text-cream">
              {copy.cta.title[0]}
              <br />
              <span className="text-gold italic">{copy.cta.title[1]}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-taupe">{copy.cta.body}</p>
            <div className="mt-14">
              <ContactForm
                variant="memorial"
                lang={copy.locale}
                copy={contactCopy[`memorial-${copy.locale}`]}
              />
            </div>
            <p className="mt-10 text-[0.66rem] tracking-[0.24em] text-taupe uppercase">{copy.cta.reassurance}</p>
          </Reveal>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
