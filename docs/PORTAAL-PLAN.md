# Klantenportaal & Admin — plan

Status: fase 1 in opbouw (gestart 7 sep 2026). Live sinds 8 sep: fundering (login, callback, shells), contactformulier, en plak 1 van de admin — klanten (aanmaken, bewerken, uitnodigen met gebrande mail), projecten (status, tijdlijn met klant-zichtbare updates) en de klantweergave van een project. Plak 2 (9 sep): documenten — offerte/factuur/contract als draft met max. 8 regels, btw en totalen; versturen = nummer toekennen (GF-/OF-/CT-jaar-0001) + gebrande mail naar de klant met portaallink; PDF in huisstijl (react-pdf, fonts uit public/fonts) voor admin én klant; handmatig markeren als aanvaard/getekend/betaald/geannuleerd (betaald boekt een manuele betaling); klant kan een offerte online aanvaarden; studio-instellingen (adres, btw, IBAN, betaaltermijn) onder /admin/settings. Klik-om-te-tekenen LIVE (9 sep): klant typt naam + vinkt akkoord aan op /portal/documents/[id]; signatures-rij met e-mail, tijdstip, IP, user-agent en sha256-documenthash (documentHash in lib/portal/documents.ts); status → signed; handtekeningblok op de PDF; bevestigingsmail naar klant en melding naar Tim. Herinneringen (9 sep): dagelijkse cron 07:00 UTC via vercel.json → /api/cron/reminders (Bearer CRON_SECRET): facturen voorbij vervaldatum → overdue + zachte herinnering aan klant (dag 0, 7, 14), verlopen offertes en 7+ dagen ongetekende contracten in een digest-mail naar Tim. Mollie geparkeerd tot er een ondernemingsnummer is. Cases (15 sep): 7 case-pagina's op /work/[slug] (+ /nl); hero = FilmStill (screenshot in lichtbak met sprocket-gaatjes, framenummer, timecode); ScrollToTop op de pagina zelf; case-copy in src/content/cases.ts, NL-vertaling van alle 7 cases live sinds 15 sep (veld `nl`, getCase(slug, locale) merged). Site tweetalig (15 sep): EN op kale paden, NL onder /nl (home, /nl/work/[slug], plus bestaande /nl/herinneringsfilms en /nl/privacy). Mechanisme: LocaleProvider in (site)/layout en (site)/nl/layout, `useLocale()` in secties, woordenboek lib/i18n/site-ui.ts; content-bestanden hebben `nl`-velden (services, process, projects, testimonials; cases nog Engels met fallback). Taalwissel in header via alternatePath(). Portaal in het Nederlands (15 sep): lib/portal/i18n.ts is het woordenboek; taal volgt clients.language (admin blijft Engels); loginpagina raadt taal uit ?lang of Accept-Language met wisselknop. Dashboard + back-up (11 sep): /admin toont openstaand, achterstallig, betaald dit jaar, open offertes, omzet per dienst en klanten die nooit inlogden (lib/portal/stats.ts). Wekelijkse JSON-snapshot van alle tabellen naar bucket documents/backups/ (maandag via de cron, of `?backup=1`, of knop 'Back up now' onder Settings); laatste 12 bewaard. Prullenmand (10 sep): klanten, projecten en documenten gaan met bevestiging naar /admin/trash (zacht verwijderen via deleted_at, migratie 003; klant neemt projecten+documenten mee, project neemt documenten mee); Restore of Delete permanently; de cron ruimt na 30 dagen op; genummerde facturen kunnen niet naar de prullenmand (annuleren). Huisstijl: geen em-dashes meer in teksten, mails, PDF's en UI (middenpunt in labels, leestekens in zinnen). Factuurflow (10 sep): op een verzonden/aanvaarde offerte "Invoice this quote" → draft-factuur als voorschot (x%), saldo (regels minus eerder gefactureerde voorschotten) of volledig; vereist migratie `002_invoice_source.sql` (documents.source_document_id). Factuur op Paid zetten stuurt automatisch een "betaling ontvangen"-mail naar de klant. Premium klantfuncties (15 sep, avond): (1) Goedkeuren is afronden: klant in status review vinkt "definitieve versie" aan op /portal/projects/[id] → project delivered, tijdlijnregel, saldofactuur (of volledige factuur als er nog geen voorschot was) als DRAFT uit de aanvaarde offerte (lib/portal/invoices.ts, gedeeld met de admin-knop), mail naar klant en naar Tim met link naar het ontwerp; Tim controleert en verstuurt de factuur zelf. Geen migratie nodig. (2) Aanleverkluis (migratie 004, tabel project_files): drag-and-drop op de projectpagina van klant én admin (components/portal/FileVault.tsx); bytes gaan rechtstreeks browser → private bucket 'documents' onder uploads/<project>/ via signed upload URL (server geeft URL, verifieert daarna met storage.exists en schrijft de rij); download via /portal/files/[id] (RLS-check, signed URL 120 s); studio-uploads = opleveringen (mail naar klant optioneel), klant-uploads mailen Tim; checklist per dienst zolang de klant niets uploadde; zacht verwijderen, cron en purge ruimen ook de opslag op; max. 50 MB per bestand (Supabase-limiet gratis plan, in dashboard te verhogen). (3) Reviewronde (migratie 005, tabellen review_cuts + review_notes): Tim publiceert een versie vanuit de kluis (video-bestand) of via YouTube/Vimeo/mp4-link → project op review, tijdlijnregel, mail naar klant; klant kijkt in het portaal (native <video> met signed URL van 2 u, of embed), pauzeert, "dit moment gebruiken", schrijft opmerking met tijdcode (components/portal/ReviewPanel.tsx); klikken op tijdcode springt in de video; Tim antwoordt, vinkt af, verbergt versies; eerdere versies blijven bereikbaar; mail naar Tim max. 1× per kwartier per versie. (4) Privé-bioscoopzaal (migratie 006, tabel screenings): Tim opent per project een zaal vanuit de admin (film uit de kluis of YouTube/Vimeo/mp4-link, titel, ondertitel, opdracht, poster, optionele kijkcode, download aan/uit, sluitdatum); publieke pagina /screening/<token> (22 tekens, onraadbaar, noindex) buiten het portaal in huisstijl (app/screening/[token]), film streamt via signed URL van 6 u, kijkcode = HMAC-cookie 30 dagen per zaal, download via /screening/<token>/download (signed URL 5 min); kijkteller; sluiten/heropenen/verwijderen; klant ziet link + code + kopieerknop op de projectpagina. Kijkcode staat bewust leesbaar in de tabel: de familie moet hem kunnen doorgeven. Portaal op de site (15 sep, laat): sectie "Eén rustige plek voor je hele project" op / en /nl tussen Process en Testimonials (components/sections/Portal.tsx + PortalScenes.tsx, tekst in site-ui.ts onder `portal`): vijf momenten in klanttaal naast een sticky verticale filmstrook waarin het echte portaalontwerp met fictieve data (Marie, Els) live gerenderd wordt, geen screenshots; op desktop kiest één ScrollTrigger-meting per tick het moment dat het dichtst bij de kijklijn (58 %) zit, op telefoons staat de strook bovenaan met vijf tikbare cijfers en draait ze zelf door tot iemand tikt; onderaan één vertrouwensregel + "Open het portaal" naar /portal/login. Herinneringsfilm-pagina kreeg een vijfde belofte "Een rustige plek van jezelf" (laatste oneven belofte spant twee kolommen). Visueel gecontroleerd op productie, desktop en 375 px. Founder-kaarten (About.tsx) gluren sinds 15 sep vanzelf open (peek-keyframes), label met kaartjes-icoon eronder, tik/Enter waaiert open (data-open); waaier 18/30/34/44 % per breakpoint en op telefoons schaalt de open waaier naar 80 % zodat beide kaarten in beeld blijven. Backup neemt de vier nieuwe tabellen mee en slaat ontbrekende tabellen over. Dit document is de bron van
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

