import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { projectIndex } from "@/content/work";

export function ProjectIndex() {
  return <Section labelledBy="project-index-title"><div className={siteStyles.container}>
    <h2 id="project-index-title" className={siteStyles.sectionTitle}>The complete index.</h2>
    <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 desktop:grid-cols-3">
      {projectIndex.map(project => <li key={project.id} className="min-w-0 border-t border-border pt-4 [overflow-wrap:anywhere]">
        <h3 className="text-[clamp(1.5rem,2vw,2rem)] leading-tight tracking-[-0.025em]">
          {project.href ? <Link href={project.href} className={siteStyles.link}>{project.title}{project.href.startsWith("https://") ? <ArrowUpRight size={20} aria-hidden="true" className="shrink-0" /> : null}</Link> : project.title}
        </h3>
        <p className="mt-3 text-base text-muted-foreground">{project.status}</p>
        <p className="mt-4">{project.summary}</p>
        <p className="mt-4">{project.contribution}</p>
        {!project.href ? <p className="mt-4 text-base text-muted-foreground">No public link yet.</p> : null}
      </li>)}
    </ul>
  </div></Section>;
}
