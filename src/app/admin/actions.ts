"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { PROJECT_STATUSES, SERVICES, type ProjectStatus, type ServiceKind } from "@/lib/portal/labels";
import { requireAdmin } from "@/lib/portal/guard";
import { inviteMail } from "@/lib/portal/invite-mail";
import { getResend, MAIL_FROM } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);
const orNull = (value: string) => (value ? value : null);

// ---------------------------------------------------------------- clients

function readClient(fd: FormData) {
  return {
    name: text(fd, "name", 120),
    email: text(fd, "email", 200).toLowerCase(),
    company: orNull(text(fd, "company", 160)),
    vat_number: orNull(text(fd, "vat_number", 40)),
    address_line1: orNull(text(fd, "address_line1", 200)),
    postal_code: orNull(text(fd, "postal_code", 20)),
    city: orNull(text(fd, "city", 120)),
    country: text(fd, "country", 2).toUpperCase() || "BE",
    language: text(fd, "language", 2) === "en" ? "en" : "nl",
    notes: orNull(text(fd, "notes", 4000)),
  };
}

export async function createClientAction(formData: FormData) {
  await requireAdmin();
  const values = readClient(formData);
  if (values.name.length < 2 || !EMAIL.test(values.email)) redirect("/admin/clients/new?error=invalid");

  const admin = createAdminClient();
  const { data, error } = await admin.from("clients").insert(values).select("id").single();
  if (error || !data) {
    redirect(`/admin/clients/new?error=${error?.code === "23505" ? "duplicate" : "save"}`);
  }
  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${data.id}?saved=1`);
}

export async function updateClientAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const values = readClient(formData);
  if (!id || values.name.length < 2 || !EMAIL.test(values.email)) redirect(`/admin/clients/${id}?error=invalid`);

  const admin = createAdminClient();
  const { error } = await admin.from("clients").update(values).eq("id", id);
  if (error) redirect(`/admin/clients/${id}?error=${error.code === "23505" ? "duplicate" : "save"}`);
  revalidatePath(`/admin/clients/${id}`);
  redirect(`/admin/clients/${id}?saved=1`);
}

/**
 * Creates (or refreshes) the client's sign-in and sends our own
 * branded invitation. Supabase mints the one-time token; we build
 * the link to our callback and mail it through Resend.
 */
export async function inviteClientAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const admin = createAdminClient();
  const { data: client } = await admin.from("clients").select("id, name, email, language").eq("id", id).single();
  if (!client) redirect("/admin/clients");

  const redirectTo = `${site.url}/auth/callback?next=/portal`;
  let link = await admin.auth.admin.generateLink({ type: "invite", email: client.email, options: { redirectTo } });
  if (link.error && /already|exist|registered/i.test(link.error.message)) {
    link = await admin.auth.admin.generateLink({ type: "magiclink", email: client.email, options: { redirectTo } });
  }
  const props = link.data?.properties;
  if (link.error || !props?.hashed_token) redirect(`/admin/clients/${id}?error=invite`);

  const url = `${site.url}/auth/callback?token_hash=${encodeURIComponent(props.hashed_token)}&type=${props.verification_type}&next=${encodeURIComponent("/portal")}`;
  const resend = getResend();
  if (!resend) redirect(`/admin/clients/${id}?error=mail`);

  const mail = inviteMail(client.name, client.language === "en" ? "en" : "nl", url);
  const { error } = await resend.emails.send({
    from: MAIL_FROM,
    to: client.email,
    replyTo: site.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (error) redirect(`/admin/clients/${id}?error=mail`);
  redirect(`/admin/clients/${id}?invited=1`);
}

// ---------------------------------------------------------------- projects

function readProject(fd: FormData) {
  const service = text(fd, "service", 30);
  const status = text(fd, "status", 30);
  return {
    client_id: text(fd, "client_id", 60),
    title: text(fd, "title", 160),
    service: (SERVICES as readonly string[]).includes(service) ? (service as ServiceKind) : "other",
    status: (PROJECT_STATUSES as readonly string[]).includes(status) ? (status as ProjectStatus) : "inquiry",
    description: orNull(text(fd, "description", 4000)),
    start_date: orNull(text(fd, "start_date", 10)),
    due_date: orNull(text(fd, "due_date", 10)),
  };
}

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const values = readProject(formData);
  if (!values.client_id || values.title.length < 2) {
    redirect(`/admin/projects/new?client=${values.client_id}&error=invalid`);
  }
  const admin = createAdminClient();
  const { data, error } = await admin.from("projects").insert(values).select("id").single();
  if (error || !data) redirect(`/admin/projects/new?client=${values.client_id}&error=save`);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/clients/${values.client_id}`);
  redirect(`/admin/projects/${data.id}?saved=1`);
}

export async function updateProjectAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const values = readProject(formData);
  if (!id || values.title.length < 2) redirect(`/admin/projects/${id}?error=invalid`);

  const admin = createAdminClient();
  const { error } = await admin.from("projects").update(values).eq("id", id);
  if (error) redirect(`/admin/projects/${id}?error=save`);
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${id}?saved=1`);
}

export async function addProjectUpdateAction(formData: FormData) {
  await requireAdmin();
  const projectId = text(formData, "project_id", 60);
  const message = text(formData, "message", 2000);
  const visible = formData.get("visible_to_client") === "on";
  if (!projectId || message.length < 2) redirect(`/admin/projects/${projectId}?error=invalid`);

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_updates")
    .insert({ project_id: projectId, message, visible_to_client: visible });
  if (error) redirect(`/admin/projects/${projectId}?error=save`);
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}#timeline`);
}

export async function deleteProjectUpdateAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const projectId = text(formData, "project_id", 60);
  const admin = createAdminClient();
  await admin.from("project_updates").delete().eq("id", id);
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}#timeline`);
}