SEO en portfolio (17 sep): naam Tim Mostrey ingebakken (metadata authors/creator/keywords, JSON-LD Organization + Person met sameAs naar tmstry.com, strafwetboek.vercel.app, excavara.com; handtekening "Tim Mostrey, oprichter"; footer "© jaar Gentle Frame Studio · Tim Mostrey"; site.ts heeft `founder`). Strafwetboek 2026 als eerste kaart + case (EN/NL) in het archief; cover public/work/strafwetboek.jpg gemaakt via headless Chrome + DevTools-protocol (scratch-script zet de localStorage-sleutel van de eenmalige melding vóór de screenshot). De Balie Gent deelde de site met haar leden. Bewust GEEN link of credit op strafwetboek.vercel.app zelf (beslissing uit het Strafwetboek-project: de tool blijft neutraal, gedeeld door de Balie Gent als gratis hulpmiddel; een commerciële link zou de geur veranderen en de nevenactiviteit-vraag bij Justitie vervroegen). De verwijzing loopt in één richting: studio → tool, via de case en de sameAs in de Person-schema.

Premium, tweede reeks (21 sep): (5) Archiefbelofte als instelling `settings.studio.archive_years` (standaard 10, 0 = niets zeggen) op /admin/settings; staat als zin op elke offerte-PDF, op de offertepagina in het portaal en bij Bestanden op de projectpagina. (6) Spoedoptie: expliciet in de tekst van de herinneringsfilm-pagina ("spoedversie binnen 72 uur, tegen meerprijs") en als snelkeuze in de offerte-editor (components/portal/LinePresets.tsx: spoed, USB-aandenken, QR-kaartjes, extra minuut, extra revisieronde; prijs typt Tim zelf). (7) Herinneringsdatum (migratie 007: projects.remembrance_date/optin/last_year): Tim zet de datum op het project, de familie kiest zelf in het portaal ("Eén keer per jaar"), de cron stuurt op die dag één zin met link naar de open bioscoopzaal of het project, hoogstens één keer per jaar; opt-out in het portaal of door te antwoorden. Opslaan van projecten werkt ook vóór migratie 007 (valt terug zonder het veld). (8) Fysiek aandenken: per bioscoopzaal in de admin "Keepsake card" (printklaar A6-kaartje, crème, met QR, adres en kijkcode, /admin/screenings/[id]/card) en "QR" (vector-SVG-download, /admin/screenings/[id]/qr); pakket `qrcode`. Bonus: back-ups downloaden vanuit /admin/settings (route /admin/settings/backup/[name], signed URL). Daarmee is het premiumlijstje van 15 sep volledig gebouwd.

