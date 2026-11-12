import Link from "next/link";
import type { JournalArticle } from "@/lib/journal";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";

export function SketchbookDiscovery({ articles }: { articles: JournalArticle[] }) {
  const sketches = articles.filter(article => article.kind === "sketchbook").slice(0, 3);
  return <div id="sketchbook"><Section labelledBy="sketchbook-title" className="surface-charcoal"><div className={siteStyles.editorialRow}>
    <h2 id="sketchbook-title" className={siteStyles.sectionTitle}>From the sketchbook.</h2>
    <div className={siteStyles.copy}>
      <p>I’m learning to make comic books. A work in progress: I’ll share the process here as it takes shape.</p>
      {sketches.length ? <ul className="grid gap-6">{sketches.map(article => <li key={article.slug}>
        <Link className={`${siteStyles.link} underline underline-offset-4`} href={`/blog/${article.slug}`}>{article.title}</Link>
        <p className="mt-2 text-base"><time dateTime={article.date}>{article.date}</time></p>
      </li>)}</ul> : <p>No drawings or sketchbook articles are published here yet.</p>}
      <Link href="/play#comic-title" className={siteStyles.link}>Explore comic learning in Play</Link>
    </div>
  </div></Section></div>;
}
