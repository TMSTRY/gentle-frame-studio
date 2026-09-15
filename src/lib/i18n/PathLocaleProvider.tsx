"use client";

import { usePathname } from "next/navigation";
import { LocaleProvider } from "@/lib/i18n/locale";

/**
 * Locale for the shared site chrome (header, footer, preloader), read
 * from the URL: anything under /nl is Dutch, the rest English. The
 * page trees below still declare their own locale; this keeps the
 * chrome around them in step.
 */
export default function PathLocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const locale = pathname === "/nl" || pathname.startsWith("/nl/") ? "nl" : "en";
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
