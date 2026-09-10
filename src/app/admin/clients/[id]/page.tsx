import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { inviteClientAction } from "@/app/admin/actions";
import ClientForm from "@/components/portal/ClientForm";
import PortalShell from "@/components/portal/PortalShell";
import TrashButton from "@/components/portal/TrashButton";
import { BackLink, buttonClass, EmptyRow, ghostButtonClass, Notice, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, SERVICE_LABEL, formatDate } from "@/lib/portal/labels";
import type { Client, Project } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Client", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  invalid: "A name and a valid email address are required.",
  duplicate: "Another client already uses this email address.",
  save: "Saving failed. Please try again.",
  invite: "The sign-in link could not be created. Try again in a minute.",
  mail: "The link was created but the email could not be sent. Check the Resend key.",
  migration: "Run supabase/portal/003_trash.sql in the Supabase SQL Editor first.",
};

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; invited?: string }>;
}) {
  const { user } = await requireAdmin();
  const { id } = await params;
  const flags = await searchParams;
  const admin = createAdminClient();

  const [{ data: client }, { data: projects }] = await Promise.all([
    admin.from("clients").select("*").eq("id", id).maybeSingle(),
    admin.from("projects").select("id, title, service, status, due_date").eq("client_id", id).is("deleted_at", null).order("updated_at", { ascending: false }),
  ]);
  if (!client) notFound();
  const typedClient = client as Client;
  const rows = (projects ?? []) as Pick<Project, "id" | "title" | "service" | "status" | "due_date">[];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/clients" label="Clients" />
      <div className="mt-8">
        <PageHeader
          eyebrow={typedClient.company ?? "Client"}
          title={typedClient.name}
          aside={
            <>
              <form action={inviteClientAction}>
                <input type="hidden" name="id" value={typedClient.id} />
                <button type="submit" className={ghostButtonClass}>
                  {typedClient.user_id ? "Send a new sign-in link" : "Invite to the portal"}
                </button>
              </form>
              <Link href={`/admin/projects/new?client=${typedClient.id}`} className={buttonClass}>
                New project
              </Link>
              {typedClient.deleted_at ? (
                <TrashButton kind="client" id={typedClient.id} mode="restore" label="Restore from trash" />
              ) : (
                <TrashButton kind="client" id={typedClient.id} mode="trash" label="Move to trash" confirmText={`Move ${typedClient.name} to the trash? Their projects and documents go along. You can restore everything from Trash.`} />
              )}
            </>
          }
        />
      </div>

      {flags.error ? <Notice tone="alert">{ERRORS[flags.error] ?? ERRORS.save}</Notice> : null}
      {flags.saved ? <Notice tone="warm">Saved.</Notice> : null}
      {typedClient.deleted_at ? <Notice tone="alert">This client is in the trash and invisible to the portal.</Notice> : null}
      {flags.invited ? (
        <Notice tone="warm">Invitation sent to {typedClient.email}, the link works once and stays valid for an hour.</Notice>
      ) : null}

      <p className="mt-6 text-[0.66rem] tracking-[0.26em] text-taupe uppercase">
        {typedClient.user_id ? "Has signed in before" : "Has not signed in yet"} · {typedClient.email} · portal in{" "}
        {typedClient.language === "en" ? "English" : "Dutch"}
      </p>

      <section className="mt-16">
        <h2 className="text-eyebrow mb-6">Projects</h2>
        {rows.length ? (
          <ul>
            {rows.map((project) => (
              <li key={project.id} className="border-t border-line">
                <Link href={`/admin/projects/${project.id}`} className="grid gap-2 py-5 md:grid-cols-[1fr_200px_160px_140px]">
                  <span className="font-display text-lg text-cream">{project.title}</span>
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{SERVICE_LABEL[project.service]}</span>
                  <StatusBadge status={project.status} />
                  <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">Due {formatDate(project.due_date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRow>No projects for this client yet.</EmptyRow>
        )}
      </section>

      <section className="mt-20">
        <h2 className="text-eyebrow mb-8">Details</h2>
        <ClientForm client={typedClient} />
      </section>
    </PortalShell>
  );
}
