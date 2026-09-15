"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/paths";

export { alternatePath, localePath, type Locale } from "@/lib/i18n/paths";

const LocaleContext = createContext<Locale>("en");

/** Wraps a route tree so every section knows which language it renders. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
