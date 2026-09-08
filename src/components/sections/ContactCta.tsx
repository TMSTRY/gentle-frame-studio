import Image from "next/image";
import FrameMark from "@/components/brand/FrameMark";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/fx/Reveal";
import { contactCopy } from "@/content/contact";

/**
 * The closing invitation — a glowing frame around a single
 * promise, with the circular submark turning like a projector
 * reel in the corner.
 */
export default function ContactCta() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[92svh] scroll-mt-24 items-center justify-center overflow-hidden"
      aria-label="Contact"
    >
      {/* Turning submark stamp */}
      <Image
        src="/brand/submark.png"
        alt=""
        width={160}
        height={160}
        className="animate-spin-slow absolute top-16 right-8 w-24 opacity-60 mix-blend-screen md:right-16 md:w-32"
      />

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
          <p className="text-eyebrow mb-10">Start something gentle</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display mx-auto max-w-4xl text-[clamp(2.6rem,7vw,6.4rem)] leading-[1.05] font-medium text-cream">
            Let&rsquo;s create something
            <br />
            <span className="text-gold italic">worth remembering.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-taupe">
            A memory, a product, a song, an idea that needs a frame —
            write to us and we&rsquo;ll listen first.
          </p>
          <div className="mt-14">
            <ContactForm variant="studio" lang="en" copy={contactCopy["studio-en"]} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
