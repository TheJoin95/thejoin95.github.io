import type { GalleryMedia } from "@/lib/gallery";

// Real UI captures. Provenance and source URLs: docs/content/media-provenance.md.
export const imageGoNordMedia: readonly GalleryMedia[] = [
  { id: "ign-conversion", kind: "image", src: "/media/imagegonord/conversion-interface.png", width: 1200, height: 870,
    alt: "ImageGoNord upload area beside Nord palette swatches and conversion options.", caption: "The conversion interface: upload an image and choose palette options.", credit: "ImageGoNord / Schrödinger Hat · interface capture, November 2026" },
  { id: "ign-introduction", kind: "image", src: "/media/imagegonord/introduction.png", width: 1200, height: 363,
    alt: "ImageGoNord’s introduction with links to more palettes and documentation.", caption: "The live website’s introduction to palette conversion.", credit: "ImageGoNord / Schrödinger Hat · interface capture, November 2026" },
  { id: "ign-palette", kind: "image", src: "/media/imagegonord/palette-controls.png", width: 261, height: 710,
    alt: "Polar Night, Snow Storm, Frost and Aurora colour swatches above conversion settings.", caption: "Palette groups and conversion settings. Open the full-size image to read the controls.", credit: "ImageGoNord / Schrödinger Hat · interface detail, November 2026" },
];

export const chromatiqueMedia: readonly GalleryMedia[] = [
  { id: "chromatique-original", kind: "image", src: "/media/chromatique/irises-original.jpg", width: 1024, height: 846,
    alt: "Hand-coloured photograph of irises and trees along the West Potomac Park embankment.", caption: "Original input: Irises along the embankment, West Potomac Park, 1921.", credit: "Frances Benjamin Johnston / Library of Congress · no known restrictions on publication" },
  { id: "chromatique-nord", kind: "image", src: "/media/chromatique/irises-nord.png", width: 1024, height: 846,
    alt: "The same garden photograph mapped to the sixteen colours of the Nord palette.", caption: "Actual Chromatique CLI output: Nord palette, OKLab, CPU, no dithering.", credit: "Chromatique 0.2.0 · source photograph: Frances Benjamin Johnston / Library of Congress; Nord palette: Sven Greb" },
];

export const supermarketMedia: readonly GalleryMedia[] = [
  { id: "supermarket-architecture", kind: "image", src: "/media/supermarket/architecture.svg", width: 1200, height: 480,
    alt: "Architecture: GitHub Pages frontend, Flask and uWSGI backend, Redis geospatial lookup and expiring cache; hosting evolved from Raspberry Pi to regional VPS instances.",
    caption: "Documented architecture, drawn from the preserved technical article. This is a diagram, not a historical screenshot.",
    credit: "Miki Lombardi’s 2021 technical article · source-derived diagram, 2026" },
];
