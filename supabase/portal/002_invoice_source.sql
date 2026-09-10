-- =====================================================================
-- Gentle Frame Studio — 002: factuur onthoudt uit welke offerte ze komt
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- =====================================================================

alter table public.documents
  add column if not exists source_document_id uuid references public.documents (id) on delete set null;

create index if not exists documents_source_idx on public.documents (source_document_id);

comment on column public.documents.source_document_id is
  'Voor facturen: de offerte waaruit ze gemaakt werden (voorschot / saldo / volledig).';
