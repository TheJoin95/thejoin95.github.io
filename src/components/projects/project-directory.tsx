import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteStyles } from "@/components/site/styles";
import type { ProjectIndexEntry } from "@/content/work";

export function ProjectDirectory({ entries, showPreviews = false }: { entries: readonly ProjectIndexEntry[]; showPreviews?: boolean }) {
  return <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 desktop:grid-cols-3">
    {entries.map(project => <li key={project.id} className="min-w-0 border-t border-border pt-4 [overflow-wrap:anywhere]">
      {showPreviews && project.preview ? (
        <div className="relative mb-4 aspect-[40/21] overflow-hidden rounded-sm border border-border bg-muted">
          <Image src={project.preview.src} alt={project.preview.alt} fill loading="lazy"
            sizes="auto, (min-width: 1600px) 470px, (min-width: 1200px) 30vw, (min-width: 768px) 44vw, 92vw"
            className={project.preview.fit === "cover" ? "object-cover" : "object-contain"} />
        </div>
      ) : null}
      <h3 className="text-[clamp(1.5rem,2vw,2rem)] leading-tight tracking-[-0.025em]">
        {project.href ? <Link href={project.href} className={siteStyles.link}>{project.title}{project.href.startsWith("https://") ? <ArrowUpRight size={20} aria-hidden="true" className="shrink-0" /> : null}</Link> : project.title}
      </h3>
      <p className="mt-3 text-base text-muted-foreground">{project.status}</p>
      <p className="mt-4">{project.summary}</p>
      <p className="mt-4">{project.contribution}</p>
      {!project.href ? <p className="mt-4 text-base text-muted-foreground">No public link yet.</p> : null}
    </li>)}
  </ul>;
}
