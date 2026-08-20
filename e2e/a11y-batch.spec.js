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

// Give A11Y-03 an explicit focus origin before asserting where Tab lands, and make a
// failure say WHAT had focus instead of only that the skip link did not.
//
// THE MECHANISM BEHIND #198 IS NOT PROVEN. Read this before trusting the fix.
//
// An earlier version of this comment claimed a parser race: that Tab was landing before
// the document was ready. That explanation is WRONG, and the correction matters because
// someone will otherwise stop looking. page.goto() defaults to waiting for "load", so
// readyState is already "complete" when the Tab is pressed, and #skipLink is static
// markup (public/index.html:43) rather than rendered by app.js. The measurement offered
// as proof used waitUntil:"commit", a state this test never enters — it varied the
// navigation timing and the focus setup at the same time and isolated neither.
//
// What is actually established, holding navigation at the real default and varying ONLY
// the focus setup, on firefox:
//
//   without body.focus(), idle          40/40 landed on #skipLink
//   with    body.focus(), idle          40/40
//   without body.focus(), under load    40/40
//   with    body.focus(), under load    40/40
//
// So the CI failure did NOT reproduce locally, and this change shows no measurable
// effect on the path the test actually takes. It is defensible on its own terms — it
// removes a real inconsistency, since tabReachesButtonsAndLinks() above always
// establishes an origin with document.body.focus() and this assertion did not — but it
// is NOT demonstrated to fix the two CI failures, and #198 stays open for that reason.
//
// The durable value here is the diagnostic below. The two existing captures could prove
// #skipLink was not focused but not what was; the next occurrence will name it.
//
// Constraints kept: retries stays 0 (#63), no sleep was added, no timeout was raised,
// and the assertion is not weakened — "first focusable element" is a claim about tabbing
// from the start of a settled document, so establishing that origin is the precondition
// the claim needs. A focusable element ahead of the skip link still fails the test.
//
// KNOWN LIMIT of normalizing focus: if application code ever moved focus during startup,
// body.focus() would overwrite that and hide it. No such startup focus exists today, and
// that would be a different assertion (initial focus, not first tab stop) — but if this
// test ever starts passing while real keyboard users report trouble, suspect this line.
async function settleFocusOrigin(page) {
  // Redundant under page.goto's default "load" wait, and kept deliberately as an
  // explicit precondition rather than an implicit dependency on that default. It is
  // NOT the fix; the body.focus() below is the only behavioural change.
  await page.waitForFunction(
    () => document.readyState === "complete" && !!document.getElementById("skipLink")
  );
  await page.evaluate(() => document.body.focus());
}

// NOTE the timing: this snapshot is taken immediately after the Tab keypress, BEFORE
// toBeFocused() opens its retry window. That is deliberate — what Tab actually produced
// is the informative moment — but it means the message describes t=0, not the state
// after the retries expired. If those two ever disagree, that disagreement is the
// finding.
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
