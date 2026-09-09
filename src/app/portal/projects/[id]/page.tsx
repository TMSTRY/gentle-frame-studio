import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { BackLink, EmptyRow, PageHeader, StatusTrack } from "@/components/portal/ui";
import { requireUser } from "@/lib/portal/guard";
import { DOC_STATUS_LABEL, KIND_LABEL, SERVICE_LABEL, STATUS_LABEL, formatDate, formatMoney } from "@/lib/portal/labels";
import type { DocumentRecord, Project, ProjectUpdate } from "@/lib/portal/types";
import { adminEmail } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Your project", robots: { index: false, follow: false } };

export default async function PortalProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  // Runs as the signed-in client: RLS returns nothing for projects that aren't theirs.
  const [{ data: project }, { data: updates }, { data: docs }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("id, kind, number, title, status, total_cents, currency").eq("project_id", id).order("created_at", { ascending: false }),
  ]);
  const documents = (docs ?? []) as Pick<DocumentRecord, "id" | "kind" | "number" | "title" | "status" | "total_cents" | "currency">[];
  if (!project) notFound();
  const typed = project as Project;
  const timeline = (updates ?? []) as ProjectUpdate[];
  const isAdmin = Boolean(user.email && user.email.toLowerCase() === adminEmail());

  return (
    <PortalShell zone="Client portal" email={user.email} links={isAdmin ? [{ href: `/admin/projects/${id}`, label: "Open in admin" }] : []}>
      <BackLink href="/portal" label="Your portal" />
      <div className="mt-8">
        <PageHeader eyebrow={`${SERVICE_LABEL[typed.service]} — ${STATUS_LABEL[typed.status]}`} title={typed.title} />
      </div>

      <div className="mt-12">
        <StatusTrack status={typed.status} />
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          {typed.description ? (
            <>
              <h2 className="text-eyebrow mb-6">About this project</h2>
              <p className="text-[0.95rem] leading-[1.9] font-light text-cream/75">{typed.description}</p>
            </>
          ) : null}
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Started</dt>
              <dd className="mt-2 text-sm text-cream/80">{formatDate(typed.start_date)}</dd>
            </div>
            <div>
              <dt className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Expected</dt>
              <dd className="mt-2 text-sm text-cream/80">{formatDate(typed.due_date)}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="text-eyebrow mb-6">Updates from the studio</h2>
          {timeline.length ? (
            <ul>
              {timeline.map((update) => (
                <li key={update.id} className="border-t border-line py-5">
                  <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{formatDate(update.created_at)}</span>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/85">{update.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow>Nothing yet — we’ll write here as the work moves.</EmptyRow>
          )}
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-eyebrow mb-6">Documents</h2>
        {documents.length ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="border-t border-line">
                <Link href={`/portal/documents/${doc.id}`} className="grid gap-2 py-4 md:grid-cols-[130px_1fr_140px_120px]">
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{KIND_LABEL[doc.kind]} {doc.number ?? ""}</span>
                  <span className="font-display text-lg text-cream">{doc.title}</span>
                  <span className="text-sm text-cream/80">{doc.kind === "quote" || doc.kind === "invoice" ? formatMoney(doc.total_cents, doc.currency) : "—"}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">{DOC_STATUS_LABEL[doc.status]}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>Quotes, invoices and contracts will appear here.</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
