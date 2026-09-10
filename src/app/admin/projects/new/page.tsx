import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import ProjectForm from "@/components/portal/ProjectForm";
import { BackLink, Notice, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "New project", robots: { index: false, follow: false } };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; error?: string }>;
}) {
  const { user } = await requireAdmin();
  const { client, error } = await searchParams;
  const admin = createAdminClient();
  const { data: clients } = await admin.from("clients").select("id, name, company").is("deleted_at", null).order("name");

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/projects" label="Projects" />
      <div className="mt-8">
        <PageHeader eyebrow="New project" title="A new frame to fill." />
      </div>
      {error ? (
        <Notice tone="alert">{error === "invalid" ? "Choose a client and give the project a title." : "Saving failed. Please try again."}</Notice>
      ) : null}
      {!clients?.length ? <Notice>Create a client first, a project always belongs to someone.</Notice> : null}
      <div className="mt-14">
        <ProjectForm clients={clients ?? []} defaultClientId={client} />
      </div>
    </PortalShell>
  );
}
