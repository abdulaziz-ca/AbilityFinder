const fs = require("node:fs/promises");
const { test, expect } = require("@playwright/test");

test.describe("all-day reminder calendar dates", () => {
  test.use({ timezoneId: "America/Edmonton", reducedMotion: "reduce" });

  async function pick(page, text) {
    const questionBefore = await page
      .locator("#wizard-question")
      .textContent()
      .catch(() => null);
    // The wizard is adaptive (skipIf() keys off answers.disabilities) and hasText
    // is a SUBSTRING match, so a stalled advance used to let the next pick() click
    // a plausible-looking option on the WRONG step — surfacing one or two steps
    // later as a zero-match locator that ate the full test timeout. Assert the
    // option belongs to the step actually on screen, so divergence fails HERE.
    const onScreen = await page.evaluate((wanted) => {
      const norm = (s) => String(s).replace(/\s+/g, " ").trim().toLowerCase();
      if (view !== "wizard") return { view };
      const step = visibleSteps()[stepIndex];
      if (!step) return { view, id: null, labels: [] };
      const labels = stepOptions(step).map((o) =>
        typeof o === "object" ? `${optionText(step, o)}${o.sub ? ` ${o.sub}` : ""}` : String(o),
      );
      const optionLabels = [...document.querySelectorAll("label.opt")].filter((el) =>
        norm(el.textContent).includes(norm(wanted)),
      );
      const pairedInput = optionLabels.length === 1
        ? document.getElementById(optionLabels[0].getAttribute("for"))
        : null;
      return {
        view,
        id: step.id,
        labels,
        matches: labels.filter((l) => norm(l).includes(norm(wanted))).length,
        type: step.type,
        alreadySelected: !!(pairedInput && pairedInput.checked),
        question: (document.getElementById("wizard-question") || {}).textContent || null,
      };
    }, text);
    if (onScreen.view !== "wizard") {
      throw new Error(`pick(${JSON.stringify(text)}): not in the wizard (view="${onScreen.view}")`);
    }
    if (onScreen.matches !== 1) {
      throw new Error(
        `pick(${JSON.stringify(text)}): wizard is on step "${onScreen.id}", whose options are ` +
          `[${onScreen.labels.join(" | ")}] — ${onScreen.matches} of them match. ` +
          `Expected exactly 1. The walk has diverged from the step this pick assumes.`,
      );
    }
    // A single-answer step auto-advances off the radio's change event, so clicking an
    // option that is ALREADY checked fires nothing: goNext never runs and the wizard
    // sits there. That is the one case that could hang, and it is knowable now rather
    // than after a wait — which is why the settle wait below no longer needs a short
    // bound. Multi-answer steps are excluded: re-clicking there legitimately deselects.
    if (onScreen.type !== "multi" && onScreen.alreadySelected) {
      throw new Error(
        `pick(${JSON.stringify(text)}) on step "${onScreen.id}": that option is already ` +
          `selected, so clicking it fires no change event and the wizard will never advance. ` +
          `The walk has already answered this step.`,
      );
    }
    await page.locator(".opt", { hasText: text }).click();
    // Single-answer steps auto-advance (goNext on a 150-200 ms timer); multi-answer
    // steps stay put and enable Continue. Wait for whichever actually happens rather
    // than sleeping past the longest timer.
    // Bounded and fatal. The only state that could never resolve — clicking an
    // already-checked radio — is now rejected before the click, so this bound is not
    // a hang guard: it is headroom for a loaded machine, and blowing it is a real
    // failure worth reporting rather than swallowing. A stall was observed here on a
    // full-suite run, which the old swallowed 3s bound had been hiding.
    await page
      .waitForFunction(
        (prev) => {
          const question = document.getElementById("wizard-question");
          const next = document.getElementById("next");
          if (!question) return true; // left the wizard entirely (e.g. results)
          if (question.textContent !== prev) return true; // auto-advanced
          return !!next && /Continue/.test(next.textContent || "") && !next.disabled;
        },
        questionBefore,
        { timeout: 20000 },
      )
      .catch(() => {
        throw new Error(
          `pick(${JSON.stringify(text)}) on step "${onScreen.id}": the wizard did not settle ` +
            `within 20000ms — it neither auto-advanced past ${JSON.stringify(questionBefore)} nor ` +
            `enabled a Continue button. The click landed but fired no change event, or goNext stalled.`,
        );
      });
    // Every step render animates the card in: .card gets `rise 0.5s`, which
    // translateY(10px)s the whole card — options included — while `.options` has a
    // 10px gap. Playwright decides an element is "stable" from two same-valued
    // bounding-box samples, and under load those two samples can land inside one
    // animation frame, so a click can be dispatched at stale coordinates and fall
    // into the gap BETWEEN two options: nothing is hit, no change event fires, and
    // the wizard sits. This wait used to be reachable only on multi-answer steps,
    // because it was gated on a "Continue" button that only multi steps render —
    // so single-answer steps, which are most of the walk, clicked into a moving
    // target. It is unconditional now.
    //
    // Only FINITE animations are awaited. The page also runs decorative infinite
    // ones (the aurora layers and .wiz-mountains drift), whose `finished` promise
    // never resolves; awaiting those would hang. The 1000ms race is a backstop for
    // an animation that fails to settle under CPU contention.
    const card = page.locator(".wizard-card");
    if (await card.count()) {
      await card
        .evaluate(async (el) => {
          const finite = el.getAnimations().filter((animation) => {
            const timing = animation.effect && animation.effect.getComputedTiming();
            return !timing || timing.iterations !== Infinity;
          });
          await Promise.race([
            Promise.all(finite.map((animation) => animation.finished.catch(() => {}))),
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]);
        }, undefined, { timeout: 5000 })
        .catch(() => {});
    }
  }

  async function openEdmontonResults(page) {
    await page.goto("/");
    await page.locator(".js-start").first().click();
    await pick(page, "Myself");
    await pick(page, "Autism spectrum");
    await pick(page, "Physical / mobility");
    await page.locator("#next").click();
    await pick(page, "19 to 59");
    await pick(page, "Yes, it is documented");
    await pick(page, "Yes");
    await pick(page, "Yes, it began in childhood");
    await pick(page, "No, that's difficult or impossible");
    await pick(page, "Needs significant help, supervision");
    await page.locator("#next").click();
    await pick(page, "Alberta");
    await pick(page, "Yes");
    await pick(page, "No, not yet");
    await pick(page, "Working / have a job");
    await pick(page, "A disability stops me from working");
    await page.locator("#next").click();
    await pick(page, "Lower income");
    await page.locator("#selInput").selectOption("Edmonton");
    await expect(page.locator(".results-head")).toBeVisible();

    const trackedBenefit = page.locator('[data-track="edmonton-fare-assistance"]');
    await expect(trackedBenefit).toHaveCount(1);
    await trackedBenefit.selectOption("submitted");
    await expect(page.locator("#tsRemind")).toBeVisible();
  }

  async function downloadIcs(page, now) {
    await page.clock.setFixedTime(now);
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#tsRemind").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("abilityfinder-reminders.ics");
    return fs.readFile(await download.path(), "utf8");
  }

  function unfolded(ics) {
    return ics.replace(/\r\n[ \t]/g, "");
  }

  function eventWithUid(ics, uidPrefix) {
    const event = unfolded(ics)
      .split("BEGIN:VEVENT\r\n")
      .slice(1)
      .map((block) => block.split("\r\nEND:VEVENT")[0])
      .find((block) => block.includes(`UID:${uidPrefix}`));
    expect(event, `event with UID prefix ${uidPrefix}`).toBeTruthy();
    return event;
  }

  function expectAllDayDates(event, start, end) {
    expect(event).toContain(`DTSTART;VALUE=DATE:${start}`);
    expect(event).toContain(`DTEND;VALUE=DATE:${end}`);
  }

  test("keeps Edmonton calendar intent on both sides of UTC midnight and emits a real UTC DTSTAMP", async ({ page }) => {
    await openEdmontonResults(page);

    const cases = [
      {
        now: new Date("2026-07-27T16:30:45-06:00"),
        stamp: "20260727T223045Z",
      },
      {
        now: new Date("2026-07-27T20:30:45-06:00"),
        stamp: "20260728T023045Z",
      },
    ];

    for (const sample of cases) {
      const ics = await downloadIcs(page, sample.now);
      const recheck = eventWithUid(ics, "recheck-");
      const followup = eventWithUid(ics, "followup-edmonton-fare-assistance-");

      expect(recheck).toContain("UID:recheck-20270727@abilityfinder.ca");
      expectAllDayDates(recheck, "20270727", "20270728");
      expect(recheck).toContain(`DTSTAMP:${sample.stamp}`);
      expect(followup).toContain(`DTSTAMP:${sample.stamp}`);

      const displayedLocalDate = await page.evaluate(() => new Date().toLocaleDateString("en-CA"));
      expect(followup).toContain(`You marked this as application submitted on ${displayedLocalDate}.`);
    }
  });

  test("uses calendar-day arithmetic through Edmonton spring and fall DST changes", async ({ page }) => {
    await openEdmontonResults(page);

    // These anchors make the 84-day follow-up land exactly on the spring-forward and fall-back days.
    const cases = [
      {
        now: new Date("2025-12-14T23:30:15-07:00"),
        start: "20260308",
        end: "20260309",
        stamp: "20251215T063015Z",
      },
      {
        now: new Date("2026-08-09T00:30:15-06:00"),
        start: "20261101",
        end: "20261102",
        stamp: "20260809T063015Z",
      },
    ];

    for (const sample of cases) {
      const ics = await downloadIcs(page, sample.now);
      const followup = eventWithUid(ics, "followup-edmonton-fare-assistance-");
      expect(followup).toContain(
        `UID:followup-edmonton-fare-assistance-${sample.start}@abilityfinder.ca`,
      );
      expectAllDayDates(followup, sample.start, sample.end);
      expect(followup).toContain(`DTSTAMP:${sample.stamp}`);
      expect(followup).toContain("The usual wait is 8–12 weeks.");
    }
  });

  test("preserves leap-day all-day dates, UTF-8 text, and RFC 5545 folding", async ({ page }) => {
    await openEdmontonResults(page);
    const ics = await downloadIcs(page, new Date("2023-03-01T12:05:09-07:00"));
    const recheck = eventWithUid(ics, "recheck-");
    const followup = eventWithUid(ics, "followup-edmonton-fare-assistance-");

    expect(recheck).toContain("UID:recheck-20240229@abilityfinder.ca");
    expectAllDayDates(recheck, "20240229", "20240301");
    expect(recheck).toContain("DTSTAMP:20230301T190509Z");

    expect(followup).toContain("The usual wait is 8–12 weeks.");
    expect(followup).not.toContain("�");
    expect(ics).toMatch(/\r\n [^\r\n]+/);
    for (const line of ics.split("\r\n").filter(Boolean)) {
      expect(Buffer.byteLength(line, "utf8"), line).toBeLessThanOrEqual(75);
    }
  });
});
