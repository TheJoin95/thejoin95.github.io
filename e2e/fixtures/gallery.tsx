import { createRoot } from "react-dom/client";
import { MediaGallery } from "../../src/components/gallery/media-gallery";
import type { GalleryMedia } from "../../src/lib/gallery";

const image: GalleryMedia = { id: "one", kind: "image", src: "/media/imagegonord/introduction.png", width: 1200, height: 363, alt: "ImageGoNord introduction", caption: "Single image", credit: "ImageGoNord" };
const video: GalleryMedia = { id: "video", kind: "video", src: "/fixture-clip.webm", width: 640, height: 360, caption: "Video specimen", credit: "Test-only sample", transcript: "A silent test clip for gallery controls.", captions: [{ src: "/fixture-captions.vtt", language: "en", label: "English" }] };
createRoot(document.getElementById("gallery-fixture")!).render(<div className="p-6">
  <MediaGallery label="Single" items={[image]} />
  <MediaGallery label="Empty" items={[]} />
  <MediaGallery label="Missing" items={[{ ...image, id: "missing", src: undefined }]} />
  <MediaGallery label="Video" items={[video, { ...image, id: "after-video" }]} />
</div>);
