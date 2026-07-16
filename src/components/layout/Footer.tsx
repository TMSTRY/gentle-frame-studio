import FrameMark from "@/components/brand/FrameMark";
import Wordmark from "@/components/brand/Wordmark";
import Reveal from "@/components/fx/Reveal";
import { navLinks, site, socialLinks } from "@/content/site";

/**
 * Quiet closing credits: navigation, socials and contact above a
 * monumental outlined wordmark.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1680px] px-6 pt-24 pb-10 md:px-12">
        <Reveal>
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4">
                <FrameMark className="w-10 text-champagne" strokeWidth={5} />
                <Wordmark />
              </div>
              <p className="font-display mt-8 max-w-xs text-xl text-cream/80 italic">
                {site.tagline}
              </p>
            </div>

            <nav className="md:col-span-2" aria-label="Footer">
              <h3 className="text-eyebrow mb-6">Menu</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="link-line text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-2">
              <h3 className="text-eyebrow mb-6">Elsewhere</h3>
              <ul className="space-y-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-line text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-eyebrow mb-6">Write us</h3>
              <a
                href={`mailto:${site.email}`}
                className="link-line text-sm text-cream/70 transition-colors hover:text-cream"
              >
                {site.email}
              </a>
              <p className="mt-3 text-sm text-taupe">
                {site.location} — working worldwide
              </p>
            </div>
          </div>
        </Reveal>

        <div
          className="font-display text-outline pointer-events-none mt-24 text-center text-[11.5vw] leading-none font-medium whitespace-nowrap select-none"
          aria-hidden="true"
        >
          GENTLE FRAMES
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-[0.65rem] tracking-[0.22em] text-taupe uppercase md:flex-row">
          <span>© {year} {site.legalName}</span>
          <span>Two frames overlapping — where memories meet imagination</span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
