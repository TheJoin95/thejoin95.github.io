import type { Metadata } from "next";
import { PageIntro } from "@/components/site/primitives";
import { ProjectGallery } from "@/components/gallery/project-gallery";
import { imageGoNordMedia } from "@/content/featured-media";

export const metadata: Metadata = { title: "Work", description: "Software, systems and open-source contributions by Miki Lombardi." };
export default function Work() {
  return <div className="surface-charcoal" data-surface="charcoal">
    <PageIntro title="Selected work."><p>Software, systems, and open-source contributions. Explore the problem, the implementation and the decisions behind each project.</p></PageIntro>
    <ProjectGallery id="imagegonord" title="ImageGoNord" href="https://github.com/Schroedinger-Hat/ImageGoNord-Web" linkLabel="Explore ImageGoNord on GitHub" media={imageGoNordMedia}>
      <p>An open-source tool for converting images into a chosen palette, built with the Schrödinger Hat community.</p>
    </ProjectGallery>
    <ProjectGallery id="supermarket" title="Supermarket waiting times" href="https://github.com/TheJoin95/covid19-market-waiting-times" linkLabel="View the archived project" media={[]}>
      <p>A crowdsourced map of shop waiting times, built in 2020. The project is archived.</p>
    </ProjectGallery>
  </div>;
}
