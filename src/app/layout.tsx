import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Cursor from "@/components/fx/Cursor";
import SmoothScroll from "@/components/fx/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/** The <title> and link-preview title: descriptive, not the slogan. */
const pageTitle = `${site.legalName} · ${site.titleLines.en}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s · ${site.legalName}`,
  },
  description: site.description,
  authors: [{ name: site.founder.name, url: `${site.url}/#studio` }],
  creator: site.founder.name,
  publisher: site.legalName,
  keywords: [
    "Tim Mostrey",
    "Gentle Frame Studio",
    "creative studio Belgium",
    "memorial films",
    "brand films",
    "product films",
    "music videos",
    "motion design",
    "websites",
    "web design Belgium",
    "web development",
    "app development",
    "digital platforms",
    "AI visual production",
    "creative consulting",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.legalName,
    title: pageTitle,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} · ${site.titleLines.en}` }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: site.description,
    images: ["/og.jpg"],
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

/** The disciplines, spelled out for the knowledge graph; one list for the studio and its founder. */
const knowsAbout = [
  "films",
  "memorial films",
  "brand films",
  "websites",
  "motion design",
  "apps",
  "platforms",
  "AI visual production",
  "creative consulting",
];

const founderSchema = {
  "@type": "Person",
  "@id": `${site.url}/#founder`,
  name: site.founder.name,
  jobTitle: site.founder.role,
  url: `${site.url}/#studio`,
  worksFor: { "@id": `${site.url}/#organization` },
  sameAs: site.founder.sameAs,
  knowsAbout,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.legalName,
      alternateName: site.name,
      url: site.url,
      email: site.email,
      slogan: site.tagline,
      foundingDate: site.founded,
      founder: { "@id": `${site.url}/#founder` },
      employee: { "@id": `${site.url}/#founder` },
      address: { "@type": "PostalAddress", addressCountry: "BE" },
      description: site.description,
      knowsAbout,
    },
    founderSchema,
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}.reveal-word{transform:none!important}[data-scrub-word]{opacity:1!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="fixed top-4 left-4 z-[120] -translate-y-24 rounded-sm bg-champagne px-4 py-2 text-xs tracking-widest text-ink uppercase transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <Cursor />

        {children}

        {/* Cinematic finish: grain + vignette above everything */}
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <Analytics />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
