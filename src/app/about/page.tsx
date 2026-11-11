import type { Metadata } from "next";
import { siteStyles } from "@/components/site/styles";
import { PageIntro, Section } from "@/components/site/primitives";

export const metadata: Metadata = { title: "About", description: "Meet Miki Lombardi, Senior Software Engineer at Adobe and Schrödinger Hat co-founder." };
export default function About() {
  return <><PageIntro title="Engineering with curiosity."><p>I’m Miki Lombardi, a Senior Software Engineer at Adobe. My work spans software development, architecture and open source.</p></PageIntro>
    <Section labelledBy="community-title"><div className={siteStyles.editorialRow}><h2 id="community-title" className={siteStyles.sectionTitle}>Software.<br /> People.<br /> Shared ideas.</h2><div className={siteStyles.copy}><p>I’ve worked in product and consultancy teams, including Aperion, Plansoft and Growens, before joining Adobe.</p><p>I co-founded Schrödinger Hat, where software and community meet. Open-source projects, talks and shared experiments are part of how I learn and contribute beyond my day-to-day work.</p></div></div></Section>
    <Section labelledBy="beyond-title" className="surface-charcoal"><div className={siteStyles.editorialRow}><h2 id="beyond-title" className={siteStyles.sectionTitle}>Beyond the<br /> keyboard.</h2><p className={siteStyles.copy}>Cycling and photography are two of my other interests. I’m also learning to make comic books. The sketchbook will follow that process as I develop original drawings.</p></div></Section>
  </>;
}
