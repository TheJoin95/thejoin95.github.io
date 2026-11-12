import Link from "next/link";
import { ProjectFeature } from "@/components/gallery/project-feature";
import { selectedProjects } from "@/content/selected-projects";
import { siteStyles } from "@/components/site/styles";

export function SelectedWork() {
  return <section className="surface-charcoal pb-(--section-space)" aria-labelledby="selected-work-title">
    <div className={siteStyles.container}>
      <h2 id="selected-work-title" className="pt-12 text-[clamp(1.75rem,3vw,3rem)] leading-[1.15] tracking-[-0.03em]">A few things I’ve built, shaped, and shared.</h2>
    </div>
    {selectedProjects.map(project => <ProjectFeature key={project.id} project={project} />)}
    <div className={siteStyles.container}><div className={siteStyles.actions}>
      <Link href="/work">Explore all work</Link><Link href="/play">More experiments in Play</Link><Link href="/about">About Miki</Link>
    </div></div>
  </section>;
}
