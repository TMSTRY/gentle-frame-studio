import { runBackupAction } from "@/app/admin/documents/actions";
import { ghostButtonClass } from "@/components/portal/ui";

interface BackupFile {
  name: string;
  size: number;
  created: string;
}

/** Lists the snapshots in the bucket and offers a manual run. */
export default function BackupPanel({ files }: { files: BackupFile[] }) {
  return (
    <section className="mt-20">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-eyebrow">Backups</h2>
        <form action={runBackupAction}>
          <button type="submit" className={ghostButtonClass}>
            Back up now
          </button>
        </form>
      </div>
      <p className="max-w-xl text-sm leading-relaxed text-taupe">
        Every Monday the nightly job writes a full snapshot (clients, projects, documents, payments, signatures) to the
        private storage bucket. The last twelve are kept. Download one now and then to keep a copy outside Supabase.
      </p>
      {files.length ? (
        <ul className="mt-6">
          {files.map((file) => (
            <li key={file.name} className="grid gap-2 border-t border-line py-3 text-sm md:grid-cols-[1fr_120px_160px_auto]">
              <span className="font-mono text-[0.8rem] text-cream/80">{file.name}</span>
              <span className="text-taupe">{Math.round(file.size / 1024)} KB</span>
              <span className="text-taupe">{new Date(file.created).toLocaleString("en-GB", { timeZone: "Europe/Brussels" })}</span>
              <a href={`/admin/settings/backup/${encodeURIComponent(file.name)}`} className="text-[0.62rem] tracking-[0.26em] text-champagne/80 uppercase hover:text-champagne">
                Download
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 border-t border-line pt-4 text-sm text-taupe">No backups yet.</p>
      )}
    </section>
  );
}
