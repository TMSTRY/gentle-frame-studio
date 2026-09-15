"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loadScreening, passCookieName, passCookieValue } from "@/lib/portal/screenings";
import { createAdminClient } from "@/lib/supabase/admin";

/** The visitor types the family's code; a right answer becomes a 30-day cookie for this room only. */
export async function enterScreeningAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").slice(0, 40);
  const code = String(formData.get("code") ?? "").trim().slice(0, 40);
  const found = await loadScreening(createAdminClient(), token);
  if (!found) redirect("/");
  const { screening } = found;
  if (!screening.passcode || code.toLowerCase() !== screening.passcode.toLowerCase()) {
    redirect(`/screening/${token}?wrong=1`);
  }
  const store = await cookies();
  store.set(passCookieName(screening.id), passCookieValue(screening.id, screening.passcode), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: `/screening/${token}`,
    maxAge: 30 * 86400,
  });
  redirect(`/screening/${token}`);
}
