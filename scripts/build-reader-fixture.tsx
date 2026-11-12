import { readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { parseArticle, renderReading } from "../src/lib/journal";
import { ReadingTemplate } from "../src/components/journal/reader";

// Browser-only specimen outside public/ and the production content directory.
const article = parseArticle(readFileSync("tests/fixtures/sketchbook.md", "utf8"), "sketchbook-reader-fixture");
const { html, contents } = await renderReading(article.body);
writeFileSync(".test-fixtures/reader.html", renderToStaticMarkup(<main><ReadingTemplate article={article} html={html} contents={contents} related={[]} /></main>));
