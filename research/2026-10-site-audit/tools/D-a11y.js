const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
const BASE = "http://127.0.0.1:8799";
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(BASE + "/"); await page.waitForFunction(() => history.state !== null);
  const audit = () => page.evaluate(() => {
    const vis = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && !el.closest("[hidden]") && (r.width > 0 || r.height > 0); };
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(vis).map((h) => h.tagName[1] + " " + h.textContent.replace(/\s+/g, " ").trim().slice(0, 50));
    const skips = []; let prev = 0; for (const h of hs) { const l = +h[0]; if (prev && l > prev + 1) skips.push(h); prev = l; }
    const landmarks = [...document.querySelectorAll("main,nav,header,footer,aside,[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=region],section[aria-label],section[aria-labelledby],[role=complementary]")].filter(vis).map((e) => e.tagName.toLowerCase() + (e.getAttribute("role") ? "[" + e.getAttribute("role") + "]" : "") + (e.getAttribute("aria-label") ? "(" + e.getAttribute("aria-label").slice(0, 25) + ")" : ""));
    const live = [...document.querySelectorAll("[aria-live],[role=status],[role=alert],[role=log]")].map((e) => (e.id || e.className.toString().slice(0, 20)) + ":" + (e.getAttribute("aria-live") || e.getAttribute("role")));
    // unlabeled form controls
    const unl = [...document.querySelectorAll("input,select,textarea")].filter(vis).filter((i) => i.type !== "hidden" && !i.labels?.length && !i.getAttribute("aria-label") && !i.getAttribute("aria-labelledby")).map((i) => i.outerHTML.slice(0, 80));
    // buttons w/o names
    const nn = [...document.querySelectorAll("button,a[href],[role=button]")].filter(vis).filter((b) => !(b.textContent.trim() || b.getAttribute("aria-label") || b.getAttribute("aria-labelledby") || b.title)).map((b) => b.outerHTML.slice(0, 80));
    // touch targets < 24 and < 44
    const tt = [...document.querySelectorAll("button,a[href],input,select,summary,[role=button],label[for]")].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return { e, w: r.width, h: r.height }; });
    const inlineLink = (e) => e.tagName === "A" && getComputedStyle(e).display === "inline";
    const small24 = tt.filter((t) => (t.w < 24 || t.h < 24) && !inlineLink(t.e)).map((t) => t.e.tagName + "." + (t.e.className.toString().split(" ")[0] || t.e.id) + " " + Math.round(t.w) + "x" + Math.round(t.h));
    const small44 = tt.filter((t) => (t.w < 44 || t.h < 44) && !inlineLink(t.e)).length;
    const ids = {}; document.querySelectorAll("[id]").forEach((e) => (ids[e.id] = (ids[e.id] || 0) + 1)); const dup = Object.entries(ids).filter(([, n]) => n > 1).map(([k, n]) => k + "x" + n);
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return { title: document.title, h1count: hs.filter((h) => h[0] === "1").length, hs: hs.slice(0, 14), hTotal: hs.length, skips, landmarks: [...new Set(landmarks)], live, unl, nn: nn.slice(0, 5), small24: [...new Set(small24)].slice(0, 12), small24n: small24.length, small44, targets: tt.length, dup, overflow, focus: document.activeElement && (document.activeElement.id || document.activeElement.tagName + "." + document.activeElement.className) };
  });
  const out = {};
  out.landing = await audit();
  // wizard: click start
  await page.evaluate(() => { answers = BLANK(); setState("wizard", { stepIndex: 0 }); });
  await page.waitForTimeout(400); out.wizard0 = await audit();
  out.wizardSteps = await page.evaluate(() => visibleSteps().map((s) => s.id || s.key));
  await page.evaluate(() => setState("wizard", { stepIndex: 3 })); await page.waitForTimeout(400); out.wizard3 = await audit();
  await page.evaluate(() => { answers = Object.assign(BLANK(), { forWho: "self", disabilities: ["physical", "mental"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", functionalNeeds: ["mobility"], province: "AB", circumstances: ["none"], citizenPR: true, dtc: "yes", situation: ["unableToWork"], income: "low", city: "Edmonton" }); setState("results"); });
  await page.waitForTimeout(800); out.results = await audit();
  await page.evaluate(() => setState("detail", { detailId: "aish" })); await page.waitForTimeout(500); out.detail = await audit();
  await page.evaluate(() => setState("browse")); await page.waitForTimeout(500); out.browse = await audit();
  await page.goto(BASE + "/guides/aish.html"); out.staticGuide = await audit();
  await page.goto(BASE + "/guides/index.html"); out.staticIndex = await audit();
  for (const [k, v] of Object.entries(out)) console.log("==", k, JSON.stringify(v, null, 0));
  await cdp.send("HeapProfiler.enable");
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
