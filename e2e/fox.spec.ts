import { test, expect, type Page } from "@playwright/test";
import { resolve } from "node:path";

async function fixture(page: Page, scripts = true) {
  await page.goto("/about");
  const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.map(link => (link as HTMLLinkElement).href));
  await page.setContent(`<html lang="en"><head><base href="http://127.0.0.1:3109/">${styles.map(href => `<link rel="stylesheet" href="${href}">`).join("")}</head><body><main class="p-8"><canvas id="fox-proof" width="384" height="320" style="width:192px;height:160px"></canvas><div id="fox-ui"><img src="/characters/fox/rest.svg" width="48" height="40" alt=""></div></main></body></html>`);
  if (scripts) await page.addScriptTag({ path: resolve(".test-fixtures/fox.js") });
}
async function loadProof(page: Page, clip: string) {
  await expect.poll(() => page.evaluate(() => window.foxError || window.foxProof.isLoaded)).toBe(true);
  await page.evaluate(clip => new Promise<void>((resolve, reject) => {
    const player = window.foxProof;
    const loaded = () => { player.removeEventListener("load", loaded); resolve(); };
    player.addEventListener("load", loaded);
    player.addEventListener("loadError", () => reject(new Error("Invalid animation")));
    player.load({ src: `/animations/fox/${clip}.lottie`, autoplay: false, loop: false });
  }), clip);
}
async function frame(page: Page, number: number) {
  await page.evaluate(number => window.foxProof.setFrame(number), number);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  return page.locator("#fox-proof").screenshot();
}

test("all compressed clips render in the installed engine and end at the exact resting frame", async ({ page }) => {
  await fixture(page);
  for (const [clip, peak, end] of [["notice", 10, 29], ["follow", 14, 35], ["settle", 18, 41]] as const) {
    await loadProof(page, clip);
    const rest = await frame(page, 0);
    expect(await page.evaluate(() => {
      const canvas = document.getElementById("fox-proof") as HTMLCanvasElement;
      return [...canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data].filter((value, index) => index % 4 === 3 && value > 0).length;
    })).toBeGreaterThan(5000);
    const moving = await frame(page, peak); expect(moving.equals(rest)).toBe(false);
    await page.locator("#fox-proof").screenshot({ path: `/tmp/mic21-${clip}-peak.png` });
    expect((await frame(page, end)).equals(rest)).toBe(true);
    expect(await page.evaluate(() => window.foxProof.loop)).toBe(false);
  }
});

test("Lottie and SVG silhouettes and interior markings agree at rest", async ({ page }) => {
  await fixture(page); await loadProof(page, "notice"); await frame(page, 0);
  const overlap = await page.evaluate(async () => {
    const actual = document.getElementById("fox-proof") as HTMLCanvasElement;
    const reference = document.createElement("canvas"); reference.width = actual.width; reference.height = actual.height;
    const image = new Image(); image.src = "/characters/fox/rest.svg"; await image.decode();
    reference.getContext("2d")!.drawImage(image, 0, 0, reference.width, reference.height);
    const a = actual.getContext("2d")!.getImageData(0, 0, actual.width, actual.height).data;
    const b = reference.getContext("2d")!.getImageData(0, 0, reference.width, reference.height).data;
    let intersection = 0, union = 0, colorError = 0;
    for (let index = 3; index < a.length; index += 4) {
      if (a[index] > 100 || b[index] > 100) union++;
      if (a[index] > 100 && b[index] > 100) { intersection++; for (let channel = 1; channel <= 3; channel++) colorError += Math.abs(a[index - channel] - b[index - channel]); }
    }
    return { silhouette: intersection / union, meanColorError: colorError / (intersection * 3) };
  });
  expect(overlap.silhouette).toBeGreaterThan(0.97);
  expect(overlap.meanColorError).toBeLessThan(5);
});

