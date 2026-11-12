import { ImageResponse } from "next/og";
import { findArticle, publishedArticles } from "@/lib/journal-server";
export async function generateStaticParams() { return (await publishedArticles()).map(({ slug }) => ({ slug })); }
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await findArticle((await params).slug);
  if (!article) return new Response(null, { status: 404 });
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 64, background: "#111111", color: "#f5f5f5" }}>
    <div style={{ display: "flex", color: "#d7ef36", fontSize: 28 }}>MIKI LOMBARDI · JOURNAL</div>
    <div style={{ display: "flex", fontSize: article.title.length > 90 ? 52 : 64, lineHeight: 1.12, letterSpacing: "-0.03em" }}>{article.title}</div>
    <div style={{ display: "flex", fontSize: 26 }}>{article.date} · Software, architecture & experiments</div>
  </div>, { width: 1200, height: 630 });
}
