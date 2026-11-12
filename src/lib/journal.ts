import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import manifest from "../../docs/migration/legacy-manifest.json";

const date = z.preprocess(value => value instanceof Date ? value.toISOString().slice(0, 10) : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().startsWith(value), "Invalid calendar date"));
const schema = z.object({ title: z.string().min(1), description: z.string().min(1), date, updated: date.optional(), draft: z.boolean().default(false), language: z.enum(["en", "it"]).default("en"), tags: z.array(z.string()).default([]) });
export function parseArticle(source: string, slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid article slug");
  const parsed = matter(source, { engines: { yaml: parseYaml } });
  const data = schema.parse(parsed.data);
  return { ...data, language: slug.includes("passaporto") ? "it" as const : data.language, slug, body: parsed.content, archival: manifest.articles.some(item => item.slug === slug) };
}
export type JournalArticle = ReturnType<typeof parseArticle>;
export function visibleArticles(articles: JournalArticle[], now: Date) {
  if (new Set(articles.map(article => article.slug)).size !== articles.length) throw new Error("Duplicate article slug");
  return articles.filter(article => !article.draft && article.date <= now.toISOString().slice(0, 10)).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
export function publishedArticles() {
  const articles = readdirSync(join(process.cwd(), "content/journal")).filter(file => file.endsWith(".md")).map(file => parseArticle(readFileSync(join(process.cwd(), "content/journal", file), "utf8"), file.slice(0, -3)));
  return visibleArticles(articles, new Date());
}
export function findArticle(slug: string) { return publishedArticles().find(article => article.slug === slug); }
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export async function renderMarkdown(body: string, archival = false) {
  let markdown = body;
  if (archival) {
    markdown = markdown.trimStart().replace(/^# [^\n]+\n/, "").replace(/<div class="mx-auto">\s*<img[^>]+source\.unsplash\.com[^>]*>\s*<\/div>/g, "")
      .replace(/{% highlight (\w+) %}/g, "```$1").replace(/{% endhighlight %}/g, "```");
    for (const media of manifest.media) {
      if (media.kind === "code" && markdown.includes(media.source)) {
        const code = readFileSync(join(process.cwd(), "public", media.path), "utf8");
        markdown = markdown.replace(`<script src="${media.source}"></script>`, `<p><a href="${escapeHtml(media.source.replace(/\.js$/, ""))}">Original code on GitHub Gist</a></p><pre><code>${escapeHtml(code)}</code></pre>`);
      } else if (media.kind === "image") {
        const altText: Record<string, string> = {
          "/media/blog/legacy-1.png": "Skyscanner scraper output from the original article",
          "/media/blog/legacy-2.png": "The Sorting Hat Quiz logo",
          "/media/blog/legacy-3.png": "Face detection with an augmented reality sorting hat",
          "/media/blog/legacy-4.png": "Supermarket waiting times architecture diagram",
          "/media/blog/legacy-5.png": "Supermarket waiting times architecture diagram",
        };
        const image = `<img src="${media.path}" alt="${altText[media.path]}" width="${media.width}" height="${media.height}" loading="lazy" />`;
        markdown = markdown.replace(new RegExp(`!\\[([^\\]]*)\\]\\(${media.source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`, "g"), (_match, alt: string) => alt ? image.replace(/alt="[^"]*"/, `alt="${escapeHtml(alt)}"`) : image);
        markdown = markdown.replace(`<img src="${media.source}" />`, image);
      }
    }
  }
  return String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeSanitize, { ...defaultSchema, attributes: { ...defaultSchema.attributes, img: [...(defaultSchema.attributes?.img || []), "loading"] } }).use(rehypeStringify).process(markdown));
}
export function articleStructuredData(article: JournalArticle, origin: string) {
  return { "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.description,
    datePublished: article.date, ...(article.updated ? { dateModified: article.updated } : {}), inLanguage: article.language,
    author: { "@type": "Person", name: "Miki Lombardi", url: new URL("/about", origin).href },
    mainEntityOfPage: new URL(`/blog/${article.slug}`, origin).href,
    image: new URL(`/blog/${article.slug}/share`, origin).href };
}
