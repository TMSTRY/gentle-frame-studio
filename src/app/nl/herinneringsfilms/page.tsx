import type { Metadata } from "next";
import MemorialPage from "@/components/memorial/MemorialPage";
import { memorialCopy } from "@/content/memorial";
import { site } from "@/content/site";

const copy = memorialCopy.nl;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: {
    canonical: copy.path,
    languages: {
      en: memorialCopy.en.path,
      nl: memorialCopy.nl.path,
      "x-default": memorialCopy.en.path,
    },
  },
  openGraph: {
    type: "website",
    url: copy.path,
    siteName: site.legalName,
    title: `${copy.meta.title} — ${site.legalName}`,
    description: copy.meta.description,
    images: [{ url: "/og-memorial.jpg", width: 1200, height: 630, alt: copy.meta.title }],
    locale: copy.ogLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${copy.meta.title} — ${site.legalName}`,
    description: copy.meta.description,
    images: ["/og-memorial.jpg"],
  },
};

export default function HerinneringsfilmsPage() {
  return <MemorialPage copy={copy} />;
}
