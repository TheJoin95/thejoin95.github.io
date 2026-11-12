import type { Metadata } from "next";
import { PageIntro } from "@/components/site/primitives";
import { ProjectFeature } from "@/components/gallery/project-feature";
import { imageGoNordProject, supermarketProject } from "@/content/selected-projects";

export const metadata: Metadata = { title: "Work", description: "Software, systems and open-source contributions by Miki Lombardi." };
export default function Work() {
  return <div className="surface-charcoal" data-surface="charcoal">
    <PageIntro title="Selected work."><p>Software, systems, and open-source contributions. Explore the problem, the implementation and the decisions behind each project.</p></PageIntro>
    {[imageGoNordProject, supermarketProject].map(project => <ProjectFeature key={project.id} project={project} />)}
  </div>;
}
