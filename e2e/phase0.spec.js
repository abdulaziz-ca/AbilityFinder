"use strict";
const { test, expect } = require("@playwright/test");
const { gotoReady } = require("./app-ready");

// Phase 0 (2026-10-22): correctness fixes found by the code audit.
test("every city with a listed local program skips the generic 2-1-1 card; unlisted towns keep it", async ({ page }) => {
  await gotoReady(page);
  const report = await page.evaluate(async () => {
    await ensurePacks(COVERED_PROVINCES);
    const wrong = [];
    for (const [prov, cities] of Object.entries(CITIES_BY_PROVINCE)) {
      for (const city of cities) {
        answers = { ...BLANK(), province: prov, city };
        // A city "has a program" when some local record (not the generic card) is open to it.
        const own = BENEFITS.some((b) => b.id !== "local-supports" && benefitIsLocal(b) && b.level !== "Your community"
          && benefitInResultsScope(b, answers) && (b.requires || []).some((r) => /answers\.city/.test(String((REQS[r] || {}).met)))
          && (b.requires || []).filter((r) => /answers\.city/.test(String((REQS[r] || {}).met))).every((r) => REQS[r].met()));
        if (REQS.cityOther.met() === own) wrong.push(`${prov}:${city}`);
      }
    }
    return { wrong, areas: localProgramAreas().length };
  });
  expect(report.wrong).toEqual([]);
  expect(report.areas).toBeGreaterThan(46);
});

test("PEI's city question says honestly that no city programs are listed yet", async ({ page }) => {
  await gotoReady(page);
  const help = await page.evaluate(() => {
    answers = { ...BLANK(), province: "PE" };
    const step = STEPS.find((s) => s.id === "city");
    const pe = stepText(step).help;
    answers.province = "AB";
    return { pe, ab: stepText(step).help };
  });
  expect(help.pe).toMatch(/don't list city programs for Prince Edward Island yet/);
  expect(help.ab).toMatch(/Unlocks local transit/);
});

test("marking a program Submitted records the date, and follow-ups count from it (never from download day)", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(async () => {
    answers = { ...BLANK(), province: "AB", city: "Calgary", forWho: "self", ageBand: "19to59", ageGroup: "adult", citizenPR: true,
      disabilities: ["physical"], functionalNeeds: ["mobility"], income: "low" };
    await ensurePacks(["AB"]); setState("results");
  });
  // Pick a tracked program whose published wait is a duration, so a follow-up applies.
  const id = await page.evaluate(() => [...document.querySelectorAll("[data-track]")].map((s) => s.dataset.track)
    .find((x) => waitToDays(BENEFIT_META[x] && BENEFIT_META[x].wait)));
  test.skip(!id, "no listed program with a duration wait for this persona");
  await page.locator(`[data-track="${id}"]`).selectOption("submitted");
  const date = page.locator(`[data-track-date="${id}"]`);
  await expect(date).toHaveValue(await page.evaluate(() => isoToday()));
  await expect(page.locator(`[data-track="${id}"]`)).toBeFocused();
  await date.fill("2026-01-05");
  await date.dispatchEvent("change");
  const ics = await page.evaluate(() => buildReminderIcs().ics.replace(/\r\n /g, ""));
  expect(ics).toContain("You submitted this on 2026-01-05");
  // An older save with no date: no invented follow-up for that program.
  const legacy = await page.evaluate((x) => { delete progressDates[x]; return buildReminderIcs().ics.replace(/\r\n /g, ""); }, id);
  expect(legacy).not.toContain(`followup-${id}`);
});

test("saved submitted-on dates are cleaned: no future, malformed or unknown-program dates", async ({ page }) => {
  await gotoReady(page);
  const out = await page.evaluate(() => AbilityFinderState.buildPersistedState({
    answers: BLANK(), progress: { dtc: "submitted" },
    progressDates: { dtc: "2026-02-30", aish: "2099-01-01", rdsp: "2026-03-04", "not-a-program": "2026-03-04" },
    validSelections: PERSISTENCE_SELECTIONS,
  }).progressDates);
  expect(out).toEqual({ rdsp: "2026-03-04" });
});

test("starting points ask before clearing work, resume at the first open question, and explain a move", async ({ page }) => {
  await gotoReady(page);
  // With saved work, dismissing the prompt keeps everything.
  await page.evaluate(() => { answers = { ...BLANK(), forWho: "self", province: "AB" }; progress = { dtc: "saved" }; setState("landing"); });
  page.once("dialog", (d) => d.dismiss());
  await page.locator('[data-nav="life-alberta"]').click();
  expect(await page.evaluate(() => [view, answers.province, progress.dtc])).toEqual(["landing", "AB", "saved"]);
  // Accepting starts fresh, at the first open question, with the move note.
  page.once("dialog", (d) => d.accept());
  await page.locator('[data-nav="life-alberta"]').click();
  await expect(page.locator(".life-note")).toContainText("go with you when you move");
  // Parent shortcut pre-fills "My child", so it opens on the next open question.
  await page.evaluate(() => { answers = BLANK(); progress = {}; setState("landing"); });
  await page.locator('[data-nav="life-parent"]').click();
  expect(await page.evaluate(() => [answers.forWho, visibleSteps()[stepIndex].id])).toEqual(["child", "disabilities"]);
  // Turning 18 no longer forces "Myself, exactly 18".
  await page.evaluate(() => setState("landing"));
  page.once("dialog", (d) => d.accept());
  await page.locator('[data-nav="life-turning18"]').click();
  expect(await page.evaluate(() => [answers.forWho, answers.ageBand])).toEqual([null, null]);
  await expect(page.locator(".life-note")).toContainText("16 to 17, or 18");
});
