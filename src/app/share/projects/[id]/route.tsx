import { ImageResponse } from "next/og";
import { findCaseStudy, publishedCaseStudies } from "@/content/case-studies";
import OpenGraphImage from "@/app/opengraph-image";
import { TitleCard, shareSize } from "@/components/social/title-card";
export function generateStaticParams() { return publishedCaseStudies.map(({ project }) => ({ id: project.id })); }
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const project = findCaseStudy(id)?.project;
  if (!project) return OpenGraphImage();
  return new ImageResponse(<TitleCard title={project.title} label="PROJECT CASE STUDY" detail={project.status || "Software & open source"} />, shareSize);
}
