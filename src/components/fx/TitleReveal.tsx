"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ElementType, type ReactElement, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface TitleRevealProps {
  children: ReactNode;
  /** Heading level or any element; defaults to h2. */
  as?: ElementType;
  className?: string;
  /** Seconds to hold back after the title enters. */
  delay?: number;
}

/** Plain text of a node tree, for the accessible label. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    if (node.type === "br") return " ";
    return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

/**
 * Splits text into masked words, keeping elements (an italic span,
 * a line break) intact around them. Whitespace stays real text, so
 * lines wrap exactly as the static heading would.
 */
function split(node: ReactNode, key: string): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return part;
      return (
        <span key={`${key}-${i}`} className="reveal-slot reveal-slot-tall">
          <span className="reveal-word">{part}</span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) return node.map((child, i) => split(child, `${key}-${i}`));
  if (isValidElement(node)) {
    if (node.type === "br") return node;
    const element = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(element, { key }, split(element.props.children, key));
  }
  return node;
}

/**
 * A section title whose words rise one by one from behind a mask the
 * first time it enters view: the hero's opening gesture, repeated at
 * every chapter so the whole site shares one typographic motion.
 * Without JavaScript or with reduced motion the title simply stands.
 */
export default function TitleReveal({ children, as: Tag = "h2", className, delay = 0 }: TitleRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const words = element.querySelectorAll<HTMLElement>(".reveal-word");
    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0, y: 0 });
      return;
    }
    // Take over the CSS start position in GSAP's own transform space.
    gsap.set(words, { yPercent: 145, y: 0 });
    const tween = gsap.to(words, {
      yPercent: 0,
      duration: 1.15,
      ease: "power3.out",
      stagger: 0.07,
      delay,
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
      // Once the title stands, release the GPU layers the rise needed.
      onComplete: () => words.forEach((word) => (word.style.willChange = "auto")),
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  const label = textOf(children).replace(/\s+/g, " ").trim();
  return (
    <Tag ref={ref} className={className} aria-label={label}>
      <span aria-hidden="true">{split(Children.toArray(children), "t")}</span>
    </Tag>
  );
}
