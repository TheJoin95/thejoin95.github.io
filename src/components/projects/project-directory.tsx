import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PreviewImage } from "@/components/media/preview-image";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import type { ProjectIndexEntry } from "@/content/work";
import { previewSources, projectPreviewWidths } from "@/lib/preview-images";

const coverSizes = "(min-width: 1600px) 475px, (min-width: 1200px) 30vw, (min-width: 768px) 44vw, 92vw";

type ProjectDirectoryProps = {
  entries: readonly ProjectIndexEntry[];
  showPreviews?: boolean;
  eagerFirstPreview?: boolean;
};

export function ProjectDirectorySection({ id, title, description, children, ...directory }: ProjectDirectoryProps & {
  id: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return <Section labelledBy={id}>
    <div className={siteStyles.container}>
      <h2 id={id} className={siteStyles.sectionTitle}>{title}</h2>
      {description ? <p className="mt-4 max-w-[60ch]">{description}</p> : null}
      <ProjectDirectory {...directory} />
      {children ? <div className={`${siteStyles.actions} mt-8`}>{children}</div> : null}
    </div>
  </Section>;
}

export function ProjectDirectory({ entries, showPreviews = false, eagerFirstPreview = false }: ProjectDirectoryProps) {
  const eagerProject = eagerFirstPreview ? entries.find(project => project.preview) : undefined;
  return <ul className="mt-8 grid gap-x-8 gap-y-10 md:mt-10 md:grid-cols-2 desktop:grid-cols-3 desktop:gap-x-10">
    {entries.map(project => <li key={project.id} className="min-w-0 border-t border-border pt-4 [overflow-wrap:anywhere]">
      {showPreviews && project.preview ? (
        <div className="relative mb-5 aspect-[40/21] overflow-hidden rounded-sm border border-border bg-muted">
          <PreviewImage
            {...(project.preview.src.endsWith(".svg") ? { src: project.preview.src } : previewSources(project.id, projectPreviewWidths, coverSizes))}
            alt={project.preview.alt}
            loading={project === eagerProject ? "eager" : "lazy"}
            fetchPriority={project === eagerProject ? "high" : undefined}
            className={`absolute inset-0 h-full w-full ${project.preview.fit === "cover" ? "object-cover" : "object-contain"}`}
          />
        </div>
      ) : null}
      <h3 className="flex min-h-11 items-center text-[clamp(1.5rem,2vw,2rem)] leading-tight tracking-[-0.025em]">
        {project.href ? <Link href={project.href} className={`${siteStyles.link} underline-offset-4`}>{project.title}{project.href.startsWith("https://") ? <ArrowUpRight size={20} aria-hidden="true" className="shrink-0" /> : null}</Link> : project.title}
      </h3>
      <p className="mt-2 text-meta text-muted-foreground">{project.status}</p>
      <p className="mt-4">{project.summary}</p>
      <p className="mt-3">{project.contribution}</p>
      {!project.href ? <p className="mt-3 text-meta text-muted-foreground">No public link yet.</p> : null}
    </li>)}
  </ul>;
}
