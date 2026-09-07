import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import { createClient } from "@/lib/supabase/server";
import { adminEmail } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Your portal",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  inquiry: "Inquiry",
  quoted: "Quote sent",
  accepted: "Accepted",
  in_production: "In production",
  review: "In review",
  delivered: "Delivered",
  closed: "Closed",
  cancelled: "Cancelled",
};

export default async function PortalHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, language")
    .limit(1)
    .maybeSingle();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, service, updated_at")
    .order("updated_at", { ascending: false });

  const isAdmin = Boolean(user?.email && user.email.toLowerCase() === adminEmail());
  const links = isAdmin ? [{ href: "/admin", label: "Studio admin" }] : [];

  return (
    <PortalShell zone="Client portal" email={user?.email} links={links}>
      <p className="text-eyebrow mb-6">Your portal</p>
      <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">
        {client ? `Hello, ${client.name.split(" ")[0]}.` : "Hello."}
      </h1>

      {!client ? (
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-taupe">
          Your address isn’t linked to a project yet. If you’re expecting one, the studio will connect
          it shortly — or write to hello@gentleframestudio.com.
        </p>
      ) : null}

      <section className="mt-16">
        <h2 className="text-eyebrow mb-6">Projects</h2>
        {projects && projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="grid gap-2 border-t border-line py-6 md:grid-cols-[1fr_220px_180px]">
                <span className="font-display text-xl text-cream">{project.title}</span>
                <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">
                  {project.service.replace("_", " ")}
                </span>
                <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">
                  {STATUS_LABEL[project.status] ?? project.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-line pt-6 text-sm text-taupe">Nothing here yet.</p>
        )}
      </section>
    </PortalShell>
  );
}
