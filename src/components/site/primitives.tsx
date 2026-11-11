import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function PageIntro({ title, children }: { title: string; children: ReactNode }) {
  return <div className="site-container page-intro"><h1 className="display-title">{title}</h1><div className="page-lead">{children}</div></div>;
}

export function Section({ children, className, labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  return <section className={cn("section-space", className)} aria-labelledby={labelledBy}>{children}</section>;
}

export function ContentState({ title, children, action, loading = false }: { title: string; children: ReactNode; action?: ReactNode; loading?: boolean }) {
  return <div className="content-state" role={loading ? "status" : undefined} aria-live={loading ? "polite" : undefined}>
    <h2 className="section-title">{title}</h2><div className="reading-copy">{children}</div>{action ? <div className="state-actions">{action}</div> : null}
  </div>;
}

export function MediaFrame({ src, alt, width, height, caption, credit, fit = "contain", priority = false }: {
  src?: string; alt: string; width: number; height: number; caption?: string; credit?: string;
  fit?: "contain" | "cover"; priority?: boolean;
}) {
  return <figure className="media-figure"><div className="media-frame" style={{ aspectRatio: `${width} / ${height}` }}>
    {src ? <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1600px) 1504px, (min-width: 1200px) calc(100vw - 96px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)" className={fit === "cover" ? "media-cover" : "media-contain"} priority={priority} />
      : <p className="media-unavailable">Image unavailable{alt ? <span> — {alt}</span> : null}</p>}
  </div>{caption || credit ? <figcaption>{caption}{credit ? <span className="media-credit">{credit}</span> : null}</figcaption> : null}</figure>;
}
