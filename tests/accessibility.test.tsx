import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { renderReading } from "@/lib/journal";
import ErrorPage from "@/app/error";

test("multiple code and table regions have distinct spoken names while retaining keyboard scroll", async () => {
  const body = '```txt\nfirst\n```\n\n```txt\nsecond\n```\n\n| A | B |\n|---|---|\n| C | D |\n\n| E | F |\n|---|---|\n| G | H |';
  const { html } = await renderReading(body);
  expect([...html.matchAll(/aria-label="([^"]*)"/g)].map(match => match[1])).toEqual(["Code example 1", "Code example 2", "Data table 1", "Data table 2"]);
  expect(html.match(/tabindex="0"/g)).toHaveLength(4);
});

test("legacy screenshot has a descriptive alternative without repeating its preserved authored caption", async () => {
  const source = readFileSync("content/journal/2020-02-23-sorting-hat-experiment-webar-in-js.md", "utf8");
  const { html } = await renderReading(source, true);
  expect(html).toContain('alt="Face detection with an augmented reality sorting hat"');
  expect(html).toContain("<em>Example of face recognition in web app</em>");
});

test("route error state has an announced error, a primary heading and native recovery controls", () => {
  const html = renderToStaticMarkup(<ErrorPage error={new Error("Test fixture")} reset={() => {}} />);
  expect(html).toContain('role="alert"'); expect(html.match(/<h1/g)).toHaveLength(1);
  expect(html).toContain("This page could not load."); expect(html).toContain("Try again"); expect(html).toContain('href="/"');
});


test("Three.js is removed from the website dependencies", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  for (const name of ["three", "@types/three", "@react-three/fiber", "@react-three/drei"]) {
    expect(pkg.dependencies?.[name]).toBeUndefined(); expect(pkg.devDependencies?.[name]).toBeUndefined();
  }
});
