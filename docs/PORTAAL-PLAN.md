# Klantenportaal & Admin — plan

Status: fase 1 in opbouw (gestart 7 sep 2026). Live sinds 8 sep: fundering (login, callback, shells), contactformulier, en plak 1 van de admin — klanten (aanmaken, bewerken, uitnodigen met gebrande mail), projecten (status, tijdlijn met klant-zichtbare updates) en de klantweergave van een project. Plak 2 (9 sep): documenten — offerte/factuur/contract als draft met max. 8 regels, btw en totalen; versturen = nummer toekennen (GF-/OF-/CT-jaar-0001) + gebrande mail naar de klant met portaallink; PDF in huisstijl (react-pdf, fonts uit public/fonts) voor admin én klant; handmatig markeren als aanvaard/getekend/betaald/geannuleerd (betaald boekt een manuele betaling); klant kan een offerte online aanvaarden; studio-instellingen (adres, btw, IBAN, betaaltermijn) onder /admin/settings. Klik-om-te-tekenen LIVE (9 sep): klant typt naam + vinkt akkoord aan op /portal/documents/[id]; signatures-rij met e-mail, tijdstip, IP, user-agent en sha256-documenthash (documentHash in lib/portal/documents.ts); status → signed; handtekeningblok op de PDF; bevestigingsmail naar klant en melding naar Tim. Herinneringen (9 sep): dagelijkse cron 07:00 UTC via vercel.json → /api/cron/reminders (Bearer CRON_SECRET): facturen voorbij vervaldatum → overdue + zachte herinnering aan klant (dag 0, 7, 14), verlopen offertes en 7+ dagen ongetekende contracten in een digest-mail naar Tim. Mollie geparkeerd tot er een ondernemingsnummer is. Dit document is de bron van
waarheid voor het portaal; werk het bij bij elke beslissing.

## Doel

Klanten (families, artiesten, brands) loggen in op gentleframestudio.com,
volgen hun project, bekijken offertes/facturen/contracten in huisstijl,
tekenen online en betalen (voorschot of saldo). Tim ziet en beheert alles
vanuit één admin-omgeving en genereert PDF's van daaruit.

## Beslissingen (7 sep 2026)

| Vraag | Beslissing |
| --- | --- |
| Waar leeft het? | Zelfde repo en deploy. Klanten: `/portal/*`. Admin: `/admin/*`. Eén huisstijl. |
| Login | Supabase Auth met **magic links** (mail via Resend). Geen wachtwoorden. Admin = e-mailadres in tabel `admins`. |
| Database | Supabase Postgres + RLS. Tim maakt het project aan; SQL wordt kant-en-klaar aangeleverd in `supabase/portal/`. |
| Betalingen | **Mollie** (Bancontact, iDEAL, kaart). Testmodus tot het account er is. Stripe blijft bij EXCAVARA. |
| Contracten | **Klik-om-te-tekenen** (naam + tijdstip + IP + documenthash → rechtsgeldige eenvoudige e-handtekening). `itsme` is voorzien als latere methode via een gekwalificeerde provider (Signhost/Connective), niet in fase 1. |
| Btw | Nog geen btw-nummer. Btw-tarief staat op 0 en is per document instelbaar; studio-gegevens (btw, IBAN) staan in `settings` en kunnen later ingevuld worden. |
| Peppol | Sinds 1 jan 2026 verplicht voor B2B-facturen in België. Niet nodig zolang er geen btw-nummer is; datamodel is er klaar voor (document-nummering, klantgegevens, regels). Fase 3. |

## Architectuur

- **Routes**
  - `/portal` — login (magic link), daarna: mijn projecten, documenten, betalingen.
  - `/portal/projects/[id]` — status, tijdlijn (updates zichtbaar voor klant), documenten.
  - `/portal/documents/[id]` — bekijken, PDF downloaden, tekenen, betalen.
  - `/admin` — dashboard (open aanvragen, openstaand saldo, recente betalingen).
  - `/admin/clients`, `/admin/projects/[id]`, `/admin/documents/[id]` — beheer + PDF genereren + versturen.
  - `/api/mollie/webhook` — betalingsstatus verwerken.
  - `/auth/callback` — magic-link afhandeling.
- **Beveiliging**: RLS in Postgres is de echte grens. Klanten zien alleen eigen rijen (`current_client_id()`), admin alles (`is_admin()`). Server-acties gebruiken de service-role-sleutel enkel op de server (PDF, Mollie, tekenen).
- **PDF**: server-side gerenderd in huisstijl (Cormorant + Outfit, ink/cream/champagne), opgeslagen in de private bucket `documents`, uitgeleverd via tijdelijke signed URL.
- **Mail (Resend)**: uitnodiging/magic link, document verstuurd, betaling ontvangen, herinnering. Afzender `hello@gentleframestudio.com`.
- **Nummering**: `next_document_number(kind)` → `GF-2026-0001` (factuur), `OF-…` (offerte), `CT-…` (contract). Doorlopend per jaar, gegarandeerd uniek via rijvergrendeling.

## Datamodel (fase 1)

`admins` · `clients` · `projects` · `project_updates` · `documents` ·
`document_lines` · `payments` · `signatures` · `document_counters` · `settings`

Zie `supabase/portal/001_schema.sql` voor kolommen, enums, RLS en grants.

## Flows

1. **Aanvraag → klant**: Tim maakt klant + project aan in admin. Klant krijgt uitnodiging (magic link).
2. **Offerte → factuur**: Tim stelt regels op, genereert PDF, verstuurt. Klant accepteert (klik) → status `accepted`. Factuur (voorschot of volledig) volgt met eigen nummer.
3. **Betalen**: klant klikt "Betaal" → Mollie-checkout → webhook zet `payments.status = paid` → document `paid` → mail naar beiden.
4. **Contract tekenen**: klant leest contract in portaal, typt naam, bevestigt → `signatures`-rij + getekende PDF (met handtekeningblok en hash) in archief.
5. **Bestelling volgen**: statusbalk (aanvraag → offerte → in productie → review → opgeleverd) + tijdlijn met updates die Tim als "zichtbaar voor klant" markeert.

## Fases

1. **Kern** — schema, auth, admin (klanten, projecten, documenten + regels, PDF, versturen), portaal (overzicht, project, document, Mollie-betaling), webhook. ← nu
2. **Contracten & mails** — klik-om-te-tekenen, getekende PDF, automatische mails, herinneringen.
3. **Boekhouding** — dashboardcijfers, export, Peppol-koppeling (Billit/Storecove) zodra btw-plichtig, itsme als tekenmethode indien gewenst.

## Omgevingsvariabelen (Tim zet ze in Vercel → Settings → Environment Variables)

| Naam | Waar vandaan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem (anon / publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | idem (service_role — geheim, nooit in de browser) |
| `RESEND_API_KEY` | Resend → API Keys |
| `MOLLIE_API_KEY` | Mollie → Developers (eerst `test_…`, later `live_…`) |
| `PORTAL_ADMIN_EMAIL` | `timmostrey@gmail.com` (zelfde als in tabel `admins`) |
| `CRON_SECRET` | willekeurige lange string; Vercel stuurt hem als Bearer-token mee naar de cron-route |

## Openstaand

- Mollie-account aanmaken (Tim).
- Supabase-project aanmaken + `001_schema.sql` uitvoeren (Tim).
- Btw-nummer later invullen in `settings.studio` (en dan Peppol-fase plannen).
- Supabase Auth: e-mailtemplates in huisstijl + "Site URL" op `https://gentleframestudio.com`, redirect `https://gentleframestudio.com/auth/callback`.
