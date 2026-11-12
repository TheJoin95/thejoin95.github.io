import { ImageResponse } from "next/og";
import { selectedProjects } from "@/content/selected-projects";
import OpenGraphImage from "@/app/opengraph-image";
import { TitleCard, shareSize } from "@/components/social/title-card";
export function generateStaticParams() { return selectedProjects.map(({ id }) => ({ id })); }
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const selected = selectedProjects.find(project => project.id === id);
  if (!selected) return OpenGraphImage();
  return new ImageResponse(<TitleCard title={selected.title} label="SELECTED WORK" detail={selected.status || "Software & open source"} />, shareSize);
}
