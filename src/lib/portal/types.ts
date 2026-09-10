import type { ProjectStatus, ServiceKind } from "@/lib/portal/labels";

export interface Client {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  company: string | null;
  vat_number: string | null;
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  country: string;
  language: "nl" | "en";
  notes: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  service: ServiceKind;
  status: ProjectStatus;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  message: string;
  visible_to_client: boolean;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  project_id: string | null;
  client_id: string;
  kind: import("@/lib/portal/labels").DocumentKind;
  number: string | null;
  title: string;
  status: import("@/lib/portal/labels").DocumentStatus;
  issue_date: string;
  due_date: string | null;
  currency: string;
  subtotal_cents: number;
  vat_rate: number;
  vat_cents: number;
  total_cents: number;
  body: string | null;
  notes: string | null;
  pdf_path: string | null;
  source_document_id?: string | null;
  deleted_at?: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentLine {
  id: string;
  document_id: string;
  position: number;
  description: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

export interface StudioSettings {
  name: string;
  brand: string;
  email: string;
  website: string;
  country: string;
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  vat_number: string | null;
  iban: string | null;
  default_vat_rate: number;
  payment_terms_days: number;
  invoice_footer: string;
}

export const DEFAULT_STUDIO: StudioSettings = {
  name: "Gentle Frame Studio",
  brand: "Gentle Frames",
  email: "hello@gentleframestudio.com",
  website: "https://gentleframestudio.com",
  country: "BE",
  address_line1: null,
  postal_code: null,
  city: null,
  vat_number: null,
  iban: null,
  default_vat_rate: 0,
  payment_terms_days: 14,
  invoice_footer: "Thank you for trusting us with your story.",
};

export interface SignatureRecord {
  id: string;
  document_id: string;
  signer_name: string;
  signer_email: string;
  method: "click" | "itsme";
  document_hash: string;
  ip: string | null;
  user_agent: string | null;
  signed_at: string;
}