test("chosen React wrapper plays once, settles to its static pose and does not replay on re-entry", async ({ page }) => {
  await fixture(page);
  await page.getByRole("button", { name: "Play notice", exact: true }).click();
  const canvas = page.locator("#fox-wrapper canvas"); await expect(canvas).toBeVisible();
  await expect(canvas).not.toHaveClass(/opacity-0/);
  await expect(canvas).toHaveCount(0);
  await expect(page.locator("#fox-wrapper img")).toBeVisible();
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => scrollTo(0, 0));
  await expect(canvas).toHaveCount(0);
  await expect(page.locator("#fox-wrapper [aria-hidden='true']")).toHaveCount(1);
});

test("reduced motion changes, offscreen state and failed clips retain the static fox", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await fixture(page);
  await page.getByRole("button", { name: "Play follow", exact: true }).click();
  await expect(page.locator("#fox-wrapper img")).toBeVisible(); await expect(page.locator("#fox-wrapper canvas")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#fox-wrapper canvas")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#fox-wrapper canvas")).toHaveCount(0); await expect(page.locator("#fox-wrapper img")).toBeVisible();
  await page.route("**/animations/fox/settle.lottie", route => route.abort());
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Play settle", exact: true }).click();
  await expect(page.locator("#fox-wrapper img")).toBeVisible();
  await expect(page.locator("#fox-wrapper canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Play notice", exact: true }).click();
  await expect(page.locator("#fox-wrapper canvas")).toBeVisible();
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("#fox-wrapper canvas")).toHaveCount(0);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator("#fox-wrapper canvas")).toHaveCount(0);
});

test("visibility events pause and resume an unfinished clip", async ({ page }) => {
  await fixture(page);
  await page.getByRole("button", { name: "Play settle", exact: true }).click();
  const canvas = page.locator("#fox-wrapper canvas");
  await expect(canvas).not.toHaveClass(/opacity-0/);
  await page.waitForTimeout(150);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  const paused = await canvas.screenshot(); await page.waitForTimeout(200);
  expect((await canvas.screenshot()).equals(paused)).toBe(true);
  await page.evaluate(() => { Reflect.deleteProperty(document, "hidden"); document.dispatchEvent(new Event("visibilitychange")); });
  await page.waitForTimeout(200);
  expect((await canvas.screenshot()).equals(paused)).toBe(false);
});

test("failed local WASM retains the static fallback without a CDN dependency", async ({ page }) => {
  await page.route("**/animations/runtime/dotlottie-player.wasm", route => route.abort());
  await fixture(page);
  await page.getByRole("button", { name: "Play notice", exact: true }).click();
  await expect(page.locator("#fox-wrapper img")).toBeVisible();
  await expect(page.locator("#fox-wrapper img")).toHaveAttribute("src", "/characters/fox/rest.svg");
  await page.waitForTimeout(300);
  await expect(page.locator("#fox-wrapper img")).toBeVisible();
});

test("40–96px static poses remain available without scripts on white and charcoal", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1100, height: 800 } });
  const page = await context.newPage(); await fixture(page, false);
  await page.setContent(`<html><head><base href="http://127.0.0.1:3109/"></head><body style="margin:0;font-family:Arial"><h1>MIC-21 original fox — size and pose proof</h1><p>Columns: rest · notice · follow · settle</p>${["#ffffff", "#111111"].map(background => `<section style="background:${background};padding:24px;color:${background === "#ffffff" ? "#111111" : "#ffffff"}">${[40,48,64,96].map(width => `<div style="display:flex;gap:32px;align-items:center"><span style="width:48px">${width}px</span>${["rest","notice","follow","settle"].map(pose => `<div style="width:120px"><img src="/characters/fox/${pose}.svg" alt="" width="${width}" height="${width*160/192}"></div>`).join("")}</div>`).join("")}</section>`).join("")}</body></html>`);
  for (const image of await page.locator("img").all()) expect(await image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: "/tmp/mic21-fox-sheet.png", fullPage: true });
  await context.close();
});
