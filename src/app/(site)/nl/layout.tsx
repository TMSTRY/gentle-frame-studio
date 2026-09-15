import HtmlLang from "@/components/fx/HtmlLang";
import { LocaleProvider } from "@/lib/i18n/locale";

/** Everything under /nl renders in Dutch. */
export default function DutchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LocaleProvider locale="nl">
      <HtmlLang lang="nl" />
      {children}
    </LocaleProvider>
  );
}
