import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PaletteStage } from "@/components/home/palette-stage";
import { coverScale, paletteImages, revealAt } from "@/components/palette/reveal";

test("reveal input clamps at both endpoints and reverses the right-hand palette fraction", () => {
  expect(revealAt(100, 100, 400)).toBe(100);
  expect(revealAt(500, 100, 400)).toBe(0);
  expect(revealAt(300, 100, 400)).toBe(50);
  expect(revealAt(200, 100, 400)).toBe(75);
  expect(revealAt(-100, 100, 400)).toBe(100);
  expect(revealAt(1000, 100, 400)).toBe(0);
});

test("GPU cover crop matches CSS at phone tablet and panoramic sizes without distortion", () => {
  const imageAspect = paletteImages.width / paletteImages.height;
  for (const [width, height] of [[320, 240], [834, 469.125], [1440, 480], [100, 300], [1024, 846]]) {
    const [x, y] = coverScale(width, height);
    expect(Math.max(x, y)).toBe(1);
    expect(Math.min(x, y)).toBeGreaterThan(0);
    expect(imageAspect * x / y).toBeCloseTo(width / height, 6);
  }
});

test("initial HTML is a useful 50/50 comparison with authentic sources and no inoperative controls", () => {
  const html = renderToStaticMarkup(<PaletteStage href="/work/chromatique" />);
  expect(html).toContain('clip-path:inset(0 0 0 50%)');
  expect(html).toContain(paletteImages.original);
  expect(html).toContain(paletteImages.palette);
  expect(html).toContain("no dithering");
  expect(html).toContain("Frances Benjamin Johnston");
  expect(html).toContain('href="/work/chromatique"');
  expect(html).not.toContain("<canvas");
  expect(html).not.toContain('type="range"');
  expect(html).not.toContain("<button");
});
