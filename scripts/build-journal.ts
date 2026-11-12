import { writeFileSync } from "node:fs";
import { publishedArticles } from "../src/lib/journal";
// Validate all Markdown before Next compiles. Publication changes require a rebuild.
writeFileSync("src/content/journal-routes.json", JSON.stringify(publishedArticles().map(article => article.slug), null, 2) + "\n");
