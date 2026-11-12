import { caseStudyPath, findCaseStudy } from "@/content/case-studies";
import type { SelectedProject } from "@/content/selected-projects";
import { ProjectGallery } from "./project-gallery";

export function ProjectFeature({ project }: { project: SelectedProject }) {
  const story = findCaseStudy(project.id);
  return <ProjectGallery id={project.id} title={project.title} href={story ? caseStudyPath(project) : project.href} linkLabel={story ? `Read the ${project.title} story` : project.linkLabel} media={project.media}>
    {project.status ? <p>{project.status}</p> : null}
    <p>{project.summary}</p><p>{project.contribution}</p>
    {story ? <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={project.href}>{project.linkLabel}</a> : null}
  </ProjectGallery>;
}
