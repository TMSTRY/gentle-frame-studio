import { saveDocumentAction } from "@/app/admin/documents/actions";
import { buttonClass, Field, inputClass } from "@/components/portal/ui";
import { DOCUMENT_KINDS, KIND_LABEL, LINE_SLOTS, type DocumentKind } from "@/lib/portal/labels";
import type { DocumentLine, DocumentRecord, StudioSettings } from "@/lib/portal/types";

interface DocumentFormProps {
  document?: DocumentRecord;
  lines?: DocumentLine[];
  clients: { id: string; name: string; company: string | null }[];
  projects: { id: string; title: string; client_id: string }[];
  studio: StudioSettings;
  defaults?: { client?: string; project?: string; kind?: string };
}

const centsToInput = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

/** Draft editor: header fields, up to eight lines, body text for contracts. */
export default function DocumentForm({ document, lines = [], clients, projects, studio, defaults }: DocumentFormProps) {
  const editing = Boolean(document);
  const selectClass = `${inputClass} cursor-pointer appearance-none bg-ink`;
  const kind = (document?.kind ?? defaults?.kind ?? "quote") as DocumentKind;
  const dueDefault = new Date(Date.now() + studio.payment_terms_days * 86400000).toISOString().slice(0, 10);

  return (
    <form action={saveDocumentAction} className="max-w-3xl">
      {document ? <input type="hidden" name="id" value={document.id} /> : null}

      <div className="grid gap-8 md:grid-cols-3">
        <Field label="Kind" htmlFor="kind">
          <select id="kind" name="kind" defaultValue={kind} className={selectClass}>
            {DOCUMENT_KINDS.map((option) => (
              <option key={option} value={option} className="bg-ink text-cream">
                {KIND_LABEL[option]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Client" htmlFor="client_id">
          <select id="client_id" name="client_id" required defaultValue={document?.client_id ?? defaults?.client ?? ""} className={selectClass}>
            <option value="" disabled className="bg-ink text-cream">
              Choose a client…
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id} className="bg-ink text-cream">
                {client.name}
                {client.company ? ` · ${client.company}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Project (optional)" htmlFor="project_id">
          <select id="project_id" name="project_id" defaultValue={document?.project_id ?? defaults?.project ?? ""} className={selectClass}>
            <option value="" className="bg-ink text-cream">
 ·
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id} className="bg-ink text-cream">
                {project.title}
              </option>
            ))}
          </select>
        </Field>
        <div className="md:col-span-3">
          <Field label="Title (appears on the document)" htmlFor="title">
            <input id="title" name="title" required minLength={2} defaultValue={document?.title ?? ""} placeholder="Memorial film · Rudy" className={inputClass} />
          </Field>
        </div>
        <Field label="Issue date" htmlFor="issue_date">
          <input id="issue_date" name="issue_date" type="date" defaultValue={document?.issue_date ?? new Date().toISOString().slice(0, 10)} className={`${inputClass} [color-scheme:dark]`} />
        </Field>
        <Field label="Due / valid until" htmlFor="due_date">
          <input id="due_date" name="due_date" type="date" defaultValue={document?.due_date ?? dueDefault} className={`${inputClass} [color-scheme:dark]`} />
        </Field>
        <Field label="VAT rate (%)" htmlFor="vat_rate">
          <input id="vat_rate" name="vat_rate" inputMode="decimal" defaultValue={document ? String(Number(document.vat_rate)) : String(studio.default_vat_rate)} className={inputClass} />
        </Field>
      </div>

      <div className="mt-12">
        <p className="text-eyebrow mb-4">Lines (quotes &amp; invoices)</p>
        <div className="hidden grid-cols-[1fr_80px_130px] gap-4 border-b border-line pb-2 text-[0.6rem] tracking-[0.26em] text-taupe uppercase md:grid">
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Unit price €</span>
        </div>
        {Array.from({ length: LINE_SLOTS }).map((_, i) => {
          const line = lines[i];
          return (
            <div key={i} className="grid grid-cols-[1fr_70px_110px] gap-4 border-b border-line/60 py-1 md:grid-cols-[1fr_80px_130px]">
              <input name={`line_desc_${i}`} defaultValue={line?.description ?? ""} placeholder={i === 0 ? "Memorial film, 3 minutes, incl. two revision rounds" : ""} className={`${inputClass} border-0`} aria-label={`Line ${i + 1} description`} />
              <input name={`line_qty_${i}`} inputMode="decimal" defaultValue={line ? String(Number(line.quantity)) : "1"} className={`${inputClass} border-0 text-right`} aria-label={`Line ${i + 1} quantity`} />
              <input name={`line_unit_${i}`} inputMode="decimal" defaultValue={line ? centsToInput(line.unit_price_cents) : ""} placeholder="0,00" className={`${inputClass} border-0 text-right`} aria-label={`Line ${i + 1} unit price`} />
            </div>
          );
        })}
        <p className="mt-3 text-xs text-taupe">Empty lines are ignored. Totals and VAT are calculated when you save.</p>
      </div>

      <div className="mt-12">
        <Field label="Body text (contracts, terms, a personal note, blank line = new paragraph)" htmlFor="body">
          <textarea id="body" name="body" rows={8} defaultValue={document?.body ?? ""} className={`${inputClass} resize-y leading-relaxed`} />
        </Field>
      </div>
      <div className="mt-8">
        <Field label="Internal notes (never on the document)" htmlFor="notes">
          <textarea id="notes" name="notes" rows={2} defaultValue={document?.notes ?? ""} className={`${inputClass} resize-none leading-relaxed`} />
        </Field>
      </div>

      <div className="mt-12">
        <button type="submit" className={buttonClass}>
          {editing ? "Save draft" : "Create draft"}
        </button>
      </div>
    </form>
  );
}
