import type { Metadata } from "next";
import Link from "next/link";

// Private zone: always rendered per request, never at build time.
export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { EmptyRow, StatusBadge } from "@/components/portal/ui";
import { requireUser } from "@/lib/portal/guard";
import { docStatusLabel, kindLabel, portalLang, serviceLabel, ui } from "@/lib/portal/i18n";
import { formatMoney } from "@/lib/portal/labels";
import type { DocumentRecord, Project } from "@/lib/portal/types";
import { adminEmail } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Your portal", robots: { index: false, follow: false } };

export default async function PortalHome() {
  const { supabase, user } = await requireUser();

  const [{ data: client }, { data: projects }, { data: docs }] = await Promise.all([
    supabase.from("clients").select("id, name, language").limit(1).maybeSingle(),
    supabase.from("projects").select("id, title, status, service, updated_at").order("updated_at", { ascending: false }),
    supabase.from("documents").select("id, kind, number, title, status, total_cents, currency").order("created_at", { ascending: false }),
  ]);
  const lang = client?.language === "nl" ? "nl" : "en";
  const t = ui(lang);
  const documents = (docs ?? []) as Pick<DocumentRecord, "id" | "kind" | "number" | "title" | "status" | "total_cents" | "currency">[];
  const rows = (projects ?? []) as Pick<Project, "id" | "title" | "status" | "service" | "updated_at">[];
  const isAdmin = Boolean(user.email && user.email.toLowerCase() === adminEmail());

  return (
    <PortalShell zone={t.zone} email={user.email} signOutLabel={t.signOut} links={isAdmin ? [{ href: "/admin", label: t.studioAdmin }] : []}>
      <p className="text-eyebrow mb-6">{t.yourPortal}</p>
      <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">
        {t.hello(client ? client.name.split(" ")[0] : null)}
      </h1>

      {!client ? <p className="mt-8 max-w-lg text-sm leading-relaxed text-taupe">{t.notLinked}</p> : null}

      <section className="mt-16">
        <h2 className="text-eyebrow mb-6">{t.projects}</h2>
        {rows.length ? (
          <ul>
            {rows.map((project) => (
              <li key={project.id} className="border-t border-line">
                <Link href={`/portal/projects/${project.id}`} className="grid gap-2 py-6 md:grid-cols-[1fr_220px_180px]">
                  <span className="font-display text-xl text-cream">{project.title}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{serviceLabel(lang, project.service)}</span>
                  <StatusBadge status={project.status} lang={lang} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>{t.nothingYet}</EmptyRow>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-eyebrow mb-6">{t.documents}</h2>
        {documents.length ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="border-t border-line">
                <Link href={`/portal/documents/${doc.id}`} className="grid gap-2 py-5 md:grid-cols-[130px_1fr_140px_120px]">
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{kindLabel(lang, doc.kind)} {doc.number ?? ""}</span>
                  <span className="font-display text-lg text-cream">{doc.title}</span>
                  <span className="text-sm text-cream/80">{doc.kind === "quote" || doc.kind === "invoice" ? formatMoney(doc.total_cents, doc.currency) : "·"}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">{docStatusLabel(lang, doc.status)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>{t.noDocuments}</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
