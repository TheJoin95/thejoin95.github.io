import { ProjectDirectorySection } from "@/components/projects/project-directory";
import { projectIndex } from "@/content/work";

export function ProjectIndex() {
  return <ProjectDirectorySection id="project-index-title" title="The complete index." entries={projectIndex} />;
}
