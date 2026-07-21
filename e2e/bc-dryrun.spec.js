const { test, expect } = require("@playwright/test");

const ALBERTA_TITLE = /AISH|Assured Income for the Severely Handicapped|Alberta Adult Health|Alberta Child Health|AADL|Alberta Aids to Daily Living|Persons with Developmental Disabilities|Family Support for Children with Disabilities|Disability Related Employment Supports/i;
const BC_TITLE = /British Columbia|BC |PWD|Autism Funding|CLBC|Community Living BC/i;

async function enableBritishColumbia(page) {
  await page.route("**/app.js?*", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    const disabledFlag = "const BC_ENABLED = false;";
    const replacementCount = body.split(disabledFlag).length - 1;
    if (replacementCount !== 1) {
      throw new Error(
        `BC dry-run could not patch app.js: expected exactly one '${disabledFlag}', found ${replacementCount}`
      );
    }
    const patched = body.replace(disabledFlag, "const BC_ENABLED = true;");
    if (patched === body) {
      throw new Error("BC dry-run app.js patch made no change; refusing a silently unpatched run");
    }
    await route.fulfill({
      response,
      body: patched,
      headers: { ...response.headers(), "content-type": "application/javascript" },
    });
  });
}

async function deleteAppStorage(page) {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    if (window.AbilityFinderDB) await window.AbilityFinderDB.close();
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase("abilityfinder");
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Database deletion blocked"));
    });
  });
  await page.reload();
  await expect(page.locator("#app h1")).toBeVisible();
}

async function pick(page, text) {
  await page.locator("button.opt", { hasText: text }).click();
}

async function completeBcAdultWizard(page) {
  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();
  await pick(page, "18 to 64");
  await pick(page, "British Columbia");
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "Lower income");
  await page.locator("#selInput").selectOption("Vancouver");
  await expect(page.locator(".results-head")).toBeVisible();
}

async function completeBcChildWizard(page) {
  await page.locator(".js-start").first().click();
  await pick(page, "My child");
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();
  await pick(page, "British Columbia");
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "Lower income");
  await page.locator("#selInput").selectOption("Vancouver");
  await expect(page.locator(".results-head")).toBeVisible();
}

async function completeBcAdultWizardUnlistedCity(page) {
  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();
  await pick(page, "18 to 64");
  await pick(page, "British Columbia");
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "Lower income");
  await page.locator("#selInput").selectOption("Other / my town isn't listed");
  await expect(page.locator(".results-head")).toBeVisible();
}

async function openBrowseWithSavedBcAnswer(page) {
  await page.evaluate(async () => {
    const state = await window.AbilityFinderDB.loadState({});
    await window.AbilityFinderDB.saveState({ ...state, view: "browse" });
  });
  await page.reload();
  await expect(page.locator("#browseInput")).toBeVisible();
}

async function cardDiagnostics(page) {
  // Result IDs exist, but browse titles have no IDs; title matching keeps both views comparable.
  const cards = await page.locator(".benefit").evaluateAll((nodes) => nodes.map((card) => {
    const name = (card.querySelector("h3")?.textContent || "").trim();
    const visible = typeof card.checkVisibility === "function"
      ? card.checkVisibility()
      : !!(card.offsetParent || card.getClientRects().length);
    const group = card.closest("details.notmatch")
      ? "not-a-match"
      : document.querySelector("#browseInput")
        ? "browse"
        : card.closest(".benefits-grid")
          ? "matched"
          : "unknown";
    let section = "unknown";
    for (let el = card.parentElement; el; el = el.parentElement) {
      const classes = [...el.classList];
      if (el.id || classes.some((value) => /^(results|section)/.test(value))) {
        section = el.id ? `#${el.id}` : `.${classes.join(".")}`;
        break;
      }
      let sibling = el.previousElementSibling;
      while (sibling) {
        if (/^H[1-6]$/.test(sibling.tagName)) {
          section = sibling.textContent.trim();
          break;
        }
        sibling = sibling.previousElementSibling;
      }
      if (section !== "unknown") break;
    }
    return { name, section, visible, group };
  }));
  const leaks = cards.filter(({ name }) => ALBERTA_TITLE.test(name));
  console.log("BC-DRYRUN-CARDS", JSON.stringify(cards, null, 2));
  console.log("BC-DRYRUN-ALBERTA-LEAK", JSON.stringify(leaks, null, 2));
  return { cards, leaks };
}

async function expectBcOnlyResults(page) {
  await expect(page.locator(".render-error")).toHaveCount(0);
  const notMatch = page.locator("details.notmatch");
  if (await notMatch.count() && !(await notMatch.first().evaluate((details) => details.open))) {
    await notMatch.first().locator("summary").click();
  }
  const { cards, leaks } = await cardDiagnostics(page);
  const visibleCards = cards.filter(({ visible }) => visible);
  const hiddenLeaks = leaks.filter(({ visible }) => !visible);
  console.log("BC-DRYRUN-HIDDEN-ALBERTA", JSON.stringify(hiddenLeaks, null, 2));
  expect(visibleCards.length, `Expected at least 5 visible result cards; got ${JSON.stringify(cards)}`).toBeGreaterThanOrEqual(5);
  expect(visibleCards.some(({ name }) => BC_TITLE.test(name)), `No BC program found in ${JSON.stringify(cards)}`).toBe(true);
  expect(leaks, `Alberta programs leaked into BC results: ${JSON.stringify(leaks)}`).toEqual([]);
}

async function expectMixedBrowse(page) {
  await expect(page.locator(".render-error")).toHaveCount(0);
  const { cards, leaks } = await cardDiagnostics(page);
  const visibleCards = cards.filter(({ visible }) => visible);
  expect(visibleCards.length, `Expected at least 5 visible browse cards; got ${JSON.stringify(cards)}`).toBeGreaterThanOrEqual(5);
  expect(visibleCards.some(({ name }) => BC_TITLE.test(name)), `No BC program found in ${JSON.stringify(cards)}`).toBe(true);
  // browseCatalog() intentionally returns the full AB + BC catalog when BC_ENABLED is true.
  expect(leaks.length, `Browse should include Alberta programs too; leak diagnostic: ${JSON.stringify(leaks)}`).toBeGreaterThan(0);
}

test.beforeEach(async ({ page }) => {
  await enableBritishColumbia(page);
  await deleteAppStorage(page);
});

test("BC resident reaches results with BC programs and zero Alberta programs", async ({ page }) => {
  await completeBcAdultWizard(page);
  await expectBcOnlyResults(page);
});

test("BC-enabled browse contains both Alberta and BC programs", async ({ page }) => {
  await completeBcAdultWizard(page);
  await openBrowseWithSavedBcAnswer(page);
  await expectMixedBrowse(page);
});

test("BC child persona", async ({ page }) => {
  await completeBcChildWizard(page);
  await expectBcOnlyResults(page);
});

test("BC resident in an unlisted city", async ({ page }) => {
  await completeBcAdultWizardUnlistedCity(page);
  await expectBcOnlyResults(page);
});
