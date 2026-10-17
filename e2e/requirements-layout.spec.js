const { test, expect } = require("@playwright/test");
const { gotoReady, waitForAppReady } = require("./app-ready");
const { buildAll } = require("./oracle/build-personas");
const { BASE_PERSONA } = require("./oracle/oracle-spec");

const persona = { ...BASE_PERSONA, disabilities: ["physical"], city: "Camrose", dtc: "yes", citizenPR: true, situation: ["working"] };
async function results(page) {
  await gotoReady(page);
  await page.evaluate(model => { answers = { ...BLANK(), ...model }; setState("results"); }, persona);
}

test("mixed results render all three answer-based labels and the acknowledgement", async ({ page }) => {
  await results(page);
  const counts = await page.evaluate(() => {
    const statuses = browseCatalog().map(b => evaluate(b).status);
    return ['ready', 'almost', 'no'].map(status => statuses.filter(s => s === status).length);
  });
  for (const count of counts) expect(count).toBeGreaterThan(0);
  await expect(page.locator('.group-title.ready')).toContainText('Matches your answers');
  await expect(page.locator('.group-title.almost')).toContainText('More to check');
  await expect(page.locator('.benefit.ready .match-status').first()).toHaveText('Matches your answers');
  await expect(page.locator('.benefit.almost .match-status').first()).toHaveText('More to check');
  await expect(page.locator('.benefit.ready .match-note').first()).toHaveText('Based on what you told us. The program decides if you qualify.');
  await expect(page.locator('.notmatch summary')).toContainText('Does not match these answers');
  await expect(page.locator('#app')).toContainText('We did not ask about every requirement. Each program decides if you qualify.');
  // Category grouping and a user-saved card must retain the same status copy.
  await page.evaluate(() => {
    const b = browseCatalog().find(b => evaluate(b).status === 'ready');
    progress[b.id] = 'saved';
    groupMode = 'category';
    setState('results');
  });
  await expect(page.locator('.benefit.stage-saved .match-status')).toHaveText('Matches your answers');
  await expect(page.locator('.benefit.stage-saved .benefit-main > .match-note')).toHaveText('Based on what you told us. The program decides if you qualify.');
});

test("detail and printed plan keep match copy separate from recorded application progress", async ({ page }) => {
  await results(page);
  const report = await page.evaluate(() => {
    const selected = ['ready', 'almost', 'no'].map(status => browseCatalog().find(b => evaluate(b).status === status));
    const details = selected.map(b => {
      const host = document.createElement('div');
      host.innerHTML = renderGuideBody(b, evaluate(b));
      return {
        answer: host.querySelector('.af-status').textContent,
        side: host.querySelector('.side-status').textContent,
        note: host.querySelector('.af-cell .match-note')?.textContent || '',
      };
    });
    progress[selected[0].id] = 'approved';
    let printed = '';
    const open = window.open;
    window.open = () => ({ document: { write: html => { printed = html; }, close() {} }, focus() {}, print() {} });
    try { printResults(); } finally { window.open = open; }
    const host = document.createElement('div');
    host.innerHTML = printed;
    return { details, badges: [...host.querySelectorAll('.badge')].map(el => el.textContent), text: host.textContent };
  });
  expect(report.details.map(d => d.answer)).toEqual(['Matches your answers', 'More to check', 'Does not match these answers']);
  expect(report.details.map(d => d.side)).toEqual(['Matches your answers', 'More to check', 'Does not match these answers']);
  expect(report.details[0].note).toBe('Based on what you told us. The program decides if you qualify.');
  expect(report.badges).toContain('Matches your answers');
  expect(report.badges).toContain('More to check');
  expect(report.badges.join(' ')).not.toMatch(/eligible|approved|guaranteed|likely|one step away/i);
  expect(report.text).toContain('Application progress: Approved');
  expect(report.text).toContain('Based on what you told us. The program decides if you qualify.');
  expect(report.text).toContain('We did not ask about every requirement. Each program decides if you qualify.');
});

