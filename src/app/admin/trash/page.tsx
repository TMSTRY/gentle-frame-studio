import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import TrashButton from "@/components/portal/TrashButton";
import { EmptyRow, Notice, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, KIND_LABEL, formatDate } from "@/lib/portal/labels";
import type { DocumentKind } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Trash", robots: { index: false, follow: false } };

interface Row {
  id: string;
  label: string;
  meta: string;
  deleted_at: string;
}

export default async function TrashPage({ searchParams }: { searchParams: Promise<{ purged?: string }> }) {
  const { user } = await requireAdmin();
  const flags = await searchParams;
  const admin = createAdminClient();
  const [clients, projects, documents] = await Promise.all([
    admin.from("clients").select("id, name, email, deleted_at").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
    admin.from("projects").select("id, title, deleted_at, clients(name)").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
    admin.from("documents").select("id, kind, number, title, deleted_at, clients(name)").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
  ]);

  const sections: { kind: "client" | "project" | "document"; title: string; rows: Row[] }[] = [
    {
      kind: "client",
      title: "Clients",
      rows: (clients.data ?? []).map((c) => ({ id: c.id, label: c.name, meta: c.email, deleted_at: c.deleted_at })),
    },
    {
      kind: "project",
      title: "Projects",
      rows: ((projects.data ?? []) as unknown as { id: string; title: string; deleted_at: string; clients: { name: string } | null }[]).map((p) => ({
        id: p.id,
        label: p.title,
        meta: p.clients?.name ?? "",
        deleted_at: p.deleted_at,
      })),
    },
    {
      kind: "document",
      title: "Documents",
      rows: ((documents.data ?? []) as unknown as { id: string; kind: DocumentKind; number: string | null; title: string; deleted_at: string; clients: { name: string } | null }[]).map((d) => ({
        id: d.id,
        label: `${KIND_LABEL[d.kind]} ${d.number ?? ""} ${d.title}`.replace(/\s+/g, " "),
        meta: d.clients?.name ?? "",
        deleted_at: d.deleted_at,
      })),
    },
  ];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <PageHeader eyebrow="Trash" title="Nothing is gone yet." />
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-taupe">
        Items stay here for 30 days, invisible to clients, then the nightly job removes them for good. Restore brings
        back whatever was trashed together with it.
      </p>
      {flags.purged ? <Notice tone="warm">Removed permanently.</Notice> : null}

      {sections.map((section) => (
        <section key={section.kind} className="mt-16">
          <h2 className="text-eyebrow mb-6">{section.title}</h2>
          {section.rows.length ? (
            <ul>
              {section.rows.map((row) => (
                <li key={row.id} className="grid gap-3 border-t border-line py-5 md:grid-cols-[1fr_200px_140px_auto_auto] md:items-center">
                  <span className="font-display text-lg text-cream">{row.label}</span>
                  <span className="text-sm text-taupe">{row.meta}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">Trashed {formatDate(row.deleted_at)}</span>
                  <TrashButton kind={section.kind} id={row.id} mode="restore" label="Restore" />
                  <TrashButton
                    kind={section.kind}
                    id={row.id}
                    mode="purge"
                    label="Delete permanently"
                    confirmText={`Permanently delete "${row.label}"? This cannot be undone.`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow>Empty.</EmptyRow>
          )}
        </section>
      ))}
    </PortalShell>
  );
}
