const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(absolute) : [absolute];
  });
}

test('REL-05 "error-card recovery works under a self-only script CSP"', async ({ page }) => {
  const appSource = fs.readFileSync(path.join(PUBLIC_DIR, "app.js"), "utf8");
  expect(appSource).not.toContain("onclick=");

  await page.goto("/");
  const errorHtml = await page.evaluate(() => {
    const html = window.renderSafely(() => {
      throw new Error("injected");
    }, "test");

    // Exercise the requested direct injection. The CSP contract is represented
    // by the generated markup and the resulting DOM attributes.
    document.getElementById("app").innerHTML = html;
    return html;
  });

  expect(errorHtml).toContain('id="reRetry"');
  expect(errorHtml).toContain('id="reReset"');
  expect(errorHtml).not.toContain("onclick");
  await expect(page.locator(".render-error")).toBeVisible();
  await expect(page.locator("#reRetry")).not.toHaveAttribute("onclick");
  await expect(page.locator("#reReset")).not.toHaveAttribute("onclick");
});

test('SEC-05 "postal text cannot inject markup into the input attribute"', async ({ page }) => {
  await page.goto("/");

  const escaped = await page.evaluate(() => {
    const values = [
      '" onfocus=alert(1) x="',
      "<img src=x onerror=alert(1)>",
      'a"b\'c<d>e&f',
    ];
    return {
      values: values.map((value) => window.attrEscape(value)),
      nullValue: window.attrEscape(null),
      undefinedValue: window.attrEscape(undefined),
    };
  });

  expect(escaped.values).toEqual([
    "&quot; onfocus=alert(1) x=&quot;",
    "&lt;img src=x onerror=alert(1)&gt;",
    "a&quot;b&#39;c&lt;d&gt;e&amp;f",
  ]);
  for (const value of escaped.values) {
    const withoutEntities = value.replace(/&(amp|lt|gt|quot|#39);/g, "");
    expect(withoutEntities).not.toMatch(/["'<>&]/);
  }
  expect(escaped.nullValue).toBe("");
  expect(escaped.undefinedValue).toBe("");

  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });
  const hostilePostal = '\"><img src=x onerror=alert(1)>';
  await page.locator(".js-browse").first().click();
  await page.locator('.js-detail[data-id="dtc"]').click();
  await page.locator("#finderPostal").fill(hostilePostal);
  await page.locator("#d-back").click();
  await page.locator('.js-detail[data-id="dtc"]').click();

  await expect(page.locator("#finderPostal")).toHaveValue(hostilePostal);
  await expect(page.locator(".finder img[src='x']")).toHaveCount(0);
  const inputMarkup = await page.locator("#finderPostal").evaluate((input) => input.outerHTML);
  expect(inputMarkup).toContain("&quot;&gt;&lt;img src=x onerror=alert(1)&gt;");
  expect(inputMarkup).not.toContain('\"><img');
  expect(dialogs).toEqual([]);
});

test('AQ-03 "British Columbia browse filter survives a reload"', async ({ page }) => {
  await page.goto("/");
  const restored = await page.evaluate(() => {
    const validSelections = {
      browseLevels: ["all", "Federal", "Alberta", "British Columbia", "local"],
    };
    const restore = (browseLevel, defaults = {}) => window.AbilityFinderState.restorePersistedState(
      { ui: { browseLevel } },
      defaults,
    ).browseLevel;

    return {
      britishColumbia: restore("British Columbia", { validSelections }),
      bogus: restore("Atlantis", { validSelections }),
      fallbackBritishColumbia: restore("British Columbia"),
    };
  });

  expect(restored.britishColumbia).toBe("British Columbia");
  expect(restored.britishColumbia).not.toBe("all");
  expect(restored.bogus).toBe("all");
  expect(restored.fallbackBritishColumbia).toBe("British Columbia");
});

test('AQ-04 "a cross-jurisdiction province/city pair does not survive a restore"', async ({ page }) => {
  await page.goto("/");
  const cities = await page.evaluate(() => {
    const validSelections = {
      provinces: ["AB", "BC", "other"],
      cities: ["Edmonton", "Calgary", "Vancouver", "Coquitlam"],
      citiesByProvince: {
        AB: ["Edmonton", "Calgary"],
        BC: ["Vancouver", "Coquitlam"],
      },
    };
    const restoreCity = (province, city) => window.AbilityFinderState.restorePersistedState(
      { answers: { province, city } },
      { answers: { province: null, city: null }, validSelections },
    ).answers.city;

    return {
      crossJurisdiction: restoreCity("AB", "Vancouver"),
      albertaMatch: restoreCity("AB", "Edmonton"),
      bcMatch: restoreCity("BC", "Vancouver"),
      otherProvince: restoreCity("other", "Edmonton"),
    };
  });

  expect(cities.crossJurisdiction).toBeNull();
  expect(cities.albertaMatch).toBe("Edmonton");
  expect(cities.bcMatch).toBe("Vancouver");
  expect(cities.otherProvince).toBeNull();
});

test('UX-01 "the guide privacy link deep-links to the privacy view"', async ({ page }) => {
  const guidesDir = path.join(PUBLIC_DIR, "guides");
  const guideFiles = fs.readdirSync(guidesDir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(guidesDir, name));
  const checkedLinks = [];
  const bareRootLinks = [];

  for (const file of guideFiles) {
    const html = fs.readFileSync(file, "utf8");
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0];
    if (!footer || !footer.includes("Privacy &amp; disclaimer")) continue;
    const href = footer.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>\s*Privacy &amp; disclaimer\s*<\/a>/i)?.[1];
    expect(href, `${path.basename(file)} privacy footer href`).toBeTruthy();
    checkedLinks.push({ file, href });
    if (/^https:\/\/abilityfinder\.ca\/?(?:#.*)?$/i.test(href)) bareRootLinks.push(file);
  }

  expect(checkedLinks.length).toBeGreaterThanOrEqual(10);
  expect(bareRootLinks).toEqual([]);
  for (const { file, href } of checkedLinks) {
    expect(href, `${path.basename(file)} privacy footer href`).toContain("?view=privacy");
  }

  await page.goto("/");
  const landingText = (await page.locator("#app").innerText()).replace(/\s+/g, " ");
  await page.goto("/?view=privacy");
  await expect(page.locator("#app .legal")).toBeVisible();
  const privacyCandidates = await page.locator("#app .legal h1, #app .legal h2, #app .legal p")
    .allTextContents();
  const privacyOnlyText = privacyCandidates
    .map((text) => text.replace(/\s+/g, " ").trim())
    .find((text) => text.length >= 20 && !landingText.includes(text));
  expect(privacyOnlyText).toBeTruthy();
  await expect(page.locator("#app")).toContainText(privacyOnlyText);

  await page.goto("/?view=browse");
  await expect(page.locator("#app .landing")).toBeVisible();
  await expect(page.locator("#app .legal")).toHaveCount(0);
});

test('DEPLOY-01 "parked data file is not deployed"', async () => {
  expect(fs.existsSync(path.join(PUBLIC_DIR, "data-provinces-later.js"))).toBe(false);
  expect(fs.existsSync(path.join(ROOT, "archive", "data-provinces-later.js"))).toBe(true);

  const needle = Buffer.from("data-provinces-later");
  const references = filesUnder(PUBLIC_DIR).filter((file) => fs.readFileSync(file).includes(needle));
  expect(references).toEqual([]);
});