Bewegingsronde site (24 sep, Opus 5.5). Leidraad: geen eindeloze lussen of zweeftrucs die naar sjabloon ruiken; alles beweegt omdat de bezoeker beweegt (scroll, hover) en komt daarna tot rust; elke beweging leent van film. (1) Hero in drie tellen (Hero.tsx): sectie is 160svh (md 172svh, 100svh bij reduced motion) met een CSS-sticky scène; tijdens het vasthouden dimmen eyebrow/lede/HUD, klapt de crossbar naar het midden en glijden de twee kaders in één (xPercent ±22, yPercent ±15 op eigen tussenlagen), cursor-drift dooft uit; bij samenvallen lost het achterste kader op en licht het voorste op (tweede rect + lock-light); daarna duwt de camera door het kader (scale 1.32, fade vóór het manifest in beeld komt) en tillen de woorden terug in hun maskers. Het samengevallen kader centreert op de h1 en schaalt mee als de kop hoger is dan het kader (telefoon: vier regels), begrensd door de schermbreedte; anders liep de bovenrand als een doorhaling door "Waar herinnering" (gemeten 24 sep op 375 px); waar het scherm het toelaat (telefoon, staande tablet) omsluit het kader ook de breedste regel, op brede schermen blijft de kop bewust over het kader heen steken (schaal 1). Regel: nooit GSAP-transforms op elementen met een Tailwind-translate (GSAP 3.15 bevriest die naar px). HUD toont nu "België" op /nl, scroll-cue is een lichtdruppel i.p.v. Tailwind pulse. (2) TitleReveal (components/fx/TitleReveal.tsx): alle sectietitels, dienstentitels en de case-h1 rijzen woord per woord uit een masker (reveal-slot-tall), aria-label op de kop. Reveal zachter (18px, 1.1s). (3) Diensten: het sticky hoofdstuknummer licht op zolang je dat hoofdstuk leest (.is-current); motieven lussen niet meer: sheen veegt één keer bij binnenkomst en bij hover, golfvorm en asterisk bewegen met de scroll, tegels ontwikkelen één keer, sterrenbeeld tekent zich één keer. (4) Werk: kaart zweeft niet meer omhoog; hover = rand warmt op + zoekerhoeken die inzoomen (.viewfinder); beeld in de kaart drijft trager mee tijdens de horizontale rit (containerAnimation, ±3.5%, scale 1.08); onder de rit een montagetijdlijn met afspeelkop en framenummer (desktop). (5) Studio: visitekaartje opent als een kader bij het scrollen (clip-path). (6) Getuigenissen: actieve lijn vult zich in 7 s. (7) Contact: submark draait mee met de scroll i.p.v. eindeloos. (8) Footer: de letters van GENTLE FRAMES schuiven in hun naam terwijl je naar het einde scrollt. Timecode schrijft rechtstreeks naar de DOM (24x/s) i.p.v. een React-render per frame. Bewust niet aangeraakt: het logo (FrameMark) zelf.

