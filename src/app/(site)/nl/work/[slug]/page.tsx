import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CasePage from "@/components/work/CasePage";
import { cases, getCase, neighbours } from "@/content/cases";
import { site } from "@/content/site";
import { localePath, type Locale } from "@/lib/i18n/paths";

const LOCALE: Locale = "nl";
const PREFIX = localePath(LOCALE, "/").replace(/\/$/, "");

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getCase(slug, LOCALE);
  if (!found) return {};
  const { project, study } = found;
  const path = `${PREFIX}/work/${project.id}`;
  return {
    title: project.title,
    description: study.standfirst,
    authors: [{ name: site.founder.name, url: `${site.url}/#studio` }],
    creator: site.founder.name,
    alternates: {
      canonical: path,
      languages: { en: `/work/${project.id}`, nl: `/nl/work/${project.id}`, "x-default": `/work/${project.id}` },
    },
    openGraph: {
      type: "article",
      url: path,
      siteName: site.legalName,
      title: `${project.title} · ${site.legalName}`,
      description: study.standfirst,
      locale: ({ en: "en_US", nl: "nl_BE" } as Record<Locale, string>)[LOCALE],
      images: project.image ? [{ url: project.image, width: 1200, height: 1600, alt: project.title }] : [{ url: "/og.jpg", width: 1200, height: 630 }],
      authors: [`${site.url}/#studio`],
    },
  };
}

export default async function WorkCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getCase(slug, LOCALE);
  if (!found) notFound();
  const { prev, next } = neighbours(slug);
  return <CasePage project={found.project} study={found.study} prev={prev} next={next} locale={LOCALE} />;
}
