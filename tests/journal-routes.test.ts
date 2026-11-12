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
