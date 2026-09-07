import Link from "next/link";
import FrameMark from "@/components/brand/FrameMark";
import Wordmark from "@/components/brand/Wordmark";
import { signOut } from "@/app/portal/actions";

interface PortalShellProps {
  children: React.ReactNode;
  /** Small label under the wordmark: "Client portal" / "Studio admin" */
  zone: string;
  /** Signed-in address shown top right, if any */
  email?: string | null;
  /** Extra links for the top bar */
  links?: { href: string; label: string }[];
}

/**
 * The quiet frame around the private zones: mark, zone label, a few
 * links and sign-out. No preloader, no marketing header.
 */
export default function PortalShell({ children, zone, email, links = [] }: PortalShellProps) {
  return (
    <div className="min-h-[100svh] bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Gentle Frame Studio — home" className="flex items-center gap-4">
              <FrameMark className="w-9 text-champagne" strokeWidth={5} />
              <Wordmark className="hidden sm:flex" />
            </Link>
            <span className="ml-2 hidden border-l border-line pl-4 text-[0.6rem] tracking-[0.3em] text-taupe uppercase md:inline">
              {zone}
            </span>
          </div>
          <nav className="flex items-center gap-8" aria-label={zone}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-line hidden text-[0.66rem] tracking-[0.28em] text-cream/75 uppercase md:inline"
              >
                {link.label}
              </Link>
            ))}
            {email ? (
              <form action={signOut} className="flex items-center gap-5">
                <span className="hidden text-xs text-taupe lg:inline">{email}</span>
                <button
                  type="submit"
                  className="link-line text-[0.66rem] tracking-[0.28em] text-champagne uppercase"
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[1400px] px-6 py-14 md:px-10 md:py-20">
        {children}
      </main>
    </div>
  );
}
