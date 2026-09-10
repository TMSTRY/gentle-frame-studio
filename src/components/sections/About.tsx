import Image from "next/image";
import Parallax from "@/components/fx/Parallax";
import Reveal from "@/components/fx/Reveal";

const ROLES = ["Correctional officer", "AI filmmaker", "Musician", "Developer", "Maker"];

/**
 * The human behind the studio - a story, a place reserved for a
 * portrait, and the brand made physical.
 */
export default function About() {
  return (
    <section id="studio" className="scroll-mt-24" aria-label="About the studio">
      <div className="mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56">
        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          {/* Portrait - two cards held like a hand of playing cards.
              The monogram card sits on top; hovering fans it right
              while the portrait behind it fans left into view. */}
          <div className="md:col-span-5">
            <Reveal>
              <Parallax speed={0.08}>
                <figure
                  className="group relative mx-auto max-w-[420px] outline-none"
                  tabIndex={0}
                  data-cursor="Meet"
                  aria-label="Portrait of Tim Mostrey, hover to reveal"
                >
                  <div className="absolute -top-4 -left-4 h-full w-full rounded-xl border border-champagne/25" aria-hidden="true" />

                  {/* Portrait card - behind, fans left on hover */}
                  <div className="absolute inset-0 origin-bottom overflow-hidden rounded-xl border border-champagne/40 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[44%] group-hover:-rotate-[8deg] group-focus-visible:-translate-x-[44%] group-focus-visible:-rotate-[8deg]">
                    <Image
                      src="/brand/artistiek.png"
                      alt="Tim Mostrey, founder of Gentle Frame Studio, black-and-white portrait"
                      fill
                      sizes="(max-width: 768px) 90vw, 420px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" aria-hidden="true" />
                  </div>

                  {/* Monogram card - on top, fans right on hover */}
                  <div className="relative aspect-[4/5] origin-bottom overflow-hidden rounded-xl border border-champagne/50 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[44%] group-hover:rotate-[8deg] group-focus-visible:translate-x-[44%] group-focus-visible:rotate-[8deg]">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(110% 90% at 50% 20%, rgba(230,213,179,0.13), transparent 60%), linear-gradient(175deg, #17130e, #0a0908 70%)",
                      }}
                    />
                    <Image
                      src="/brand/monogram.png"
                      alt=""
                      width={300}
                      height={300}
                      className="absolute top-1/2 left-1/2 w-40 -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-80"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-[0.6rem] tracking-[0.28em] text-taupe uppercase">
                      <span>The founder</span>
                      <span>Tim Mostrey</span>
                    </figcaption>
                  </div>
                </figure>
              </Parallax>
            </Reveal>
          </div>

          {/* The story */}
          <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-eyebrow mb-6">The studio · a human story</p>
              <h2 className="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.05] font-medium text-cream">
                The person behind
                <br />
                the frames
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 space-y-7 text-[0.95rem] leading-[2] font-light text-cream/70">
                <p>
                  Before there was a studio, there were night shifts. Years spent as a
                  correctional officer, keeping watch through the quietest hours of a
                  prison, learning that presence matters more than words, and that
                  everyone carries a story worth keeping.
                </p>
                <p>
                  Somewhere along the way, the stories asked for form. Music got
                  written. Code got shipped. Films got made. The tools kept changing
                  (guitars, cameras, neural networks), but the job stayed the same:
                  make someone feel something true.
                </p>
                <p>
                  Gentle Frames is that job, taken seriously. A one-person studio in
                  Belgium working with families, artists and brands worldwide, using
                  AI the way a craftsman uses any instrument: quietly, precisely, in
                  service of the human on the other side.
                </p>
              </div>
              <p className="font-display mt-10 text-2xl text-champagne italic">Tim, founder</p>
              <p className="mt-12 border-t border-line pt-8 text-[0.65rem] tracking-[0.26em] text-taupe uppercase">
                {ROLES.join("  ·  ")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* The brand, made physical */}
      <div className="mx-auto max-w-[1680px] px-6 pb-36 md:px-12 md:pb-56">
        <Reveal>
          <div className="relative h-[52vh] overflow-hidden rounded-xl border border-line md:h-[74vh]">
            <Parallax speed={-0.12} className="absolute inset-0 scale-[1.18]">
              <Image
                src="/brand/business-card.jpg"
                alt="Gentle Frames business card, black paper with champagne foil"
                fill
                sizes="(max-width: 1680px) 100vw, 1680px"
                className="object-cover"
              />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <p className="font-display absolute bottom-6 left-6 text-xl text-cream/90 italic md:bottom-10 md:left-10 md:text-3xl">
              Crafted in Belgium. At home anywhere.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
