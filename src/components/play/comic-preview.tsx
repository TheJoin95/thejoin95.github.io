import Link from "next/link";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { comicLearning } from "@/content/play";

export function ComicPreview() {
  return <Section labelledBy="comic-title" className="surface-charcoal"><div className={siteStyles.editorialRow}>
    <h2 id="comic-title" className={siteStyles.sectionTitle}>{comicLearning.title}.</h2>
    <div className={siteStyles.copy}>
      <p>A work in progress. I’m developing original drawings and learning the craft. I’ll share the process in the Journal as it takes shape.</p>
      <p>No drawings are published here yet.</p>
      <div className={siteStyles.actions}><Link href="/blog">Explore the Journal</Link><a href="/rss.xml">Follow by RSS</a></div>
    </div>
  </div></Section>;
}
