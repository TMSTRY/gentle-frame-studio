"use client";

import { useEffect } from "react";

/**
 * Sets the document language for a page rendered inside the
 * English root layout — restores the previous value on unmount.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [lang]);

  return null;
}
