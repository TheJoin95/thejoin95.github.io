import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { boundedIndex, indexAtScroll, type GalleryMedia } from "@/lib/gallery";
import { MediaGallery } from "@/components/gallery/media-gallery";
import { ProjectGallery } from "@/components/gallery/project-gallery";
import { imageGoNordMedia } from "@/content/featured-media";
import { StaticGallery } from "@/components/gallery/static-gallery";

const image: GalleryMedia = { id: "image", kind: "image", src: "/image.png", alt: "A real interface", width: 800, height: 600, caption: "The interface", credit: "Project team" };

describe("gallery navigation model", () => {
  test("bounds rapid navigation and handles empty or non-scrolling strips", () => {
    expect(boundedIndex(-1, 3)).toBe(0);
    expect(boundedIndex(99, 3)).toBe(2);
    expect(boundedIndex(1, 3)).toBe(1);
    expect(boundedIndex(0, 0)).toBe(0);
    expect(indexAtScroll(0, 0, 3)).toBe(0);
    expect(indexAtScroll(0, 100, 3)).toBe(0);
    expect(indexAtScroll(50, 100, 3)).toBe(1);
    expect(indexAtScroll(100, 100, 3)).toBe(2);
    expect(indexAtScroll(150, 100, 3)).toBe(2);
  });
  test("renders a meaningful labelled list before hydration", () => {
    const html = renderToStaticMarkup(<MediaGallery label="Project media" items={[image, { ...image, id: "two" }]} />);
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Project media"');
    expect(html).toContain("<ol");
    expect(html).toContain("<figcaption");
    expect(html).toContain('alt="A real interface"');
    expect(html).toContain("Project team");
    expect(html).toContain("View full-size image");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("Loading image…");
    expect(html).not.toContain('role="tablist"');
  });
  test("zero and missing media preserve the summary and project destination", () => {
    expect(renderToStaticMarkup(<MediaGallery label="Empty" items={[]} />)).toBe("");
    const html = renderToStaticMarkup(<ProjectGallery id="project" title="Project" href="/work" linkLabel="Project story" media={[]}><p>Actual summary</p></ProjectGallery>);
    expect(html).toContain("Actual summary");
    expect(html).toContain('href="/work"');
    expect(html).not.toContain("<figure");
    const missing = renderToStaticMarkup(<MediaGallery label="Missing" items={[{ ...image, src: undefined }]} />);
    expect(missing).toContain("Image unavailable");
    expect(missing).toContain("The interface");
  });
  test("video is opt-in, native, captioned and accompanied by a transcript", () => {
    const video: GalleryMedia = { id: "video", kind: "video", src: "/clip.webm", width: 640, height: 360, caption: "Walkthrough", credit: "Project team", transcript: "A description of the demonstration.", captions: [{ src: "/clip.vtt", language: "en", label: "English" }] };
    const html = renderToStaticMarkup(<MediaGallery label="Video" items={[video]} />);
    expect(html).toContain('preload="none"');
    expect(html).toContain('controls=""');
    expect(html).toContain('kind="captions"');
    expect(html).toContain("A description of the demonstration.");
    expect(html).not.toContain("autoplay");
  });
  test("server fallback preserves captions, native media and empty states", () => {
    expect(renderToStaticMarkup(<StaticGallery label="Empty" items={[]} />)).toBe("");
    const video: GalleryMedia = { id: "clip", kind: "video", src: "/clip.webm", width: 640, height: 360, caption: "Demo", credit: "Project team", transcript: "Silent demo", captions: [{ src: "/clip.vtt", language: "en", label: "English" }] };
    const output = renderToStaticMarkup(<StaticGallery label="Server media" items={[image, { ...image, id: "cover", fit: "cover" }, { ...image, id: "missing", src: undefined }, video, { ...video, id: "missing-video", src: undefined, captions: undefined }]} />);
    expect(output).toContain('aria-label="Server media"');
    expect(output).toContain("Image unavailable.");
    expect(output).toContain("Video unavailable.");
    expect(output).toContain("Video transcript");
    expect(output).toContain("Project team");
    expect(output).not.toContain("<button");
    expect(renderToStaticMarkup(<StaticGallery label="Single" items={[image]} />)).toContain("basis-full");
  });
  test("published media has stable identities, intrinsic PNG dimensions and credits", async () => {
    expect(new Set(imageGoNordMedia.map(item => item.id)).size).toBe(imageGoNordMedia.length);
    for (const item of imageGoNordMedia) {
      expect(item.credit).toContain("Schrödinger Hat");
      const bytes = Buffer.from(await Bun.file(`public${item.src}`).arrayBuffer());
      expect(bytes.toString("ascii", 1, 4)).toBe("PNG");
      expect(bytes.readUInt32BE(16)).toBe(item.width);
      expect(bytes.readUInt32BE(20)).toBe(item.height);
    }
  });
});
