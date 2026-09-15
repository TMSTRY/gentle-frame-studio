import type { Metadata } from "next";
import { site } from "@/content/site";
import About from "@/components/sections/About";
import ContactCta from "@/components/sections/ContactCta";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Work from "@/components/sections/Work";

const description =
  "Gentle Frame Studio is een Belgische creatieve studio die herinneringsfilms, luxeproductfilms, muziekvideo’s, AI-beeldproductie en digitale platformen maakt: technologie met een menselijk hart.";

export const metadata: Metadata = {
  title: { absolute: `${site.legalName} · Herinneringen. Opnieuw verbeeld. Voor altijd.` },
  description,
  alternates: { canonical: "/nl", languages: { en: "/", nl: "/nl", "x-default": "/" } },
  openGraph: { locale: "nl_BE", url: "/nl", title: `${site.legalName} · Herinneringen. Opnieuw verbeeld. Voor altijd.`, description },
};

export default function DutchHomePage() {
  return (
    <main id="main">
      <Hero />
      <Manifesto />
      <Services />
      <Work />
      <About />
      <Process />
      <Testimonials />
      <ContactCta />
    </main>
  );
}
