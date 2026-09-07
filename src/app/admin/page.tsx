import type { Metadata } from "next";

// Private zone: always rendered per request, never at build time.
export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false },
};

export default async function AdminHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const [clientsRes, projectsRes, documentsRes] = await Promise.all([
    admin.from("clients").select("*", { count: "exact", head: true }),
    admin.from("projects").select("*", { count: "exact", head: true }).not("status", "in", "(closed,cancelled)"),
    admin.from("documents").select("*", { count: "exact", head: true }).in("status", ["sent", "accepted", "overdue"]),
  ]);
  const clients = clientsRes.count ?? 0;
  const openProjects = projectsRes.count ?? 0;
  const openDocuments = documentsRes.count ?? 0;

  const tiles = [
    { label: "Clients", value: clients },
    { label: "Open projects", value: openProjects },
    { label: "Documents awaiting action", value: openDocuments },
  ];

  return (
    <PortalShell zone="Studio admin" email={user?.email} links={[{ href: "/portal", label: "Portal view" }]}>
      <p className="text-eyebrow mb-6">Studio admin</p>
      <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">
        The studio at a glance.
      </h1>
      <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-ink p-8">
            <p className="text-[0.62rem] tracking-[0.28em] text-taupe uppercase">{tile.label}</p>
            <p className="font-display tabular mt-4 text-5xl font-medium text-cream">{tile.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-sm text-taupe">
        Client, project and document management arrives in the next build. The foundation — sign-in,
        roles and the database — is live.
      </p>
    </PortalShell>
  );
}
