import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { invoiceFromQuoteAction, sendDocumentAction } from "@/app/admin/documents/actions";
import DocumentForm from "@/components/portal/DocumentForm";
import PortalShell from "@/components/portal/PortalShell";
import StatusButton from "@/components/portal/StatusButton";
import TrashButton from "@/components/portal/TrashButton";
import { BackLink, buttonClass, ghostButtonClass, inputClass, Notice, PageHeader } from "@/components/portal/ui";
import { loadDocumentBundle } from "@/lib/portal/documents";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, DOC_STATUS_LABEL, KIND_LABEL, formatDate, formatMoney, type DocumentStatus } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Document", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  invalid: "A client and a title are required.",
  locked: "Sent documents can’t be edited, cancel it and create a new one.",
  save: "Saving failed. Please try again.",
  number: "No number could be assigned. Try again in a minute.",
  mail: "The email could not be sent, so the document stays a draft. Check the Resend key.",
  migration: "Run the latest supabase/portal/*.sql migration in the Supabase SQL Editor first.",
  "invoice-trash": "Numbered invoices can’t be trashed; cancel them instead so the numbering stays intact.",
};

export default async function DocumentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; sent?: string }>;
}) {
  const { user } = await requireAdmin();
  const { id } = await params;
  const flags = await searchParams;
  const admin = createAdminClient();
  const bundle = await loadDocumentBundle(admin, id);
  if (!bundle) notFound();
  const { document, lines, client, project, studio, signatures } = bundle;
  const [{ data: clients }, { data: projects }, { data: derived }] = await Promise.all([
    admin.from("clients").select("id, name, company").is("deleted_at", null).order("name"),
    admin.from("projects").select("id, title, client_id").is("deleted_at", null).order("updated_at", { ascending: false }),
    document.kind === "quote"
      ? admin.from("documents").select("id, number, title, status, total_cents, currency").eq("source_document_id", id).is("deleted_at", null).order("created_at")
      : Promise.resolve({ data: [] as { id: string; number: string | null; title: string; status: DocumentStatus; total_cents: number; currency: string }[] }),
  ]);
  const invoicesFromQuote = (derived ?? []) as { id: string; number: string | null; title: string; status: DocumentStatus; total_cents: number; currency: string }[];

  const isMoney = document.kind === "quote" || document.kind === "invoice";
  const draft = document.status === "draft";
  const open = ["sent", "overdue"].includes(document.status);

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/documents" label="Documents" />
      <div className="mt-8">
        <PageHeader
          eyebrow={`${KIND_LABEL[document.kind]} ${document.number ?? "(draft)"} · ${DOC_STATUS_LABEL[document.status]}`}
          title={document.title}
          aside={
            <>
              <a href={`/admin/documents/${id}/pdf`} target="_blank" rel="noopener" className={ghostButtonClass}>
                View PDF
              </a>
              {document.deleted_at ? (
                <TrashButton kind="document" id={id} mode="restore" label="Restore from trash" />
              ) : !(document.kind === "invoice" && document.number) ? (
                <TrashButton kind="document" id={id} mode="trash" label="Move to trash" confirmText={`Move this ${KIND_LABEL[document.kind].toLowerCase()} to the trash? You can restore it from Trash.`} />
              ) : null}
              {draft ? (
                <form action={sendDocumentAction}>
                  <input type="hidden" name="id" value={id} />
                  <button type="submit" className={buttonClass}>
                    Send to {client.name.split(" ")[0]}
                  </button>
                </form>
              ) : null}
            </>
          }
        />
      </div>

      {flags.error ? <Notice tone="alert">{ERRORS[flags.error] ?? ERRORS.save}</Notice> : null}
      {flags.saved ? <Notice tone="warm">Saved.</Notice> : null}
      {document.deleted_at ? <Notice tone="alert">This document is in the trash and invisible to the client.</Notice> : null}
      {flags.sent ? <Notice tone="warm">Sent to {client.email}, numbered {document.number}.</Notice> : null}

      <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-4">
        <div>
          <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Client</p>
          <Link href={`/admin/clients/${client.id}`} className="mt-2 block text-sm text-cream/85 hover:text-cream">
            {client.name}
          </Link>
        </div>
        <div>
          <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Project</p>
          {project ? (
            <Link href={`/admin/projects/${project.id}`} className="mt-2 block text-sm text-cream/85 hover:text-cream">
              {project.title}
            </Link>
          ) : (
            <p className="mt-2 text-sm text-taupe"> · </p>
          )}
        </div>
        <div>
          <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Dates</p>
          <p className="mt-2 text-sm text-cream/85">
            {formatDate(document.issue_date)}
            {document.due_date ? ` → ${formatDate(document.due_date)}` : ""}
          </p>
        </div>
        <div>
          <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Total</p>
          <p className="font-display mt-1 text-2xl text-cream">{isMoney ? formatMoney(document.total_cents, document.currency) : "·"}</p>
        </div>
      </div>

      {isMoney && lines.length ? (
        <section className="mt-12">
          <h2 className="text-eyebrow mb-4">Lines</h2>
          <ul>
            {lines.map((line) => (
              <li key={line.id} className="grid grid-cols-[1fr_70px_120px] gap-4 border-t border-line py-3 text-sm text-cream/85">
                <span>{line.description}</span>
                <span className="text-right text-taupe">{Number(line.quantity)}</span>
                <span className="text-right">{formatMoney(line.line_total_cents, document.currency)}</span>
              </li>
            ))}
            <li className="grid grid-cols-[1fr_120px] gap-4 border-t border-line py-3 text-sm text-taupe">
              <span>{Number(document.vat_rate) > 0 ? `VAT ${Number(document.vat_rate)}%` : "VAT not applicable"}</span>
              <span className="text-right">{formatMoney(document.vat_cents, document.currency)}</span>
            </li>
          </ul>
        </section>
      ) : null}

      {signatures.length ? (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-eyebrow mb-4">Signature</h2>
          {signatures.map((signature) => (
            <p key={signature.id} className="text-sm leading-relaxed text-cream/80">
              <span className="font-display text-xl text-cream italic">{signature.signer_name}</span>
              <span className="ml-3 text-taupe">{signature.signer_email} · {new Date(signature.signed_at).toLocaleString("en-GB", { timeZone: "Europe/Brussels" })}{signature.ip ? ` · ` : ""}</span>
              <span className="mt-1 block font-mono text-[0.68rem] text-taupe/80">{signature.document_hash}</span>
            </p>
          ))}
        </section>
      ) : null}

      {document.kind === "quote" && ["sent", "accepted"].includes(document.status) ? (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-eyebrow mb-6">Invoice this quote</h2>
          <form action={invoiceFromQuoteAction} className="flex flex-wrap items-end gap-8">
            <input type="hidden" name="id" value={id} />
            <div className="flex flex-wrap gap-6 text-sm text-cream/80">
              <label className="flex items-center gap-2"><input type="radio" name="mode" value="deposit" defaultChecked className="accent-[#e6d5b3]" /> Deposit</label>
              <label className="flex items-center gap-2"><input type="radio" name="mode" value="balance" className="accent-[#e6d5b3]" /> Balance (total minus deposits)</label>
              <label className="flex items-center gap-2"><input type="radio" name="mode" value="full" className="accent-[#e6d5b3]" /> Full amount</label>
            </div>
            <div className="w-24">
              <label htmlFor="pct" className="mb-1 block text-[0.62rem] tracking-[0.28em] text-taupe uppercase">Deposit %</label>
              <input id="pct" name="pct" inputMode="numeric" defaultValue="30" className={inputClass} />
            </div>
            <button type="submit" className={buttonClass}>Create draft invoice</button>
          </form>
          {invoicesFromQuote.length ? (
            <ul className="mt-8">
              {invoicesFromQuote.map((inv) => (
                <li key={inv.id} className="border-t border-line">
                  <Link href={`/admin/documents/${inv.id}`} className="grid gap-2 py-3 text-sm md:grid-cols-[130px_1fr_140px_120px]">
                    <span className="text-[0.66rem] tracking-[0.26em] text-taupe uppercase">Invoice {inv.number ?? "(draft)"}</span>
                    <span className="text-cream/85">{inv.title}</span>
                    <span className="text-cream/80">{formatMoney(inv.total_cents, inv.currency)}</span>
                    <span className="text-[0.66rem] tracking-[0.26em] text-champagne uppercase">{DOC_STATUS_LABEL[inv.status]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {!draft ? (
        <section className="mt-12 flex flex-wrap items-center gap-8 border-t border-line pt-8">
          <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Mark as</span>
          {open && document.kind === "quote" ? <StatusButton id={id} status="accepted" label="Accepted" /> : null}
          {open && document.kind === "contract" ? <StatusButton id={id} status="signed" label="Signed" /> : null}
          {open && document.kind === "invoice" ? <StatusButton id={id} status="paid" label="Paid" /> : null}
          {document.status === "sent" && document.kind === "invoice" ? <StatusButton id={id} status="overdue" label="Overdue" /> : null}
          {document.status !== "cancelled" && document.status !== "paid" ? (
            <StatusButton id={id} status="cancelled" label="Cancelled" confirmText={`Cancel ${KIND_LABEL[document.kind].toLowerCase()} ${document.number ?? ""}? You can reopen it later.`} />
          ) : null}
          {document.status === "cancelled" ? <StatusButton id={id} status="sent" label="Reopen (back to sent)" /> : null}
        </section>
      ) : null}

      {draft ? (
        <section className="mt-20">
          <h2 className="text-eyebrow mb-8">Edit draft</h2>
          <DocumentForm document={document} lines={lines} clients={clients ?? []} projects={projects ?? []} studio={studio} />
        </section>
      ) : (
        <section className="mt-16">
          <h2 className="text-eyebrow mb-4">Body</h2>
          <p className="max-w-2xl text-sm leading-[1.9] whitespace-pre-line text-cream/75">{document.body ?? "·"}</p>
          {document.notes ? (
            <>
              <h2 className="text-eyebrow mt-10 mb-4">Internal notes</h2>
              <p className="max-w-2xl text-sm leading-relaxed whitespace-pre-line text-taupe">{document.notes}</p>
            </>
          ) : null}
        </section>
      )}
    </PortalShell>
  );
}
