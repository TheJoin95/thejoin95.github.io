import type { SelectedProject } from "@/content/selected-projects";
import { ProjectGallery } from "./project-gallery";

export function ProjectFeature({ project }: { project: SelectedProject }) {
  return <ProjectGallery id={project.id} title={project.title} href={project.href} linkLabel={project.linkLabel} media={project.media}>
    {project.status ? <p>{project.status}</p> : null}
    <p>{project.summary}</p><p>{project.contribution}</p>
  </ProjectGallery>;
}
