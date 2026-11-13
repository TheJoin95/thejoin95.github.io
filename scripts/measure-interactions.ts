import { chromium } from "@playwright/test";

type LabEvent = { name: string; duration: number; interactionId: number; startTime: number; processingStart: number; processingEnd: number };
declare global {
  interface Window {
    labEvents: LabEvent[];
    labTasks: { startTime: number; duration: number }[];
  }
}

// Run against the same production server as measure-performance.ts.
// Browser EventTiming samples are diagnostic and are never labelled field INP.
const browser = await chromium.launch();
const runs = [];
try {
  for (const path of ["/", "/work", "/play"]) for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 196608, uploadThroughput: 98304 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.labEvents = []; window.labTasks = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const event = entry as PerformanceEntry & { interactionId: number; processingStart: number; processingEnd: number };
          window.labEvents.push({ name: event.name, duration: event.duration, interactionId: event.interactionId, startTime: event.startTime, processingStart: event.processingStart, processingEnd: event.processingEnd });
        }
      }).observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit & { durationThreshold: number });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.labTasks.push({ startTime: entry.startTime, duration: entry.duration });
      }).observe({ type: "longtask", buffered: true });
    });
    await page.goto("http://127.0.0.1:3109" + path);
    await page.waitForTimeout(2500);
    const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
    const target = path === "/work" ? gallery.getByRole("button", { name: /Next media/ }) : page.getByRole("button", { name: "Meet the fox", exact: true });
    await target.click();
    if (path === "/work") await gallery.getByRole("status").filter({ hasText: "2 of 3" }).waitFor();
    else await page.getByRole("region", { name: "A quiet corner.", exact: true }).waitFor();
    await page.waitForTimeout(500);
    runs.push({ path, run, action: path === "/work" ? "Next media" : "Open fox corner", ...await page.evaluate(() => ({ events: window.labEvents, longTasks: window.labTasks })) });
    await context.close();
  }
  await Bun.write(process.argv[2] || "/tmp/portfolio-interactions.json", JSON.stringify({ browser: browser.version(), profile: "390x844 DPR2, 4x CPU, 150ms RTT, 196608B/s; synthetic click EventTiming, not field INP", runs }, null, 2) + "\n");
} finally { await browser.close(); }
