-- =====================================================================
-- Gentle Frame Studio — 004: aanleverkluis (bestanden per project)
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- =====================================================================

create table if not exists public.project_files (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  client_id    uuid not null references public.clients (id) on delete cascade,
  uploaded_by  text not null default 'client' check (uploaded_by in ('client','studio')),
  path         text not null unique,         -- pad in bucket 'documents': uploads/<project>/<uuid>-<naam>
  name         text not null,
  size_bytes   bigint not null default 0,
  mime         text,
  note         text,
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz
);
create index if not exists project_files_project_idx on public.project_files (project_id, created_at desc);
create index if not exists project_files_deleted_idx on public.project_files (deleted_at);

alter table public.project_files enable row level security;

drop policy if exists project_files_admin_all on public.project_files;
create policy project_files_admin_all on public.project_files
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Klant leest de bestanden van eigen, niet-verwijderde projecten.
drop policy if exists project_files_client_read on public.project_files;
create policy project_files_client_read on public.project_files
  for select to authenticated
  using (
    deleted_at is null
    and project_id in (
      select id from public.projects
      where client_id = public.current_client_id() and deleted_at is null
    )
  );

-- Schrijven gebeurt via server-acties (service role); expliciete grants zoals altijd.
grant select, insert, update, delete on public.project_files to authenticated;
grant all on public.project_files to service_role;
