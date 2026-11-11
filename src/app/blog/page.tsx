import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { siteStyles } from "@/components/site/styles";
import Link from "next/link";
import { ContentState, PageIntro } from "@/components/site/primitives";

export const metadata: Metadata = { title: "Journal", description: "Notes from Miki Lombardi on software, architecture, open source and learning by making." };
export default function Journal() {
  return <><PageIntro title="Notes & experiments."><p>On software, architecture, and learning by making.</p></PageIntro>
    <div className={cn(siteStyles.container, siteStyles.sectionSpace)}><ContentState title="The archive is moving here." action={<Link href="/#newsletter-title">Get new writing by email</Link>}>
      <p>I’m bringing the articles from my previous website into this Journal. The archive will return here with its original titles and publication dates.</p>
    </ContentState></div>
  </>;
}
