const { test, expect } = require("@playwright/test");

test("the first paint already matches the settled landing layout, so nothing jumps", async ({ page }) => {
  // Block app.js so the page stays in its pre-render state — the exact frame the user sees first.
  await page.route("**/app.js*", (route) => route.abort());
  await page.goto("/");

  const computed = await page.evaluate(() => {
    const progress = document.querySelector(".progress");
    const app = document.getElementById("app");
    return {
      progress: progress ? getComputedStyle(progress).display : null,
      app: app ? getComputedStyle(app).display : null,
    };
  });

  // Both come from CSS, before any script runs. If either regresses, #app moves on first
  // render and the landing visibly jumps: measured at CLS 0.0905 before this was fixed.
  expect(computed.progress, ".progress must be hidden by CSS at first paint").toBe("none");
  expect(computed.app, "#app must establish a block formatting context so the hero margin cannot collapse through it").toBe("flow-root");
});
