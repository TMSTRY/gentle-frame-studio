"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addReviewNoteAction, deleteNoteAction, resolveNoteAction } from "@/app/portal/review/actions";
import { buttonClass, inputClass } from "@/components/portal/ui";
import type { CutSource } from "@/lib/portal/review";
import { formatTimecode, parseTimecode } from "@/lib/portal/review";
import type { ReviewCut, ReviewNote } from "@/lib/portal/types";

export interface ReviewLabels {
  version: string;
  noteAt: string;
  general: string;
  useMoment: string;
  placeholder: string;
  send: string;
  sending: string;
  resolved: string;
  resolve: string;
  reopen: string;
  remove: string;
  noNotes: string;
  openLink: string;
  timecodeHint: string;
  studio: string;
}

interface ReviewPanelProps {
  cut: ReviewCut;
  source: CutSource | null;
  notes: ReviewNote[];
  mode: "client" | "studio";
  lang: "nl" | "en";
  labels: ReviewLabels;
  readOnly?: boolean;
}

/**
 * One cut, one conversation. The film on the left; on the right the
 * notes, each pinned to a moment. Clicking a timecode seeks the player;
 * the note form picks up the player's current moment on request.
 */
export default function ReviewPanel({ cut, source, notes, mode, lang, labels, readOnly }: ReviewPanelProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [timecode, setTimecode] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isVideo = source?.kind === "video";

  function useMoment() {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setTimecode(formatTimecode(v.currentTime));
  }

  function seek(seconds: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = seconds;
    v.pause();
    v.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || body.trim().length < 2) return;
    setBusy(true);
    setError(null);
    const result = await addReviewNoteAction({ cutId: cut.id, timecode: parseTimecode(timecode), body });
    setBusy(false);
    if (!result.ok) {
      setError(lang === "nl" ? "Opslaan mislukte, probeer opnieuw." : "Saving failed, please try again.");
      return;
    }
    setBody("");
    setTimecode("");
    startTransition(() => router.refresh());
  }

  async function toggle(note: ReviewNote) {
    await resolveNoteAction({ id: note.id, resolved: !note.resolved_at });
    startTransition(() => router.refresh());
  }

  async function remove(note: ReviewNote) {
    if (!window.confirm(lang === "nl" ? "Deze opmerking verwijderen?" : "Remove this note?")) return;
    await deleteNoteAction({ id: note.id });
    startTransition(() => router.refresh());
  }

  const when = (value: string) => new Date(value).toLocaleString(lang === "nl" ? "nl-BE" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const canRemove = (note: ReviewNote) => !readOnly && (mode === "studio" || (note.author === "client" && !note.resolved_at));

  return (
    <div className="grid gap-10 md:grid-cols-12">
      <div className="md:col-span-7">
        <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">
          {labels.version} {cut.version}
          {cut.title ? ` · ${cut.title}` : ""}
        </p>
        <div className="mt-4 overflow-hidden border border-line bg-ink-deep">
          {source?.kind === "video" ? (
            <video ref={videoRef} src={source.url} controls playsInline preload="metadata" className="block aspect-video w-full bg-black" />
          ) : source?.kind === "embed" ? (
            <iframe src={source.url} title={`${labels.version} ${cut.version}`} allow="fullscreen; picture-in-picture" allowFullScreen className="block aspect-video w-full" />
          ) : source?.kind === "link" ? (
            <div className="p-8">
              <a href={source.url} target="_blank" rel="noopener" className={buttonClass}>
                {labels.openLink} ↗
              </a>
            </div>
          ) : (
            <p className="p-8 text-sm text-taupe">·</p>
          )}
        </div>
        {cut.note ? <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-cream/80 whitespace-pre-line">{cut.note}</p> : null}
      </div>

      <div className="md:col-span-5">
        {!readOnly ? (
          <form onSubmit={submit} className="border-t border-line pt-5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-24">
                <label htmlFor={`tc-${cut.id}`} className="mb-1 block text-[0.62rem] tracking-[0.28em] text-taupe uppercase">
                  {labels.noteAt}
                </label>
                <input id={`tc-${cut.id}`} value={timecode} onChange={(e) => setTimecode(e.target.value)} placeholder="0:00" inputMode="numeric" className={inputClass} />
              </div>
              {isVideo ? (
                <button type="button" onClick={useMoment} className="link-line pb-3 text-[0.62rem] tracking-[0.26em] text-champagne uppercase">
                  {labels.useMoment}
                </button>
              ) : (
                <span className="pb-3 text-xs text-taupe">{labels.timecodeHint}</span>
              )}
            </div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder={labels.placeholder} className={`${inputClass} mt-4 resize-none leading-relaxed`} />
            {error ? <p className="mt-3 text-sm text-gold">{error}</p> : null}
            <button type="submit" disabled={busy || body.trim().length < 2} className={`${buttonClass} mt-5`}>
              {busy ? labels.sending : labels.send}
            </button>
          </form>
        ) : null}

        <ul className={readOnly ? "" : "mt-8"}>
          {notes.length ? (
            notes.map((note) => (
              <li key={note.id} className={`border-t border-line py-4 ${note.resolved_at ? "opacity-55" : ""}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="flex items-baseline gap-3">
                    {note.timecode !== null ? (
                      <button
                        type="button"
                        onClick={() => isVideo && seek(note.timecode ?? 0)}
                        className={`font-display text-lg ${isVideo ? "text-champagne hover:underline" : "text-champagne/80"}`}
                      >
                        {formatTimecode(note.timecode)}
                      </button>
                    ) : (
                      <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{labels.general}</span>
                    )}
                    <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">
                      {note.author === "studio" ? labels.studio : note.author_name.split(" ")[0]} · {when(note.created_at)}
                    </span>
                  </span>
                  <span className="flex gap-4 text-[0.6rem] tracking-[0.24em] uppercase">
                    {note.resolved_at ? <span className="text-champagne/70">{labels.resolved}</span> : null}
                    {mode === "studio" && !readOnly ? (
                      <button type="button" onClick={() => toggle(note)} className="text-taupe hover:text-champagne">
                        {note.resolved_at ? labels.reopen : labels.resolve}
                      </button>
                    ) : null}
                    {canRemove(note) ? (
                      <button type="button" onClick={() => remove(note)} className="text-taupe/70 hover:text-gold">
                        {labels.remove}
                      </button>
                    ) : null}
                  </span>
                </div>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/85 whitespace-pre-line">{note.body}</p>
              </li>
            ))
          ) : (
            <li className="border-t border-line pt-4 text-sm text-taupe">{labels.noNotes}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
