import type { CSSProperties } from "react";

interface FrameMarkProps {
  className?: string;
  strokeWidth?: number;
  /** When true, strokes start undrawn so GSAP can animate them in. */
  drawable?: boolean;
}

const undrawn: CSSProperties = { strokeDasharray: 1, strokeDashoffset: 1 };

/**
 * The Gentle Frames mark — two overlapping frames with the F
 * crossbar, drawn as vector strokes. Each shape carries a class
 * (`gf-back`, `gf-front`, `gf-bar`) for stroke-draw animations,
 * enabled by every shape using `pathLength={1}`.
 */
export default function FrameMark({ className, strokeWidth = 4, drawable = false }: FrameMarkProps) {
  const style = drawable ? undrawn : undefined;

  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        className="gf-back"
        x="8"
        y="6"
        width="66"
        height="58"
        rx="12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        pathLength={1}
        style={style}
      />
      <rect
        className="gf-front"
        x="46"
        y="34"
        width="66"
        height="58"
        rx="12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        pathLength={1}
        style={style}
      />
      <line
        className="gf-bar"
        x1="26"
        y1="63"
        x2="82"
        y2="63"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        style={style}
      />
    </svg>
  );
}
