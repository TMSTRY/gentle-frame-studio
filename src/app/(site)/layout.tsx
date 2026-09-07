import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Preloader from "@/components/layout/Preloader";

/**
 * Marketing chrome — the opening title card, the fixed header and
 * the closing credits — wraps only the public site. The portal and
 * admin zones bring their own, quieter frame.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Preloader />
      <Header />
      {children}
      <Footer />
    </>
  );
}
