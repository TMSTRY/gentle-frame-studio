import type { Metadata } from "next";
import Link from "next/link";

// Private zone: always rendered per request, never at build time.
export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { buttonClass, EmptyRow, ghostButtonClass, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, SERVICE_LABEL, formatDate, formatMoney } from "@/lib/portal/labels";
import { loadStats } from "@/lib/portal/stats";
import type { Project } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Studio admin", robots: { index: false, follow: false } };

type RecentProject = Pick<Project, "id" | "title" | "service" | "status" | "updated_at"> & {
  clients: { name: string } | null;
};

export default async function AdminHome() {
  const { user } = await requireAdmin();
  const admin = createAdminClient();

  const [clientsRes, projectsRes, documentsRes, recentRes, stats] = await Promise.all([
    admin.from("clients").select("*", { count: "exact", head: true }).is("deleted_at", null),
    admin.from("projects").select("*", { count: "exact", head: true }).not("status", "in", "(closed,cancelled)").is("deleted_at", null),
    admin.from("documents").select("*", { count: "exact", head: true }).in("status", ["sent", "accepted", "overdue"]).is("deleted_at", null),
    admin
      .from("projects")
      .select("id, title, service, status, updated_at, clients(name)")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    loadStats(admin),
  ]);

  const tiles = [
    { label: "Clients", value: clientsRes.count ?? 0, href: "/admin/clients" },
    { label: "Open projects", value: projectsRes.count ?? 0, href: "/admin/projects" },
    { label: "Documents awaiting action", value: documentsRes.count ?? 0, href: "/admin/documents" },
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

      <section className="mt-16">
        <h2 className="text-eyebrow mb-6">Money</h2>
        <div className="grid gap-px border border-line bg-line md:grid-cols-4">
          <Link href="/admin/documents" className="bg-ink p-8 transition-colors hover:bg-ink-soft">
            <p className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">Outstanding</p>
            <p className="font-display tabular mt-4 text-4xl font-medium text-cream">{formatMoney(stats.outstandingCents)}</p>
            <p className="mt-2 text-xs text-taupe">{stats.outstandingCount} invoice{stats.outstandingCount === 1 ? "" : "s"} sent, not yet paid</p>
          </Link>
          <Link href="/admin/documents" className={`bg-ink p-8 transition-colors hover:bg-ink-soft ${stats.overdueCount ? "" : "opacity-70"}`}>
            <p className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">Overdue</p>
            <p className={`font-display tabular mt-4 text-4xl font-medium ${stats.overdueCount ? "text-gold" : "text-cream"}`}>{formatMoney(stats.overdueCents)}</p>
            <p className="mt-2 text-xs text-taupe">{stats.overdueCount} past due date</p>
          </Link>
          <div className="bg-ink p-8">
            <p className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">Paid in {stats.year}</p>
            <p className="font-display tabular mt-4 text-4xl font-medium text-cream">{formatMoney(stats.paidYearCents)}</p>
            <p className="mt-2 text-xs text-taupe">{stats.paidYearCount} payment{stats.paidYearCount === 1 ? "" : "s"}</p>
          </div>
          <Link href="/admin/documents" className="bg-ink p-8 transition-colors hover:bg-ink-soft">
            <p className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">Quoted, open</p>
            <p className="font-display tabular mt-4 text-4xl font-medium text-cream">{formatMoney(stats.quotedOpenCents)}</p>
            <p className="mt-2 text-xs text-taupe">
              {stats.quotedOpenCount} quote{stats.quotedOpenCount === 1 ? "" : "s"} sent or accepted
              {stats.expiredQuotes ? ` · ${stats.expiredQuotes} expired` : ""}
            </p>
          </Link>
        </div>
        {stats.unsignedContracts ? (
          <p className="mt-4 text-xs text-taupe">
            {stats.unsignedContracts} contract{stats.unsignedContracts === 1 ? "" : "s"} waiting for a signature.
          </p>
        ) : null}
      </section>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <section>
          <h2 className="text-eyebrow mb-6">Revenue by service · {stats.year}</h2>
          {stats.byService.length ? (
            <ul>
              {stats.byService.map((row) => {
                const share = stats.paidYearCents ? Math.round((row.cents / stats.paidYearCents) * 100) : 0;
                return (
                  <li key={row.service} className="border-t border-line py-4">
                    <div className="flex items-baseline justify-between gap-6 text-sm">
                      <span className="text-cream/85">{row.label}</span>
                      <span className="tabular text-cream/80">{formatMoney(row.cents)} <span className="text-taupe">· {share}%</span></span>
                    </div>
                    <div className="mt-2 h-px w-full bg-line">
                      <div className="h-px bg-champagne/70" style={{ width: `${share}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyRow>No payments booked this year yet.</EmptyRow>
          )}
        </section>
        <section>
          <h2 className="text-eyebrow mb-6">Invited, never signed in</h2>
          {stats.neverSignedIn.length ? (
            <ul>
              {stats.neverSignedIn.map((client) => (
                <li key={client.id} className="border-t border-line">
                  <Link href={`/admin/clients/${client.id}`} className="flex items-baseline justify-between gap-6 py-4 text-sm">
                    <span className="text-cream/85">{client.name}</span>
                    <span className="text-taupe">{client.email}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow>Everyone you invited has signed in.</EmptyRow>
          )}
        </section>
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
          <EmptyRow>No projects yet, start with a client, then a project.</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
