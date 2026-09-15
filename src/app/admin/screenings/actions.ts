"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/portal/guard";
import { newToken } from "@/lib/portal/screenings";
import { createAdminClient } from "@/lib/supabase/admin";

const text = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);
const orNull = (value: string) => (value ? value : null);

function readScreening(fd: FormData) {
  const externalUrl = text(fd, "external_url", 600);
  return {
    file_id: orNull(text(fd, "file_id", 60)),
    external_url: orNull(/^https:\/\//i.test(externalUrl) ? externalUrl : ""),
    poster_file_id: orNull(text(fd, "poster_file_id", 60)),
    title: text(fd, "title", 160),
    subtitle: orNull(text(fd, "subtitle", 120)),
    dedication: orNull(text(fd, "dedication", 1000)),
    passcode: orNull(text(fd, "passcode", 40)),
    allow_download: fd.get("allow_download") === "on",
    expires_at: orNull(text(fd, "expires_at", 10)) ? `${text(fd, "expires_at", 10)}T23:59:59Z` : null,
  };
}

/** Create or update a screening room; the family link never changes once made. */
export async function saveScreeningAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const projectId = text(formData, "project_id", 60);
  const values = readScreening(formData);
  const back = `/admin/projects/${projectId}`;
  if (!projectId || values.title.length < 2 || (!values.file_id && !values.external_url)) redirect(`${back}?error=screening#screening`);

  const admin = createAdminClient();
  if (id) {
    const { error } = await admin.from("screenings").update(values).eq("id", id);
    if (error) redirect(`${back}?error=save#screening`);
  } else {
    const { data: project } = await admin.from("projects").select("client_id").eq("id", projectId).maybeSingle();
    if (!project) redirect("/admin/projects");
    const { error } = await admin.from("screenings").insert({ ...values, project_id: projectId, client_id: project.client_id, token: newToken() });
    if (error) redirect(`${back}?error=${error.code === "42P01" ? "migration" : "save"}#screening`);
  }
  revalidatePath(back);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`${back}?saved=1#screening`);
}

/** Close (or reopen) a room. The link stays, the page says the room is closed. */
export async function toggleScreeningAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const projectId = text(formData, "project_id", 60);
  const admin = createAdminClient();
  const { data } = await admin.from("screenings").select("revoked_at").eq("id", id).maybeSingle();
  await admin.from("screenings").update({ revoked_at: data?.revoked_at ? null : new Date().toISOString() }).eq("id", id);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}#screening`);
}

/** Gone for good; the link dies. */
export async function deleteScreeningAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const projectId = text(formData, "project_id", 60);
  await createAdminClient().from("screenings").delete().eq("id", id);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}#screening`);
}
