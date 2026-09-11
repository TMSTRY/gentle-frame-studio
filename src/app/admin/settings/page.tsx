import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import SettingsForm from "@/components/portal/SettingsForm";
import BackupPanel from "./BackupPanel";
import { Notice, PageHeader } from "@/components/portal/ui";
import { loadStudio } from "@/lib/portal/documents";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string; backup?: string }> }) {
  const { user } = await requireAdmin();
  const flags = await searchParams;
  const admin = createAdminClient();
  const [studio, { data: backupFiles }] = await Promise.all([
    loadStudio(admin),
    admin.storage.from("documents").list("backups", { sortBy: { column: "name", order: "desc" } }),
  ]);
  const files = (backupFiles ?? []).map((f) => ({ name: f.name, size: (f.metadata as { size?: number } | null)?.size ?? 0, created: f.created_at ?? "" }));

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <PageHeader eyebrow="Settings" title="The studio on paper." />
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-taupe">
        These details print on every quote, invoice and contract. Leave the VAT number empty until you’re registered; the
        PDF then says “VAT not applicable”.
      </p>
      {flags.saved ? <Notice tone="warm">Saved.</Notice> : null}
      {flags.error === "backup" ? <Notice tone="alert">The backup could not be written. Check the storage bucket.</Notice> : flags.error ? <Notice tone="alert">Saving failed. Please try again.</Notice> : null}
      {flags.backup ? <Notice tone="warm">Backup written.</Notice> : null}
      <div className="mt-14">
        <SettingsForm studio={studio} />
      </div>
      <BackupPanel files={files} />
    </PortalShell>
  );
}
