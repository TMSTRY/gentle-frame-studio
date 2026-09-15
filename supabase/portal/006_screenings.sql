-- =====================================================================
-- Gentle Frame Studio — 006: privé-bioscoopzaal (publieke kijkpagina per film)
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- Vereist 004 (project_files).
-- =====================================================================

create table if not exists public.screenings (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects (id) on delete cascade,
  client_id       uuid not null references public.clients (id) on delete cascade,
  token           text not null unique,        -- onraadbaar deel van de familielink
  file_id         uuid references public.project_files (id) on delete set null,   -- de film in de kluis
  external_url    text,                                                            -- of een YouTube/Vimeo/mp4-link
  poster_file_id  uuid references public.project_files (id) on delete set null,   -- stilstaand beeld vóór het afspelen
  title           text not null,
  subtitle        text,                        -- bv. "1948 · 2026"
  dedication      text,                        -- korte tekst onder de film
  passcode        text,                        -- kijkcode, bewust leesbaar: de familie deelt hem zelf door
  allow_download  boolean not null default true,
  expires_at      timestamptz,
  view_count      integer not null default 0,
  last_viewed_at  timestamptz,
  revoked_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists screenings_project_idx on public.screenings (project_id, created_at desc);

drop trigger if exists screenings_touch on public.screenings;
create trigger screenings_touch before update on public.screenings for each row execute function public.touch_updated_at();

alter table public.screenings enable row level security;

drop policy if exists screenings_admin_all on public.screenings;
create policy screenings_admin_all on public.screenings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Klant ziet de zalen van eigen projecten (link + code, om door te geven).
drop policy if exists screenings_client_read on public.screenings;
create policy screenings_client_read on public.screenings
  for select to authenticated
  using (
    project_id in (
      select id from public.projects
      where client_id = public.current_client_id() and deleted_at is null
    )
  );

-- Bezoekers van de kijkpagina zijn anoniem: de server leest met de service role.
grant select, insert, update, delete on public.screenings to authenticated;
grant all on public.screenings to service_role;
