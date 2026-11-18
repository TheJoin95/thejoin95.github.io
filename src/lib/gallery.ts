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
    ? "auto, (min-width: 1600px) 1504px, (min-width: 1200px) calc(100vw - 96px), (min-width: 768px) calc(100vw - 64px), 100vw"
    : "auto, (min-width: 1600px) 1144px, (min-width: 1200px) 76vw, (min-width: 768px) 84vw, 88vw";
}

export function boundedIndex(index: number, count: number) {
  return Math.max(0, Math.min(index, count - 1));
}

export function indexAtScroll(left: number, maximum: number, offsets: readonly number[]) {
  if (maximum <= 0) return 0;
  // The last slide cannot align at the start when the viewport is wider than it.
  const distance = (offset: number) => Math.abs(left - Math.min(offset, maximum));
  return offsets.reduce((closest, offset, index) =>
    distance(offset) < distance(offsets[closest]) ? index : closest, 0);
}
