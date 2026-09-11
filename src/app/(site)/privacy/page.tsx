import type { Metadata } from "next";
import PrivacyPage from "@/components/legal/PrivacyPage";
import { privacyCopy } from "@/content/privacy";
import { site } from "@/content/site";

const copy = privacyCopy.en;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: {
    canonical: copy.path,
    languages: { en: privacyCopy.en.path, nl: privacyCopy.nl.path, "x-default": privacyCopy.en.path },
  },
  openGraph: { type: "website", url: copy.path, siteName: site.legalName, title: `${copy.meta.title} · ${site.legalName}`, description: copy.meta.description },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PrivacyPage copy={copy} />;
}
