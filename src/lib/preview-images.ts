export const projectPreviewWidths = [480, 960] as const;
export const palettePreviewWidths = [480, 828, 1200, 1600, 2048, 2880, 3200] as const;

export function previewPath(id: string, width: number) {
  return `/media/previews/${id}-${width}.webp`;
}

export function previewSources(id: string, widths: readonly [number, ...number[]], sizes: string) {
  return {
    sizes,
    srcSet: widths.map(width => `${previewPath(id, width)} ${width}w`).join(", "),
    src: previewPath(id, widths[0]),
  };
}
