import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/portal";

  return (
    <PortalShell zone="Client portal">
      <div className="mx-auto max-w-md">
        <p className="text-eyebrow mb-6">Client portal</p>
        <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-medium text-cream">
          Welcome back.
        </h1>
        <p className="mt-6 mb-12 text-sm leading-relaxed text-taupe">
          Your projects, documents and payments — in one quiet place.
        </p>
        {isSupabaseConfigured() ? (
          <LoginForm next={next} linkError={params.error === "link"} />
        ) : (
          <div className="border-t border-line pt-8">
            <p className="font-display text-xl text-cream italic">The portal is being prepared.</p>
            <p className="mt-4 text-sm leading-relaxed text-taupe">
              Sign-in opens as soon as the studio finishes the setup. In the meantime, write to
              hello@gentleframestudio.com.
            </p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
