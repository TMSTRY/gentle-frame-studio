import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import ClientForm from "@/components/portal/ClientForm";
import PortalShell from "@/components/portal/PortalShell";
import { BackLink, Notice, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS } from "@/lib/portal/labels";

export const metadata: Metadata = { title: "New client", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  invalid: "A name and a valid email address are required.",
  duplicate: "A client with this email address already exists.",
  save: "Saving failed. Please try again.",
};

export default async function NewClientPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user } = await requireAdmin();
  const { error } = await searchParams;

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/clients" label="Clients" />
      <div className="mt-8">
        <PageHeader eyebrow="New client" title="Someone new to work for." />
      </div>
      {error ? <Notice tone="alert">{ERRORS[error] ?? ERRORS.save}</Notice> : null}
      <div className="mt-14">
        <ClientForm />
      </div>
    </PortalShell>
  );
}
