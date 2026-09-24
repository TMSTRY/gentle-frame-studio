"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import FrameMark from "@/components/brand/FrameMark";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { contactCopy } from "@/content/contact";
import { useLocale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";

/**
 * The closing invitation - a glowing frame around a single
 * promise, with the circular submark in the corner turning like a
 * projector reel, wound by the scroll rather than spinning on its own.
 */
export default function ContactCta() {
  const locale = useLocale();
  const t = siteUi(locale).contact;
  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      reel,
      { rotation: -60 },
      {
        rotation: 120,
        ease: "none",
        scrollTrigger: { trigger: reel.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative flex min-h-[92svh] scroll-mt-24 items-center justify-center overflow-hidden"
      aria-label="Contact"
    >
      {/* Submark stamp, wound by the scroll */}
      <div ref={reelRef} className="absolute top-16 right-8 w-24 opacity-60 mix-blend-screen md:right-16 md:w-32">
        <Image src="/brand/submark.png" alt="" width={160} height={160} className="w-full" />
      </div>

      {/* Glowing frame */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <FrameMark
          className="animate-breathe w-[min(88vw,900px)] text-champagne/25 blur-[2px]"
          strokeWidth={0.8}
        />
      </div>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(closest-side, rgba(230,213,179,0.1), transparent 70%)",
        }}
      />

      <div className="relative z-10 px-6 text-center">
        <Reveal>
          <p className="text-eyebrow mb-10">{t.eyebrow}</p>
        </Reveal>
        <TitleReveal delay={0.1} className="font-display mx-auto max-w-4xl text-[clamp(2.6rem,7vw,6.4rem)] leading-[1.05] font-medium text-cream">
          {t.title1}
          <br />
          <span className="text-gold italic">{t.title2}</span>
        </TitleReveal>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-taupe">
            {t.lede}
          </p>
          <div className="mt-14">
            <ContactForm variant="studio" lang={locale} copy={contactCopy[`studio-${locale}`]} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
