import { PageTransition } from "@/components/site/page-transition";
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
  return <PageTransition data-surface="charcoal">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(homeStructuredData(siteOrigin())) }} />
    <div className="surface-charcoal">
      <div className={`${siteStyles.container} pt-6 pb-5 md:pt-14 md:pb-16 desktop:pt-16 desktop:pb-20`}>
        <div className="max-w-[36rem] text-[clamp(1.5rem,1.325rem_+_0.6vw,2rem)] leading-[1.2] tracking-[-0.03em]">
          <h1 className="inline">I’m Miki, a Senior Software Engineer at Adobe.</h1>{" "}
          <p className="inline text-muted-foreground">I build software, contribute to open source, and write about what I learn.</p>
        </div>
      </div>
      <SelectedWork />
    </div>
    <SelectedWriting />
    <Section labelledBy="newsletter-title"><div className={siteStyles.editorialRow}>
      <h2 id="newsletter-title" className={siteStyles.sectionTitle}>Stay in the loop.</h2>
      <div className={siteStyles.copy}><p>Subscribe for new writing and updates. Unsubscribe at any time.</p><NewsletterForm /><Button asChild variant="link"><Link href="/blog">Read the Journal</Link></Button></div>
    </div></Section>
  </PageTransition>;
}
