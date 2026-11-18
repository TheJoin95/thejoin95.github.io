import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import Link from "next/link";
import { siteStyles } from "@/components/site/styles";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter-form";
import { Section } from "@/components/site/primitives";
import { SelectedWork } from "@/components/home/selected-work";
import { SelectedWriting } from "@/components/home/selected-writing";
import { homeIdentity, homeStructuredData } from "@/content/home";
import type { Metadata } from "next";

const homeMetadata = pageMetadata({ title: "Home", description: homeIdentity.description, path: "/" });
export const metadata: Metadata = { ...homeMetadata, title: { absolute: homeIdentity.title },
  openGraph: { ...homeMetadata.openGraph, title: homeIdentity.title }, twitter: { ...homeMetadata.twitter, title: homeIdentity.title } };


export default function Home() {
  return <div className="home-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(homeStructuredData(siteOrigin())) }} />
    <div className={`${siteStyles.container} pt-10 pb-10 md:pt-20 md:pb-24 desktop:pt-28 desktop:pb-28`}>
      <div className="max-w-[39rem] text-[clamp(1.75rem,1.5rem_+_0.7vw,2.25rem)] leading-[1.2] tracking-[-0.035em]">
        <h1 className="inline">I’m Miki, a Senior Software Engineer at Adobe.</h1>{" "}
        <p className="inline text-muted-foreground">I build software, contribute to open source, and write about what I learn.</p>
      </div>
    </div>
    <SelectedWork />
    <SelectedWriting />
    <Section labelledBy="newsletter-title"><div className={siteStyles.editorialRow}>
      <h2 id="newsletter-title" className={siteStyles.sectionTitle}>Stay in the loop.</h2>
      <div className={siteStyles.copy}><p>Subscribe for new writing and updates. Unsubscribe at any time.</p><NewsletterForm /><Button asChild variant="link"><Link href="/blog">Read the Journal</Link></Button></div>
    </div></Section>
  </div>;
}