## Openstaand (21 sep 2026)

- Migraties 001 t/m 007 zijn allemaal gedraaid (007 op 21 sep, gecontroleerd via information_schema).
- Tim: instelling "Archive promise" nakijken op /admin/settings (staat op 10 jaar); wil je dat niet beloven, zet ze op 0.
- Tim: bij een testproject een herinneringsdatum zetten, in het portaal als klant "Ja, één keer per jaar" kiezen, en de tekst van de mail beoordelen (project-mail.ts, remembranceMail).
- Tim: "Keepsake card" openen bij een bioscoopzaal en eens afdrukken op A6.

- Migraties 004, 005 en 006 zijn gedraaid (15 sep).
- Tim: casetekst Strafwetboek nalezen (EN+NL), vooral de claim over de Balie Gent ("gedeeld met haar leden en zet ze op haar website").
- Tim: de portaalsectie op de homepage bekijken (desktop + telefoon) en zeggen of de fictieve namen (Marie, Els, tante Rita) goed zitten.
- Tim: de vier nieuwe functies testen met een testklant: bestand uploaden (klant en studio), versie publiceren, opmerking met tijdcode, goedkeuren → factuurontwerp controleren, bioscoopzaal openen en de link op een telefoon zonder login proberen (met en zonder kijkcode).

- Cases NL (15 sep, commit eedaa11): alle 7 verhalen vertaald in cases.ts (veld `nl`), zonder Tims correcties; Tim leest EN én NL na op /nl/work/[slug] en geeft correcties door, die pas ik dan in beide talen toe.
- Tim: 2FA op Gmail/Vercel/Supabase bevestigen; rondje mobiel.
- Mollie: pas zodra er een ondernemingsnummer is (KYC). Dan MOLLIE_API_KEY (test_) in Vercel, ik bouw checkout + webhook; factuur op paid.
- Btw-nummer later invullen in settings.studio en in privacy.ts ("Wie verantwoordelijk is"); dan Peppol plannen.
- Optioneel: Supabase Auth e-mailtemplate in huisstijl; itsme.
