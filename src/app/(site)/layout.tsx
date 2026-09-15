import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Preloader from "@/components/layout/Preloader";
import PathLocaleProvider from "@/lib/i18n/PathLocaleProvider";

/**
 * Marketing chrome - the opening title card, the fixed header and
 * the closing credits - wraps only the public site. The portal and
 * admin zones bring their own, quieter frame. The chrome takes its
 * language from the URL, so header and footer follow /nl too.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PathLocaleProvider>
      <Preloader />
      <Header />
      {children}
      <Footer />
    </PathLocaleProvider>
  );
}
