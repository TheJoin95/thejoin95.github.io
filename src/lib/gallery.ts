type MediaBase = {
  id: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
};

export type GalleryMedia = MediaBase & (
  | { kind: "image"; src?: string; alt: string; fit?: "contain" | "cover"; focalPoint?: string }
  | { kind: "video"; src?: string; poster?: string; transcript: string; captions?: { src: string; language: string; label: string }[] }
);

// Keep native Suspense fallback and hydrated requests identical to avoid loading
// the original asset before its responsive optimized counterpart.
export function galleryImageSizes(count: number) {
  return count === 1
    ? "(min-width: 1600px) 1504px, (min-width: 1200px) calc(100vw - 96px), (min-width: 768px) calc(100vw - 64px), 100vw"
    : "(min-width: 1600px) 720px, (min-width: 1200px) 48vw, (min-width: 768px) 70vw, 85vw";
}

export function boundedIndex(index: number, count: number) {
  return Math.max(0, Math.min(index, count - 1));
}

export function indexAtScroll(left: number, maximum: number, count: number) {
  if (maximum <= 0) return 0;
  return boundedIndex(Math.round((left / maximum) * (count - 1)), count);
}
