interface WordmarkProps {
  className?: string;
}

/**
 * The typographic wordmark, set live so it stays crisp at any
 * size — serif display for the name, spaced sans for STUDIO.
 */
export default function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={`flex flex-col leading-none ${className ?? ""}`}>
      <span className="font-display text-[1.05rem] font-medium tracking-[0.18em] text-cream">
        GENTLE FRAMES
      </span>
      <span className="mt-1.5 text-[0.5rem] font-light tracking-[0.52em] text-taupe">
        S T U D I O
      </span>
    </span>
  );
}
