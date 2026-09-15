"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Locale = "en" | "nl";

const LocaleContext = createContext<Locale>("en");

/** Wraps a route tree so every section knows which language it renders. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Prefix a site path for the given locale: "/" -> "/nl", "/work/x" -> "/nl/work/x". */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  if (path === "/") return "/nl";
  if (path.startsWith("#")) return `/nl${path}`;
  return `/nl${path}`;
}

/** Same page in the other language; memorial and privacy have their own slugs. */
export function alternatePath(locale: Locale, pathname: string): string {
  const special: Record<string, string> = {
    "/memorial-films": "/nl/herinneringsfilms",
    "/nl/herinneringsfilms": "/memorial-films",
    "/privacy": "/nl/privacy",
    "/nl/privacy": "/privacy",
  };
  if (special[pathname]) return special[pathname];
  if (locale === "en") return pathname === "/" ? "/nl" : `/nl${pathname}`;
  return pathname === "/nl" ? "/" : pathname.replace(/^\/nl/, "") || "/";
}
