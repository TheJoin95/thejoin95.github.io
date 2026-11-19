import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { projectIndex } from "@/content/work";
import { previewSources, projectPreviewWidths } from "@/lib/preview-images";
import { ProjectCoverImage } from "./project-cover-image";

const coverSizes = "(min-width: 1600px) 470px, (min-width: 1200px) 30vw, (min-width: 768px) 44vw, 92vw";
const coverRatios = ["aspect-[3/2]", "aspect-[5/4]", "aspect-[16/10]", "aspect-[4/3]"];
const coverPalettes = [
  "bg-(--experiment-cloud) text-(--experiment-ink)",
  "bg-(--experiment-ink) text-(--reverse)",
  "bg-(--experiment-sky) text-(--ink)",
  "bg-(--experiment-ink) text-(--experiment-accent)",
  "bg-(--experiment-slate) text-(--reverse)",
];

export function ProjectIndex() {
  return <Section labelledBy="project-index-title">
    <div className={siteStyles.container}>
      <h2 id="project-index-title" className={`${siteStyles.sectionTitle} w-fit`} tabIndex={-1}>The complete index.</h2>
      <ul role="list" className="mt-8 gap-x-8 md:mt-10 md:columns-2 desktop:columns-3 desktop:gap-x-10">
        {projectIndex.map((project, index) => {
          const preview = project.preview;
          const hasMedia = preview && !preview.src.startsWith("/share/projects/");
          const diagram = preview?.src.endsWith(".svg");
          return <li key={project.id} className="mb-10 break-inside-avoid last:mb-0 desktop:mb-14">
            <div className={`relative isolate flex items-end overflow-hidden p-[7%] ${coverRatios[index % coverRatios.length]} ${coverPalettes[index % coverPalettes.length]}`}>
              <span aria-hidden="true" className="w-full border-t border-current pt-4 text-[clamp(1.65rem,3vw,3rem)] leading-none tracking-[-0.05em] text-balance">
                {project.title}
              </span>
              {hasMedia ? <ProjectCoverImage
                {...(diagram ? { src: preview.src } : previewSources(project.id, projectPreviewWidths, coverSizes))}
                alt={preview.alt}
                className={`absolute inset-0 h-full w-full ${diagram ? "bg-(--experiment-ink)" : "bg-(--experiment-cloud)"} ${preview.fit === "cover" || project.id === "chromatique" ? "object-cover" : "object-contain"}`}
              /> : null}
            </div>
            <div className="mt-3">
              <h3 className="text-[clamp(1.5rem,2vw,2rem)] leading-tight tracking-[-0.025em]">
                {project.href ? <Link href={project.href} prefetch={false} className={siteStyles.link}>
                  {project.title}
                  {project.href.startsWith("https://") ? <ArrowUpRight size={20} aria-hidden="true" className="shrink-0" /> : null}
                </Link> : <span className="flex min-h-11 items-center">{project.title}</span>}
              </h3>
              <p className="text-meta text-muted-foreground">{project.status}</p>
              <p className="mt-2 text-base">{project.summary}</p>
              <p className="mt-1 text-base text-muted-foreground">{project.contribution}</p>
              {!project.href ? <p className="mt-2 text-meta text-muted-foreground">No public link yet.</p> : null}
            </div>
          </li>;
        })}
      </ul>
    </div>
  </Section>;
}
