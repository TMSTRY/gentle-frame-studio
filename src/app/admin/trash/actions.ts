"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/portal/guard";
import { createAdminClient } from "@/lib/supabase/admin";

type Kind = "client" | "project" | "document";
const TABLE: Record<Kind, "clients" | "projects" | "documents"> = { client: "clients", project: "projects", document: "documents" };
const text = (fd: FormData, key: string, max = 60) => String(fd.get(key) ?? "").trim().slice(0, max);

function readTarget(fd: FormData): { kind: Kind; id: string } {
  const kind = text(fd, "kind", 10) as Kind;
  const id = text(fd, "id");
  if (!(kind in TABLE) || !id) redirect("/admin");
  return { kind, id };
}

/**
 * Soft delete: stamps deleted_at so the row vanishes from every list
 * and from the client portal (RLS, migration 003), but nothing is
 * lost until it's purged. A client takes its projects and documents
 * along; a project takes its documents. Numbered invoices are never
 * trashed (cancel them instead).
 */
export async function trashAction(formData: FormData) {
  await requireAdmin();
  const { kind, id } = readTarget(formData);
  const admin = createAdminClient();
  const now = new Date().toISOString();

  if (kind === "document") {
    const { data: doc } = await admin.from("documents").select("kind, number").eq("id", id).maybeSingle();
    if (doc?.kind === "invoice" && doc.number) redirect(`/admin/documents/${id}?error=invoice-trash`);
  }
  const { error } = await admin.from(TABLE[kind]).update({ deleted_at: now }).eq("id", id);
  if (error) redirect(`/admin/${TABLE[kind]}/${id}?error=${error.code === "42703" ? "migration" : "save"}`);

  if (kind === "client") {
    await admin.from("projects").update({ deleted_at: now }).eq("client_id", id).is("deleted_at", null);
    await admin.from("documents").update({ deleted_at: now }).eq("client_id", id).is("deleted_at", null);
  }
  if (kind === "project") {
    await admin.from("documents").update({ deleted_at: now }).eq("project_id", id).is("deleted_at", null);
  }
  revalidatePath("/admin");
  redirect(`/admin/${TABLE[kind]}?trashed=1`);
}

/** Brings a row back, together with whatever went to the trash with it. */
export async function restoreAction(formData: FormData) {
  await requireAdmin();
  const { kind, id } = readTarget(formData);
  const admin = createAdminClient();
  const { data: row } = await admin.from(TABLE[kind]).select("deleted_at").eq("id", id).maybeSingle();
  const stamp = row?.deleted_at as string | null | undefined;

  await admin.from(TABLE[kind]).update({ deleted_at: null }).eq("id", id);
  if (stamp && kind === "client") {
    await admin.from("projects").update({ deleted_at: null }).eq("client_id", id).eq("deleted_at", stamp);
    await admin.from("documents").update({ deleted_at: null }).eq("client_id", id).eq("deleted_at", stamp);
  }
  if (stamp && kind === "project") {
    await admin.from("documents").update({ deleted_at: null }).eq("project_id", id).eq("deleted_at", stamp);
  }
  revalidatePath("/admin");
  redirect(`/admin/${TABLE[kind]}/${id}?saved=1`);
}

/** Gone for good. Foreign keys cascade to lines, updates, payments, signatures. */
export async function purgeAction(formData: FormData) {
  await requireAdmin();
  const { kind, id } = readTarget(formData);
  const admin = createAdminClient();
  await admin.from(TABLE[kind]).delete().eq("id", id).not("deleted_at", "is", null);
  revalidatePath("/admin");
  redirect("/admin/trash?purged=1");
}
