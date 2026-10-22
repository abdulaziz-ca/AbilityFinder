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

test("saved submitted-on dates are cleaned: no future, malformed, unknown-program or not-yet-sent dates", async ({ page }) => {
  await gotoReady(page);
  const out = await page.evaluate(() => AbilityFinderState.buildPersistedState({
    answers: BLANK(), progress: { dtc: "submitted", aish: "waiting", rdsp: "approved", cdb: "saved" },
    progressDates: { dtc: "2026-02-30", aish: "2099-01-01", rdsp: "2026-03-04", cdb: "2026-03-04", "not-a-program": "2026-03-04" },
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

test("Suggest a fix opens a prefilled correction from a guide, an organization, and a static-guide link", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(async () => { await ensurePacks(["AB"]); detailFrom = "browse"; setState("detail", { detailId: "aish" }); });
  await page.locator('[data-suggest-fix="aish"]').click();
  await expect(page.locator("#fb-type")).toHaveValue("Correction to a listing");
  await expect(page.locator("#fb-msg")).toHaveValue(/Correction for Assured Income for the Severely Handicapped \(AISH\): \[aish\]/);
  await expect(page.locator("#fb-msg")).toBeFocused();
  // Organizations too.
  await page.evaluate(() => { document.getElementById("fb-msg").value = ""; setState("organizations"); });
  const org = page.locator("#app article.org-card").first();
  const orgId = await org.getAttribute("data-org-id");
  await org.locator("[data-suggest-fix]").click();
  await expect(page.locator("#fb-msg")).toHaveValue(new RegExp(`\\[${orgId}\\]`));
  // Static guides link to ?fix=<id>, which opens the same prefilled form; nothing else is sent.
  await page.goto("/guides/aish.html");
  await expect(page.locator('.guide-fix-link')).toHaveAttribute("href", "https://abilityfinder.ca/?fix=aish");
  await page.goto("/?fix=aish");
  await expect(page.locator("#fb-type")).toHaveValue("Correction to a listing");
  await expect(page).toHaveURL(/\/$/);
});

test("results say honestly when a town has no listed city program, and that answers stay on the device", async ({ page }) => {
  await gotoReady(page);
  const open = async (province, city) => page.evaluate(async ({ province, city }) => {
    answers = { ...BLANK(), province, city, forWho: "self", ageBand: "19to59", ageGroup: "adult", citizenPR: true,
      disabilities: ["physical"], functionalNeeds: ["mobility"], income: "low" };
    await ensurePacks([province]); setState("results");
  }, { province, city });
  await open("PE", "Summerside");
  await expect(page.locator(".local-coverage-note")).toContainText("We don't list a city program for Summerside yet");
  await expect(page.locator(".results-privacy")).toContainText("Your answers stay in this browser");
  await page.locator(".limits-panel summary").click();
  await expect(page.locator(".limits-panel")).toContainText(new RegExp(`for ${await page.evaluate(() => localProgramAreas().length)} cities and regions`));
  await open("SK", "Regina");
  await expect(page.locator(".local-coverage-note")).toHaveCount(0);
});

test("results name the skipped questions and open the first one", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(async () => {
    answers = { ...BLANK(), province: "AB", city: "Calgary", forWho: "self", ageBand: "19to59", ageGroup: "adult", citizenPR: true,
      disabilities: ["physical"], functionalNeeds: ["mobility"], income: "low" };
    await ensurePacks(["AB"]); setState("results");
  });
  const line = page.locator(".answers-skipped");
  const expected = await page.evaluate(() => visibleSteps().filter((s) => answerSummary(s) === "—").length);
  test.skip(expected === 0, "this persona answered everything");
  await expect(line).toContainText(`You skipped ${expected} question`);
  const firstSkipped = await page.evaluate(() => visibleSteps().find((s) => answerSummary(s) === "—").id);
  await line.locator("[data-edit]").click();
  expect(await page.evaluate(() => [view, visibleSteps()[stepIndex].id])).toEqual(["wizard", firstSkipped]);
});
