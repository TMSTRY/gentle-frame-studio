import type { Metadata } from "next";
import { site } from "@/content/site";
import About from "@/components/sections/About";
import ContactCta from "@/components/sections/ContactCta";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Portal from "@/components/sections/Portal";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Work from "@/components/sections/Work";

// Both lines live in site.ts next to their English twins, so a brand
// decision changes Google and link previews in both languages at once.
const title = `${site.legalName} · ${site.titleLines.nl}`;
const description = site.descriptions.nl;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "Tim Mostrey",
    "Gentle Frame Studio",
    "creatieve studio België",
    "herinneringsfilm",
    "bedrijfsfilm",
    "productfilm",
    "muziekvideo",
    "motion design",
    "website laten maken",
    "webdesign België",
    "app laten maken",
    "digitaal platform",
    "AI-beeldproductie",
  ],
  alternates: { canonical: "/nl", languages: { en: "/", nl: "/nl", "x-default": "/" } },
  // A page-level openGraph replaces the layout's whole object, so the
  // image, site name and type have to travel along or /nl loses them.
  openGraph: {
    type: "website",
    url: "/nl",
    siteName: site.legalName,
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} · ${site.titleLines.nl}` }],
    locale: "nl_BE",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
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
      <Portal />
      <Testimonials />
      <ContactCta />
    </main>
  );
}
