import type { Metadata } from "next";
import { headers } from "next/headers";

// Private zone: always rendered per request, never at build time.
export const dynamic = "force-dynamic";
import PortalShell from "@/components/portal/PortalShell";
import { ui, type PortalLang } from "@/lib/portal/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/** Before sign-in we don't know the client yet: ?lang wins, then the browser's language. */
async function guessLang(param?: string): Promise<PortalLang> {
  if (param === "nl" || param === "en") return param;
  const accept = (await headers()).get("accept-language") ?? "";
  return /^nl\b|,\s*nl\b/i.test(accept) ? "nl" : "en";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/portal";
  const lang = await guessLang(params.lang);
  const t = ui(lang);

  return (
    <PortalShell zone={t.zone}>
      <div className="mx-auto max-w-md">
        <div className="flex items-baseline justify-between gap-6">
          <p className="text-eyebrow mb-6">{t.zone}</p>
          <a
            href={`/portal/login?lang=${lang === "nl" ? "en" : "nl"}${params.next ? `&next=${encodeURIComponent(params.next)}` : ""}`}
            className="link-line text-[0.62rem] tracking-[0.26em] text-taupe uppercase transition-colors hover:text-cream"
          >
            {lang === "nl" ? "English" : "Nederlands"}
          </a>
        </div>
        <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">{t.login.title}</h1>
        <p className="mt-6 mb-12 text-sm leading-relaxed text-taupe">{t.login.lede}</p>
        {isSupabaseConfigured() ? (
          <LoginForm next={next} linkError={params.error === "link"} lang={lang} />
        ) : (
          <div className="border-t border-line pt-8">
            <p className="font-display text-xl text-cream italic">{t.login.preparing}</p>
            <p className="mt-4 text-sm leading-relaxed text-taupe">{t.login.preparingBody}</p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
