"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeUploadAction, prepareUploadAction, removeFileAction } from "@/app/portal/files/actions";
import { buttonClass } from "@/components/portal/ui";
import { formatBytes, MAX_UPLOAD_BYTES } from "@/lib/portal/files";
import type { ProjectFile } from "@/lib/portal/types";

export interface VaultLabels {
  fromStudio: string;
  fromClient: string;
  empty: string;
  drop: string;
  choose: string;
  uploading: string;
  tooLarge: string;
  failed: string;
  remove: string;
  download: string;
  notify?: string;
  checklistTitle?: string;
}

interface FileVaultProps {
  projectId: string;
  files: ProjectFile[];
  /** "client" hides the notify checkbox and only lets them remove their own uploads. */
  mode: "client" | "studio";
  lang: "nl" | "en";
  labels: VaultLabels;
  checklist?: string[];
  readOnly?: boolean;
}

interface Job {
  name: string;
  state: "uploading" | "done" | "error";
  message?: string;
}

/**
 * The project's vault: files from the client (photos, videos, voice
 * notes) and from the studio (cuts, finals). Bytes go straight from the
 * browser to private storage through a one-time signed URL; the server
 * only hands out that URL and records the result.
 */
export default function FileVault({ projectId, files, mode, lang, labels, checklist, readOnly }: FileVaultProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notify, setNotify] = useState(true);
  const [pending, startTransition] = useTransition();

  const studioFiles = files.filter((f) => f.uploaded_by === "studio");
  const clientFiles = files.filter((f) => f.uploaded_by === "client");
  const dateFor = (value: string) => new Date(value).toLocaleDateString(lang === "nl" ? "nl-BE" : "en-GB", { day: "numeric", month: "short", year: "numeric" });

  async function uploadOne(file: File): Promise<Job> {
    if (file.size > MAX_UPLOAD_BYTES) return { name: file.name, state: "error", message: labels.tooLarge };
    const prep = await prepareUploadAction({ projectId, name: file.name, size: file.size });
    if (!prep.ok) return { name: file.name, state: "error", message: prep.error === "size" ? labels.tooLarge : labels.failed };
    const { createBrowser } = await import("@/lib/supabase/browser");
    const { error } = await createBrowser().storage.from("documents").uploadToSignedUrl(prep.path, prep.token, file, { contentType: file.type || "application/octet-stream" });
    if (error) return { name: file.name, state: "error", message: labels.failed };
    const done = await completeUploadAction({ projectId, path: prep.path, name: file.name, size: file.size, mime: file.type, notify: mode === "studio" && notify });
    if (!done.ok) return { name: file.name, state: "error", message: labels.failed };
    return { name: file.name, state: "done" };
  }

  async function handleFiles(list: FileList | File[]) {
    const picked = Array.from(list);
    if (!picked.length) return;
    setJobs(picked.map((f) => ({ name: f.name, state: "uploading" })));
    // One at a time keeps the order predictable and the connection calm.
    for (let i = 0; i < picked.length; i++) {
      const result = await uploadOne(picked[i]);
      setJobs((current) => current.map((job, index) => (index === i ? result : job)));
    }
    startTransition(() => router.refresh());
    setTimeout(() => setJobs((current) => current.filter((job) => job.state === "error")), 4000);
  }

  async function remove(file: ProjectFile) {
    if (!window.confirm(lang === "nl" ? `"${file.name}" verwijderen?` : `Remove "${file.name}"?`)) return;
    await removeFileAction({ id: file.id });
    startTransition(() => router.refresh());
  }

  const canRemove = (file: ProjectFile) => !readOnly && (mode === "studio" || file.uploaded_by === "client");

  const renderList = (title: string, rows: ProjectFile[]) => (
    <div>
      <h3 className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{title}</h3>
      {rows.length ? (
        <ul className="mt-3">
          {rows.map((file) => (
            <li key={file.id} className="grid items-baseline gap-2 border-t border-line py-3 text-sm md:grid-cols-[1fr_90px_110px_auto]">
              <a href={`/portal/files/${file.id}`} className="link-line truncate text-cream/90" title={file.name}>
                {file.name}
              </a>
              <span className="text-taupe">{formatBytes(file.size_bytes)}</span>
              <span className="text-taupe">{dateFor(file.created_at)}</span>
              <span className="flex gap-5 text-[0.62rem] tracking-[0.26em] uppercase">
                <a href={`/portal/files/${file.id}`} className="text-champagne/80 hover:text-champagne">
                  {labels.download}
                </a>
                {canRemove(file) ? (
                  <button type="button" onClick={() => remove(file)} className="text-taupe/70 hover:text-gold">
                    {labels.remove}
                  </button>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 border-t border-line pt-3 text-sm text-taupe">{labels.empty}</p>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 md:grid-cols-12">
      <div className="space-y-10 md:col-span-7">
        {renderList(labels.fromStudio, studioFiles)}
        {renderList(labels.fromClient, clientFiles)}
      </div>
      {!readOnly ? (
        <div className="md:col-span-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            className={`border border-dashed p-8 text-center transition-colors ${dragging ? "border-champagne bg-champagne/5" : "border-line"}`}
          >
            <p className="text-sm leading-relaxed text-cream/75">{labels.drop}</p>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && void handleFiles(e.target.files)} />
            <button type="button" onClick={() => inputRef.current?.click()} className={`${buttonClass} mt-6`}>
              {labels.choose}
            </button>
            <p className="mt-4 text-[0.7rem] text-taupe">max. {formatBytes(MAX_UPLOAD_BYTES)}</p>
          </div>
          {mode === "studio" && labels.notify ? (
            <label className="mt-4 flex items-center gap-3 text-sm text-taupe">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-[#e6d5b3]" />
              {labels.notify}
            </label>
          ) : null}
          {jobs.length ? (
            <ul className="mt-6 space-y-2 text-sm" aria-live="polite">
              {jobs.map((job, i) => (
                <li key={`${job.name}-${i}`} className={job.state === "error" ? "text-gold" : job.state === "done" ? "text-champagne" : "text-taupe"}>
                  {job.state === "uploading" ? `${labels.uploading} ` : job.state === "done" ? "✓ " : "✕ "}
                  {job.name}
                  {job.message ? ` · ${job.message}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
          {pending ? <p className="mt-3 text-xs text-taupe">…</p> : null}
          {checklist?.length && labels.checklistTitle ? (
            <div className="mt-10">
              <h3 className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{labels.checklistTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-cream/70">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-champagne/70">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
