import Link from "next/link";
import { STATUS_LABEL, STATUS_TRACK, type ProjectStatus } from "@/lib/portal/labels";

export const inputClass =
  "w-full border-b border-line bg-transparent py-3 text-[0.95rem] font-light text-cream placeholder:text-taupe/60 transition-colors duration-500 focus:border-champagne focus:outline-none";
export const labelClass = "mb-1 block text-[0.62rem] tracking-[0.28em] text-taupe uppercase";
export const buttonClass =
  "inline-block rounded-full border border-champagne/50 px-8 py-4 text-[0.68rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink disabled:opacity-50";
export const ghostButtonClass =
  "link-line text-[0.66rem] tracking-[0.28em] text-cream/70 uppercase transition-colors hover:text-cream";

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  aside,
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-8">
      <div>
        <p className="text-eyebrow mb-6">{eyebrow}</p>
        <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">{title}</h1>
      </div>
      {aside ? <div className="flex items-center gap-8 pb-2">{aside}</div> : null}
    </div>
  );
}

export function Notice({ tone = "quiet", children }: { tone?: "quiet" | "warm" | "alert"; children: React.ReactNode }) {
  const color = tone === "alert" ? "text-gold" : tone === "warm" ? "text-champagne" : "text-taupe";
  return (
    <p className={`mt-8 border-t border-line pt-5 text-sm leading-relaxed ${color}`} role={tone === "alert" ? "alert" : undefined}>
      {children}
    </p>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const tone =
    status === "cancelled" ? "text-taupe/70" : status === "delivered" || status === "closed" ? "text-cream/70" : "text-champagne";
  return <span className={`text-[0.66rem] tracking-[0.26em] uppercase ${tone}`}>{STATUS_LABEL[status]}</span>;
}

/** Six frames on a filmstrip; the lit ones are behind us. */
export function StatusTrack({ status }: { status: ProjectStatus }) {
  const index = STATUS_TRACK.indexOf(status);
  const sidelined = index === -1;
  return (
    <ol className="grid grid-cols-3 gap-px border border-line bg-line md:grid-cols-6" aria-label="Project progress">
      {STATUS_TRACK.map((step, i) => {
        const reached = !sidelined && i <= index;
        const current = !sidelined && i === index;
        return (
          <li key={step} className={`bg-ink p-4 ${reached ? "" : "opacity-45"}`} aria-current={current ? "step" : undefined}>
            <span className="font-display block text-2xl leading-none text-outline">{String(i + 1).padStart(2, "0")}</span>
            <span className={`mt-3 block text-[0.6rem] tracking-[0.24em] uppercase ${current ? "text-champagne" : "text-cream/70"}`}>
              {STATUS_LABEL[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="border-t border-line pt-6 text-sm text-taupe">{children}</p>;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-[0.66rem] tracking-[0.28em] text-taupe uppercase transition-colors hover:text-cream">
      ← {label}
    </Link>
  );
}
