import { Suspense, type ReactNode } from "react";
import { MediaGallery } from "./media-gallery";
import type { GalleryMedia } from "@/lib/gallery";
import { siteStyles } from "@/components/site/styles";
import { cn } from "@/lib/utils";
import { StaticGallery } from "./static-gallery";

export function ProjectGallery({ id, title, children, href, linkLabel, media }: {
  id: string; title: string; children: ReactNode; href?: string; linkLabel?: string; media: readonly GalleryMedia[];
}) {
  return <section aria-labelledby={id} className={cn(siteStyles.container, "grid gap-6 py-(--section-space)", media.length > 0 && "desktop:grid-cols-[minmax(0,2fr)_minmax(0,10fr)]")}>
    <div className={cn("min-w-0 space-y-4", media.length === 0 && "max-w-[68ch]")}>
      <h2 id={id} className="text-[clamp(1.75rem,2.4vw,2.5rem)] leading-[1.1] tracking-[-0.035em] [overflow-wrap:anywhere]">{title}</h2>
      <div className="text-base [&>*+*]:mt-4">{children}</div>
      {href && linkLabel ? <a className="inline-flex min-h-11 items-center text-base" href={href}>{linkLabel}</a> : null}
    </div>
    {media.length > 0 ? <Suspense fallback={<StaticGallery label={`${title} media`} items={media} />}>
      <MediaGallery label={`${title} media`} items={media} />
    </Suspense> : null}
  </section>;
}
