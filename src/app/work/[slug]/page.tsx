import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/work/case-study";
import { caseStudyPath, caseStudyStructuredData, findCaseStudy, publishedCaseStudies } from "@/content/case-studies";
import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";

export function generateStaticParams() { return publishedCaseStudies.map(story => ({ slug: story.project.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const story = findCaseStudy((await params).slug);
  if (!story) notFound();
  return pageMetadata({ title: story.project.title, description: story.introduction, path: caseStudyPath(story.project), image: `/share/projects/${story.project.id}`, imageAlt: `${story.project.title} — a project story by Miki Lombardi` });
}
export default async function ProjectStory({ params }: { params: Promise<{ slug: string }> }) {
  const story = findCaseStudy((await params).slug);
  if (!story) notFound();
  return <><CaseStudyPage story={story} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(caseStudyStructuredData(story, siteOrigin())) }} /></>;
}