test("pilot cue preview opens personalized requirements; full list has a keyboard-operable name", async ({ page }) => {
  await results(page);
  const id = await page.evaluate(() => BENEFITS.find(b => b.requires.includes("cwbEligibility")).id);
  const preview = page.locator(`#req-card-${id}`).locator("..");
  await expect(preview.getByRole("heading", { name: "Requirements to check" })).toBeVisible();
  await expect(preview.locator(".req-cue")).toHaveText(["Check CWB residence, family, income rules and exclusions"]);
  const link = preview.getByRole("link", { name: /^See all requirements for/ });
  await expect(link).toHaveAttribute("href", `/guides/${id}`);
  await link.click();
  await expect(page.locator(`#req-detail-${id}`)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(`#req-detail-${id}`)).not.toBeFocused();
  expect(await page.evaluate(() => document.activeElement.matches('a, summary'))).toBe(true);
  const section = page.locator(".req-checks");
  await expect(section).toHaveAttribute("lang", "en");
  await expect(section.locator("details")).toHaveCount(1);
  const name = await page.evaluate(id => `Read full requirements for ${BENEFITS.find(b => b.id === id).name}`, id);
  const summary = section.locator("summary");
  await expect(summary).toHaveAccessibleName(name);
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(section.locator("details")).toHaveAttribute("open", "");
  await expect(section.locator(".req-wording")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(section.locator("details")).not.toHaveAttribute("open", "");
});

test("every gate's resolved full text reaches the detail DOM intact, including dynamic branches", async ({ page }) => {
  await gotoReady(page);
  const report = await page.evaluate(() => {
    const failures = [];
    let checked = 0;
    // Both branches of the sole dynamic unmet gate, plus the DTC-unsure override.
    for (const ageBand of ["12to15", "19to59"]) {
      answers = { ...BLANK(), ageBand, dtc: "unsure", situation: [], disabilities: [] };
      for (const [key, req] of Object.entries(REQS)) {
        const text = typeof req.unmet === "function" ? req.unmet() : req.unmet;
        const host = document.createElement("div");
        host.innerHTML = renderRequirements({ id: "test", name: "Test benefit" }, [{ key, text, short: req.short, who: req.who, action: req.action }]);
        const wording = host.querySelector(".req-wording") || host.querySelector(`li[data-req-key="${key}"]`);
        // Fallback rows may also contain an action; their first text node is the full wording.
        const actual = wording?.classList.contains("req-wording") ? wording.textContent : wording?.firstChild?.textContent;
        if (actual !== text) failures.push({ key, text, actual });
        if (host.querySelectorAll("details").length > 1) failures.push({ key, problem: "multiple disclosures" });
        checked++;
      }
    }
    const needs = evaluate({ requires: ["dtc"] }).needs;
    const host = document.createElement("div");
    host.innerHTML = renderRequirements({ id: "dtc-test", name: "DTC" }, needs);
    if (!host.textContent.includes(needs[0].text) || needs[0].short) failures.push({ problem: "DTC-unsure override" });
    return { failures, checked, gates: Object.keys(REQS).length };
  });
  expect(report.failures).toEqual([]);
  expect(report.checked).toBe(report.gates * 2);
});

test("mixed pilot detail keeps every need, fallback prose and print wording", async ({ page }) => {
  await results(page);
  await page.evaluate(() => { detailFrom = "results"; setState("detail", { detailId: "rdsp" }); });
  const section = page.locator(".req-checks");
  await expect(section.locator(".req-cue").first()).toContainText("Check SIN and residency");
  await expect(section.locator(".req-group-title").first()).toBeVisible();
  await expect(section.locator("details")).toHaveCount(1);
  const texts = await page.evaluate(() => evaluate(BENEFITS.find(b => b.id === "rdsp")).needs.map(n => n.text));
  // #216 moved grant/bond context off the checklist; both real checks remain.
  expect(texts.length).toBe(2);
  for (const text of texts) expect(await section.textContent()).toContain(text);
  await expect(page.locator(".side-status")).toHaveText('More to check');
  await page.emulateMedia({ media: "print" });
  const printed = page.locator(".print-action-plan");
  await expect(printed).toBeVisible();
  await expect(printed).toHaveAttribute("aria-hidden", "true");
  for (const text of texts) expect(await printed.textContent()).toContain(text);
});

test("catalogue detail rendering retains every evaluated need, not just the first two", async ({ page }) => {
  await gotoReady(page);
  const catalogue = await page.evaluate(() => BENEFITS.map(b => ({ id: b.id, requires: [...b.requires] })));
  const cases = buildAll(catalogue).map(c => ({ id: c.id, answers: c.bestCase.answers }));
  const report = await page.evaluate(cases => {
    const failures = [];
    let checked = 0;
    for (const c of cases) {
      answers = { ...BLANK(), ...c.answers, disabilities: c.answers.disabilities.length ? c.answers.disabilities : ["none"], city: c.answers.city || "Camrose" };
      const b = BENEFITS.find(b => b.id === c.id);
      const r = evaluate(b);
      if (r.status !== "almost") continue;
      const host = document.createElement("div");
      host.innerHTML = renderGuideBody(b, r);
      const section = host.querySelector(".req-checks");
      for (const n of r.needs) {
        const row = section?.querySelector(`.req-wording[data-req-key="${n.key}"]`) ||
          section?.querySelector(`.req-full-list [data-req-key="${n.key}"] .req-wording`) ||
          section?.querySelector(`.req-fallback [data-req-key="${n.key}"]`);
        const actual = row?.classList.contains("req-wording") ? row.textContent : row?.firstChild?.textContent;
        if (actual !== n.text) failures.push({ id: b.id, key: n.key, actual, expected: n.text });
        checked++;
      }
    }
    return { failures, checked };
  }, cases);
  expect(report.failures).toEqual([]);
  expect(report.checked).toBeGreaterThan(100);
});

test("inline headings, shared actors and EN fallback keep their presentation contracts", async ({ page }) => {
  await results(page);
  await page.evaluate(() => {
    answers.province = "ON";
    answers.city = "Kingston";
    LANG = "fr";
    setState("detail", { detailId: "odsp" });
  });
  const section = page.locator(".req-checks");
  await expect(section.getByRole("heading", { name: "Checks you do with someone else" })).toBeVisible();
  await expect(section.locator('[lang="fr"]')).toHaveCount(0);
  expect(await page.locator('#app').textContent()).toContain(await page.evaluate(() => t('det.enNote')));
  const noteCount = await page.evaluate(() => document.getElementById('app').textContent.split(t('det.enNote')).length - 1);
  expect(noteCount).toBe(1);
  await expect(section.locator("details")).toHaveCount(1);
  const inline = await page.evaluate(() => {
    const b = BENEFITS.find(b => b.id === "odsp");
    const host = document.createElement("div");
    host.innerHTML = renderGuideBody(b, evaluate(b), { inline: true });
    const section = host.querySelector(".req-checks");
    return { id: section.querySelector("[tabindex]").id, heading: section.querySelector("[tabindex]").tagName, group: section.querySelector(".req-group-title").tagName };
  });
  expect(inline).toEqual({ id: "req-inline-odsp", heading: "H4", group: "H5" });
});

for (const forWho of ["self", "child", "family"]) {
  for (const theme of ["light", "dark", "contrast"]) {
    test(`requirements reflow after fresh ${theme} reload for ${forWho}`, async ({ page }) => {
      await gotoReady(page);
      await page.evaluate(({ theme }) => {
        document.documentElement.dataset.theme = theme === "contrast" ? "dark" : theme;
      }, { theme });
      await page.reload();
      await waitForAppReady(page);
      await page.setViewportSize({ width: 320, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.evaluate(({ model, forWho, theme }) => {
        answers = { ...BLANK(), ...model, forWho };
        document.documentElement.dataset.theme = theme === "contrast" ? "dark" : theme;
        document.body.classList.toggle("a11y-contrast", theme === "contrast");
        document.body.classList.add("a11y-nomotion");
        setState("detail", { detailId: "rdsp" });
      }, { model: persona, forWho, theme });
      await expect(page.locator(".req-checks")).toBeVisible();
      expect(await page.locator(".req-checks").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      const routeFailures = await page.evaluate(() => {
        helpTopic = "disabilities";
        const routes = ["landing", "wizard", "results", "browse", "detail", "privacy", "about", "support", "updates", "help", "accessibility", "professionals", "partner-overview", "impact", "dtc-prep", "grants", "organizations"];
        return routes.filter(route => {
          setState(route, { stepIndex: 0, detailId: "rdsp" });
          const app = document.getElementById("app");
          return !app.textContent.trim() || !!app.querySelector(".render-error");
        });
      });
      expect(routeFailures).toEqual([]);
    });
  }
}

test("fully matched detail keeps its content when printing, and status labels do not imply qualification", async ({ page }) => {
  await results(page);
  const report = await page.evaluate(() => {
    const b = BENEFITS.find(b => b.id === "rdsp");
    const ready = renderGuideBody(b, { status: "ready", needs: [], reasons: [] });
    const single = renderGuideBody(b, { status: "almost", needs: [{ key: "a", text: "A" }], reasons: [] });
    const many = renderGuideBody(b, { status: "almost", needs: [{ key: "a", text: "A" }, { key: "b", text: "B" }], reasons: [] });
    const status = html => { const host = document.createElement('div'); host.innerHTML = html; return host.querySelector('.side-status').textContent; };
    document.getElementById('app').innerHTML = ready;
    return { ready, single: status(single), many: status(many) };
  });
  expect(report.ready).not.toContain('class="print-action-plan"');
  expect(report.single).toBe('More to check');
  expect(report.many).toBe('More to check');
  expect(report.ready).toContain('Matches your answers');
  expect(report.ready).toContain('Based on what you told us. The program decides if you qualify.');
  await page.emulateMedia({ media: "print" });
  await expect(page.locator('#app h1')).toBeVisible();
});

for (const theme of ['light', 'dark', 'contrast']) {
  test(`requirement links use accessible link tokens in ${theme}`, async ({ page }) => {
    await results(page);
    await page.evaluate(theme => {
      document.body.classList.add('a11y-nomotion');
      document.body.style.transition = 'none';
      document.documentElement.dataset.theme = theme === 'contrast' ? 'dark' : theme;
      document.body.classList.toggle('a11y-contrast', theme === 'contrast');
      const b = BENEFITS.find(b => b.id === 'rdsp');
      document.getElementById('app').innerHTML = '<div class="card">' + reqPreview(b, [{ key: 'x', text: 'Full', short: 'Cue', who: ['you'] }]) + renderRequirements(b, [{ key: 'x', text: 'Full', short: 'Cue', who: ['you'], action: { text: 'Official', url: 'https://example.com' } }]) + '</div>';
      document.querySelector('details').open = true;
    }, theme);
    const colors = await page.locator('.req-checks a, .req-preview a').evaluateAll(links => links.map(el => {
      const style = getComputedStyle(el);
      const token = document.createElement('span'); token.style.color = 'var(--accent-hi)'; el.parentElement.append(token);
      const expected = getComputedStyle(token).color; token.remove();
      let node = el.parentElement, bg;
      while (node) { bg = getComputedStyle(node).backgroundColor; if (bg !== 'rgba(0, 0, 0, 0)') break; node = node.parentElement; }
      return { actual: style.color, expected, bg, underline: style.textDecorationLine };
    }));
    expect(colors.length).toBe(2);
    const luminance = rgb => {
      const c = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(x => { x /= 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; });
      return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
    };
    for (const color of colors) {
      expect(color.actual).toBe(color.expected);
      expect(color.actual).not.toBe('rgb(0, 0, 238)');
      expect(color.actual).not.toBe('rgb(85, 26, 139)');
      expect(color.underline).toContain('underline');
      const a = luminance(color.actual), b = luminance(color.bg);
      expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(4.5);
    }
  });
}
