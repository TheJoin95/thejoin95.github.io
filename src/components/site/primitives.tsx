import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteStyles } from "./styles";
import { MediaCaption, MediaSurface } from "@/components/media/presentation";

export function PageIntro({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      siteStyles.container,
      "grid gap-6 py-(--section-space)",
      "md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] md:items-end",
      "desktop:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] desktop:gap-12",
      className,
    )}>
      <h1 className={cn(
        "text-[clamp(3rem,8.1vw,9rem)] leading-[1.02] tracking-[-0.04em]",
        "text-balance [overflow-wrap:anywhere]",
        "md:text-[clamp(4.5rem,7.8vw,6rem)]",
        "desktop:text-[clamp(6rem,8.1vw,9rem)] desktop:leading-[0.98]",
      )}>{title}</h1>
      <div className="max-w-[40ch] text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35] [&>*+*]:mt-6">
        {children}
      </div>
    </div>
  );
}

export function Section({ children, className, labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  return <section className={cn(siteStyles.sectionSpace, className)} aria-labelledby={labelledBy}>{children}</section>;
}

export function ContentState({ title, children, action, loading = false }: { title: string; children: ReactNode; action?: ReactNode; loading?: boolean }) {
  return (
    <div className="grid max-w-[68ch] gap-6" role={loading ? "status" : undefined} aria-live={loading ? "polite" : undefined}>
      <h2 className={siteStyles.sectionTitle}>{title}</h2>
      <div className={siteStyles.copy}>{children}</div>
      {action ? <div className={siteStyles.actions}>{action}</div> : null}
    </div>
  );
}

export function MediaFrame({ src, alt, width, height, caption, credit, fit = "contain", priority = false }: {
  src?: string; alt: string; width: number; height: number; caption?: string; credit?: string;
  fit?: "contain" | "cover"; priority?: boolean;
}) {
  return (
    <figure className="media-figure">
      <MediaSurface className="overflow-hidden border border-input bg-background" style={{ aspectRatio: `${width} / ${height}` }}>
        {src ? (
          <Image src={src} alt={alt} width={width} height={height}
            sizes="(min-width: 1600px) 1504px, (min-width: 1200px) calc(100vw - 96px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)"
            className={cn("h-full min-h-0 w-full", fit === "cover" ? "media-cover object-cover" : "media-contain object-contain")}
            priority={priority} />
        ) : (
          <p className="p-6 text-muted-foreground">Image unavailable{alt ? <span> — {alt}</span> : null}</p>
        )}
      </MediaSurface>
      {caption || credit ? (
        <MediaCaption className="text-muted-foreground">
          {caption}{credit ? <span className="block">{credit}</span> : null}
        </MediaCaption>
      ) : null}
    </figure>
  );
}
