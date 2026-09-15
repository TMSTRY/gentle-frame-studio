"use client";

import { useState } from "react";

/** Copies a string to the clipboard and says so for a moment. */
export default function CopyButton({ value, label, doneLabel, className }: { value: string; label: string; doneLabel: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          window.prompt(label, value);
        }
      }}
      className={className ?? "link-line text-[0.62rem] tracking-[0.26em] text-champagne uppercase"}
    >
      {done ? doneLabel : label}
    </button>
  );
}
