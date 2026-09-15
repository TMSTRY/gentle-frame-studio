import type { Metadata } from "next";
import About from "@/components/sections/About";
import ContactCta from "@/components/sections/ContactCta";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Portal from "@/components/sections/Portal";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Work from "@/components/sections/Work";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { en: "/", nl: "/nl", "x-default": "/" } },
};

export default function HomePage() {
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
