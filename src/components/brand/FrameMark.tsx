import type { CSSProperties } from "react";

interface FrameMarkProps {
  className?: string;
  strokeWidth?: number;
  /** When true, strokes start undrawn so GSAP can animate them in. */
  drawable?: boolean;
}

const undrawn: CSSProperties = { strokeDasharray: 1, strokeDashoffset: 1 };

/**
 * Geometry traced from the official brand asset (public/brand/wordmark.jpg),
 * in stroke-center coordinates on a 120x92 viewBox. The front frame
 * knocks the back frame out where they overlap — that interlock is
 * what makes the mark read as crafted rather than as crossed lines.
 */
const BACK = { x: 4.1, y: 4.1, w: 78.3, h: 60.9, r: 6.9 };
const FRONT = { x: 45.1, y: 24.2, w: 70.8, h: 63.7, r: 6.9 };
const BAR = { x1: 25.3, x2: 72.3, y: 49.6 };

/**
 * The Gentle Frames mark — two interlocking frames with the shared
 * G/F crossbar. Each shape carries a class (`gf-back`, `gf-front`,
 * `gf-bar`) for stroke-draw animations, enabled by every shape using
 * `pathLength={1}`.
 */
export default function FrameMark({ className, strokeWidth = 4, drawable = false }: FrameMarkProps) {
  const style = drawable ? undrawn : undefined;
  // The knockout follows the front frame's inner edge, so it depends
  // on stroke weight. Instances sharing a weight share identical mask
  // content, which keeps this deterministic id safe across repeats.
  const maskId = `gf-knockout-${String(strokeWidth).replace(".", "-")}`;

  return (
    <svg
      viewBox="0 0 120 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="92">
        <rect x="0" y="0" width="120" height="92" fill="white" />
        <rect
          x={FRONT.x + strokeWidth / 2}
          y={FRONT.y + strokeWidth / 2}
          width={FRONT.w - strokeWidth}
          height={FRONT.h - strokeWidth}
          rx={FRONT.r - strokeWidth / 2}
          fill="black"
        />
      </mask>
      <rect
        className="gf-back"
        x={BACK.x}
        y={BACK.y}
        width={BACK.w}
        height={BACK.h}
        rx={BACK.r}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        pathLength={1}
        mask={`url(#${maskId})`}
        style={style}
      />
      <rect
        className="gf-front"
        x={FRONT.x}
        y={FRONT.y}
        width={FRONT.w}
        height={FRONT.h}
        rx={FRONT.r}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        pathLength={1}
        style={style}
      />
      <line
        className="gf-bar"
        x1={BAR.x1}
        y1={BAR.y}
        x2={BAR.x2}
        y2={BAR.y}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        pathLength={1}
        style={style}
      />
    </svg>
  );
}
