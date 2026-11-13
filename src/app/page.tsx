import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import Link from "next/link";
import { siteStyles } from "@/components/site/styles";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter-form";
import { PageIntro, Section } from "@/components/site/primitives";
import { PaletteStage } from "@/components/home/palette-stage";
import { SelectedWork } from "@/components/home/selected-work";
import { SelectedWriting } from "@/components/home/selected-writing";
import { homeIdentity, homeStructuredData } from "@/content/home";
import type { Metadata } from "next";
import { FoxCompanion } from "@/components/characters/fox-companion";

const homeMetadata = pageMetadata({ title: "Home", description: homeIdentity.description, path: "/" });
export const metadata: Metadata = { ...homeMetadata, title: { absolute: homeIdentity.title },
  openGraph: { ...homeMetadata.openGraph, title: homeIdentity.title }, twitter: { ...homeMetadata.twitter, title: homeIdentity.title } };


export default function Home() {
  return <div className="home-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(homeStructuredData(siteOrigin())) }} />
    <PageIntro className="md:items-start" title="Engineering, with curiosity."><p>I’m Miki, a Senior Software Engineer at Adobe. I build software, contribute to open source, and share what I learn along the way.</p><FoxCompanion /></PageIntro>
    <PaletteStage />
    <SelectedWork />
    <SelectedWriting />
    <Section labelledBy="newsletter-title"><div className={siteStyles.editorialRow}>
      <h2 id="newsletter-title" className={siteStyles.sectionTitle}>Stay in the loop.</h2>
      <div className={siteStyles.copy}><p>Subscribe for new writing and updates. Unsubscribe at any time.</p><NewsletterForm /><Button asChild variant="link"><Link href="/blog">Read the Journal</Link></Button></div>
    </div></Section>
  </div>;
}
