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
