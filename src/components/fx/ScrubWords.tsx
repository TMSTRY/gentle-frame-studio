"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface ScrubWordsProps {
  text: string;
  className?: string;
}

/**
 * A statement paragraph whose words brighten one by one as the
 * reader scrolls through it - ink to cream, tied to scroll.
 */
export default function ScrubWords({ text, className }: ScrubWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const targets = element.querySelectorAll("[data-scrub-word]");
    const tween = gsap.fromTo(
      targets,
      { opacity: 0.13 },
      {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top 78%",
          end: "bottom 45%",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-scrub-word className="opacity-[0.13]">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
