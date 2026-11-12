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

export const metadata: Metadata = {
  title: { absolute: homeIdentity.title }, description: homeIdentity.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: homeIdentity.title, description: homeIdentity.description, url: "/", siteName: homeIdentity.name },
  twitter: { card: "summary_large_image", title: homeIdentity.title, description: homeIdentity.description, images: [{ url: "/opengraph-image", alt: "Miki Lombardi — Engineering, with curiosity." }] },
};

export default function Home() {
  return <div className="home-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")).replace(/</g, "\\u003c") }} />
    <PageIntro title="Engineering, with curiosity."><p>I’m Miki, a Senior Software Engineer at Adobe. I build software, contribute to open source, and share what I learn along the way.</p></PageIntro>
    <PaletteStage />
    <SelectedWork />
    <SelectedWriting />
    <Section labelledBy="newsletter-title"><div className={siteStyles.editorialRow}>
      <h2 id="newsletter-title" className={siteStyles.sectionTitle}>Stay in the loop.</h2>
      <div className={siteStyles.copy}><p>Subscribe for new writing and updates. Unsubscribe at any time.</p><NewsletterForm /><Button asChild variant="link"><Link href="/blog">Read the Journal</Link></Button><Link href="/experience" className="ml-6 inline-flex min-h-11 items-center">Explore the experiment</Link></div>
    </div></Section>
  </div>;
}
