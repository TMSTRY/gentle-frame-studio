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
