import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { JournalArticle } from "./journal";

export type ContentsEntry = { id: string; title: string; level: 2 | 3 };

// Runs after sanitizing and slugging; no authored script or arbitrary attributes survive.
export function readingElements(contents: ContentsEntry[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "h1") node.tagName = "h2"; // The template owns the sole H1.
      if (node.tagName === "h2" || node.tagName === "h3") {
        const title = toString(node).trim();
        if (title && node.properties.id) contents.push({ id: String(node.properties.id), title, level: node.tagName === "h2" ? 2 : 3 });
        node.properties.tabIndex = -1;
      }
      if (node.tagName === "pre") {
        node.properties.tabIndex = 0;
        node.properties.role = "region";
        node.properties.ariaLabel = "Code example";
      }
      if (node.tagName === "table" && parent && index !== undefined) {
        parent.children[index] = { type: "element", tagName: "div", properties: { role: "region", ariaLabel: "Data table", tabIndex: 0, className: ["my-8", "max-w-full", "overflow-x-auto"] }, children: [node] };
        return "skip";
      }
    });
  };
}

export function relatedWriting(article: JournalArticle, published: readonly JournalArticle[]) {
  return published.filter(candidate => candidate.slug !== article.slug)
    .map(candidate => ({ candidate, score: candidate.tags.filter(tag => article.tags.includes(tag)).length + (article.kind === "sketchbook" && candidate.kind === "sketchbook" ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date) || a.candidate.slug.localeCompare(b.candidate.slug))
    .slice(0, 3).map(({ candidate }) => candidate);
}
