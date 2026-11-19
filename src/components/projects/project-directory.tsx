import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import type { ProjectIndexEntry } from "@/content/work";

type ProjectDirectoryProps = {
  entries: readonly ProjectIndexEntry[];
  showPreviews?: boolean;
};

export function ProjectDirectorySection({ id, title, description, children, entries, showPreviews }: ProjectDirectoryProps & {
  id: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return <Section labelledBy={id}>
    <div className={siteStyles.container}>
      <h2 id={id} className={siteStyles.sectionTitle}>{title}</h2>
      {description ? <p className="mt-4 max-w-[60ch]">{description}</p> : null}
      <ProjectDirectory entries={entries} showPreviews={showPreviews} />
      {children ? <div className={`${siteStyles.actions} mt-8`}>{children}</div> : null}
    </div>
  </Section>;
}

export function ProjectDirectory({ entries, showPreviews = false }: ProjectDirectoryProps) {
  return <ul className="mt-8 grid gap-x-8 gap-y-10 md:mt-10 md:grid-cols-2 desktop:grid-cols-3 desktop:gap-x-10">
    {entries.map(project => <li key={project.id} className="min-w-0 border-t border-border pt-4 [overflow-wrap:anywhere]">
      {showPreviews && project.preview ? (
        <div className="relative mb-5 aspect-[40/21] overflow-hidden rounded-sm border border-border bg-muted">
          <Image src={project.preview.src} alt={project.preview.alt} fill loading="lazy"
            sizes="auto, (min-width: 1600px) 470px, (min-width: 1200px) 30vw, (min-width: 768px) 44vw, 92vw"
            className={project.preview.fit === "cover" ? "object-cover" : "object-contain"} />
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
