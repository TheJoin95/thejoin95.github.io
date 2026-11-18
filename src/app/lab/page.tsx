import Link from "next/link";
import { PaletteStage } from "@/components/home/palette-stage";
import { PageIntro } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";

const description = "Try Miki Lombardi’s interactive experiments in colour and image processing.";
export const metadata = pageMetadata({ title: "Lab", description, path: "/lab" });

export default function Lab() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Lab — Miki Lombardi",
    url: new URL("/lab", siteOrigin()).href,
    description,
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />
    <PageIntro title="Lab"><p>Small experiments in colour and image processing.</p></PageIntro>
    <section aria-labelledby="lab-colour-title">
      <div className={`${siteStyles.editorialRow} pb-8`}>
        <h2 id="lab-colour-title" className={siteStyles.sectionTitle}>A photograph, two palettes.</h2>
        <div className={siteStyles.copy}>
          <p>Slide between a 1921 hand-coloured photograph and the same image mapped to Nord by Chromatique.</p>
        </div>
      </div>
      <PaletteStage href="/work/chromatique" />
    </section>
    <div className={`${siteStyles.container} border-t border-border py-8`}>
      <Link href="/play" className={`${siteStyles.link} underline underline-offset-4`}>Explore side projects and community in Play</Link>
    </div>
  </>;
}
