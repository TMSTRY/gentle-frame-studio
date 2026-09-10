import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
import type { EmailOtpType } from "@supabase/supabase-js";
import { adminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Where the magic link lands. Exchanges the one-time code (or token
 * hash) for a session cookie, then continues to the requested page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  const supabase = await createClient();

  const succeed = async () => {
    // The studio owner skips the client portal and lands in admin.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isAdmin = (user?.email ?? "").toLowerCase() === adminEmail();
    return NextResponse.redirect(`${origin}${isAdmin && next === "/portal" ? "/admin" : next}`);
  };

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return succeed();
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return succeed();
  }

  return NextResponse.redirect(`${origin}/portal/login?error=link`);
}

/** Only allow same-site destinations inside the private zones. */
function safeNext(value: string | null): string {
  if (value && (value.startsWith("/portal") || value.startsWith("/admin"))) return value;
  return "/portal";
}
