import { TitleCard, shareSize } from "@/components/social/title-card";
import { ImageResponse } from "next/og";
import { findArticle, publishedArticles } from "@/lib/journal-server";
export async function generateStaticParams() { return (await publishedArticles()).map(({ slug }) => ({ slug })); }
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await findArticle((await params).slug);
  if (!article) return new Response(null, { status: 404 });
  return new ImageResponse(<TitleCard title={article.title} label="JOURNAL" detail={`${article.date} · Software, architecture & experiments`} />, shareSize);
}
