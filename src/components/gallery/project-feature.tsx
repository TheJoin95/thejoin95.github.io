import { caseStudyPath, findCaseStudy } from "@/content/case-studies";
import type { SelectedProject } from "@/content/selected-projects";
import { ProjectGallery } from "./project-gallery";

export function ProjectFeature({ project, compact = false }: { project: SelectedProject; compact?: boolean }) {
  const story = findCaseStudy(project.id);
  return <ProjectGallery id={project.id} title={project.title} href={story ? caseStudyPath(project) : project.href} linkLabel={story ? `Read the ${project.title} story` : project.linkLabel} media={project.media} compact={compact}>
    {project.status ? <p>{project.status}</p> : null}
    <p>{project.summary}</p>
    {!compact ? <p>{project.contribution}</p> : null}
    {story && !compact ? <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={project.href}>{project.linkLabel}</a> : null}
  </ProjectGallery>;
}
