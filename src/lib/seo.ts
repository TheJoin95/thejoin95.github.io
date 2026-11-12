import type { Metadata } from "next";
import { siteOrigin } from "./seo-config";

export const defaultShareAlt = "Miki Lombardi — Engineering, with curiosity.";
export const publicPages = ["/", "/work", "/blog", "/about", "/play", "/experience"] as const;
export function pageMetadata({ title, description, path, image = "/opengraph-image", imageAlt = defaultShareAlt }: {
  title: string; description: string; path: string; image?: string; imageAlt?: string;
}): Metadata {
  const url = new URL(path, siteOrigin()).href;
  const images = [{ url: new URL(image, siteOrigin()).href, alt: imageAlt, width: 1200, height: 630 }];
  return { title, description, alternates: { canonical: url, types: { "application/rss+xml": new URL("/rss.xml", siteOrigin()).href } },
    openGraph: { type: "website", url, title: `${title} — Miki Lombardi`, description, siteName: "Miki Lombardi", images },
    twitter: { card: "summary_large_image", title: `${title} — Miki Lombardi`, description, images } };
}
export function serializeStructuredData(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }

export function articleMetadata(article: { title: string; description: string; slug: string; date: string; updated?: string }): Metadata {
  const metadata = pageMetadata({ title: article.title, description: article.description, path: `/blog/${article.slug}`, image: `/blog/${article.slug}/share`, imageAlt: `${article.title} — Miki Lombardi` });
  return { ...metadata, authors: [{ name: "Miki Lombardi", url: new URL("/about", siteOrigin()).href }],
    openGraph: { ...metadata.openGraph, type: "article", title: article.title, publishedTime: article.date,
      ...(article.updated ? { modifiedTime: article.updated } : {}), authors: [new URL("/about", siteOrigin()).href] },
    twitter: { ...metadata.twitter, title: article.title } };
}
