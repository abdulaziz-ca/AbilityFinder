import { test, expect } from "@playwright/test";

async function installCspViolationRecorder(page) {
  await page.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      window.__cspViolations.push({
        blockedURI: event.blockedURI,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        violatedDirective: event.violatedDirective,
      });
    });
  });
}

async function cspViolations(page) {
  return page.evaluate(() => window.__cspViolations);
}

test("REL-05: the app boots under the real CSP with no violations", async ({ page }) => {
  const consoleMessages = [];
  const pageErrors = [];
  page.on("console", (message) => consoleMessages.push(`${message.type()}: ${message.text()}`));
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await installCspViolationRecorder(page);

  await page.goto("/");
  await expect.poll(() => page.locator("#app").evaluate((app) => app.children.length)).toBeGreaterThan(0);

  expect(await cspViolations(page)).toEqual([]);
  expect(pageErrors, `Console messages:\n${consoleMessages.join("\n")}`).toEqual([]);
});

test("REL-05: the crash-recovery controls work under the real CSP", async ({ page }) => {
  await installCspViolationRecorder(page);
  await page.goto("/");

  // Force a genuine failure through the app's own render path, so the error card
  // is produced and wired exactly as it would be for a real user.
  await page.evaluate(() => {
    window.renderLanding = () => {
      throw new Error("injected");
    };
    window.view = "landing";
    window.render();
  });

  const card = page.locator("#reRetry");
  await expect(card).toBeVisible();
  const html = await page.evaluate(() => document.getElementById("app").innerHTML);
  expect(html).toContain('id="reRetry"');
  expect(html).not.toContain("onclick");

  // Prove that the listener triggered a real reload by checking that a marker
  // placed on the old page does not survive the navigation.
  await page.evaluate(() => {
    window.__beforeReload = true;
  });
  await Promise.all([
    page.waitForLoadState("load"),
    card.click(),
  ]);
  const survived = await page.evaluate(() => window.__beforeReload === true);
  expect(survived).toBe(false);

  expect(await cspViolations(page)).toEqual([]);
});

test("the strict CSP is actually enforced on this origin", async ({ page }) => {
  await installCspViolationRecorder(page);
  await page.goto("/");

  await page.evaluate(() => {
    window.__cspViolations.length = 0;
    const script = document.createElement("script");
    script.textContent = "window.__inlineRan = true;";
    document.head.appendChild(script);
  });

  expect(await page.evaluate(() => window.__inlineRan)).toBeUndefined();
  await expect.poll(async () => (await cspViolations(page)).length).toBeGreaterThan(0);
  const violations = await cspViolations(page);
  expect(violations.some((violation) => /script-src/i.test(
    `${violation.effectiveDirective} ${violation.violatedDirective}`,
  ))).toBeTruthy();
});
