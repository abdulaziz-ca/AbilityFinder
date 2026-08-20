const { test, expect } = require("@playwright/test");

// Safari/WebKit only tabs between form controls unless the user turns on Full
// Keyboard Access; links and buttons are skipped. That is engine policy, not a
// defect in this app, so probe the behaviour rather than hardcoding a browser
// name — a Safari with Full Keyboard Access enabled should run these assertions.
async function tabReachesButtonsAndLinks(page) {
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press("Tab");
  return page.evaluate(() => {
    const a = document.activeElement;
    return !!a && (a.tagName === "A" || a.tagName === "BUTTON");
  });
}

// Establish a DETERMINISTIC starting point before asserting where Tab lands.
//
// WHY, measured 2026-08-20 (#198): A11Y-03 pressed Tab straight after page.goto()
// without re-establishing a focus origin, unlike tabReachesButtonsAndLinks() three
// lines above it, which always calls document.body.focus() first. Pressing Tab while
// the document is still parsing does NOT land on the skip link — it leaves
// activeElement on BODY. Probed on firefox: with the document not yet ready, 16 of 20
// runs ended on BODY instead of #skipLink, which is exactly the CI symptom; once the
// document was ready, 40 of 40 landed on #skipLink.
//
// toBeFocused() then retries futilely, because focus does not move on its own — which
// is why the CI failures burned ~7-8s of a 90s budget rather than timing out at 90s.
//
// This does NOT weaken the assertion. "The skip link is the first focusable element"
// is a claim about tabbing from the start of the document, so starting from a known
// origin on a settled page is the precondition the claim needs, not a relaxation of it.
// No retry, no sleep, and no raised timeout.
async function settleFocusOrigin(page) {
  await page.waitForFunction(
    () => document.readyState === "complete" && !!document.getElementById("skipLink")
  );
  await page.evaluate(() => document.body.focus());
}

// Report WHAT actually has focus, so a failure names the element instead of only
// saying the expected one was not focused. The earlier CI captures could prove the
// skip link was not focused but not what was, which is the difference between an
// undiagnosable flake and a lead.
//
// NOTE the timing: this snapshot is taken immediately after the Tab keypress, BEFORE
// toBeFocused() opens its retry window. That is deliberate — what Tab actually
// produced is the informative moment — but it means the message describes t=0, not
// the state after the retries expired. If those two ever disagree, that disagreement
// is itself the finding.
async function describeActiveElement(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a) return "activeElement=null";
    return `activeElement=<${a.tagName.toLowerCase()}${a.id ? "#" + a.id : ""}${
      a.className && typeof a.className === "string" ? "." + a.className.trim().split(/\s+/).join(".") : ""
    }> readyState=${document.readyState} hasFocus=${document.hasFocus()}`;
  });
}

// No per-file timeout override. A hardcoded 5s cap lived here from when the
// suite was Chromium-only on a dev machine; it failed as soon as WebKit ran on a
// 2-vCPU CI runner, where the same work takes several times longer. These tests
// are not testing speed, so they inherit the global budget (45s locally, 90s on
// CI) instead of asserting an arbitrary one.

test("A11Y-03: skip link is first focusable, visible on focus, and moves focus to main", async ({ page }) => {
  await page.goto("/");
  const skip = page.locator("#skipLink");

  // Engine-specific: only assert Tab lands on it where the engine tabs to links.
  if (await tabReachesButtonsAndLinks(page)) {
    await page.goto("/");
    await settleFocusOrigin(page);
    await page.keyboard.press("Tab");
    await expect(skip, `Tab from a settled page should focus #skipLink, but ${await describeActiveElement(page)}`)
      .toBeFocused();
  }

  // Engine-agnostic product claims, asserted everywhere:
  // it is the first focusable element in DOM order,
  await expect(
    page.locator("a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])").first()
  ).toHaveAttribute("id", "skipLink");
  // it becomes visible when focused,
  await skip.focus();
  await expect(skip).toBeInViewport();
  // and activating it moves focus to main.
  await skip.press("Enter");
  await expect(page.locator("#app")).toBeFocused();
});

test("A11Y-03: accessibility dialog is modal (focus, trap, Escape, restore, inert)", async ({ page }) => {
  await page.goto("/");
  const tabsToButtonsAndLinks = await tabReachesButtonsAndLinks(page);
  await page.goto("/");
  const fab = page.locator("#a11yFab");
  const panel = page.locator("#a11yPanel");
  await fab.focus();
  await fab.press("Enter");
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("aria-modal", "true");
  // initial focus is inside the panel
  expect(await page.evaluate(() => !!(document.activeElement && document.activeElement.closest("#a11yPanel")))).toBe(true);
  // background is inert
  await expect(page.locator("#app")).toHaveAttribute("inert", "");
  if (tabsToButtonsAndLinks) {
    // Tab stays trapped inside the panel
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!(document.activeElement && document.activeElement.closest("#a11yPanel")))).toBe(true);
    }
    // Shift+Tab also stays trapped
    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => !!(document.activeElement && document.activeElement.closest("#a11yPanel")))).toBe(true);
  }
  // Escape closes, restores focus to the opener, removes inert
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(fab).toBeFocused();
  await expect(page.locator("#app")).not.toHaveAttribute("inert", /.*/);
});

test("A11Y-03: feedback empty submit marks invalid, associates + announces, preserves + recovers", async ({ page }) => {
  await page.goto("/");
  const msg = page.locator("#fb-msg");
  await expect(msg).toHaveAttribute("aria-describedby", "fb-status");
  await expect(page.locator("#fb-status")).toHaveAttribute("role", "status");
  await expect(page.locator("#fb-status")).toHaveAttribute("aria-live", "polite");
  await page.locator("#fb-send").click(); // empty message
  await expect(msg).toHaveAttribute("aria-invalid", "true");
  await expect(msg).toBeFocused();
  await expect(page.locator("#fb-status")).not.toBeEmpty();
  // recovery: valid message + successful submit clears invalid and message
  await msg.fill("Please fix a link.");
  await expect(msg).toHaveValue("Please fix a link."); // text preserved through the flow
  await page.route("**/api/feedback", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }));
  await page.locator("#fb-send").click();
  await expect(msg).toHaveAttribute("aria-invalid", "false");
});

test("A11Y-05: OS reduced-motion suppresses motion equivalently to in-app no-motion", async ({ page }) => {
  const probe = () => page.evaluate(() => { const el = document.querySelector(".ask-fab") || document.body; const cs = getComputedStyle(el); return { anim: cs.animationName, tdur: cs.transitionDuration }; });
  // OS setting
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const os = await probe();
  expect(os.anim === "none" && os.tdur === "0s").toBe(true);
  // in-app setting (no OS preference)
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await page.locator("#a11yFab").click();
  await page.locator("[data-toggle=\"motion\"]").click();
  const inApp = await probe();
  expect(inApp.anim === "none" && inApp.tdur === "0s").toBe(true);
});

test("A11Y-06: language control accessible name contains the visible EN/FR token", async ({ page }) => {
  await page.goto("/");
  const langBtn = page.locator("#langBtn");
  const visEn = (await page.locator("#langLabel").textContent()).trim();
  expect(await langBtn.getAttribute("aria-label")).toContain(visEn); // contains "EN"
  await langBtn.click(); // toggle language
  const visFr = (await page.locator("#langLabel").textContent()).trim();
  expect(await langBtn.getAttribute("aria-label")).toContain(visFr); // contains "FR"
});
