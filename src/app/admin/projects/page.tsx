import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { buttonClass, EmptyRow, Notice, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, SERVICE_LABEL, formatDate } from "@/lib/portal/labels";
import type { Project } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };

type Row = Pick<Project, "id" | "title" | "service" | "status" | "due_date" | "updated_at"> & {
  clients: { name: string } | null;
};

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ trashed?: string }> }) {
  const { user } = await requireAdmin();
  const flags = await searchParams;
  const admin = createAdminClient();
  const { data } = await admin
    .from("projects")
    .select("id, title, service, status, due_date, updated_at, clients(name)")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];
  const open = rows.filter((row) => !["closed", "cancelled"].includes(row.status));
  const archived = rows.filter((row) => ["closed", "cancelled"].includes(row.status));

  const list = (items: Row[]) => (
    <ul>
      {items.map((project) => (
        <li key={project.id} className="border-t border-line">
          <Link href={`/admin/projects/${project.id}`} className="grid gap-2 py-6 md:grid-cols-[1fr_200px_160px_140px]">
            <span className="font-display text-xl text-cream">
              {project.title}
              <span className="ml-3 text-sm text-taupe">{project.clients?.name}</span>
            </span>
            <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{SERVICE_LABEL[project.service]}</span>
            <StatusBadge status={project.status} />
            <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">Due {formatDate(project.due_date)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <PageHeader
        eyebrow={`Projects · ${open.length} open`}
        title="What’s in the frame."
        aside={
          <Link href="/admin/projects/new" className={buttonClass}>
            New project
          </Link>
        }
      />
      {flags.trashed ? <Notice tone="warm">Moved to the trash. Restore it from Trash if that was a slip.</Notice> : null}
      <div className="mt-16">{open.length ? list(open) : <EmptyRow>No open projects.</EmptyRow>}</div>
      {archived.length ? (
        <section className="mt-20">
          <h2 className="text-eyebrow mb-6">Closed &amp; cancelled</h2>
          <div className="opacity-70">{list(archived)}</div>
        </section>
      ) : null}
    </PortalShell>
  );
}
