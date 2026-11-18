import Link from "next/link";
import { PaletteStage } from "@/components/home/palette-stage";
import { PageIntro } from "@/components/site/primitives";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { sideProjectCaseStudies } from "@/content/work";
import { siteStyles } from "@/components/site/styles";
import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";

const description = "Explore Miki Lombardi’s side-project case studies and try the Chromatique palette experiment.";
export const metadata = pageMetadata({ title: "Lab", description, path: "/lab" });

export default function Lab() {
  const origin = siteOrigin();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Lab — Miki Lombardi",
    url: new URL("/lab", origin).href,
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sideProjectCaseStudies.length,
      itemListElement: sideProjectCaseStudies.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: new URL(project.href, origin).href,
      })),
    },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />
    <PageIntro title="Lab"><p>Side projects, open-source contributions, and experiments you can try.</p></PageIntro>
    <section className={`${siteStyles.container} ${siteStyles.sectionSpace}`} aria-labelledby="lab-projects">
      <h2 id="lab-projects" className={siteStyles.sectionTitle}>Project case studies</h2>
      <ProjectDirectory entries={sideProjectCaseStudies} />
      <Link href="/play#github-projects" className={`${siteStyles.link} mt-8 underline underline-offset-4`}>Browse the GitHub project index</Link>
    </section>
    <section aria-labelledby="lab-colour-title">
      <div className={`${siteStyles.editorialRow} pb-8`}>
        <h2 id="lab-colour-title" className={siteStyles.sectionTitle}>A photograph, two palettes.</h2>
        <div className={siteStyles.copy}>
          <p>Slide between a 1921 hand-coloured photograph and the same image mapped to Nord by Chromatique.</p>
        </div>
      </div>
      <PaletteStage href="/work/chromatique" />
    </section>
  </>;
}
