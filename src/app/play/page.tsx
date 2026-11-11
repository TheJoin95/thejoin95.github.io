import type { Metadata } from "next";
import { siteStyles } from "@/components/site/styles";
import Link from "next/link";
import { PageIntro, Section } from "@/components/site/primitives";

export const metadata: Metadata = { title: "Play", description: "Side projects, community and creative experiments by Miki Lombardi." };
export default function Play() {
  return <><PageIntro title="Built out of curiosity."><p>Side projects, community, and experiments.</p></PageIntro>
    <Section labelledBy="play-title" className="surface-charcoal"><div className={siteStyles.editorialRow}>
      <h2 id="play-title" className={siteStyles.sectionTitle}>Make something.<br /> Learn something.</h2>
      <div className={siteStyles.copy}><p>I experiment with software and colour, contribute to community projects, and share what I learn.</p><div className={siteStyles.actions}><Link href="/experience">Explore the experiment</Link><a href="https://schroedinger-hat.org/">Schrödinger Hat</a><a href="https://broski.substack.com/">Read Broskis</a></div></div>
    </div></Section>
    <Section labelledBy="comic-title"><div className={siteStyles.editorialRow}><h2 id="comic-title" className={siteStyles.sectionTitle}>Learning to<br /> make comics.</h2><p className={siteStyles.copy}>A work in progress. I’m developing original drawings and learning the craft, alongside cycling, photography, and whatever comes next.</p></div></Section>
  </>;
}
