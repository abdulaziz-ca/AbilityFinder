const { test, expect } = require("@playwright/test");

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
