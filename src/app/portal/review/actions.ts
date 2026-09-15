"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { requireAdmin } from "@/lib/portal/guard";
import { whoForProject } from "@/lib/portal/who";
import { getResend, MAIL_FROM } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const text = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);

/**
 * Studio publishes a cut: a video from the vault or an outside link.
 * The project moves to "review", the timeline gets a line, and the
 * client is (optionally) mailed. Version numbers count up per project.
 */
export async function createCutAction(formData: FormData) {
  await requireAdmin();
  const projectId = text(formData, "project_id", 60);
  const fileId = text(formData, "file_id", 60);
  const externalUrl = text(formData, "external_url", 600);
  const note = text(formData, "note", 2000);
  const notify = formData.get("notify") === "on";
  if (!projectId || (!fileId && !externalUrl)) redirect(`/admin/projects/${projectId}?error=cut`);
  if (externalUrl && !/^https:\/\//i.test(externalUrl)) redirect(`/admin/projects/${projectId}?error=cut`);

  const admin = createAdminClient();
  const [{ data: project }, { data: last }] = await Promise.all([
    admin.from("projects").select("id, title, client_id, status").eq("id", projectId).maybeSingle(),
    admin.from("review_cuts").select("version").eq("project_id", projectId).order("version", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!project) redirect("/admin/projects");
  const version = (last?.version ?? 0) + 1;
  const { data: cut, error } = await admin
    .from("review_cuts")
    .insert({ project_id: projectId, version, file_id: fileId || null, external_url: externalUrl || null, note: note || null })
    .select("id")
    .single();
  if (error || !cut) redirect(`/admin/projects/${projectId}?error=${error?.code === "42P01" ? "migration" : "save"}`);

  const { data: client } = await admin.from("clients").select("name, email, language").eq("id", project.client_id).maybeSingle();
  const nl = client?.language === "nl";
  if (!["cancelled", "closed"].includes(project.status)) {
    await admin.from("projects").update({ status: "review" }).eq("id", projectId);
  }
  await admin.from("project_updates").insert({
    project_id: projectId,
    visible_to_client: true,
    message: nl ? `Versie ${version} staat klaar om te bekijken.` : `Cut ${version} is ready to watch.`,
  });

  const resend = getResend();
  if (notify && resend && client) {
    const { cutReadyMail } = await import("@/lib/portal/project-mail");
    const mail = cutReadyMail({ language: nl ? "nl" : "en", clientName: client.name, projectTitle: project.title, version, url: `${site.url}/portal/projects/${projectId}#review` });
    await resend.emails.send({ from: MAIL_FROM, to: client.email, replyTo: site.email, subject: mail.subject, html: mail.html, text: mail.text });
  }
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?saved=1#review`);
}

/** Takes a cut out of the client's view; its notes stay with it. */
export async function deleteCutAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const projectId = text(formData, "project_id", 60);
  const admin = createAdminClient();
  await admin.from("review_cuts").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}#review`);
}

export type NoteResult = { ok: true; id: string } | { ok: false; error: "auth" | "empty" | "save" };

/**
 * A note on a cut, at a moment in the film or in general. Ownership is
 * proven by reading the cut as the signed-in user. The studio hears
 * about a client's notes at most once per quarter hour per cut.
 */
export async function addReviewNoteAction(input: { cutId: string; timecode: number | null; body: string }): Promise<NoteResult> {
  const body = String(input.body ?? "").trim().slice(0, 2000);
  if (body.length < 2) return { ok: false, error: "empty" };
  const supabase = await createClient();
  const { data: cut } = await supabase.from("review_cuts").select("id, project_id, version").eq("id", String(input.cutId).slice(0, 60)).is("deleted_at", null).maybeSingle();
  if (!cut) return { ok: false, error: "auth" };
  const who = await whoForProject(cut.project_id);
  if (!who) return { ok: false, error: "auth" };

  const admin = createAdminClient();
  let authorName = who.isStudio ? "Studio" : who.userEmail;
  if (!who.isStudio) {
    const { data: client } = await admin.from("clients").select("name").eq("id", who.project.client_id).maybeSingle();
    if (client?.name) authorName = client.name;
  }
  const timecode = input.timecode === null || !Number.isFinite(Number(input.timecode)) ? null : Math.max(0, Math.round(Number(input.timecode) * 100) / 100);

  if (!who.isStudio) {
    const since = new Date(Date.now() - 15 * 60_000).toISOString();
    const { count } = await admin.from("review_notes").select("id", { count: "exact", head: true }).eq("cut_id", cut.id).eq("author", "client").gt("created_at", since);
    const resend = getResend();
    if (!count && resend) {
      await resend.emails.send({
        from: MAIL_FROM,
        to: adminEmail() || site.email,
        subject: `Review notes · ${who.project.title} · cut ${cut.version}`,
        text: `${authorName} is leaving notes on cut ${cut.version} of "${who.project.title}".\n\nFirst one${timecode !== null ? ` at ${Math.floor(timecode / 60)}:${String(Math.floor(timecode % 60)).padStart(2, "0")}` : ""}: ${body}\n\n${site.url}/admin/projects/${cut.project_id}#review`,
      });
    }
  }

  const { data, error } = await admin
    .from("review_notes")
    .insert({ cut_id: cut.id, project_id: cut.project_id, author: who.isStudio ? "studio" : "client", author_name: authorName, timecode, body })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "save" };
  revalidatePath(`/admin/projects/${cut.project_id}`);
  revalidatePath(`/portal/projects/${cut.project_id}`);
  return { ok: true, id: data.id };
}

/** Studio ticks a note off (or un-ticks it). */
export async function resolveNoteAction(input: { id: string; resolved: boolean }): Promise<{ ok: boolean }> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("review_notes")
    .update({ resolved_at: input.resolved ? new Date().toISOString() : null })
    .eq("id", String(input.id).slice(0, 60))
    .select("project_id")
    .maybeSingle();
  if (data) {
    revalidatePath(`/admin/projects/${data.project_id}`);
    revalidatePath(`/portal/projects/${data.project_id}`);
  }
  return { ok: !error };
}

/** A client may take back their own unresolved note; the studio any note. */
export async function deleteNoteAction(input: { id: string }): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false };
  const { data: note } = await supabase.from("review_notes").select("id, project_id, author, resolved_at").eq("id", String(input.id).slice(0, 60)).maybeSingle();
  if (!note) return { ok: false };
  const isStudio = user.email.toLowerCase() === adminEmail();
  if (!isStudio && (note.author !== "client" || note.resolved_at)) return { ok: false };
  const admin = createAdminClient();
  const { error } = await admin.from("review_notes").delete().eq("id", note.id);
  revalidatePath(`/admin/projects/${note.project_id}`);
  revalidatePath(`/portal/projects/${note.project_id}`);
  return { ok: !error };
}
