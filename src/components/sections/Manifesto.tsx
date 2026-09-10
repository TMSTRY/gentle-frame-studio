import Reveal from "@/components/fx/Reveal";
import ScrubWords from "@/components/fx/ScrubWords";

const STATEMENT =
  "We are a small studio for big feelings. With AI, code and cinema we tell the oldest stories: love, loss, joy, wonder. The technology is our instrument. The emotion is the work.";

const FACTS = [
  ["Est. 2025", "Belgium · worldwide"],
  ["Films · Visuals · Software", "One craft, many frames"],
  ["Human first", "Always"],
] as const;

/** The studio's founding statement, brightening word by word. */
export default function Manifesto() {
  return (
    <section className="relative mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56" aria-label="Manifesto">
      <Reveal>
        <p className="text-eyebrow mb-12">The studio · a founding statement</p>
      </Reveal>
      <ScrubWords
        text={STATEMENT}
        className="font-display max-w-5xl text-[clamp(1.75rem,4.2vw,3.9rem)] leading-[1.25] font-medium text-cream"
      />
      <Reveal delay={0.15}>
        <dl className="mt-24 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
          {FACTS.map(([term, detail]) => (
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
