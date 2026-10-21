const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
const BASE = "http://127.0.0.1:8798/research/2026-10-redesign/prototype/v2/";
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const warm = await b.newPage(); await warm.goto(BASE + "index.html"); await warm.waitForTimeout(800); await warm.close();
  for (const page of ["question", "results", "guide"]) for (const [w, h, tag] of [[1440, 900, "desk"], [390, 844, "phone"]]) for (const theme of ["dark", "light"]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await p.addInitScript((t) => { try { localStorage.setItem("af-theme", t); } catch (e) {} }, theme);
    await p.goto(BASE + page + ".html"); await p.waitForTimeout(1800);
    await p.evaluate(() => document.querySelectorAll(".reveal, .stagger").forEach((e) => e.classList.add("in"))); await p.waitForTimeout(1000);
    await p.screenshot({ path: `s-${page}-${tag}-${theme}.png`, fullPage: true });
    const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (over || errs.length) console.log(page, tag, theme, over ? "H-SCROLL" : "", errs.join(" | "));
    await p.close();
  }
  // results drawer open
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "results.html"); await p.waitForTimeout(1500); await p.click(".row[data-open]"); await p.waitForTimeout(800);
  await p.screenshot({ path: "s-results-drawer.png" }); await p.close();
  await b.close();
})();
