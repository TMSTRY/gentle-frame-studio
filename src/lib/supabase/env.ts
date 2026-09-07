/**
 * Supabase connection details. The marketing site never needs them;
 * the portal degrades to a friendly notice while they're missing.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function adminEmail(): string {
  return (process.env.PORTAL_ADMIN_EMAIL ?? "").trim().toLowerCase();
}
