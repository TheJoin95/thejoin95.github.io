import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteStyles } from "./styles";
import { MediaCaption, MediaSurface } from "@/components/media/presentation";

export function PageIntro({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      siteStyles.container,
      "grid gap-5 py-(--intro-space)",
      "md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] md:items-start",
      "desktop:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] desktop:gap-12",
      className,
    )}>
      <h1 className="font-heading text-display text-balance [overflow-wrap:anywhere]">{title}</h1>
      <div className="max-w-[32ch] text-lead [&>*+*]:mt-6">
        {children}
      </div>
    </div>
  );
}

export function Section({ children, className, labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  return <section className={cn(siteStyles.sectionSpace, className)} aria-labelledby={labelledBy}>{children}</section>;
}

export function ContentState({ title, children, action, loading = false, headingLevel = "h2" }: { title: string; children: ReactNode; action?: ReactNode; loading?: boolean; headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <div className="grid max-w-[68ch] gap-6" role={loading ? "status" : undefined} aria-live={loading ? "polite" : undefined}>
      <Heading className={siteStyles.sectionTitle}>{title}</Heading>
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
