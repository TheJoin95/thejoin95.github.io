import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { projectTitleImage } from "../src/components/social/title-card";
import { publishedCaseStudies } from "../src/content/case-studies";
import { paletteImages, projectPreview } from "../src/content/featured-media";
import { palettePreviewWidths, previewPath, projectPreviewWidths } from "../src/lib/preview-images";

async function writeVariants(id: string, source: string | Buffer, widths: readonly number[], quality: number) {
  const image = sharp(source);
  await Promise.all(widths.map(width =>
    image.clone().resize({ width }).webp({ quality }).toFile(`public${previewPath(id, width)}`),
  ));
}

await mkdir("public/media/previews", { recursive: true });
for (const { project } of publishedCaseStudies) {
  const { src } = projectPreview(project);
  if (src.endsWith(".svg")) continue;

  const input = src.startsWith("/share/projects/")
    ? Buffer.from(await projectTitleImage(project).arrayBuffer())
    : `public${src}`;
  await writeVariants(project.id, input, projectPreviewWidths, 75);
}
await writeVariants("palette-original", `public${paletteImages.original}`, palettePreviewWidths, 70);
await writeVariants("palette-nord", `public${paletteImages.palette}`, palettePreviewWidths, 70);
