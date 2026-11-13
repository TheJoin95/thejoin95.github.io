import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PaletteStage } from "@/components/home/palette-stage";
import { paletteImages, revealAt } from "@/components/palette/reveal";

test("reveal input clamps at both endpoints and reverses the right-hand palette fraction", () => {
  expect(revealAt(100, 100, 400)).toBe(100);
  expect(revealAt(500, 100, 400)).toBe(0);
  expect(revealAt(300, 100, 400)).toBe(50);
  expect(revealAt(200, 100, 400)).toBe(75);
  expect(revealAt(-100, 100, 400)).toBe(100);
  expect(revealAt(1000, 100, 400)).toBe(0);
});

test("initial HTML is a useful 50/50 comparison with authentic sources and no inoperative controls", () => {
  const html = renderToStaticMarkup(<PaletteStage href="/work/chromatique" />);
  expect(html).toContain('clip-path:inset(0 0 0 50%)');
  expect(html).toContain(encodeURIComponent(paletteImages.original));
  expect(html).toContain(encodeURIComponent(paletteImages.palette));
  expect(html).toContain('sizes="(min-width: 1600px) 1600px, 100vw"');
  expect(html).toContain("no dithering");
  expect(html).toContain("Frances Benjamin Johnston");
  expect(html).toContain('href="/work/chromatique"');
  expect(html).not.toContain("<canvas");
  expect(html).not.toContain('type="range"');
  expect(html).not.toContain("<button");
});
