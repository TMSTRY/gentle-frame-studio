-- =====================================================================
-- Gentle Frame Studio — 007: herinneringsdatum (stille jaarlijkse mail)
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- =====================================================================

alter table public.projects add column if not exists remembrance_date      date;      -- bv. de sterfdatum; Tim vult in
alter table public.projects add column if not exists remembrance_optin     boolean not null default false;  -- de familie kiest zelf, in het portaal
alter table public.projects add column if not exists remembrance_last_year integer;   -- laatste jaar waarin de mail verstuurd werd

comment on column public.projects.remembrance_date is 'Datum waarop de familie elk jaar een stille mail met de film kan krijgen; alleen als remembrance_optin waar is.';
