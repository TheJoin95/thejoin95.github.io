import { expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import slugs from "@/content/journal-routes.json";
import { publishedArticles } from "@/lib/journal";
test("the build route inventory admits published articles and rejects unknown/private routes before streaming", () => {
  expect(slugs).toEqual(publishedArticles().map(article => article.slug));
  expect(proxy(new NextRequest(`https://example.com/blog/${slugs[0]}`)).status).toBe(200);
  for (const slug of ["missing", "draft", "future"]) {
    const response = proxy(new NextRequest(`https://example.com/blog/${slug}`));
    expect(response.status).toBe(404);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  }
});
test("indexing headers follow the build decision and canonical host, independently of article visibility", () => {
  const previous = process.env.PORTFOLIO_INDEXABLE;
  try {
    process.env.PORTFOLIO_INDEXABLE = "false";
    expect(proxy(new NextRequest("https://example.com/about")).headers.get("X-Robots-Tag")).toBe("noindex, follow");
    process.env.PORTFOLIO_INDEXABLE = "true";
    expect(proxy(new NextRequest("https://example.com/about")).headers.get("X-Robots-Tag")).toBeNull();
    expect(proxy(new NextRequest("http://localhost/about", { headers: { Host: "example.com" } })).headers.get("X-Robots-Tag")).toBeNull();
    expect(proxy(new NextRequest("https://preview.netlify.app/about")).headers.get("X-Robots-Tag")).toBe("noindex, follow");
  } finally { process.env.PORTFOLIO_INDEXABLE = previous; }
});
