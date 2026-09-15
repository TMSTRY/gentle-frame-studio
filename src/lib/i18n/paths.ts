/** Pure, framework-free locale helpers; safe on server and client. */

export type Locale = "en" | "nl";

/** Prefix a site path for the given locale: "/" -> "/nl", "/work/x" -> "/nl/work/x". */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  if (path === "/") return "/nl";
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
