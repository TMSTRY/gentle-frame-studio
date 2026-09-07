import type { MetadataRoute } from "next";
import { memorialCopy } from "@/content/memorial";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
  ];
}
