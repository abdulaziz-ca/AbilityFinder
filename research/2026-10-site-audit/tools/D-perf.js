const { chromium, devices } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
const BASE = process.argv[2] || "http://127.0.0.1:8799";
const CPU = Number(process.argv[3] || 4);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], userAgent: undefined, isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => {
    window.__lt = []; window.__lcp = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push({ s: Math.round(e.startTime), d: Math.round(e.duration) }))).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = Math.round(e.startTime)))).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  await cdp.send("Performance.enable");
  const t0 = Date.now();
  await page.goto(BASE + "/");
  await page.waitForFunction(() => history.state !== null && document.querySelector(".hero-title"));
  const ready = Date.now() - t0;
  await page.waitForTimeout(500);
  const land = await page.evaluate(() => ({ fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime), lcp: window.__lcp, dcl: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart), lt: window.__lt.slice(), nodes: document.querySelectorAll("*").length }));
  const heap = async () => { const m = (await cdp.send("Performance.getMetrics")).metrics; const g = (n) => m.find((x) => x.name === n).value; return { heapMB: +(g("JSHeapUsedSize") / 1048576).toFixed(1), nodes: g("Nodes"), listeners: g("JSEventListeners") }; };
  console.log("CPU x" + CPU, "LANDING ready(history.state) ms", ready, JSON.stringify(land), JSON.stringify(await heap()));
  // results for a broad profile
  const profiles = {
    broad: { forWho: "self", disabilities: ["physical", "mental"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", functionalNeeds: ["mobility"], province: "AB", circumstances: ["none"], citizenPR: true, dtc: "yes", situation: ["unableToWork"], income: "low", city: "Edmonton" },
    on: { forWho: "self", disabilities: ["physical"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", functionalNeeds: ["mobility"], province: "ON", circumstances: ["none"], citizenPR: true, dtc: "yes", situation: ["working"], income: "low", city: "Toronto" },
  };
  for (const [name, model] of Object.entries(profiles)) {
    const r = await page.evaluate(async (model) => {
      window.__lt.length = 0;
      answers = Object.assign(BLANK(), model);
      const t = performance.now();
      setState("results");
      const sync = performance.now() - t;
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      const paint = performance.now() - t;
      await new Promise((r) => setTimeout(r, 1500));
      return { sync: Math.round(sync), toPaint: Math.round(paint), lt: window.__lt.slice(), nodes: document.querySelectorAll("#app *").length, cards: document.querySelectorAll("#app .bcard, #app article, #app .card").length, liveRegions: document.querySelectorAll("[aria-live],[role=status],[role=alert],[role=log]").length, h: [...document.querySelectorAll("#app h1,#app h2,#app h3")].slice(0, 6).map((h) => h.tagName + ":" + h.textContent.trim().slice(0, 40)), htmlKB: Math.round(document.getElementById("app").innerHTML.length / 1024) };
    }, model);
    console.log("RESULTS", name, JSON.stringify(r), JSON.stringify(await heap()));
  }
  // re-render cost of the same results page (e.g. group toggle)
  const rr = await page.evaluate(async () => { const ts = []; for (let i = 0; i < 5; i++) { const t = performance.now(); render(); ts.push(Math.round(performance.now() - t)); } return ts; });
  console.log("RESULTS re-render x5 ms", rr);
  // evaluate cost alone
  const ev = await page.evaluate(() => { const t = performance.now(); for (let i = 0; i < 10; i++) browseCatalog().map((b) => evaluate(b)); return Math.round((performance.now() - t) / 10); });
  console.log("evaluate all programs ms/iter", ev);
  // detail view
  const d = await page.evaluate(async () => { window.__lt.length = 0; const t = performance.now(); setState("detail", { detailId: "aish" }); const s = performance.now() - t; await new Promise((r) => setTimeout(r, 800)); return { sync: Math.round(s), lt: window.__lt.slice(), nodes: document.querySelectorAll("#app *").length }; });
  console.log("DETAIL aish", JSON.stringify(d));
  const b = await page.evaluate(async () => { window.__lt.length = 0; const t = performance.now(); setState("browse"); const s = performance.now() - t; await new Promise((r) => setTimeout(r, 800)); return { sync: Math.round(s), lt: window.__lt.slice(), nodes: document.querySelectorAll("#app *").length }; });
  console.log("BROWSE", JSON.stringify(b));
  // wizard step re-render on a checkbox tick
  const w = await page.evaluate(async () => { answers = BLANK(); setState("wizard", { stepIndex: 0 }); await new Promise((r) => setTimeout(r, 300)); const t = performance.now(); render(); return Math.round(performance.now() - t); });
  console.log("WIZARD step render ms", w);
  // Search typing in browse: measure per-keystroke cost
  await page.evaluate(() => setState("browse"));
  await page.waitForSelector("#browseInput");
  window.__x = 0;
  await page.evaluate(() => (window.__lt.length = 0));
  const ts = Date.now();
  await page.locator("#browseInput").pressSequentially("transit pass", { delay: 30 });
  await page.waitForTimeout(600);
  const kb = await page.evaluate(() => ({ lt: window.__lt.slice(), focusOk: document.activeElement && document.activeElement.id }));
  console.log("BROWSE typing 12 chars", Date.now() - ts, "ms", JSON.stringify(kb));
  console.log("final", JSON.stringify(await heap()));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
