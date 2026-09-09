import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { acceptQuoteAction } from "@/app/portal/actions";
import PortalShell from "@/components/portal/PortalShell";
import { BackLink, buttonClass, ghostButtonClass, Notice, PageHeader } from "@/components/portal/ui";
import { loadDocumentBundle } from "@/lib/portal/documents";
import { requireUser } from "@/lib/portal/guard";
import { DOC_STATUS_LABEL, KIND_LABEL, KIND_LABEL_NL, formatDate, formatMoney } from "@/lib/portal/labels";
import { adminEmail } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Document", robots: { index: false, follow: false } };

export default async function PortalDocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ accepted?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { id } = await params;
  const flags = await searchParams;
  // As the signed-in client: RLS hides drafts and other people's documents.
  const bundle = await loadDocumentBundle(supabase, id);
  if (!bundle) notFound();
  const { document, lines, client, studio, project } = bundle;
  const nl = client.language === "nl";
  const kindLabel = (nl ? KIND_LABEL_NL : KIND_LABEL)[document.kind];
  const isMoney = document.kind === "quote" || document.kind === "invoice";
  const isAdmin = Boolean(user.email && user.email.toLowerCase() === adminEmail());

  return (
    <PortalShell zone="Client portal" email={user.email} links={isAdmin ? [{ href: `/admin/documents/${id}`, label: "Open in admin" }] : []}>
      <BackLink href={project ? `/portal/projects/${project.id}` : "/portal"} label={project ? project.title : nl ? "Je portaal" : "Your portal"} />
      <div className="mt-8">
        <PageHeader
          eyebrow={`${kindLabel} ${document.number ?? ""} · ${DOC_STATUS_LABEL[document.status]}`}
          title={document.title}
          aside={
            <a href={`/portal/documents/${id}/pdf`} target="_blank" rel="noopener" className={ghostButtonClass}>
              {nl ? "Download PDF" : "Download PDF"}
            </a>
          }
        />
      </div>

      {flags.accepted ? (
        <Notice tone="warm">{nl ? "Dank je — we gaan aan de slag. Je hoort snel van ons." : "Thank you — we’re on it. You’ll hear from us soon."}</Notice>
      ) : null}

      <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
        <div>
          <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{nl ? "Datum" : "Issued"}</p>
          <p className="mt-2 text-sm text-cream/85">{formatDate(document.issue_date)}</p>
        </div>
        <div>
          <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">
            {document.kind === "quote" ? (nl ? "Geldig tot" : "Valid until") : nl ? "Vervaldatum" : "Due"}
          </p>
          <p className="mt-2 text-sm text-cream/85">{formatDate(document.due_date)}</p>
        </div>
        {isMoney ? (
          <div>
            <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{nl ? "Totaal" : "Total"}</p>
            <p className="font-display mt-1 text-2xl text-cream">{formatMoney(document.total_cents, document.currency)}</p>
          </div>
        ) : null}
      </div>

      {isMoney && lines.length ? (
        <ul className="mt-10">
          {lines.map((line) => (
            <li key={line.id} className="grid grid-cols-[1fr_60px_120px] gap-4 border-t border-line py-3 text-sm text-cream/85">
              <span>{line.description}</span>
              <span className="text-right text-taupe">{Number(line.quantity)}</span>
              <span className="text-right">{formatMoney(line.line_total_cents, document.currency)}</span>
            </li>
          ))}
          <li className="grid grid-cols-[1fr_120px] gap-4 border-t border-line py-3 text-sm text-taupe">
            <span>{Number(document.vat_rate) > 0 ? `${nl ? "Btw" : "VAT"} ${Number(document.vat_rate)}%` : nl ? "Btw niet van toepassing" : "VAT not applicable"}</span>
            <span className="text-right">{formatMoney(document.vat_cents, document.currency)}</span>
          </li>
        </ul>
      ) : null}

      {document.body ? (
        <section className="mt-12">
          <p className="max-w-2xl text-[0.95rem] leading-[1.9] whitespace-pre-line text-cream/80">{document.body}</p>
        </section>
      ) : null}

      <section className="mt-14 border-t border-line pt-8">
        {document.kind === "quote" && document.status === "sent" ? (
          <form action={acceptQuoteAction} className="flex flex-wrap items-center gap-8">
            <input type="hidden" name="id" value={id} />
            <button type="submit" className={buttonClass}>
              {nl ? "Offerte aanvaarden" : "Accept this quote"}
            </button>
            <span className="text-sm text-taupe">
              {nl ? "Vragen eerst? Antwoord gewoon op de mail." : "Questions first? Just reply to the email."}
            </span>
          </form>
        ) : null}
        {document.kind === "quote" && document.status === "accepted" ? (
          <p className="text-sm text-champagne">{nl ? "Aanvaard — dank je." : "Accepted — thank you."}</p>
        ) : null}
        {document.kind === "invoice" && ["sent", "overdue"].includes(document.status) ? (
          <div className="text-sm leading-relaxed text-cream/80">
            <p className="text-[0.62rem] tracking-[0.26em] text-taupe uppercase">{nl ? "Betalen" : "Payment"}</p>
            {studio.iban ? (
              <p className="mt-3">
                {nl ? "Overschrijven naar" : "Bank transfer to"} <span className="text-cream">{studio.iban}</span>
                {document.number ? ` — ${nl ? "mededeling" : "reference"} ${document.number}` : ""}
              </p>
            ) : (
              <p className="mt-3 text-taupe">{nl ? "Betaalgegevens volgen per mail." : "Payment details follow by email."}</p>
            )}
            <p className="mt-2 text-taupe">{nl ? "Online betalen (Bancontact, kaart) komt binnenkort." : "Online payment (Bancontact, card) is coming soon."}</p>
          </div>
        ) : null}
        {document.kind === "invoice" && document.status === "paid" ? (
          <p className="text-sm text-champagne">{nl ? "Betaald — dank je." : "Paid — thank you."}</p>
        ) : null}
        {document.kind === "contract" && document.status === "sent" ? (
          <p className="text-sm text-taupe">{nl ? "Online tekenen komt binnenkort. Tot dan: antwoord op de mail met “akkoord”." : "Online signing is coming soon. Until then: reply to the email with “agreed”."}</p>
        ) : null}
      </section>
    </PortalShell>
  );
}
