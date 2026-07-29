const { test, expect } = require("@playwright/test");

// Every step render animates the card in: `.card` gets `rise 0.5s`, which translateY(10px)s the
// whole card, options and #next included, while `.options` has a matching 10px gap. Playwright
// decides an element is "stable" from two same-valued bounding-box samples, and under load both
// samples can land inside one animation frame — so a click into an unsettled card can be
// dispatched at stale coordinates and hit nothing. Measured for this spec: at the moment the
// #next click fires, the animation is still running ~100ms into its 500ms.
//
// Only FINITE animations are awaited. The page also runs decorative infinite ones (the aurora
// layers and .wiz-mountains drift) whose `finished` promise never resolves; awaiting those would
// hang. The 1000ms race is a backstop for an animation that fails to settle under contention.
async function settleWizardCard(page) {
  const card = page.locator(".wizard-card");
  if (!(await card.count())) return;
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

test("wizard exposes native choice state, preserves multi-select focus, and focuses each new question", async ({ page }) => {
  await page.goto("/");
  await page.locator(".js-start").first().click();

  const question = page.locator("#wizard-question");
  await expect(question).toBeFocused();
  await expect(page.locator(".wizard-options-fieldset legend")).toHaveText(
    "Who are we finding benefits for?"
  );

  const firstStepChoices = page.getByRole("radio");
  await expect(firstStepChoices).toHaveCount(3);
  await expect(page.getByRole("radio", { name: "Myself" })).not.toBeChecked();
  await expect(page.locator(".wizard-choice[type=radio][name='wizard-forWho']")).toHaveCount(3);

  await settleWizardCard(page);
  await page.locator(".opt", { hasText: "Myself" }).click();
  await expect(question).toContainText("Which of these apply");
  await expect(question).toBeFocused();

  const autism = page.getByRole("checkbox", { name: "Autism spectrum" });
  await autism.focus();
  await page.keyboard.press("Space");
  await expect(autism).toBeChecked();
  await expect(autism).toBeFocused();
  await expect(page.locator(`label[for="${await autism.getAttribute("id")}"]`)).toHaveClass(/selected/);
  await expect(page.locator("#next")).toBeEnabled();

  const physical = page.getByRole("checkbox", { name: "Physical / mobility" });
  await physical.focus();
  await page.keyboard.press("Space");
  await expect(physical).toBeChecked();
  await expect(physical).toBeFocused();
  await expect(autism).toBeChecked();

  await settleWizardCard(page);
  await page.locator("#next").click();
  await expect(question).not.toContainText("Which of these apply");
  await expect(question).toBeFocused();
});

test("route navigation updates title, announces the view, and is not a persistent live region", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#app")).not.toHaveAttribute("aria-live", /.*/);
  await expect(page.locator("#routeLive")).toHaveCount(1);

  await page.locator(".js-start").first().click();

  const heading = page.locator("#wizard-question");
  const label = (await heading.textContent()).replace(/\s+/g, " ").trim();
  await expect(page).toHaveTitle(/· AbilityFinder$/);
  await expect(page).toHaveTitle(`${label} · AbilityFinder`);
  await expect(page.locator("#routeLive")).not.toBeEmpty();
});
