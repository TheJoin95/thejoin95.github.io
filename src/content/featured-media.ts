import type { GalleryMedia } from "@/lib/gallery";

export type ProjectPreview = { src: string; alt: string; fit?: "contain" | "cover" };

const projectCovers: Readonly<Record<string, ProjectPreview>> = {
  certo: { src: "/media/project-covers/certo.webp", alt: "Certo’s public share card showing its certificate design interface." },
  vitni: { src: "/media/project-covers/vitni.webp", alt: "Vitni Repair’s public share card with its illustrated repair mascot." },
  "vitni-credentials": { src: "/media/project-covers/vitni-credentials.webp", alt: "Vitni Credentials’ public share card featuring a blue credential badge." },
};

export function projectPreview(project: { id: string; media: readonly GalleryMedia[] }): ProjectPreview {
  if (projectCovers[project.id]) return projectCovers[project.id];
  const still = project.media.find(item => item.kind === "image" && item.src);
  if (still?.kind === "image" && still.src) {
    return { src: still.src, alt: still.alt, fit: still.fit };
  }
  return { src: `/share/projects/${project.id}`, alt: "" };
}

export const paletteImages = {
  original: "/media/chromatique/irises-study-original.jpg",
  palette: "/media/chromatique/irises-study-nord.png",
  width: 3200,
  height: 2172,
} as const;

// Real UI captures. Provenance and source URLs: docs/content/media-provenance.md.
export const imageGoNordMedia: readonly GalleryMedia[] = [
  { id: "ign-conversion", kind: "image", src: "/media/imagegonord/converter-preview-2x.png", width: 2400, height: 1420,
    alt: "A garden photograph preview beside Nord palette swatches and conversion options.",
    caption: "ImageGoNord’s browser preview and conversion settings.",
    credit: "ImageGoNord / Schrödinger Hat · photograph: Frances Benjamin Johnston / Library of Congress" },
  { id: "ign-introduction", kind: "image", src: "/media/imagegonord/introduction-2x.png", width: 2000, height: 916,
    alt: "ImageGoNord’s introduction with links to more palettes and documentation.",
    caption: "The live website’s introduction to palette conversion.",
    credit: "ImageGoNord / Schrödinger Hat · interface capture, November 2026" },
  { id: "ign-python-docs", kind: "image", src: "/media/imagegonord/python-documentation-2x.png", width: 1720, height: 1032,
    alt: "ImageGoNord’s Python documentation introduces the NordPaletteFile class and palette groups.",
    caption: "The live Python guide explains how the package organises palette files.",
    credit: "ImageGoNord / Schrödinger Hat · documentation capture, November 2026" },
];

export const chromatiqueMedia: readonly GalleryMedia[] = [
  { id: "chromatique-original", kind: "image", src: paletteImages.original, width: paletteImages.width, height: paletteImages.height,
    alt: "Hand-coloured photograph of irises and trees along the West Potomac Park embankment.", caption: "Cropped scan used as input: Irises along the embankment, West Potomac Park, 1921.", credit: "Frances Benjamin Johnston / Library of Congress · no known restrictions on publication" },
  { id: "chromatique-nord", kind: "image", src: paletteImages.palette, width: paletteImages.width, height: paletteImages.height,
    alt: "The same garden photograph mapped to the sixteen colours of the Nord palette.", caption: "Actual Chromatique CLI output: Nord palette, OKLab, CPU, no dithering.", credit: "Chromatique 0.2.0 · source photograph: Frances Benjamin Johnston / Library of Congress; Nord palette: Sven Greb" },
];

export const supermarketMedia: readonly GalleryMedia[] = [
  { id: "supermarket-architecture", kind: "image", src: "/media/supermarket/architecture.svg", width: 1200, height: 480,
    alt: "Architecture: GitHub Pages frontend, Flask and uWSGI backend, Redis geospatial lookup and expiring cache; hosting evolved from Raspberry Pi to regional VPS instances.",
    caption: "Documented architecture, drawn from the preserved technical article. This is a diagram, not a historical screenshot.",
    credit: "Miki Lombardi’s 2021 technical article · source-derived diagram, 2026" },
];
