import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { sendDocumentAction, setDocumentStatusAction } from "@/app/admin/documents/actions";
import DocumentForm from "@/components/portal/DocumentForm";
import PortalShell from "@/components/portal/PortalShell";
import { BackLink, buttonClass, ghostButtonClass, Notice, PageHeader } from "@/components/portal/ui";
import { loadDocumentBundle } from "@/lib/portal/documents";
import { requireAdmin } from "@/lib/portal/guard";
import { ADMIN_LINKS, DOC_STATUS_LABEL, KIND_LABEL, formatDate, formatMoney, type DocumentStatus } from "@/lib/portal/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Document", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  invalid: "A client and a title are required.",
  locked: "Sent documents can’t be edited — cancel it and create a new one.",
  save: "Saving failed. Please try again.",
  number: "No number could be assigned. Try again in a minute.",
  mail: "The email could not be sent, so the document stays a draft. Check the Resend key.",
};

function StatusButton({ id, status, label }: { id: string; status: DocumentStatus; label: string }) {
  return (
    <form action={setDocumentStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={ghostButtonClass}>
        {label}
      </button>
    </form>
  );
}

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
  const [{ data: clients }, { data: projects }] = await Promise.all([
    admin.from("clients").select("id, name, company").order("name"),
    admin.from("projects").select("id, title, client_id").order("updated_at", { ascending: false }),
  ]);

  const isMoney = document.kind === "quote" || document.kind === "invoice";
  const draft = document.status === "draft";
  const open = ["sent", "overdue"].includes(document.status);

  return (
    <PortalShell zone="Studio admin" email={user.email} links={ADMIN_LINKS}>
      <BackLink href="/admin/documents" label="Documents" />
      <div className="mt-8">
        <PageHeader
          eyebrow={`${KIND_LABEL[document.kind]} ${document.number ?? "— draft"} · ${DOC_STATUS_LABEL[document.status]}`}
          title={document.title}
          aside={
            <>
              <a href={`/admin/documents/${id}/pdf`} target="_blank" rel="noopener" className={ghostButtonClass}>
                View PDF
              </a>
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
      {flags.sent ? <Notice tone="warm">Sent to {client.email} — numbered {document.number}.</Notice> : null}

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
            <p className="mt-2 text-sm text-taupe">—</p>
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
          <p className="font-display mt-1 text-2xl text-cream">{isMoney ? formatMoney(document.total_cents, document.currency) : "—"}</p>
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

      {!draft ? (
        <section className="mt-12 flex flex-wrap items-center gap-8 border-t border-line pt-8">
          <span className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">Mark as</span>
          {open && document.kind === "quote" ? <StatusButton id={id} status="accepted" label="Accepted" /> : null}
          {open && document.kind === "contract" ? <StatusButton id={id} status="signed" label="Signed" /> : null}
          {open && document.kind === "invoice" ? <StatusButton id={id} status="paid" label="Paid" /> : null}
          {document.status === "sent" && document.kind === "invoice" ? <StatusButton id={id} status="overdue" label="Overdue" /> : null}
          {document.status !== "cancelled" && document.status !== "paid" ? <StatusButton id={id} status="cancelled" label="Cancelled" /> : null}
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
          <p className="max-w-2xl text-sm leading-[1.9] whitespace-pre-line text-cream/75">{document.body ?? "—"}</p>
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
