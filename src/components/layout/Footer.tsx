"use client";

import FrameMark from "@/components/brand/FrameMark";
import Wordmark from "@/components/brand/Wordmark";
import Reveal from "@/components/fx/Reveal";
import { site } from "@/content/site";
import { localePath, useLocale } from "@/lib/i18n/locale";
import { siteUi } from "@/lib/i18n/site-ui";

/**
 * Quiet closing credits: navigation, socials and contact above a
 * monumental outlined wordmark.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const locale = useLocale();
  const t = siteUi(locale);
  const f = t.footer;
  const home = localePath(locale, "/");

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

            <nav className="md:col-span-3" aria-label="Footer">
              <h3 className="text-eyebrow mb-6">{f.menu}</h3>
              <ul className="space-y-3">
                {t.nav.map((link) => (
                  <li key={link.href}>
                    <a
                      href={`${home}${link.href}`}
                      className="link-line text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={f.memorialHref}
                    className="link-line text-sm text-cream/70 transition-colors hover:text-cream"
                  >
                    {f.memorial}
                  </a>
                </li>
                <li className="pt-3">
                  <a
                    href={`/portal/login?lang=${locale}`}
                    className="link-line text-[0.66rem] tracking-[0.26em] text-taupe uppercase transition-colors hover:text-cream"
                  >
                    {f.portal}
                  </a>
                </li>
              </ul>
            </nav>

            <div className="md:col-span-4">
              <h3 className="text-eyebrow mb-6">{f.writeUs}</h3>
              <a
                href={`mailto:${site.email}`}
                className="link-line text-sm text-cream/70 transition-colors hover:text-cream"
              >
                {site.email}
              </a>
              <p className="mt-3 text-sm text-taupe">
                {f.worldwide(site.location)}
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
          <span>{f.tagline}</span>
          <span className="flex gap-6">
            <a href={f.privacyHref} className="link-line transition-colors hover:text-cream">{f.privacy}</a>
            <span>{site.domain}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
