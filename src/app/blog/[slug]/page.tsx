import { articleMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import { findArticle, publishedArticles } from "@/lib/journal-server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingTemplate } from "@/components/journal/reader";
import { relatedWriting } from "@/lib/reading";
import { articleStructuredData, renderReading } from "@/lib/journal";

export async function generateStaticParams() { return (await publishedArticles()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await findArticle((await params).slug);
  if (!article) notFound();
  return articleMetadata(article);
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await findArticle((await params).slug);
  if (!article) notFound();
  const { html, contents } = await renderReading(article.body, article.archival);
  const origin = siteOrigin();
  return <><ReadingTemplate article={article} html={html} contents={contents} related={relatedWriting(article, await publishedArticles())} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(articleStructuredData(article, origin)) }} /></>;
}
