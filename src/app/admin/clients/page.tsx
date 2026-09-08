import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { buttonClass, EmptyRow, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Clients", robots: { index: false, follow: false } };

interface ClientRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  language: string;
  user_id: string | null;
  projects: { count: number }[];
}

export default async function ClientsPage() {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("clients")
    .select("id, name, email, company, language, user_id, projects(count)")
    .order("name");
  const clients = (data ?? []) as unknown as ClientRow[];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <PageHeader
        eyebrow={`Clients — ${clients.length}`}
        title="Who we work for."
        aside={
          <Link href="/admin/clients/new" className={buttonClass}>
            New client
          </Link>
        }
      />
      <div className="mt-16">
        {clients.length ? (
          <ul>
            {clients.map((client) => (
              <li key={client.id} className="border-t border-line">
                <Link href={`/admin/clients/${client.id}`} className="grid gap-2 py-6 md:grid-cols-[1fr_1fr_120px_120px_120px]">
                  <span className="font-display text-xl text-cream">
                    {client.name}
                    {client.company ? <span className="ml-3 text-sm text-taupe">{client.company}</span> : null}
                  </span>
                  <span className="text-sm text-taupe">{client.email}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{client.language}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">
                    {client.projects?.[0]?.count ?? 0} project{(client.projects?.[0]?.count ?? 0) === 1 ? "" : "s"}
                  </span>
                  <span className={`text-[0.66rem] tracking-[0.26em] uppercase ${client.user_id ? "text-champagne" : "text-taupe/60"}`}>
                    {client.user_id ? "Signed in" : "Not invited"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>No clients yet.</EmptyRow>
        )}
      </div>
    </PortalShell>
  );
}
