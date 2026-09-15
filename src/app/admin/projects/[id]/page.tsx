import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { addProjectUpdateAction, deleteProjectUpdateAction } from "@/app/admin/actions";
import FileVault from "@/components/portal/FileVault";
import PortalShell from "@/components/portal/PortalShell";
import ReviewPanel from "@/components/portal/ReviewPanel";
import { createCutAction, deleteCutAction } from "@/app/portal/review/actions";
import TrashButton from "@/components/portal/TrashButton";
import ProjectForm from "@/components/portal/ProjectForm";
import { BackLink, buttonClass, EmptyRow, Field, ghostButtonClass, inputClass, Notice, PageHeader, StatusTrack } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { listProjectFiles } from "@/lib/portal/files";
import { loadReview } from "@/lib/portal/review";
import { ADMIN_LINKS, DOC_STATUS_LABEL, KIND_LABEL, SERVICE_LABEL, STATUS_LABEL, formatMoney } from "@/lib/portal/labels";
import type { DocumentRecord, Project, ProjectUpdate } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Project", robots: { index: false, follow: false } };

const formatMoment = (value: string) =>
  new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; cut?: string }>;
}) {
  const { user } = await requireAdmin();
  const { id } = await params;
  const flags = await searchParams;
  const admin = createAdminClient();

  const [{ data: project }, { data: updates }, { data: clients }, { data: docs }, files] = await Promise.all([
    admin.from("projects").select("*, clients(id, name, email)").eq("id", id).maybeSingle(),
    admin.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    admin.from("clients").select("id, name, company").is("deleted_at", null).order("name"),
    admin.from("documents").select("id, kind, number, title, status, total_cents, currency").eq("project_id", id).is("deleted_at", null).order("created_at", { ascending: false }),
    listProjectFiles(admin, id),
  ]);
  const review = await loadReview(admin, admin, id);
  const currentCut = review.cuts.find((c) => c.id === flags.cut) ?? review.cuts[0] ?? null;
  const videoFiles = files.filter((f) => f.uploaded_by === "studio" && (f.mime?.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(f.name)));
  const documents = (docs ?? []) as Pick<DocumentRecord, "id" | "kind" | "number" | "title" | "status" | "total_cents" | "currency">[];
  if (!project) notFound();
  const typed = project as Project & { clients: { id: string; name: string; email: string } | null };
  const timeline = (updates ?? []) as ProjectUpdate[];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/projects" label="Projects" />
      <div className="mt-8">
        <PageHeader
          eyebrow={`${SERVICE_LABEL[typed.service]} · ${STATUS_LABEL[typed.status]}`}
          title={typed.title}
          aside={
            <>
              {typed.clients ? (
                <Link href={`/admin/clients/${typed.clients.id}`} className={ghostButtonClass}>
                  {typed.clients.name}
                </Link>
              ) : null}
              {typed.deleted_at ? (
                <TrashButton kind="project" id={typed.id} mode="restore" label="Restore from trash" />
              ) : (
                <TrashButton kind="project" id={typed.id} mode="trash" label="Move to trash" confirmText={`Move "${typed.title}" to the trash? Its documents go along. You can restore it from Trash.`} />
              )}
            </>
          }
        />
      </div>

      {flags.error ? (
        <Notice tone="alert">
          {flags.error === "invalid"
            ? "A title and a message need at least two characters."
            : flags.error === "cut"
              ? "Pick a video from the vault or paste an https link."
              : flags.error === "migration"
                ? "Run the missing migration in Supabase first (004 files, 005 review)."
                : "Saving failed. Please try again."}
        </Notice>
      ) : null}
      {flags.saved ? <Notice tone="warm">Saved.</Notice> : null}
      {typed.deleted_at ? <Notice tone="alert">This project is in the trash and invisible to the client.</Notice> : null}

      <div className="mt-12">
        <StatusTrack status={typed.status} />
      </div>

      <section id="timeline" className="mt-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="text-eyebrow mb-6">Add an update</h2>
          <form action={addProjectUpdateAction} className="space-y-6">
            <input type="hidden" name="project_id" value={typed.id} />
            <Field label="Message" htmlFor="message">
              <textarea id="message" name="message" required minLength={2} rows={3} placeholder="First cut is ready for you to watch…" className={`${inputClass} resize-none leading-relaxed`} />
            </Field>
            <label className="flex items-center gap-3 text-sm text-taupe">
              <input type="checkbox" name="visible_to_client" defaultChecked className="h-4 w-4 accent-[#e6d5b3]" />
              Visible to the client in the portal
            </label>
            <button type="submit" className={buttonClass}>
              Post update
            </button>
          </form>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="text-eyebrow mb-6">Timeline</h2>
          {timeline.length ? (
            <ul>
              {timeline.map((update) => (
                <li key={update.id} className="border-t border-line py-5">
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">
                      {formatMoment(update.created_at)} · {update.visible_to_client ? "client sees this" : "internal"}
                    </span>
                    <form action={deleteProjectUpdateAction}>
                      <input type="hidden" name="id" value={update.id} />
                      <input type="hidden" name="project_id" value={typed.id} />
                      <button type="submit" className="text-[0.62rem] tracking-[0.26em] text-taupe/70 uppercase hover:text-gold">
                        Remove
                      </button>
                    </form>
                  </div>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/85">{update.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow>No updates yet. The first one usually says “we’ve started”.</EmptyRow>
          )}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-eyebrow mb-8">Details &amp; status</h2>
        <ProjectForm project={typed} clients={clients ?? []} />
      </section>

      <section id="review" className="mt-20">
        <h2 className="text-eyebrow mb-4">Review</h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-taupe">
          Publish a cut for the client to watch and annotate. Upload the video under Files first (as the studio), then pick it here, or paste a YouTube, Vimeo or direct video link. Publishing moves the project to “In review”. Needs migration 005.
        </p>
        <form action={createCutAction} className="grid max-w-3xl gap-6 border-t border-line pt-6 md:grid-cols-2">
          <input type="hidden" name="project_id" value={typed.id} />
          <Field label="Video from the vault" htmlFor="file_id">
            <select id="file_id" name="file_id" defaultValue="" className={`${inputClass} cursor-pointer appearance-none bg-ink`}>
              <option value="" className="bg-ink text-cream">
                None, I’ll paste a link
              </option>
              {videoFiles.map((file) => (
                <option key={file.id} value={file.id} className="bg-ink text-cream">
                  {file.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Or a link (YouTube, Vimeo, mp4)" htmlFor="external_url">
            <input id="external_url" name="external_url" type="url" placeholder="https://…" className={inputClass} />
          </Field>
          <div className="md:col-span-2">
            <Field label="A word for the client (optional)" htmlFor="cut_note">
              <textarea id="cut_note" name="note" rows={2} placeholder="Here is the first cut. The middle part is still rough; the ending is where I’d love your eye." className={`${inputClass} resize-none leading-relaxed`} />
            </Field>
          </div>
          <label className="flex items-center gap-3 text-sm text-taupe">
            <input type="checkbox" name="notify" defaultChecked className="h-4 w-4 accent-[#e6d5b3]" />
            Mail the client that a cut is ready
          </label>
          <div className="md:text-right">
            <button type="submit" className={buttonClass}>
              Publish cut {review.cuts.length + 1}
            </button>
          </div>
        </form>

        {currentCut ? (
          <div className="mt-12">
            <ReviewPanel
              cut={currentCut}
              source={review.sources.get(currentCut.id) ?? null}
              notes={review.notes.filter((n) => n.cut_id === currentCut.id)}
              mode="studio"
              lang="en"
              labels={{
                version: "Cut",
                noteAt: "At",
                general: "General",
                useMoment: "Use this moment",
                placeholder: "Reply to the client, or leave a note of your own…",
                send: "Add note",
                sending: "Saving…",
                resolved: "Done",
                resolve: "Mark done",
                reopen: "Reopen",
                remove: "Remove",
                noNotes: "No notes from the client yet.",
                openLink: "Open the film",
                timecodeHint: "Type the moment as minutes:seconds, or leave empty.",
                studio: "Studio",
              }}
            />
            <div className="mt-6 flex flex-wrap items-center gap-6 text-[0.66rem] tracking-[0.26em] uppercase">
              {review.cuts.length > 1 ? (
                <span className="text-taupe">
                  Cuts:
                  {review.cuts.map((c) => (
                    <Link key={c.id} href={`/admin/projects/${id}?cut=${c.id}#review`} className={`link-line ml-3 ${c.id === currentCut.id ? "text-champagne" : "text-cream/70"}`}>
                      {c.version}
                    </Link>
                  ))}
                </span>
              ) : null}
              <form action={deleteCutAction}>
                <input type="hidden" name="id" value={currentCut.id} />
                <input type="hidden" name="project_id" value={typed.id} />
                <button type="submit" className="text-taupe/70 hover:text-gold">
                  Hide cut {currentCut.version} from the client
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-20">
        <h2 className="text-eyebrow mb-4">Files</h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-taupe">
          What the client shared and what you deliver. Files you add here appear in the client’s portal under “From the studio”. Needs migration 004.
        </p>
        <FileVault
          projectId={typed.id}
          files={files}
          mode="studio"
          lang="en"
          labels={{
            fromStudio: "From the studio",
            fromClient: "From the client",
            empty: "Nothing here yet.",
            drop: "Drop cuts, finals or anything for the client here.",
            choose: "Choose files",
            uploading: "Uploading…",
            tooLarge: "too large for one upload (Supabase file limit)",
            failed: "upload failed",
            remove: "Remove",
            download: "Download",
            notify: "Mail the client that a new file is ready",
          }}
        />
      </section>

      <section className="mt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-eyebrow">Documents</h2>
          <div className="flex gap-6">
            {(["quote", "invoice", "contract"] as const).map((kind) => (
              <Link key={kind} href={`/admin/documents/new?client=${typed.client_id}&project=${typed.id}&kind=${kind}`} className={ghostButtonClass}>
                New {kind}
              </Link>
            ))}
          </div>
        </div>
        {documents.length ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="border-t border-line">
                <Link href={`/admin/documents/${doc.id}`} className="grid gap-2 py-4 md:grid-cols-[130px_1fr_140px_120px]">
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{KIND_LABEL[doc.kind]} {doc.number ?? ""}</span>
                  <span className="font-display text-lg text-cream">{doc.title}</span>
                  <span className="text-sm text-cream/80">{doc.kind === "quote" || doc.kind === "invoice" ? formatMoney(doc.total_cents, doc.currency) : "·"}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">{DOC_STATUS_LABEL[doc.status]}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>No documents for this project yet.</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
