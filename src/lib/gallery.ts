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

export function boundedIndex(index: number, count: number) {
  return Math.max(0, Math.min(index, count - 1));
}

export function indexAtScroll(left: number, maximum: number, count: number) {
  if (maximum <= 0) return 0;
  return boundedIndex(Math.round((left / maximum) * (count - 1)), count);
}
