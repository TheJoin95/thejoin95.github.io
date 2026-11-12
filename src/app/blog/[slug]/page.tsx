import { articleMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import { findArticle, publishedArticles } from "@/lib/journal-server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/journal/article-body";
import { siteStyles } from "@/components/site/styles";
import { articleStructuredData, renderMarkdown } from "@/lib/journal";

export async function generateStaticParams() { return (await publishedArticles()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await findArticle((await params).slug);
  if (!article) notFound();
  return articleMetadata(article);
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await findArticle((await params).slug);
  if (!article) notFound();
  const html = await renderMarkdown(article.body, article.archival);
  const origin = siteOrigin();
  return <div className={`${siteStyles.container} ${siteStyles.sectionSpace}`}><article lang={article.language} className="mx-auto max-w-[72ch]">
    <Link className="inline-flex min-h-11 items-center" href="/blog">← Journal</Link>
    <header className="mt-8 border-b border-current/20 pb-10"><p className="text-sm uppercase tracking-widest">{article.archival ? "From the archive" : "Journal"}</p>
      <h1 className="mt-5 text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.08] tracking-tight text-balance [overflow-wrap:anywhere]">{article.title}</h1>
      <p className="mt-6 text-xl leading-relaxed">{article.description}</p>
      <p className="mt-6 text-sm"><Link href="/about">Miki Lombardi</Link> · <time dateTime={article.date}>{article.date}</time></p>
      {article.archival ? <p className="mt-4 text-sm text-muted-foreground">Historical writing, preserved with its original publication date. Tools, services and advice may have changed.</p> : null}
    </header><ArticleBody html={html} />
  </article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(articleStructuredData(article, origin)) }} /></div>;
}
