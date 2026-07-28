const fs = require("node:fs/promises");
const { test, expect } = require("@playwright/test");

test.describe("all-day reminder calendar dates", () => {
  test.use({ timezoneId: "America/Edmonton", reducedMotion: "reduce" });

  async function pick(page, text) {
    await page.locator(".opt", { hasText: text }).click();
    await page.waitForTimeout(230);
    const next = page.locator("#next");
    if (await next.count() && (await next.textContent()).includes("Continue")) {
      await page.locator(".wizard-card").evaluate(async (card) => {
        await Promise.all(card.getAnimations().map((animation) => animation.finished.catch(() => {})));
      });
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
