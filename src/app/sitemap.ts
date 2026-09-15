import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";
import { memorialCopy } from "@/content/memorial";
import { privacyCopy } from "@/content/privacy";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const privacyLanguages = {
    en: `${site.url}${privacyCopy.en.path}`,
    nl: `${site.url}${privacyCopy.nl.path}`,
  };
  const memorialLanguages = {
    en: `${site.url}${memorialCopy.en.path}`,
    nl: `${site.url}${memorialCopy.nl.path}`,
  };

  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: memorialLanguages.en,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: memorialLanguages },
    },
    {
      url: memorialLanguages.nl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: memorialLanguages },
    },
    ...cases.map((c) => ({ url: `${site.url}/work/${c.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: privacyLanguages.en, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: { languages: privacyLanguages } },
    { url: privacyLanguages.nl, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: { languages: privacyLanguages } },
  ];
}
