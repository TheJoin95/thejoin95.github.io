import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseArticle, renderReading, visibleArticles } from "@/lib/journal";

const template = (name: string) => readFileSync(`docs/publishing/templates/${name}.md`, "utf8");

test("the documented article starter is a valid unpublished draft and becomes a readable article when approved", async () => {
  const source = template("article");
  const draft = parseArticle(source, "my-first-post");
  expect(draft.draft).toBe(true);
  expect(visibleArticles([draft], new Date("2030-01-01"))).toEqual([]);
  const approved = parseArticle(source.replace("draft: true", "draft: false"), "my-first-post");
  expect(visibleArticles([approved], new Date("2030-01-01"))).toEqual([approved]);
  const reading = await renderReading(approved.body);
  expect(reading.contents.map(entry => entry.title)).toEqual(["Context", "Approach", "Outcome"]);
  expect(reading.html).not.toContain("<h1");
});

test("the sketchbook starter stays unpublished and cannot publish without described panels", () => {
  const source = template("sketchbook");
  const draft = parseArticle(source, "my-drawing-study");
  expect(draft.kind).toBe("sketchbook"); expect(draft.panels).toEqual([]);
  expect(visibleArticles([draft], new Date("2030-01-01"))).toEqual([]);
  expect(() => parseArticle(source.replace("draft: true", "draft: false"), "my-drawing-study")).toThrow("at least one described, credited panel");
});

test("maintenance and publishing handoffs have working repository file links", () => {
  const paths = ["docs/maintenance/README.md", "docs/maintenance/projects.md", "docs/maintenance/deployment.md", "docs/maintenance/release-record.md", "docs/publishing/journal.md"];
  let checked = 0;
  for (const path of paths) {
    const source = readFileSync(path, "utf8");
    for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      expect(existsSync(resolve(dirname(path), target)), `${path} → ${target}`).toBe(true);
      checked++;
    }
  }
  expect(checked).toBeGreaterThan(20);
});
