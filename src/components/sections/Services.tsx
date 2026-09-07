import FrameMark from "@/components/brand/FrameMark";
import Reveal from "@/components/fx/Reveal";
import { services, type Service, type ServiceMotif } from "@/content/services";

/**
 * Seven services, treated as editorial chapters — each with its
 * own reel number, copy and ambient motif — rather than a grid
 * of interchangeable cards.
 */
export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-24" aria-label="Services">
      <div className="mx-auto max-w-[1680px] px-6 md:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 pb-20">
            <div>
              <p className="text-eyebrow mb-6">Services — seven ways in</p>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none font-medium text-cream">
                What we make
              </h2>
            </div>
            <p className="max-w-xs pb-2 text-sm leading-relaxed text-taupe">
              Every discipline shares one brief: make someone feel something true.
            </p>
          </div>
        </Reveal>

        <div>
          {services.map((service) => (
            <ServiceChapter key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceChapter({ service }: { service: Service }) {
  return (
    <article
      id={service.id}
      className="group grid gap-10 border-t border-line py-16 md:grid-cols-[140px_1fr_260px] md:gap-16 md:py-24"
    >
      <div className="md:sticky md:top-32 md:self-start">
        <Reveal>
          <span className="font-display text-outline block text-6xl leading-none font-medium transition-colors duration-700 md:text-7xl">
            {service.index}
          </span>
        </Reveal>
      </div>

      <div className="max-w-2xl">
        <Reveal>
          <p className="text-eyebrow mb-5">{service.kicker}</p>
          <h3 className="font-display text-[clamp(2.1rem,4.4vw,3.9rem)] leading-[1.05] font-medium text-cream">
            {service.title}
          </h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display mt-7 text-xl leading-snug text-champagne/90 italic md:text-2xl">
            {service.lede}
          </p>
          <p className="mt-6 text-sm leading-[1.9] font-light text-taupe md:text-base">
            {service.body}
          </p>
          <p className="mt-8 text-[0.65rem] tracking-[0.24em] text-cream/50 uppercase">
            {service.tags.join("  /  ")}
          </p>
          {service.href ? (
            <a
              href={service.href}
              className="link-line mt-8 inline-block text-[0.68rem] tracking-[0.3em] text-champagne uppercase"
            >
              {service.linkLabel ?? "Read more"} →
            </a>
          ) : null}
        </Reveal>
      </div>

      <div className="hidden items-start justify-center md:flex md:sticky md:top-40 md:self-start">
        <Reveal delay={0.2}>
          <Motif kind={service.motif} />
        </Reveal>
      </div>
    </article>
  );
}

/**
 * Ambient chapter visuals — small, quiet, each one built from
 * strokes and light rather than stock imagery.
 */
function Motif({ kind }: { kind: ServiceMotif }) {
  switch (kind) {
    case "glow":
      return (
        <div className="relative flex h-52 w-52 items-center justify-center">
          <FrameMark
            className="animate-breathe w-28 text-champagne"
            strokeWidth={2.5}
          />
          <div
            className="absolute h-40 w-40 rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, rgba(230,213,179,0.16), transparent 70%)" }}
          />
        </div>
      );
    case "sheen":
      return (
        <div className="relative h-52 w-52 overflow-hidden rounded-md border border-line bg-ink-soft">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(150deg, rgba(194,161,101,0.22), transparent 55%)" }}
          />
          <div className="animate-sheen absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-cream/12 to-transparent" />
          <span className="font-display absolute bottom-4 left-4 text-xs tracking-[0.3em] text-champagne/70">
            LUMIÈRE
          </span>
        </div>
      );
    case "waveform":
      return (
        <svg viewBox="0 0 200 200" fill="none" className="h-52 w-52 text-champagne/80" aria-hidden="true">
          <path
            d="M10 100 Q 25 40 40 100 T 70 100 Q 80 140 90 100 T 120 100 Q 135 30 150 100 T 190 100"
            stroke="currentColor"
            strokeWidth="1.4"
            className="animate-dash"
            strokeDasharray="6 8"
          />
          <path
            d="M10 100 H 190"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
      );
    case "tiles":
      return (
        <div className="grid h-52 w-52 grid-cols-4 gap-2" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              className="animate-twinkle rounded-[3px]"
              style={{
                background: `linear-gradient(140deg, rgba(230,213,179,${0.06 + (index % 5) * 0.05}), rgba(194,161,101,${0.04 + (index % 3) * 0.06}))`,
                animationDelay: `${(index * 0.37) % 3}s`,
              }}
            />
          ))}
        </div>
      );
    case "terminal":
      return (
        <div className="h-52 w-52 rounded-md border border-line bg-ink-deep p-5">
          <div className="mb-6 flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-taupe/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-taupe/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-taupe/20" />
          </div>
          <p className="text-[0.62rem] leading-6 tracking-[0.18em] text-champagne/70 uppercase">
            building
            <br />
            quiet tools
            <span className="animate-caret ml-1 inline-block h-3 w-[5px] translate-y-[2px] bg-champagne/80" />
          </p>
        </div>
      );
    case "constellation":
      return (
        <svg viewBox="0 0 200 200" fill="none" className="h-52 w-52" aria-hidden="true">
          <g stroke="rgba(230,213,179,0.25)" strokeWidth="0.6">
            <line x1="40" y1="60" x2="110" y2="40" />
            <line x1="110" y1="40" x2="160" y2="90" />
            <line x1="160" y1="90" x2="120" y2="150" />
            <line x1="120" y1="150" x2="55" y2="130" />
            <line x1="55" y1="130" x2="40" y2="60" />
            <line x1="110" y1="40" x2="120" y2="150" />
          </g>
          {[
            [40, 60], [110, 40], [160, 90], [120, 150], [55, 130],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="3"
              fill="#e6d5b3"
              className="animate-twinkle"
              style={{ animationDelay: `${index * 0.7}s` }}
            />
          ))}
        </svg>
      );
    case "asterisk":
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="h-52 w-52 text-champagne/70 [animation-duration:30s] animate-spin-slow"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <line
              key={index}
              x1="100"
              y1="30"
              x2="100"
              y2="70"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              transform={`rotate(${index * 45} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="6" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
  }
}
