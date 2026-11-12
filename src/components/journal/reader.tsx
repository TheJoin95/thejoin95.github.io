import Link from "next/link";
import type { JournalArticle } from "@/lib/journal";
import type { ContentsEntry } from "@/lib/reading";
import { archiveHref } from "@/lib/journal-archive";
import { ArticleBody } from "./article-body";
import { MediaFrame } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";

export function ContentsNavigation({ entries }: { entries: ContentsEntry[] }) {
  if (entries.length < 3) return null;
  return <nav aria-labelledby="contents-title" className="my-10 border-y border-current/20 py-6">
    <h2 id="contents-title" className="text-xl">On this page</h2>
    <ul className="mt-3 grid gap-1">{entries.map(entry => <li key={entry.id} className={entry.level === 3 ? "ps-5" : undefined}>
      <a className={`${siteStyles.link} underline underline-offset-4 [overflow-wrap:anywhere]`} href={`#${entry.id}`}>{entry.title}</a>
    </li>)}</ul>
  </nav>;
}

export function SketchbookPanels({ panels }: { panels: JournalArticle["panels"] }) {
  if (!panels.length) return null;
  return <section aria-labelledby="panels-title" className="my-12">
    <h2 id="panels-title" className={siteStyles.sectionTitle}>Panels</h2>
    <ol className="mt-8 grid gap-12" aria-label="Sketchbook panels">{panels.map((panel, index) => <li key={`${index}-${panel.src}`} className="min-w-0 [overflow-wrap:anywhere]">
      <MediaFrame {...panel} caption={`Panel ${index + 1} · ${panel.caption}`} />
      <a className={`${siteStyles.link} mt-3 underline underline-offset-4`} href={panel.src}>View full-size panel {index + 1}</a>
    </li>)}</ol>
  </section>;
}

export function RelatedWriting({ articles }: { articles: JournalArticle[] }) {
  return <nav aria-labelledby="related-writing-title" className="mx-auto mt-16 max-w-[72ch] border-t border-current/20 pt-10">
    <h2 id="related-writing-title" className={siteStyles.sectionTitle}>Keep reading.</h2>
    {articles.length ? <ul className="mt-6 grid gap-6">{articles.map(article => <li key={article.slug}>
      <Link className={`${siteStyles.link} text-xl underline underline-offset-4 [overflow-wrap:anywhere]`} href={`/blog/${article.slug}`}>{article.title}</Link>
      <p className="mt-2 text-base text-muted-foreground"><time dateTime={article.date}>{article.date}</time>{article.kind === "sketchbook" ? " · Sketchbook" : ""}</p>
    </li>)}</ul> : <p className="mt-6">More writing will appear in the Journal as it is published.</p>}
    <div className={`${siteStyles.actions} mt-8`}><Link href="/blog">Explore the Journal</Link><a href="/rss.xml">Follow by RSS</a></div>
  </nav>;
}

export function ReadingTemplate({ article, html, contents, related }: { article: JournalArticle; html: string; contents: ContentsEntry[]; related: JournalArticle[] }) {
  return <div className={`${siteStyles.container} ${siteStyles.sectionSpace}`}>
    <article lang={article.language} className="mx-auto max-w-[72ch] min-w-0 [overflow-wrap:anywhere]">
      <Link className={siteStyles.link} href="/blog">← Journal</Link>
      <header className="mt-8 border-b border-current/20 pb-10">
        <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.08] tracking-tight text-balance">{article.title}</h1>
        <p className="mt-6 text-xl leading-relaxed">{article.description}</p>
        <p className="mt-6 text-base"><Link className={siteStyles.link} href="/about">Miki Lombardi</Link> · <time dateTime={article.date}>{article.date}</time>{article.kind === "sketchbook" ? " · Sketchbook" : ""}</p>
        {article.updated ? <p className="mt-2 text-base">Updated <time dateTime={article.updated}>{article.updated}</time></p> : null}
        {article.tags.length ? <ul aria-label="Article tags" className="mt-3 flex flex-wrap gap-x-6 gap-y-1">{article.tags.map(tag => <li key={tag}><Link className={`${siteStyles.link} underline underline-offset-4`} href={archiveHref({ tag })}>{tag}</Link></li>)}</ul> : null}
        {article.archival ? <p className="mt-4 text-base text-muted-foreground">Historical writing, preserved with its original publication date. Tools, services and advice may have changed.</p> : null}
      </header>
      <ContentsNavigation entries={contents} />
      {article.kind === "sketchbook" ? <SketchbookPanels panels={article.panels} /> : null}
      {article.kind === "sketchbook" ? <h2 className={`${siteStyles.sectionTitle} mt-12`}>Learning notes</h2> : null}
      <ArticleBody html={html} />
    </article>
    <RelatedWriting articles={related} />
  </div>;
}
