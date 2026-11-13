import { chromium } from "@playwright/test";

// A repeatable local lab, not field Core Web Vitals or a Lighthouse score.
// Start a production server first. Output includes raw runs, not just averages.
const origin = "http://127.0.0.1:3109";
const paths = ["/", "/work", "/play", "/about", "/blog/2019-12-21-microfrontend-from-00-to-20s"];
const output = process.argv[2] || "/tmp/portfolio-performance.json";
const browser = await chromium.launch();
const runs = [];
try {
  for (const path of paths) for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 196608, uploadThroughput: 98304 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      const metrics = { lcp: 0, lcpElement: "", cls: 0, longTasks: [] as number[] };
      Object.assign(window, { labMetrics: metrics });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) {
        const item = entry as PerformanceEntry & { element?: Element };
        metrics.lcp = item.startTime; metrics.lcpElement = item.element?.tagName || "";
      } }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) {
        const item = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!item.hadRecentInput) metrics.cls += item.value;
      } }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) metrics.longTasks.push(entry.duration); }).observe({ type: "longtask", buffered: true });
    });
    const response = await page.goto(origin + path, { waitUntil: "load" });
    if (response?.status() !== 200) throw new Error(`${path}: ${response?.status()}`);
    await page.waitForTimeout(2500);
    const metrics = await page.evaluate(() => {
      const state = (window as unknown as { labMetrics: { lcp: number; lcpElement: string; cls: number; longTasks: number[] } }).labMetrics;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      return { ...state, fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null,
        resources: resources.map(item => ({ url: item.name.replace(location.origin, ""), type: item.initiatorType, bytes: item.encodedBodySize, duration: item.duration })),
        fonts: [...document.fonts].length,
        images: [...document.images].map(image => ({ url: image.currentSrc.replace(location.origin, ""), displayed: Math.round(image.getBoundingClientRect().width), natural: image.naturalWidth, loading: image.loading })),
        navigation: (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).toJSON() };
    });
    runs.push({ path, run, ...metrics });
    console.info(`${path} #${run}: LCP ${metrics.lcp.toFixed(0)}ms, CLS ${metrics.cls.toFixed(4)}, resources ${metrics.resources.reduce((sum, item) => sum + item.bytes, 0)}B`);
    await context.close();
  }
  await Bun.write(output, JSON.stringify({ date: new Date().toISOString().slice(0, 10), browser: browser.version(), profile: { viewport: "390x844", dpr: 2, cpuSlowdown: 4, latencyMs: 150, downloadBytesPerSecond: 196608, cache: "fresh browser context, browser cache disabled; server optimizer cache may be warm", observation: "load + 2500ms; no scroll or interaction" }, runs }, null, 2) + "\n");
} finally { await browser.close(); }
