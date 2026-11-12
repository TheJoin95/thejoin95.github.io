import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { siteStyles } from "@/components/site/styles";
import { PageIntro } from "@/components/site/primitives";
import { CareerCommunity } from "@/components/about/career-community";
import { Passions } from "@/components/about/passions";
import { aboutDescription, aboutStructuredData } from "@/content/about";
import { siteOrigin } from "@/lib/seo-config";

export const metadata: Metadata = pageMetadata({ title: "About", description: aboutDescription, path: "/about" });
export default function About() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(aboutStructuredData(siteOrigin())) }} />
    <PageIntro title="Engineering with curiosity."><p>I’m Miki Lombardi, a Senior Software Engineer at Adobe. My work spans software development, architecture and open source. I like learning by building something I can use, then sharing the decisions and lessons behind it.</p>
      <Link href="#contact" className={`${siteStyles.link} text-lg underline underline-offset-4`}>Contact &amp; CV</Link></PageIntro>
    <CareerCommunity /><Passions />
  </>;
}
