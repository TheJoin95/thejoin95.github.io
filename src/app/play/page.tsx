import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import { siteStyles } from "@/components/site/styles";
import Link from "next/link";
import { PageIntro, Section } from "@/components/site/primitives";
import { PaletteStage } from "@/components/home/palette-stage";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { ComicPreview } from "@/components/play/comic-preview";
import { playDescription, playProjects, playStructuredData } from "@/content/play";
import { FoxCompanion } from "@/components/characters/fox-companion";

export const metadata = pageMetadata({ title: "Play", description: playDescription, path: "/play" });
export default function Play() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(playStructuredData(siteOrigin())) }} />
    <PageIntro className="md:items-start" title="Built out of curiosity."><p>Side projects, community, and experiments.</p><FoxCompanion /></PageIntro>
    <PaletteStage href="/work/chromatique" />
    <Section labelledBy="play-directory-title"><div className={siteStyles.container}>
      <h2 id="play-directory-title" className={siteStyles.sectionTitle}>Projects &amp; community.</h2>
      <p className="mt-6 max-w-[68ch]">Things I build, contribute to, and keep exploring. Some are public; others are still taking shape.</p>
      <ProjectDirectory entries={playProjects} />
    </div></Section>
    <ComicPreview />
    <Section labelledBy="play-passions-title"><div className={siteStyles.editorialRow}>
      <h2 id="play-passions-title" className={siteStyles.sectionTitle}>Beyond the keyboard.</h2>
      <div className={siteStyles.copy}><p>Cycling, photography, and whatever comes next.</p>
        <div className={siteStyles.actions}><Link href="/about">More about Miki</Link><Link href="/experience">Explore the Three.js experiment</Link></div>
      </div>
    </div></Section>
  </>;
}
