"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Browser-side Supabase client, used only to push file bytes straight
 * to Storage through a signed upload URL the server handed out.
 * Everything else still goes through server actions.
 */
export function createBrowser() {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase is not configured.");
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
