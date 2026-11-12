import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { publishedArticles } from "@/lib/journal-server";
export const metadata: Metadata = { title: "Journal", description: "Notes from Miki Lombardi on software, architecture, open source and learning by making.", alternates: { canonical: "/blog" } };
export default async function Journal() {
  const articles = await publishedArticles();
  return <><PageIntro title="Notes & experiments."><p>On software, architecture, and learning by making.</p></PageIntro>
    <div className={`${siteStyles.container} pb-(--section-space)`}><p className="max-w-[65ch]">Writing from the archive, with original titles and publication dates.</p>
      <ul className="mt-10 border-t border-current/20">{articles.map(article => <li key={article.slug} className="grid gap-4 border-b border-current/20 py-8 md:grid-cols-[10rem_1fr]">
        <time dateTime={article.date} className="text-sm tabular-nums">{article.date}</time><div className="max-w-[70ch]"><h2 className="text-2xl tracking-tight"><Link className="inline-flex min-h-11 items-center" href={`/blog/${article.slug}`}>{article.title}</Link></h2><p className="mt-3">{article.description}</p></div>
      </li>)}</ul>{articles.length === 0 ? <p>No published writing yet.</p> : null}</div></>;
}
