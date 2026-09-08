import type { Metadata } from "next";
import Link from "next/link";

// Private zone: always rendered per request, never at build time.
export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { EmptyRow, StatusBadge } from "@/components/portal/ui";
import { requireUser } from "@/lib/portal/guard";
import { SERVICE_LABEL } from "@/lib/portal/labels";
import type { Project } from "@/lib/portal/types";
import { adminEmail } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Your portal", robots: { index: false, follow: false } };

export default async function PortalHome() {
  const { supabase, user } = await requireUser();

  const [{ data: client }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("id, name, language").limit(1).maybeSingle(),
    supabase.from("projects").select("id, title, status, service, updated_at").order("updated_at", { ascending: false }),
  ]);
  const rows = (projects ?? []) as Pick<Project, "id" | "title" | "status" | "service" | "updated_at">[];
  const isAdmin = Boolean(user.email && user.email.toLowerCase() === adminEmail());

  return (
    <PortalShell zone="Client portal" email={user.email} links={isAdmin ? [{ href: "/admin", label: "Studio admin" }] : []}>
      <p className="text-eyebrow mb-6">Your portal</p>
      <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">
        {client ? `Hello, ${client.name.split(" ")[0]}.` : "Hello."}
      </h1>

      {!client ? (
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-taupe">
          Your address isn’t linked to a project yet. If you’re expecting one, the studio will connect it
          shortly — or write to hello@gentleframestudio.com.
        </p>
      ) : null}

      <section className="mt-16">
        <h2 className="text-eyebrow mb-6">Projects</h2>
        {rows.length ? (
          <ul>
            {rows.map((project) => (
              <li key={project.id} className="border-t border-line">
                <Link href={`/portal/projects/${project.id}`} className="grid gap-2 py-6 md:grid-cols-[1fr_220px_180px]">
                  <span className="font-display text-xl text-cream">{project.title}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{SERVICE_LABEL[project.service]}</span>
                  <StatusBadge status={project.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>Nothing here yet.</EmptyRow>
        )}
      </section>
    </PortalShell>
  );
}
