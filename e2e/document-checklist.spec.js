const { test, expect } = require("@playwright/test");
const { gotoReady } = require("./app-ready");
const { BASE_PERSONA } = require("./oracle/oracle-spec");
const persona = { ...BASE_PERSONA, disabilities: ["physical"], city: "Camrose", dtc: "yes", citizenPR: true, situation: ["working"] };

for (const theme of ["light", "dark", "contrast"]) {
  test(`document checklist counts, keyboard and print in ${theme}`, async ({ page }) => {
    await gotoReady(page); // A fresh page and restore for each theme.
    const expected = await page.evaluate(({ persona, theme }) => {
      answers = { ...BLANK(), ...persona };
      document.documentElement.dataset.theme = theme === "contrast" ? "dark" : theme;
      document.body.classList.toggle("a11y-contrast", theme === "contrast");
      // A tracked non-match must not contribute to either checklist.
      const no = browseCatalog().find(b => evaluate(b).status === "no" && b.detail?.documents?.length);
      if (no) progress[no.id] = "saved";
      setState("results");
      const matched = resultGroups(browseCatalog().filter(b => benefitInResultsScope(b, answers)).map(b => ({ b, r: evaluate(b) }))).g1; // G1 programs only
      const checklist = buildDocumentChecklist(matched);
      const unique = new Set(matched.flatMap(e => e.b.detail?.documents || []).map(s => s.toLowerCase().trim().replace(/\s+/g, " ").replace(/[\p{P}\s]+$/gu, "")));
      return { checklist: checklist.filter(e => e.programs.length >= 2), single: checklist.filter(e => e.programs.length === 1), independentCount: unique.size };
    }, { persona, theme });
    expect(expected.checklist.length).toBeGreaterThan(0);
    expect(expected.checklist.length + expected.single.length).toBe(expected.independentCount);
    const details = page.locator("details.document-checklist-details");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(details.locator("summary")).toHaveText(`Documents several programs ask for (${expected.checklist.length})`);
    await expect(details.locator(".document-checklist-content")).toHaveAttribute("lang", "en");
    await details.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(details.locator(".document-checklist")).toBeVisible();
    await expect(details.locator("li")).toHaveCount(expected.checklist.length);
    await expect(details.locator(".document-checklist-text")).toHaveText(expected.checklist.map(e => e.text));
    await expect(details.locator("li p")).toHaveText(expected.checklist.map(e => `Needed for: ${e.programs.join(", ")}`));
    await expect(details.locator("input")).toHaveCount(0);
    const colors = await details.evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor }));
    expect(colors.color).not.toBe(colors.background);
    await page.keyboard.press("Space");
    await expect(details).not.toHaveAttribute("open", "");
    await page.emulateMedia({ media: "print" });
    const printed = page.locator(".print-action-plan .print-document-checklist");
    await expect(printed).toBeVisible();
    await expect(printed.locator("h2")).toHaveText("Documents to gather");
    await expect(printed.locator("li")).toHaveCount(expected.checklist.length);
    await expect(printed.locator(".document-checklist-text")).toHaveText(expected.checklist.map(e => e.text));
    await expect(printed.locator(".document-checklist-box").first()).toBeVisible();
    expect(await printed.evaluate(el => !!el.previousElementSibling?.classList.contains("print-benefit"))).toBe(true);
    for (const section of [details, printed]) {
      for (const entry of expected.single) expect(await section.textContent()).not.toContain(entry.text);
      await expect(section.locator('.document-checklist-more')).toHaveText(`${expected.single.length} more documents are each needed by only one program. You'll find them on that program's card and guide.`);
    }
    if (theme === "light") console.log("Checklist counts:", JSON.stringify({ shared: expected.checklist.length, single: expected.single.length }));
  });
}

for (const n of [0, 1, 3]) {
  test(`count line wording for ${n} single documents`, async ({ page }) => {
    await gotoReady(page);
    const html = await page.evaluate(n => {
      const entries = [{ text: 'Shared', programs: ['A', 'B'] }, ...Array.from({ length: n }, (_, i) => ({ text: `Private ${i}`, programs: ['A'] }))];
      return renderDocumentChecklist(entries);
    }, n);
    expect(html).toContain('Needed for: A, B');
    expect(html).not.toContain('Private');
    if (!n) expect(html).not.toContain('more document');
    else expect(html).toContain(`${n === 1 ? '1 more document is' : `${n} more documents are each`} needed by only one program. You'll find them on that program's card and guide.`);
    const singleOnly = await page.evaluate(() => renderDocumentChecklist([{ text: 'Private', programs: ['A'] }]));
    expect(singleOnly).not.toContain('<ul');
    expect(singleOnly).not.toContain('Private');
    expect(singleOnly).toContain('1 more document is needed');
  });
}

test("programs with no guide documents omit both checklist surfaces", async ({ page }) => {
  await gotoReady(page);
  const markup = await page.evaluate(() => renderPrintActionPlan([{ b: { id: "empty", name: "Empty", summary: "", requires: [], detail: { documents: [] } }, r: { status: "ready" } }]));
  expect(markup).not.toContain("print-document-checklist");
});
