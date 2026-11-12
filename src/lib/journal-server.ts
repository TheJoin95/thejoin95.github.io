import "server-only";
import { publishedArticles as loadArticles } from "./journal";
export async function publishedArticles() {
  "use cache";
  return loadArticles();
}
export async function findArticle(slug: string) { return (await publishedArticles()).find(article => article.slug === slug); }
