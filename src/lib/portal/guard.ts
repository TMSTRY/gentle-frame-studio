import { redirect } from "next/navigation";
import { adminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side gate for the studio zone. The middleware already
 * redirects strangers; this re-checks inside pages and actions so a
 * misrouted request can never act with admin powers.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?next=/admin");
  if ((user.email ?? "").toLowerCase() !== adminEmail()) redirect("/portal");
  return { supabase, user };
}

/** Any signed-in visitor (client or admin); RLS scopes what they see. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  return { supabase, user };
}
