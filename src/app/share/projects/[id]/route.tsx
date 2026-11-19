import { findCaseStudy, publishedCaseStudies } from "@/content/case-studies";
import OpenGraphImage from "@/app/opengraph-image";
import { projectTitleImage } from "@/components/social/title-card";
export function generateStaticParams() { return publishedCaseStudies.map(({ project }) => ({ id: project.id })); }
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const project = findCaseStudy(id)?.project;
  if (!project) return OpenGraphImage();
  return projectTitleImage(project);
}
