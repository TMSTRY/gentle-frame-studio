import About from "@/components/sections/About";
import ContactCta from "@/components/sections/ContactCta";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Work from "@/components/sections/Work";

export default function HomePage() {
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
