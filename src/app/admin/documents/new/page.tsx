import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import DocumentForm from "@/components/portal/DocumentForm";
import PortalShell from "@/components/portal/PortalShell";
import { BackLink, Notice, PageHeader } from "@/components/portal/ui";
import { loadStudio } from "@/lib/portal/documents";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "New document", robots: { index: false, follow: false } };

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; project?: string; kind?: string; error?: string }>;
}) {
  const { user } = await requireAdmin();
  const params = await searchParams;
  const admin = createAdminClient();
  const [{ data: clients }, { data: projects }, studio] = await Promise.all([
    admin.from("clients").select("id, name, company").is("deleted_at", null).order("name"),
    admin.from("projects").select("id, title, client_id").is("deleted_at", null).order("updated_at", { ascending: false }),
    loadStudio(admin),
  ]);

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/documents" label="Documents" />
      <div className="mt-8">
        <PageHeader eyebrow="New document" title="Put it in writing." />
      </div>
      {params.error ? <Notice tone="alert">{params.error === "invalid" ? "Choose a client and give the document a title." : "Saving failed. Please try again."}</Notice> : null}
      {!studio.iban || !studio.address_line1 ? (
        <Notice>Tip: fill in your address and IBAN under Settings, they print on every document.</Notice>
      ) : null}
      <div className="mt-14">
        <DocumentForm clients={clients ?? []} projects={projects ?? []} studio={studio} defaults={params} />
      </div>
    </PortalShell>
  );
}
