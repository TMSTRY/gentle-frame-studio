"use server";

import { revalidatePath } from "next/cache";
import { site } from "@/content/site";
import { BUCKET, MAX_UPLOAD_BYTES, uploadPath } from "@/lib/portal/files";
import { getResend, MAIL_FROM } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type Who = { userEmail: string; isStudio: boolean; project: { id: string; title: string; client_id: string; status: string } };

/**
 * Who is asking, and may they touch this project? Reading the project
 * as the signed-in user lets RLS answer: a client only sees their own,
 * the studio sees all. Cancelled projects are read-only.
 */
async function whoFor(projectId: string): Promise<Who | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const { data: project } = await supabase.from("projects").select("id, title, client_id, status").eq("id", projectId).maybeSingle();
  if (!project) return null;
  return { userEmail: user.email, isStudio: user.email.toLowerCase() === adminEmail(), project };
}

export type PrepareResult = { ok: true; path: string; token: string } | { ok: false; error: "auth" | "size" | "closed" | "storage" };

/** Step 1 of an upload: a one-time signed URL for exactly this file. */
export async function prepareUploadAction(input: { projectId: string; name: string; size: number }): Promise<PrepareResult> {
  const who = await whoFor(String(input.projectId).slice(0, 60));
  if (!who) return { ok: false, error: "auth" };
  if (who.project.status === "cancelled") return { ok: false, error: "closed" };
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > MAX_UPLOAD_BYTES) return { ok: false, error: "size" };
  const path = uploadPath(who.project.id, String(input.name ?? "file"));
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "storage" };
  return { ok: true, path: data.path, token: data.token };
}

export type CompleteResult = { ok: true; id: string } | { ok: false; error: "auth" | "missing" | "save" | "migration" };

/** Step 2: the bytes are in the bucket; record the file and, for studio deliveries, tell the client. */
export async function completeUploadAction(input: { projectId: string; path: string; name: string; size: number; mime: string; notify?: boolean }): Promise<CompleteResult> {
  const projectId = String(input.projectId).slice(0, 60);
  const who = await whoFor(projectId);
  if (!who) return { ok: false, error: "auth" };
  const path = String(input.path);
  if (!path.startsWith(`uploads/${projectId}/`)) return { ok: false, error: "auth" };

  const admin = createAdminClient();
  const { data: exists } = await admin.storage.from(BUCKET).exists(path);
  if (!exists) return { ok: false, error: "missing" };

  const name = String(input.name ?? "file").trim().slice(0, 200) || "file";
  const { data, error } = await admin
    .from("project_files")
    .insert({
      project_id: projectId,
      client_id: who.project.client_id,
      uploaded_by: who.isStudio ? "studio" : "client",
      path,
      name,
      size_bytes: Math.max(0, Math.round(Number(input.size) || 0)),
      mime: String(input.mime ?? "").slice(0, 120) || null,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.code === "42P01" ? "migration" : "save" };

  const resend = getResend();
  if (resend) {
    if (who.isStudio && input.notify) {
      const { data: client } = await admin.from("clients").select("name, email, language").eq("id", who.project.client_id).maybeSingle();
      if (client) {
        const { fileDeliveredMail } = await import("@/lib/portal/project-mail");
        const mail = fileDeliveredMail({ language: client.language === "nl" ? "nl" : "en", clientName: client.name, projectTitle: who.project.title, fileName: name, url: `${site.url}/portal/projects/${projectId}` });
        await resend.emails.send({ from: MAIL_FROM, to: client.email, replyTo: site.email, subject: mail.subject, html: mail.html, text: mail.text });
      }
    } else if (!who.isStudio) {
      // One quiet line to the studio per file; clients rarely send more than a handful at once.
      await resend.emails.send({
        from: MAIL_FROM,
        to: adminEmail() || site.email,
        subject: `File received · ${who.project.title}`,
        text: `${who.userEmail} uploaded "${name}" to "${who.project.title}".\n${site.url}/admin/projects/${projectId}`,
      });
    }
  }
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: true, id: data.id };
}

/** Soft delete. A client can only take back their own uploads; the studio anything. The cron purges after 30 days. */
export async function removeFileAction(input: { id: string }): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false };
  // Under RLS: only rows the user may see come back.
  const { data: file } = await supabase.from("project_files").select("id, project_id, uploaded_by").eq("id", String(input.id).slice(0, 60)).maybeSingle();
  if (!file) return { ok: false };
  const isStudio = user.email.toLowerCase() === adminEmail();
  if (!isStudio && file.uploaded_by !== "client") return { ok: false };
  const admin = createAdminClient();
  const { error } = await admin.from("project_files").update({ deleted_at: new Date().toISOString() }).eq("id", file.id);
  revalidatePath(`/portal/projects/${file.project_id}`);
  revalidatePath(`/admin/projects/${file.project_id}`);
  return { ok: !error };
}
