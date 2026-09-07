-- =====================================================================
-- Gentle Frame Studio — Klantenportaal & Admin — fase 1
-- Uitvoeren in de Supabase SQL Editor. Veilig om opnieuw te draaien.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 0. Admins & helpers
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);
insert into public.admins (email) values ('timmostrey@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------
do $$ begin
  create type public.service_kind as enum
    ('memorial_film','product_film','music_video','ai_visual','app','platform','consulting','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum
    ('inquiry','quoted','accepted','in_production','review','delivered','closed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_kind as enum ('quote','invoice','contract','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_status as enum
    ('draft','sent','accepted','signed','paid','overdue','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum
    ('open','pending','paid','failed','expired','canceled','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_kind as enum ('deposit','balance','full');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.signature_method as enum ('click','itsme');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 2. Tabellen
-- ---------------------------------------------------------------------
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references auth.users (id) on delete set null,
  email         text not null unique,
  name          text not null,
  company       text,
  vat_number    text,
  address_line1 text,
  postal_code   text,
  city          text,
  country       text not null default 'BE',
  language      text not null default 'nl' check (language in ('nl','en')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists clients_email_idx on public.clients (lower(email));

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients (id) on delete cascade,
  title       text not null,
  service     public.service_kind not null default 'other',
  status      public.project_status not null default 'inquiry',
  description text,
  start_date  date,
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_client_idx on public.projects (client_id);

create table if not exists public.project_updates (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.projects (id) on delete cascade,
  message           text not null,
  visible_to_client boolean not null default true,
  created_at        timestamptz not null default now()
);
create index if not exists project_updates_project_idx on public.project_updates (project_id, created_at desc);

create table if not exists public.documents (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid references public.projects (id) on delete set null,
  client_id      uuid not null references public.clients (id) on delete cascade,
  kind           public.document_kind not null,
  number         text unique,
  title          text not null,
  status         public.document_status not null default 'draft',
  issue_date     date not null default current_date,
  due_date       date,
  currency       text not null default 'EUR',
  subtotal_cents integer not null default 0,
  vat_rate       numeric(5,2) not null default 0,
  vat_cents      integer not null default 0,
  total_cents    integer not null default 0,
  body           text,            -- contracttekst / toelichting (markdown)
  notes          text,            -- interne notities (nooit voor klant)
  pdf_path       text,            -- pad in bucket 'documents'
  sent_at        timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists documents_client_idx on public.documents (client_id);
create index if not exists documents_project_idx on public.documents (project_id);

create table if not exists public.document_lines (
  id               uuid primary key default gen_random_uuid(),
  document_id      uuid not null references public.documents (id) on delete cascade,
  position         integer not null default 0,
  description      text not null,
  quantity         numeric(10,2) not null default 1,
  unit_price_cents integer not null default 0,
  line_total_cents integer not null default 0
);
create index if not exists document_lines_document_idx on public.document_lines (document_id, position);

create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  document_id         uuid not null references public.documents (id) on delete cascade,
  provider            text not null default 'mollie' check (provider in ('mollie','manual','stripe')),
  provider_payment_id text unique,
  kind                public.payment_kind not null default 'full',
  amount_cents        integer not null,
  status              public.payment_status not null default 'open',
  checkout_url        text,
  paid_at             timestamptz,
  raw                 jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists payments_document_idx on public.payments (document_id);

create table if not exists public.signatures (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references public.documents (id) on delete cascade,
  signer_name   text not null,
  signer_email  text not null,
  method        public.signature_method not null default 'click',
  document_hash text not null,
  ip            text,
  user_agent    text,
  signed_at     timestamptz not null default now()
);
create index if not exists signatures_document_idx on public.signatures (document_id);

create table if not exists public.document_counters (
  kind        public.document_kind not null,
  year        integer not null,
  last_number integer not null default 0,
  primary key (kind, year)
);

create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values (
  'studio',
  jsonb_build_object(
    'name', 'Gentle Frame Studio',
    'brand', 'Gentle Frames',
    'email', 'hello@gentleframestudio.com',
    'website', 'https://gentleframestudio.com',
    'country', 'BE',
    'address_line1', null,
    'postal_code', null,
    'city', null,
    'vat_number', null,
    'iban', null,
    'default_vat_rate', 0,
    'payment_terms_days', 14,
    'invoice_footer', 'Thank you for trusting us with your story.'
  )
) on conflict (key) do nothing;

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['clients','projects','documents','payments'] loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 3. Doorlopende nummering: GF-2026-0001 / OF-… / CT-…
-- ---------------------------------------------------------------------
create or replace function public.next_document_number(p_kind public.document_kind)
returns text
language plpgsql security definer
set search_path = public
as $$
declare
  v_year   integer := extract(year from now())::integer;
  v_n      integer;
  v_prefix text;
begin
  v_prefix := case p_kind
    when 'invoice'  then 'GF'
    when 'quote'    then 'OF'
    when 'contract' then 'CT'
    else 'DOC' end;

  insert into public.document_counters (kind, year, last_number)
  values (p_kind, v_year, 1)
  on conflict (kind, year)
  do update set last_number = public.document_counters.last_number + 1
  returning last_number into v_n;

  return format('%s-%s-%s', v_prefix, v_year, lpad(v_n::text, 4, '0'));
end $$;

-- ---------------------------------------------------------------------
-- 4. Klant koppelen aan login bij eerste magic-link
-- ---------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  update public.clients
     set user_id = new.id
   where user_id is null
     and lower(email) = lower(new.email);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.current_client_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select c.id
    from public.clients c
   where c.user_id = auth.uid()
      or lower(c.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
   limit 1;
$$;

-- ---------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------
alter table public.admins            enable row level security;
alter table public.clients           enable row level security;
alter table public.projects          enable row level security;
alter table public.project_updates   enable row level security;
alter table public.documents         enable row level security;
alter table public.document_lines    enable row level security;
alter table public.payments          enable row level security;
alter table public.signatures        enable row level security;
alter table public.document_counters enable row level security;
alter table public.settings          enable row level security;

-- Admin: alles, overal
do $$
declare t text;
begin
  foreach t in array array['admins','clients','projects','project_updates','documents',
                           'document_lines','payments','signatures','document_counters','settings'] loop
    execute format('drop policy if exists %I_admin_all on public.%I', t, t);
    execute format('create policy %I_admin_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- Klant: alleen eigen rijen, alleen lezen
drop policy if exists clients_self_read on public.clients;
create policy clients_self_read on public.clients
  for select to authenticated
  using (id = public.current_client_id());

drop policy if exists projects_client_read on public.projects;
create policy projects_client_read on public.projects
  for select to authenticated
  using (client_id = public.current_client_id());

drop policy if exists project_updates_client_read on public.project_updates;
create policy project_updates_client_read on public.project_updates
  for select to authenticated
  using (
    visible_to_client
    and project_id in (select id from public.projects where client_id = public.current_client_id())
  );

drop policy if exists documents_client_read on public.documents;
create policy documents_client_read on public.documents
  for select to authenticated
  using (client_id = public.current_client_id() and status <> 'draft');

drop policy if exists document_lines_client_read on public.document_lines;
create policy document_lines_client_read on public.document_lines
  for select to authenticated
  using (
    document_id in (
      select id from public.documents
      where client_id = public.current_client_id() and status <> 'draft'
    )
  );

drop policy if exists payments_client_read on public.payments;
create policy payments_client_read on public.payments
  for select to authenticated
  using (
    document_id in (select id from public.documents where client_id = public.current_client_id())
  );

drop policy if exists signatures_client_read on public.signatures;
create policy signatures_client_read on public.signatures
  for select to authenticated
  using (
    document_id in (select id from public.documents where client_id = public.current_client_id())
  );

-- Studio-gegevens (naam, adres, btw) mag elke ingelogde klant lezen (staan op de PDF)
drop policy if exists settings_read on public.settings;
create policy settings_read on public.settings
  for select to authenticated using (true);

-- Klanten schrijven nooit rechtstreeks: accepteren, tekenen en betalen
-- lopen via server-acties met de service-role-sleutel.

-- ---------------------------------------------------------------------
-- 6. Grants (zonder deze falen writes stil met 42501)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated, service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant execute on functions to authenticated, service_role;

-- ---------------------------------------------------------------------
-- 7. Private opslag voor PDF's (server levert signed URLs)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Klaar. Controle:
--   select public.next_document_number('invoice');  -- → GF-2026-0001
