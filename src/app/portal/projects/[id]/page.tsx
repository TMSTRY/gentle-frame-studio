import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { BackLink, EmptyRow, PageHeader, StatusTrack } from "@/components/portal/ui";
import { requireUser } from "@/lib/portal/guard";
import { docStatusLabel, formatDateFor, kindLabel, portalLang, serviceLabel, statusLabel, ui } from "@/lib/portal/i18n";
import { formatMoney } from "@/lib/portal/labels";
import type { DocumentRecord, Project, ProjectUpdate } from "@/lib/portal/types";
import { adminEmail } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Your project", robots: { index: false, follow: false } };

export default async function PortalProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  // Runs as the signed-in client: RLS returns nothing for projects that aren't theirs.
  const [lang, { data: project }, { data: updates }, { data: docs }] = await Promise.all([
    portalLang(supabase),
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("id, kind, number, title, status, total_cents, currency").eq("project_id", id).order("created_at", { ascending: false }),
  ]);
  const t = ui(lang);
  const documents = (docs ?? []) as Pick<DocumentRecord, "id" | "kind" | "number" | "title" | "status" | "total_cents" | "currency">[];
  if (!project) notFound();
  const typed = project as Project;
  const timeline = (updates ?? []) as ProjectUpdate[];
  const isAdmin = Boolean(user.email && user.email.toLowerCase() === adminEmail());

  return (
    <PortalShell zone={t.zone} email={user.email} signOutLabel={t.signOut} links={isAdmin ? [{ href: `/admin/projects/${id}`, label: t.openInAdmin }] : []}>
      <BackLink href="/portal" label={t.yourPortal} />
      <div className="mt-8">
        <PageHeader eyebrow={`${serviceLabel(lang, typed.service)} · ${statusLabel(lang, typed.status)}`} title={typed.title} />
      </div>

      <div className="mt-12">
        <StatusTrack status={typed.status} lang={lang} ariaLabel={t.progress} />
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          {typed.description ? (
            <>
              <h2 className="text-eyebrow mb-6">{t.aboutProject}</h2>
              <p className="text-[0.95rem] leading-[1.9] font-light text-cream/75">{typed.description}</p>
            </>
          ) : null}
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{t.started}</dt>
              <dd className="mt-2 text-sm text-cream/80">{formatDateFor(lang, typed.start_date)}</dd>
            </div>
            <div>
              <dt className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{t.expected}</dt>
              <dd className="mt-2 text-sm text-cream/80">{formatDateFor(lang, typed.due_date)}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="text-eyebrow mb-6">{t.updates}</h2>
          {timeline.length ? (
            <ul>
              {timeline.map((update) => (
                <li key={update.id} className="border-t border-line py-5">
                  <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{formatDateFor(lang, update.created_at)}</span>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/85">{update.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow>{t.noUpdates}</EmptyRow>
          )}
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-eyebrow mb-6">{t.documents}</h2>
        {documents.length ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="border-t border-line">
                <Link href={`/portal/documents/${doc.id}`} className="grid gap-2 py-4 md:grid-cols-[130px_1fr_140px_120px]">
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{kindLabel(lang, doc.kind)} {doc.number ?? ""}</span>
                  <span className="font-display text-lg text-cream">{doc.title}</span>
                  <span className="text-sm text-cream/80">{doc.kind === "quote" || doc.kind === "invoice" ? formatMoney(doc.total_cents, doc.currency) : "·"}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">{docStatusLabel(lang, doc.status)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>{t.docsAppear}</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
