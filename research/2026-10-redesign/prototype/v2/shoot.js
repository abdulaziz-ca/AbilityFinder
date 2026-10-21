// Screenshot helper: a throwaway page first, because the first WebGL page in a fresh
// headless Chromium composites as white.
const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
const URL = "http://127.0.0.1:8798/research/2026-10-redesign/prototype/v2/index.html";
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const warm = await b.newPage(); await warm.goto(URL); await warm.waitForTimeout(800); await warm.close();
  for (const [w, h, tag] of [[1440, 900, "desk"], [390, 844, "phone"]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(URL); await p.waitForTimeout(2200);
    await p.screenshot({ path: `v2-${tag}-hero.png` });
    await p.evaluate(() => scrollTo(0, 640)); await p.waitForTimeout(1300); await p.screenshot({ path: `v2-${tag}-app.png` });
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"))); await p.waitForTimeout(900);
    await p.screenshot({ path: `v2-${tag}-full.png`, fullPage: true });
    if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) console.log("H-SCROLL", tag);
    await p.close();
  }
  await b.close();
})();
