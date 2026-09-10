-- =====================================================================
-- Gentle Frame Studio — 003: prullenmand (zacht verwijderen)
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- =====================================================================

alter table public.clients   add column if not exists deleted_at timestamptz;
alter table public.projects  add column if not exists deleted_at timestamptz;
alter table public.documents add column if not exists deleted_at timestamptz;

create index if not exists clients_deleted_idx   on public.clients (deleted_at);
create index if not exists projects_deleted_idx  on public.projects (deleted_at);
create index if not exists documents_deleted_idx on public.documents (deleted_at);

-- Klanten zien nooit iets dat in de prullenmand ligt.
drop policy if exists projects_client_read on public.projects;
create policy projects_client_read on public.projects
  for select to authenticated
  using (client_id = public.current_client_id() and deleted_at is null);

drop policy if exists project_updates_client_read on public.project_updates;
create policy project_updates_client_read on public.project_updates
  for select to authenticated
  using (
    visible_to_client
    and project_id in (
      select id from public.projects
      where client_id = public.current_client_id() and deleted_at is null
    )
  );

drop policy if exists documents_client_read on public.documents;
create policy documents_client_read on public.documents
  for select to authenticated
  using (client_id = public.current_client_id() and status <> 'draft' and deleted_at is null);

drop policy if exists document_lines_client_read on public.document_lines;
create policy document_lines_client_read on public.document_lines
  for select to authenticated
  using (
    document_id in (
      select id from public.documents
      where client_id = public.current_client_id() and status <> 'draft' and deleted_at is null
    )
  );
