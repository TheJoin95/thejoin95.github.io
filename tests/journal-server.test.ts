import { expect, test } from "bun:test";
import { findArticle, publishedArticles } from "@/lib/journal-server";
test("cached server loader finds published articles and rejects unknown slugs", async () => {
  const articles = await publishedArticles();
  expect((await findArticle(articles[0].slug))!.title).toBe(articles[0].title);
  expect(await findArticle("unknown")).toBeUndefined();
});
