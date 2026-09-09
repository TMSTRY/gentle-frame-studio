import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { buttonClass, EmptyRow, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, DOC_STATUS_LABEL, KIND_LABEL, formatDate, formatMoney } from "@/lib/portal/labels";
import type { DocumentRecord } from "@/lib/portal/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Documents", robots: { index: false, follow: false } };

type Row = Pick<DocumentRecord, "id" | "kind" | "number" | "title" | "status" | "issue_date" | "due_date" | "total_cents" | "currency"> & {
  clients: { name: string } | null;
};

const groups: { label: string; statuses: DocumentRecord["status"][] }[] = [
  { label: "Drafts", statuses: ["draft"] },
  { label: "Awaiting the client", statuses: ["sent", "overdue"] },
  { label: "Settled", statuses: ["accepted", "signed", "paid", "cancelled"] },
];

export default async function DocumentsPage() {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("documents")
    .select("id, kind, number, title, status, issue_date, due_date, total_cents, currency, clients(name)")
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <PageHeader
        eyebrow={`Documents — ${rows.length}`}
        title="Quotes, invoices, contracts."
        aside={
          <Link href="/admin/documents/new" className={buttonClass}>
            New document
          </Link>
        }
      />
      {groups.map((group) => {
        const items = rows.filter((row) => group.statuses.includes(row.status));
        return (
          <section key={group.label} className="mt-16">
            <h2 className="text-eyebrow mb-6">{group.label}</h2>
            {items.length ? (
              <ul>
                {items.map((row) => (
                  <li key={row.id} className="border-t border-line">
                    <Link href={`/admin/documents/${row.id}`} className="grid gap-2 py-5 md:grid-cols-[130px_1fr_150px_120px_130px]">
                      <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">
                        {KIND_LABEL[row.kind]} {row.number ?? ""}
                      </span>
                      <span className="font-display text-lg text-cream">
                        {row.title}
                        <span className="ml-3 text-sm text-taupe">{row.clients?.name}</span>
                      </span>
                      <span className="text-sm text-cream/80">{row.kind === "contract" || row.kind === "other" ? "—" : formatMoney(row.total_cents, row.currency)}</span>
                      <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">{DOC_STATUS_LABEL[row.status]}</span>
                      <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">{formatDate(row.due_date ?? row.issue_date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyRow>Nothing here.</EmptyRow>
            )}
          </section>
        );
      })}
    </PortalShell>
  );
}
