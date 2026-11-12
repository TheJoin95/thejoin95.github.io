import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import type { GalleryMedia } from "@/lib/gallery";

export function MediaSurface({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid place-items-center", className)} {...props} />;
}

export function MediaCaption({ className, ...props }: ComponentProps<"figcaption">) {
  return <figcaption className={cn("mt-3 text-[1rem]", className)} {...props} />;
}

export function GalleryCaption({ item, failed = false }: { item: GalleryMedia; failed?: boolean }) {
  return <MediaCaption className="[overflow-wrap:anywhere]">
    <p>{item.caption}</p><p className="text-muted-foreground">{item.credit}</p>
    {item.kind === "image" && item.src && !failed ? <a className="inline-flex min-h-11 items-center" href={item.src}>View full-size image<span className="sr-only">: {item.caption}</span></a> : null}
    {item.kind === "video" ? <details className="mt-2"><summary className="min-h-11 cursor-pointer">Video transcript</summary><p>{item.transcript}</p></details> : null}
  </MediaCaption>;
}
