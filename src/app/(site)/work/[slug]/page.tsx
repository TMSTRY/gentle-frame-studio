import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CasePage from "@/components/work/CasePage";
import { cases, getCase, neighbours } from "@/content/cases";
import { site } from "@/content/site";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getCase(slug);
  if (!found) return {};
  const { project, study } = found;
  const path = `/work/${project.id}`;
  return {
    title: project.title,
    description: study.standfirst,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: site.legalName,
      title: `${project.title} · ${site.legalName}`,
      description: study.standfirst,
      images: project.image ? [{ url: project.image, width: 1200, height: 1600, alt: project.title }] : [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function WorkCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getCase(slug);
  if (!found) notFound();
  const { prev, next } = neighbours(slug);
  return <CasePage project={found.project} study={found.study} prev={prev} next={next} />;
}
