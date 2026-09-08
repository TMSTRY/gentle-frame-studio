import type { Metadata } from "next";
import Link from "next/link";

// Private zone: always rendered per request, never at build time.
export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { buttonClass, EmptyRow, ghostButtonClass, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, SERVICE_LABEL, formatDate } from "@/lib/portal/labels";
import type { Project } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Studio admin", robots: { index: false, follow: false } };

type RecentProject = Pick<Project, "id" | "title" | "service" | "status" | "updated_at"> & {
  clients: { name: string } | null;
};

export default async function AdminHome() {
  const { user } = await requireAdmin();
  const admin = createAdminClient();

  const [clientsRes, projectsRes, documentsRes, recentRes] = await Promise.all([
    admin.from("clients").select("*", { count: "exact", head: true }),
    admin.from("projects").select("*", { count: "exact", head: true }).not("status", "in", "(closed,cancelled)"),
    admin.from("documents").select("*", { count: "exact", head: true }).in("status", ["sent", "accepted", "overdue"]),
    admin
      .from("projects")
      .select("id, title, service, status, updated_at, clients(name)")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const tiles = [
    { label: "Clients", value: clientsRes.count ?? 0, href: "/admin/clients" },
    { label: "Open projects", value: projectsRes.count ?? 0, href: "/admin/projects" },
    { label: "Documents awaiting action", value: documentsRes.count ?? 0, href: "/admin/projects" },
  ];
  const recent = (recentRes.data ?? []) as unknown as RecentProject[];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={[...ADMIN_LINKS, { href: "/portal", label: "Portal view" }]}>
      <PageHeader
        eyebrow="Studio admin"
        title="The studio at a glance."
        aside={
          <>
            <Link href="/admin/clients/new" className={ghostButtonClass}>
              New client
            </Link>
            <Link href="/admin/projects/new" className={buttonClass}>
              New project
            </Link>
          </>
        }
      />

      <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="bg-ink p-8 transition-colors hover:bg-ink-soft">
            <p className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">{tile.label}</p>
            <p className="font-display tabular mt-4 text-5xl font-medium text-cream">{tile.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="text-eyebrow mb-6">Recently touched</h2>
        {recent.length ? (
          <ul>
            {recent.map((project) => (
              <li key={project.id} className="border-t border-line">
                <Link href={`/admin/projects/${project.id}`} className="grid gap-2 py-6 transition-colors hover:text-cream md:grid-cols-[1fr_200px_180px_140px]">
                  <span className="font-display text-xl text-cream">
                    {project.title}
                    <span className="ml-3 text-sm text-taupe">{project.clients?.name}</span>
                  </span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{SERVICE_LABEL[project.service]}</span>
                  <StatusBadge status={project.status} />
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{formatDate(project.updated_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>No projects yet — start with a client, then a project.</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
