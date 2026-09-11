import type { SupabaseClient } from "@supabase/supabase-js";
import { SERVICE_LABEL, type ServiceKind } from "@/lib/portal/labels";

export interface StudioStats {
  outstandingCents: number;
  outstandingCount: number;
  overdueCents: number;
  overdueCount: number;
  paidYearCents: number;
  paidYearCount: number;
  quotedOpenCents: number;
  quotedOpenCount: number;
  expiredQuotes: number;
  unsignedContracts: number;
  byService: { service: ServiceKind; label: string; cents: number }[];
  neverSignedIn: { id: string; name: string; email: string }[];
  year: number;
}

/** Everything the dashboard shows, computed from documents and payments. */
export async function loadStats(db: SupabaseClient): Promise<StudioStats> {
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  const yearStart = `${year}-01-01`;

  const [{ data: docs }, { data: payments }, { data: silent }] = await Promise.all([
    db
      .from("documents")
      .select("id, kind, status, total_cents, due_date, project_id, projects(service)")
      .is("deleted_at", null),
    db.from("payments").select("amount_cents, paid_at, document_id").eq("status", "paid").gte("paid_at", yearStart),
    db.from("clients").select("id, name, email").is("user_id", null).is("deleted_at", null).order("created_at", { ascending: false }).limit(8),
  ]);

  type Doc = { id: string; kind: string; status: string; total_cents: number; due_date: string | null; project_id: string | null; projects: { service: ServiceKind } | null };
  const rows = (docs ?? []) as unknown as Doc[];
  const invoices = rows.filter((d) => d.kind === "invoice");

  const open = invoices.filter((d) => d.status === "sent" || d.status === "overdue");
  const overdue = invoices.filter((d) => d.status === "overdue" || (d.status === "sent" && d.due_date && d.due_date < today));
  const quotesOpen = rows.filter((d) => d.kind === "quote" && (d.status === "sent" || d.status === "accepted"));
  const expiredQuotes = rows.filter((d) => d.kind === "quote" && d.status === "sent" && d.due_date && d.due_date < today).length;
  const unsignedContracts = rows.filter((d) => d.kind === "contract" && d.status === "sent").length;

  const paidRows = payments ?? [];
  const paidYearCents = paidRows.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);

  // Revenue by service: paid invoices this year, attributed via their project.
  const serviceOf = new Map(invoices.map((d) => [d.id, d.projects?.service ?? ("other" as ServiceKind)]));
  const byServiceMap = new Map<ServiceKind, number>();
  for (const p of paidRows) {
    const service = serviceOf.get(p.document_id) ?? ("other" as ServiceKind);
    byServiceMap.set(service, (byServiceMap.get(service) ?? 0) + (p.amount_cents ?? 0));
  }
  const byService = [...byServiceMap.entries()]
    .map(([service, cents]) => ({ service, label: SERVICE_LABEL[service], cents }))
    .sort((a, b) => b.cents - a.cents);

  return {
    outstandingCents: open.reduce((s, d) => s + d.total_cents, 0),
    outstandingCount: open.length,
    overdueCents: overdue.reduce((s, d) => s + d.total_cents, 0),
    overdueCount: overdue.length,
    paidYearCents,
    paidYearCount: paidRows.length,
    quotedOpenCents: quotesOpen.reduce((s, d) => s + d.total_cents, 0),
    quotedOpenCount: quotesOpen.length,
    expiredQuotes,
    unsignedContracts,
    byService,
    neverSignedIn: (silent ?? []) as { id: string; name: string; email: string }[],
    year,
  };
}
