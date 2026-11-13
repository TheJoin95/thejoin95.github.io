export const paletteImages = {
  original: "/media/chromatique/irises-original.jpg",
  palette: "/media/chromatique/irises-nord.png",
  width: 1024,
  height: 846,
} as const;

export function revealAt(clientX: number, left: number, width: number) {
  return Math.round(Math.max(0, Math.min(100, (1 - (clientX - left) / width) * 100)));
}

/** Match centred CSS object-fit: cover without stretching either texture. */
export function coverScale(width: number, height: number): [number, number] {
  const aspect = width / height;
  const imageAspect = paletteImages.width / paletteImages.height;
  return aspect > imageAspect ? [1, imageAspect / aspect] : [aspect / imageAspect, 1];
}
