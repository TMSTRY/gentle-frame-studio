-- =====================================================================
-- Gentle Frame Studio — 005: reviewronde (versies + opmerkingen met tijdcode)
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- Vereist 004 (project_files).
-- =====================================================================

create table if not exists public.review_cuts (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  version      integer not null default 1,
  title        text,
  file_id      uuid references public.project_files (id) on delete set null,  -- video in de kluis
  external_url text,                                                           -- of een YouTube/Vimeo/mp4-link
  note         text,                                                           -- begeleidend woordje voor de klant
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  unique (project_id, version)
);
create index if not exists review_cuts_project_idx on public.review_cuts (project_id, version desc);

create table if not exists public.review_notes (
  id           uuid primary key default gen_random_uuid(),
  cut_id       uuid not null references public.review_cuts (id) on delete cascade,
  project_id   uuid not null references public.projects (id) on delete cascade,
  author       text not null check (author in ('client','studio')),
  author_name  text not null,
  timecode     numeric(8,2),                -- seconden in de film, leeg = algemene opmerking
  body         text not null,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists review_notes_cut_idx on public.review_notes (cut_id, created_at);

alter table public.review_cuts  enable row level security;
alter table public.review_notes enable row level security;

drop policy if exists review_cuts_admin_all on public.review_cuts;
create policy review_cuts_admin_all on public.review_cuts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists review_notes_admin_all on public.review_notes;
create policy review_notes_admin_all on public.review_notes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists review_cuts_client_read on public.review_cuts;
create policy review_cuts_client_read on public.review_cuts
  for select to authenticated
  using (
    deleted_at is null
    and project_id in (
      select id from public.projects
      where client_id = public.current_client_id() and deleted_at is null
    )
  );

drop policy if exists review_notes_client_read on public.review_notes;
create policy review_notes_client_read on public.review_notes
  for select to authenticated
  using (
    project_id in (
      select id from public.projects
      where client_id = public.current_client_id() and deleted_at is null
    )
  );

grant select, insert, update, delete on public.review_cuts, public.review_notes to authenticated;
grant all on public.review_cuts, public.review_notes to service_role;
