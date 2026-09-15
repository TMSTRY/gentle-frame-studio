import { adminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export interface Who {
  userEmail: string;
  isStudio: boolean;
  project: { id: string; title: string; client_id: string; status: string };
}

/**
 * Who is asking, and may they touch this project? Reading the project
 * as the signed-in user lets RLS answer: a client only sees their own,
 * the studio sees all.
 */
export async function whoForProject(projectId: string): Promise<Who | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const { data: project } = await supabase.from("projects").select("id, title, client_id, status").eq("id", String(projectId).slice(0, 60)).maybeSingle();
  if (!project) return null;
  return { userEmail: user.email, isStudio: user.email.toLowerCase() === adminEmail(), project };
}
