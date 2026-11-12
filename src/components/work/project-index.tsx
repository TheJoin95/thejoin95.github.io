import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { projectIndex } from "@/content/work";

export function ProjectIndex() {
  return <Section labelledBy="project-index-title"><div className={siteStyles.container}>
    <h2 id="project-index-title" className={siteStyles.sectionTitle}>The complete index.</h2>
    <ProjectDirectory entries={projectIndex} />
  </div></Section>;
}
