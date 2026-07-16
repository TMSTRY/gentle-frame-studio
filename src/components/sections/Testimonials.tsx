"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/fx/Reveal";
import { testimonials } from "@/content/testimonials";

const ROTATION_MS = 7000;

/**
 * Kind words, one voice at a time — generous whitespace, large
 * italic serif, slow rotation with manual override.
 */
export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [active]);

  const select = useCallback((index: number) => setActive(index), []);

  return (
    <section className="border-t border-line" aria-label="Testimonials">
      <div className="mx-auto max-w-[1680px] px-6 py-36 md:px-12 md:py-56">
        <Reveal>
          <p className="text-eyebrow mb-20 text-center">Kind words</p>
        </Reveal>

        <Reveal>
          <div className="relative mx-auto min-h-[16rem] max-w-4xl md:min-h-[14rem]" aria-live="polite">
            {testimonials.map((testimonial, index) => (
              <blockquote
                key={testimonial.author}
                className={`absolute inset-0 text-center transition-all duration-1000 ease-out ${
                  index === active
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                <p className="font-display text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.3] font-medium text-cream italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-10 text-[0.65rem] tracking-[0.3em] text-taupe uppercase">
                  {testimonial.author} — {testimonial.context}
                </footer>
              </blockquote>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 flex justify-center gap-4">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.author}
              type="button"
              onClick={() => select(index)}
              aria-label={`Show quote ${index + 1}`}
              className={`h-px w-10 transition-all duration-500 ${
                index === active ? "bg-champagne" : "bg-line hover:bg-champagne/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
