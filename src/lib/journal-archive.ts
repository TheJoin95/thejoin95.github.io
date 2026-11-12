import type { JournalArticle } from "./journal";
export type ArchiveParams = Record<string, string | string[] | undefined>;
export const archivePageSize = 8;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] || "" : value || "";
const normalize = (text: string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function archiveView(articles: readonly JournalArticle[], params: ArchiveParams) {
  const q = first(params.q).trim().slice(0, 160);
  const tag = first(params.tag).trim().slice(0, 80);
  const requested = first(params.page);
  const requestedPage = /^\d+$/.test(requested) && Number.isSafeInteger(Number(requested)) ? Math.max(1, Number(requested)) : 1;
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  const matches = articles.filter(article => (!tag || article.tags.includes(tag)) && terms.every(term => normalize(`${article.title} ${article.description} ${article.tags.join(" ")} ${article.body}`).includes(term)));
  const totalPages = Math.max(1, Math.ceil(matches.length / archivePageSize));
  const page = Math.min(requestedPage, totalPages);
  return { q, tag, page, totalPages, total: matches.length, items: matches.slice((page - 1) * archivePageSize, page * archivePageSize),
    tags: [...new Set(articles.flatMap(article => article.tags))].sort(), filtered: Boolean(q || tag), empty: articles.length === 0 };
}
export type ArchiveView = ReturnType<typeof archiveView>;
export function archiveHref({ q = "", tag = "", page = 1 }: { q?: string; tag?: string; page?: number }) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (tag) query.set("tag", tag);
  if (page > 1) query.set("page", String(page));
  return `/blog${query.size ? `?${query}` : ""}#archive`;
}

// Filter combinations stay out of the index; ordinary archive pages are distinct.
export function archiveCanonical(view: ArchiveView) {
  return !view.filtered && view.page > 1 ? `/blog?page=${view.page}` : "/blog";
}

export function archiveStructuredData(view: ArchiveView, origin: string) {
  return { "@context": "https://schema.org", "@type": "CollectionPage", name: "Miki Lombardi — Journal",
    url: new URL(archiveCanonical(view), origin).href,
    mainEntity: { "@type": "ItemList", numberOfItems: view.items.length,
      itemListElement: view.items.map((article, index) => ({ "@type": "ListItem", position: (view.page - 1) * archivePageSize + index + 1,
        item: { "@type": "BlogPosting", headline: article.title, description: article.description, datePublished: article.date,
          url: new URL(`/blog/${article.slug}`, origin).href, inLanguage: article.language,
          author: { "@type": "Person", name: "Miki Lombardi", url: new URL("/about", origin).href } } })) } };
}
