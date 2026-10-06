-- =====================================================================
-- Gentle Frame Studio · 008: bredere dienstenlijst
-- (website, motion design, merkfilm)
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- Vereist 001.
--
-- Draai dit VÓÓR je in de admin een project opslaat met een nieuwe
-- dienst (Website, Motion design, Brand film): tot dan weigert Postgres
-- die waarden (22P02) en toont de admin de melding dat migratie 008
-- nog moet draaien.
--
-- Enumwaarden kunnen achteraf niet meer verwijderd worden: de namen
-- hieronder zijn een definitieve keuze. Een nieuwe waarde is pas
-- bruikbaar nadat dit script volledig is uitgevoerd; zet daarom geen
-- UPDATE met deze waarden in hetzelfde script.
-- =====================================================================

alter type public.service_kind add value if not exists 'website';
alter type public.service_kind add value if not exists 'motion_design';
alter type public.service_kind add value if not exists 'brand_film';

comment on type public.service_kind is
  'Soort project: films (memorial, brand, product, music), motion design, AI-beeld, digitaal werk (website, app, platform) en advies. De volgorde in de UI staat in src/lib/portal/labels.ts, niet hier.';

-- Controle (verwacht 11 rijen):
--   select unnest(enum_range(null::public.service_kind));
