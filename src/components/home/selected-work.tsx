import Link from "next/link";
import { ProjectFeature } from "@/components/gallery/project-feature";
import { selectedProjects } from "@/content/selected-projects";
import { siteStyles } from "@/components/site/styles";

export function SelectedWork() {
  return <section className="pb-(--section-space) desktop:[--gallery-slide-width:64%] [&>section+section]:border-t [&>section+section]:border-border" aria-label="Selected work">
    {selectedProjects.map(project => <ProjectFeature key={project.id} project={project} compact />)}
    <div className={siteStyles.container}><div className={`${siteStyles.actions} border-t border-border pt-6`}>
      <Link href="/work#project-index-title">Explore all work</Link><Link href="/play">More experiments in Play</Link><Link href="/about">About Miki</Link>
    </div></div>
  </section>;
}
