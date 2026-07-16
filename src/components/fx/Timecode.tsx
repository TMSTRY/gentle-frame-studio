"use client";

import { useEffect, useState } from "react";

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
 * visitor arrived — the site as a take that is being recorded.
 */
export default function Timecode({ className }: { className?: string }) {
  const [code, setCode] = useState("00:00:00:00");

  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setCode(format(Math.floor(elapsed * FPS)));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <span className={`tabular ${className ?? ""}`} aria-hidden="true">
      {code}
    </span>
  );
}
