import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Preloader from "@/components/layout/Preloader";
import { LocaleProvider } from "@/lib/i18n/locale";

/**
 * Marketing chrome - the opening title card, the fixed header and
 * the closing credits - wraps only the public site. The portal and
 * admin zones bring their own, quieter frame. English is the default
 * locale; /nl re-wraps the same tree in Dutch.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LocaleProvider locale="en">
      <Preloader />
      <Header />
      {children}
      <Footer />
    </LocaleProvider>
  );
}
