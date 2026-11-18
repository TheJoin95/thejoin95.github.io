import { Suspense, type ReactNode } from "react";
import { MediaGallery } from "./media-gallery";
import type { GalleryMedia } from "@/lib/gallery";
import { siteStyles } from "@/components/site/styles";
import { cn } from "@/lib/utils";
import { StaticGallery } from "./static-gallery";

export function ProjectGallery({ id, title, children, href, linkLabel, media, compact = false }: {
  id: string; title: string; children: ReactNode; href?: string; linkLabel?: string; media: readonly GalleryMedia[]; compact?: boolean;
}) {
  return <section aria-labelledby={id} className={cn(siteStyles.container, "grid items-start gap-5 py-(--project-space) md:gap-6 desktop:gap-8", media.length > 0 && "md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]", media.length > 0 && (compact ? "desktop:grid-cols-[minmax(0,calc((100%_-_6rem)/4))_minmax(0,1fr)]" : "desktop:grid-cols-[minmax(0,1fr)_minmax(0,4fr)]"))}>
    <div className={cn("min-w-0 space-y-3", media.length === 0 ? "max-w-[68ch]" : "max-w-[46ch]")}>
      <h2 id={id} className={cn("leading-[1.1] tracking-[-0.035em] [overflow-wrap:anywhere]", compact ? "text-[1.375rem]" : "text-[clamp(1.75rem,2.4vw,2.5rem)]")}>{title}</h2>
      <div className={cn("text-meta [&>*+*]:mt-3", compact && "text-muted-foreground")}>{children}</div>
      {href && linkLabel ? <a className={cn("inline-flex min-h-11 items-center text-base", compact && "underline decoration-current/40 underline-offset-4 hover:decoration-current")} href={href}>{linkLabel}</a> : null}
    </div>
    {media.length > 0 ? <Suspense fallback={<StaticGallery label={`${title} media`} items={media} />}>
      <MediaGallery label={`${title} media`} items={media} />
    </Suspense> : null}
  </section>;
}
