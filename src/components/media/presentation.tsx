import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import type { GalleryMedia } from "@/lib/gallery";

export const galleryStyles = {
  track: "relative flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-2 md:gap-4",
  slide: "min-w-0 shrink-0 snap-start",
  peek: "basis-[88%] md:basis-[84%] desktop:basis-[var(--gallery-slide-width,76%)]",
  frame: "relative aspect-[4/3] bg-(--experiment-ink) text-(--reverse) md:aspect-[5/3]",
};

export function MediaSurface({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid place-items-center", className)} {...props} />;
}

export function MediaCaption({ className, ...props }: ComponentProps<"figcaption">) {
  return <figcaption className={cn("mt-3 text-meta", className)} {...props} />;
}

export function GalleryCaption({ item, failed = false }: { item: GalleryMedia; failed?: boolean }) {
  return <MediaCaption className="[overflow-wrap:anywhere] text-muted-foreground">
    <p>{item.caption}</p><p>{item.credit}</p>
    {item.kind === "image" && item.src && !failed ? <a className="inline-flex min-h-11 items-center underline decoration-current/40 underline-offset-4 hover:text-foreground focus-visible:-outline-offset-3" href={item.src}>View full-size image<span className="sr-only">: {item.caption}</span></a> : null}
    {item.kind === "video" ? <details><summary className="min-h-11 cursor-pointer focus-visible:-outline-offset-3">Video transcript</summary><p>{item.transcript}</p></details> : null}
  </MediaCaption>;
}
