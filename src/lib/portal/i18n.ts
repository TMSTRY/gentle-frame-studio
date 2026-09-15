import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DOC_STATUS_LABEL,
  KIND_LABEL,
  KIND_LABEL_NL,
  SERVICE_LABEL,
  STATUS_LABEL,
  type DocumentKind,
  type DocumentStatus,
  type ProjectStatus,
  type ServiceKind,
} from "@/lib/portal/labels";

export type PortalLang = "nl" | "en";

/** The client's portal language; admins and unknown visitors get English. */
export async function portalLang(db: SupabaseClient): Promise<PortalLang> {
  const { data } = await db.from("clients").select("language").limit(1).maybeSingle();
  return data?.language === "nl" ? "nl" : "en";
}

const STATUS_NL: Record<ProjectStatus, string> = {
  inquiry: "Aanvraag",
  quoted: "Offerte verstuurd",
  accepted: "Aanvaard",
  in_production: "In productie",
  review: "In review",
  delivered: "Opgeleverd",
  closed: "Afgesloten",
  cancelled: "Geannuleerd",
};

const SERVICE_NL: Record<ServiceKind, string> = {
  memorial_film: "Herinneringsfilm",
  product_film: "Productfilm",
  music_video: "Muziekvideo",
  ai_visual: "AI-beeldproductie",
  app: "App",
  platform: "Platform",
  consulting: "Creatief advies",
  other: "Overig",
};

const DOC_STATUS_NL: Record<DocumentStatus, string> = {
  draft: "Ontwerp",
  sent: "Verstuurd",
  accepted: "Aanvaard",
  signed: "Getekend",
  paid: "Betaald",
  overdue: "Vervallen",
  cancelled: "Geannuleerd",
};

const UI = {
  en: {
    zone: "Client portal",
    signOut: "Sign out",
    studioAdmin: "Studio admin",
    openInAdmin: "Open in admin",
    yourPortal: "Your portal",
    hello: (first: string | null) => (first ? `Hello, ${first}.` : "Hello."),
    notLinked: "Your address isn’t linked to a project yet. If you’re expecting one, the studio will connect it shortly, or write to hello@gentleframestudio.com.",
    projects: "Projects",
    documents: "Documents",
    nothingYet: "Nothing here yet.",
    noDocuments: "No documents yet.",
    yourProject: "Your project",
    aboutProject: "About this project",
    started: "Started",
    expected: "Expected",
    updates: "Updates from the studio",
    noUpdates: "Nothing yet, we’ll write here as the work moves.",
    docsAppear: "Quotes, invoices and contracts will appear here.",
    progress: "Project progress",
    downloadPdf: "Download PDF",
    approve: {
      eyebrow: "Your approval",
      lede: "Watched the final version and happy with it? Approve it here. The project is then delivered, and the balance invoice (if any) will follow in your portal.",
      check: "This is the final version. I approve it.",
      button: "Approve this version",
      done: "Approved, thank you. This project is now delivered, and you have a confirmation by email.",
      error: "Please tick the box to confirm this is the final version.",
    },
    login: {
      title: "Welcome back.",
      lede: "Your projects, documents and payments, in one quiet place.",
      preparing: "The portal is being prepared.",
      preparingBody: "Sign-in opens as soon as the studio finishes the setup. In the meantime, write to hello@gentleframestudio.com.",
      checkInbox: "Check your inbox.",
      sentBody: (email: string) => `If ${email} is known to us, a sign-in link is on its way. It works once and expires after an hour.`,
      emailLabel: "Your email address",
      expired: "That link has expired or was already used, request a new one.",
      sending: "Sending…",
      send: "Send me a sign-in link",
      noPassword: "No password needed. We email you a one-time link.",
    },
  },
  nl: {
    zone: "Klantenportaal",
    signOut: "Afmelden",
    studioAdmin: "Studio admin",
    openInAdmin: "Open in admin",
    yourPortal: "Je portaal",
    hello: (first: string | null) => (first ? `Dag ${first}.` : "Dag."),
    notLinked: "Je adres is nog niet aan een project gekoppeld. Verwacht je er een, dan koppelt de studio het binnenkort. Of schrijf naar hello@gentleframestudio.com.",
    projects: "Projecten",
    documents: "Documenten",
    nothingYet: "Nog niets hier.",
    noDocuments: "Nog geen documenten.",
    yourProject: "Je project",
    aboutProject: "Over dit project",
    started: "Gestart",
    expected: "Verwacht",
    updates: "Berichten van de studio",
    noUpdates: "Nog niets. We schrijven hier zodra het werk beweegt.",
    docsAppear: "Offertes, facturen en contracten verschijnen hier.",
    progress: "Voortgang van het project",
    downloadPdf: "Download PDF",
    approve: {
      eyebrow: "Jouw goedkeuring",
      lede: "De definitieve versie bekeken en tevreden? Keur ze hier goed. Het project staat dan op opgeleverd, en de saldofactuur (als die er is) volgt in je portaal.",
      check: "Dit is de definitieve versie. Ik keur ze goed.",
      button: "Deze versie goedkeuren",
      done: "Goedgekeurd, dank je. Dit project is nu opgeleverd, en je hebt een bevestiging per mail.",
      error: "Vink het vakje aan om te bevestigen dat dit de definitieve versie is.",
    },
    login: {
      title: "Welkom terug.",
      lede: "Je projecten, documenten en betalingen, op één rustige plek.",
      preparing: "Het portaal wordt voorbereid.",
      preparingBody: "Inloggen kan zodra de studio de opzet afrondt. Schrijf ondertussen naar hello@gentleframestudio.com.",
      checkInbox: "Kijk in je mailbox.",
      sentBody: (email: string) => `Als ${email} bij ons bekend is, is er een inloglink onderweg. Hij werkt één keer en vervalt na een uur.`,
      emailLabel: "Je e-mailadres",
      expired: "Die link is verlopen of al gebruikt. Vraag een nieuwe aan.",
      sending: "Versturen…",
      send: "Stuur me een inloglink",
      noPassword: "Geen wachtwoord nodig. Je krijgt een eenmalige inloglink per e-mail.",
    },
  },
} as const;

export type PortalUi = (typeof UI)["en"];

export function ui(lang: PortalLang): PortalUi {
  return UI[lang] as PortalUi;
}

export const statusLabel = (lang: PortalLang, s: ProjectStatus) => (lang === "nl" ? STATUS_NL : STATUS_LABEL)[s];
export const serviceLabel = (lang: PortalLang, s: ServiceKind) => (lang === "nl" ? SERVICE_NL : SERVICE_LABEL)[s];
export const docStatusLabel = (lang: PortalLang, s: DocumentStatus) => (lang === "nl" ? DOC_STATUS_NL : DOC_STATUS_LABEL)[s];
export const kindLabel = (lang: PortalLang, k: DocumentKind) => (lang === "nl" ? KIND_LABEL_NL : KIND_LABEL)[k];

export function formatDateFor(lang: PortalLang, value: string | null | undefined): string {
  if (!value) return "·";
  return new Date(value).toLocaleDateString(lang === "nl" ? "nl-BE" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}
