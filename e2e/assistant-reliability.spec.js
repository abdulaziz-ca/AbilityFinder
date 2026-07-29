const { test, expect } = require("@playwright/test");

const SSE = (text) => `event: delta\ndata: ${JSON.stringify({ text })}\n\n`;

async function openChat(page) {
  await page.locator("#askFab").click();

  // The panel is revealed by toggling [hidden], which restarts its 0.22s `rise` animation, and
  // isVisible() does NOT retry. Probing it in the same tick as the click can observe the panel
  // before layout settles, return false, skip the consent click, and leave #askInput hidden for the
  // rest of the test — on CI that showed as #askInput resolving to hidden 183 times across 90s.
  //
  // Both controls are always in the DOM (#askBody is merely [hidden]), so a combined locator
  // is a strict-mode violation. Wait for whichever one is actually rendered instead.
  await page.waitForFunction(() => {
    const rendered = (id) => {
      const el = document.getElementById(id);
      return !!el && el.getClientRects().length > 0;
    };
    return rendered("askAccept") || rendered("askInput");
  });

  const accept = page.locator("#askAccept");
  if (await accept.isVisible()) await accept.click();
  await page.locator("#askInput").waitFor({ state: "visible" });
}

async function ask(page, q) {
  await page.locator("#askInput").fill(q);
  await page.locator("#askInput").press("Enter");
}

test("REL-02: reaching the conversation cap reveals Start-new and recovers", async ({ page }) => {
  await page.goto("/");
  await page.route("**/api/ask", (route) => route.fulfill({
    status: 400,
    contentType: "application/json",
    body: JSON.stringify({ error: "This conversation is too long. Please start a new one." }),
  }));

  await openChat(page);
  await ask(page, "hi");

  await expect(page.locator("#askNew")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("#askInput")).toBeDisabled();
  await expect(page.locator("#askSend")).toBeDisabled();

  await page.unroute("**/api/ask");
  await page.route("**/api/ask", (route) => route.fulfill({
    status: 200,
    contentType: "text/event-stream",
    body: SSE("All set — ask away."),
  }));

  await page.locator("#askNew").click();
  await expect(page.locator("#askNew")).toBeHidden();
  await expect(page.locator("#askInput")).toBeEnabled();
  await expect(page.locator("#askInput")).toBeFocused();
  await expect(page.locator("#askLog .ask-msg")).toHaveCount(0);

  await ask(page, "what is T2201");
  await expect(page.locator("#askLog .ask-msg.bot")).toContainText("All set", { timeout: 5000 });
});

test("REL-02: starting a new conversation does not clear questionnaire/profile", async ({ page }) => {
  await page.goto("/");
  // Enter the wizard and answer a question so questionnaire/profile state exists.
  await page.locator(".js-start").first().click();
  const question = page.locator("#wizard-question");
  await expect(question).toBeVisible();
  const questionBefore = await question.textContent();
  await page.locator(".opt").first().click();
  // The first step is single-answer, so it auto-advances; wait for the new
  // question rather than sleeping past the timer.
  await expect(question).not.toHaveText(questionBefore);
  // Snapshot the current questionnaire state (the wizard lives in #app; the chat
  // panel and #askLog live outside it, so a conversation reset must not touch this).
  const profileBefore = await question.textContent();
  // Reach the conversation cap, then start a new conversation.
  await page.route("**/api/ask", (r) => r.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "This conversation is too long. Please start a new one." }) }));
  await openChat(page);
  await ask(page, "hi");
  await expect(page.locator("#askNew")).toBeVisible();
  await page.locator("#askNew").click();
  await expect(page.locator("#askNew")).toBeHidden();
  await expect(page.locator("#askLog .ask-msg")).toHaveCount(0); // chat cleared
  // Questionnaire/profile is untouched by the reset.
  await expect(question).toHaveText(profileBefore);
});

test("REL-03: a stalled assistant fetch times out and restores controls", async ({ page }) => {
  await page.addInitScript(() => { window.__ASK_TIMEOUT_MS = 400; });
  await page.goto("/");
  await page.route("**/api/ask", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.abort().catch(() => {});
  });

  await openChat(page);
  await ask(page, "hi");
  await expect(page.locator("#askStop")).toBeVisible();

  await expect(page.locator("#askSend")).toBeVisible({ timeout: 2500 });
  await expect(page.locator("#askStop")).toBeHidden();
  await expect(page.locator("#askLog .ask-msg.err")).toContainText(/too long|try again/i);
  await expect(page.locator("#askLive")).not.toBeEmpty();
});

test("REL-03: the user can stop an in-progress response", async ({ page }) => {
  await page.goto("/");
  await page.route("**/api/ask", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.abort().catch(() => {});
  });

  await openChat(page);
  await ask(page, "hi");
  await expect(page.locator("#askStop")).toBeVisible();
  await page.locator("#askStop").click();

  await expect(page.locator("#askSend")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("#askStop")).toBeHidden();
  await expect(page.locator("#askLog .ask-msg.note, #askLog .ask-msg.err")).toContainText(/stopped/i);
  await expect(page.locator("#askLog .ask-msg.bot")).toHaveCount(0);
});

test("REL-03: no duplicate assistant requests while busy", async ({ page }) => {
  let count = 0;
  await page.goto("/");
  await page.route("**/api/ask", async (route) => {
    count += 1;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.abort().catch(() => {});
  });

  await openChat(page);
  await ask(page, "hi");
  // Wait for the deterministic busy state instead of sleeping: #askStop replaces
  // #askSend while a request is in flight.
  await expect(page.locator("#askStop")).toBeVisible();
  await page.locator("#askInput").press("Enter");
  // The send handler starts its fetch synchronously, so a duplicate would already
  // have been counted by now.
  expect(count).toBe(1);
});

test("REL-03: feedback timeout preserves the message and allows one clean retry", async ({ page }) => {
  await page.addInitScript(() => { window.__FB_TIMEOUT_MS = 400; });
  await page.goto("/");
  await page.route("**/api/feedback", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.abort().catch(() => {});
  });

  const message = "Please fix the AISH phone number.";
  await page.locator("#fb-msg").scrollIntoViewIfNeeded();
  await page.locator("#fb-msg").fill(message);
  await page.locator("#fb-send").click();

  await expect(page.locator("#fb-send")).toBeEnabled({ timeout: 2500 });
  await expect(page.locator("#fb-msg")).toHaveValue(message);
  await expect(page.locator("#fb-status")).toContainText(/timed out|try again/i);

  let retryCount = 0;
  await page.unroute("**/api/feedback");
  await page.route("**/api/feedback", (route) => {
    retryCount += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.locator("#fb-send").click();
  await expect(page.locator("#fb-status")).toContainText(/thank/i, { timeout: 5000 });
  await expect(page.locator("#fb-msg")).toHaveValue("");
  expect(retryCount).toBe(1);
});

test("REL-02/03: accessible names and EN/FR copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#askStop")).toHaveAttribute("aria-label", "Stop response");

  await page.route("**/api/ask", (route) => route.fulfill({
    status: 400,
    contentType: "application/json",
    body: JSON.stringify({ error: "This conversation is too long. Please start a new one." }),
  }));
  await openChat(page);
  await ask(page, "hi");

  await expect(page.locator("#askNew")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("#askNew")).toHaveAccessibleName("Start a new conversation");

  const response = await page.request.get("/i18n.js");
  expect(response.ok()).toBe(true);
  const i18nSource = await response.text();
  expect(i18nSource).toContain("Commencer une nouvelle conversation");
  expect(i18nSource).toContain("Réponse arrêtée");
});
