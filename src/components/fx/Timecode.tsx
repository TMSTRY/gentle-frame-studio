"use client";

import { useEffect, useRef } from "react";

const FPS = 24;

function format(totalFrames: number): string {
  const frames = totalFrames % FPS;
  const totalSeconds = Math.floor(totalFrames / FPS);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

/**
 * A running 24fps film timecode, counting from the moment the
 * visitor arrived - the site as a take that is being recorded.
 */
export default function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const start = performance.now();
    let last = -1;
    let rafId: number;

    // Only touch the DOM when the frame number changes: 24 writes a
    // second, no React render at all.
    const tick = (now: number) => {
      const frame = Math.floor(((now - start) / 1000) * FPS);
      if (frame !== last) {
        last = frame;
        element.textContent = format(frame);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`} aria-hidden="true">
      00:00:00:00
    </span>
  );
}
