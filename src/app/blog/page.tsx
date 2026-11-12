import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import { PageIntro, Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { publishedArticles } from "@/lib/journal-server";
import { archiveCanonical, archiveStructuredData, archiveView, type ArchiveParams } from "@/lib/journal-archive";
import { featuredWriting } from "@/content/home";
import { FeaturedWriting } from "@/components/journal/featured-writing";
import { JournalArchive } from "@/components/journal/archive";

// Request-specific discovery uses complete server HTML rather than an instant shell.
export const instant = false;
type Props = { searchParams?: Promise<ArchiveParams> };
export async function generateMetadata({ searchParams = Promise.resolve({}) }: Props = {}): Promise<Metadata> {
  const view = archiveView(await publishedArticles(), await searchParams);
  const metadata = pageMetadata({ title: view.page > 1 && !view.filtered ? `Journal — Page ${view.page}` : "Journal", description: "Notes from Miki Lombardi on software, architecture, open source and learning by making.", path: archiveCanonical(view) });
  return view.filtered ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}
export default async function Journal({ searchParams = Promise.resolve({}) }: Props = {}) {
  const articles = await publishedArticles();
  const view = archiveView(articles, await searchParams);
  const featured = articles.find(article => `/blog/${article.slug}` === featuredWriting.href) || articles[0];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(archiveStructuredData(view, siteOrigin())) }} /><PageIntro title="Notes & experiments."><p>On software, architecture, and learning by making.</p></PageIntro>
    {featured ? <FeaturedWriting article={featured} /> : null}
    <JournalArchive view={view} />
    <div id="sketchbook"><Section labelledBy="sketchbook-title" className="surface-charcoal"><div className={siteStyles.editorialRow}>
      <h2 id="sketchbook-title" className={siteStyles.sectionTitle}>From the sketchbook.</h2>
      <div className={siteStyles.copy}><p>I’m learning to make comic books. A work in progress: I’ll share the process here as it takes shape.</p><p>No drawings or sketchbook articles are published here yet.</p><Link href="/play#comic-title" className={siteStyles.link}>Explore comic learning in Play</Link></div>
    </div></Section></div>
    <Section labelledBy="journal-rss-title"><div className={siteStyles.editorialRow}><h2 id="journal-rss-title" className={siteStyles.sectionTitle}>Follow the writing.</h2><div className={siteStyles.copy}><p>The complete Journal feed, independent of archive filters.</p><a href="/rss.xml" className={siteStyles.link}>Subscribe via RSS</a></div></div></Section>
  </>;
}
