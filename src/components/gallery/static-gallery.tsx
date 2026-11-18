import { galleryImageSizes, type GalleryMedia } from "@/lib/gallery";
import { getImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { GalleryCaption, galleryStyles, MediaSurface } from "@/components/media/presentation";

// This native-media fallback must not depend on the gallery's client bundle.
export function StaticGallery({ label, items }: { label: string; items: readonly GalleryMedia[] }) {
  if (items.length === 0) return null;
  return <div role="region" aria-label={label} className="min-w-0">
    <ol tabIndex={0} aria-label="Scrollable project media" className={galleryStyles.track}>
      {items.map((item) => <li key={item.id} className={cn(galleryStyles.slide, items.length === 1 ? "basis-full" : galleryStyles.peek)}>
        <figure>
          <MediaSurface className={galleryStyles.frame}>
            {item.kind === "image" && item.src ? (
              // Native markup keeps media visible if client rendering is suspended.
              // eslint-disable-next-line @next/next/no-img-element
              <img {...getImageProps({ src: item.src, alt: item.alt, width: item.width, height: item.height, sizes: galleryImageSizes(items.length), loading: "lazy" }).props} alt={item.alt} className={cn("h-full min-h-0 w-full", item.fit === "cover" ? "object-cover" : "object-contain")} style={{ objectPosition: item.focalPoint }} />
            ) : item.kind === "video" && item.src ? (
              <video src={item.src} controls playsInline preload="none" poster={item.poster} width={item.width} height={item.height} aria-label={item.caption} className="h-full min-h-0 w-full object-contain">
                {item.captions?.map(track => <track key={track.src} kind="captions" src={track.src} srcLang={track.language} label={track.label} />)}
              </video>
            ) : <p className="p-6">{item.kind === "image" ? "Image" : "Video"} unavailable.</p>}
          </MediaSurface>
          <GalleryCaption item={item} />
        </figure>
      </li>)}
    </ol>
  </div>;
}
