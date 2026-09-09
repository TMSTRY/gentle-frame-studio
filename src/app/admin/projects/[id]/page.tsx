import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { addProjectUpdateAction, deleteProjectUpdateAction } from "@/app/admin/actions";
import PortalShell from "@/components/portal/PortalShell";
import ProjectForm from "@/components/portal/ProjectForm";
import { BackLink, buttonClass, EmptyRow, Field, ghostButtonClass, inputClass, Notice, PageHeader, StatusTrack } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
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
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { user } = await requireAdmin();
  const { id } = await params;
  const flags = await searchParams;
  const admin = createAdminClient();

  const [{ data: project }, { data: updates }, { data: clients }, { data: docs }] = await Promise.all([
    admin.from("projects").select("*, clients(id, name, email)").eq("id", id).maybeSingle(),
    admin.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    admin.from("clients").select("id, name, company").order("name"),
    admin.from("documents").select("id, kind, number, title, status, total_cents, currency").eq("project_id", id).order("created_at", { ascending: false }),
  ]);
  const documents = (docs ?? []) as Pick<DocumentRecord, "id" | "kind" | "number" | "title" | "status" | "total_cents" | "currency">[];
  if (!project) notFound();
  const typed = project as Project & { clients: { id: string; name: string; email: string } | null };
  const timeline = (updates ?? []) as ProjectUpdate[];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/projects" label="Projects" />
      <div className="mt-8">
        <PageHeader
          eyebrow={`${SERVICE_LABEL[typed.service]} — ${STATUS_LABEL[typed.status]}`}
          title={typed.title}
          aside={
            typed.clients ? (
              <Link href={`/admin/clients/${typed.clients.id}`} className={ghostButtonClass}>
                {typed.clients.name}
              </Link>
            ) : null
          }
        />
      </div>

      {flags.error ? <Notice tone="alert">{flags.error === "invalid" ? "A title and a message need at least two characters." : "Saving failed. Please try again."}</Notice> : null}
      {flags.saved ? <Notice tone="warm">Saved.</Notice> : null}

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
                  <span className="text-sm text-cream/80">{doc.kind === "quote" || doc.kind === "invoice" ? formatMoney(doc.total_cents, doc.currency) : "—"}</span>
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
