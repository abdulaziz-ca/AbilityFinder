const { test, expect } = require("@playwright/test");

async function catalogEntry(page, id) {
  await page.goto("/");
  return page.evaluate((benefitId) => {
    const benefit = BENEFITS.find((entry) => entry.id === benefitId);
    return {
      benefit,
      value: BENEFIT_VALUES[benefitId] || null,
      extra: BENEFIT_EXTRA[benefitId] || null,
      valueParts: valueParts(benefit),
    };
  }, id);
}

test("Canada Disability Benefit uses the July 2026 maximum without folding in the supplement", async ({ page }) => {
  const cdb = await catalogEntry(page, "cdb-adult");

  expect(cdb.benefit.amount).toBe("Up to $204.20 / month for July 2026–June 2027");
  expect(cdb.value).toMatchObject({ annualMax: 2450.4, monthlyMax: 204.2 });
  expect(cdb.valueParts.head).toBe("Up to $2,450.40 / year ($204.20/mo)");
  expect(cdb.benefit.detail.tips.join(" ")).toMatch(/\$150 lump sum/i);
  expect(cdb.benefit.detail.tips.join(" ")).toMatch(/not included in the monthly maximum/i);
  expect(cdb.extra.faqs.map((entry) => entry.a).join(" ")).toMatch(/\$204\.20 per month/i);

  const guide = await (await page.request.get("/guides/cdb-adult.html")).text();
  expect(guide).toMatch(/\$204\.20 \/ month for July 2026–June 2027/i);
  expect(guide).toMatch(/separate fixed \$150 lump sum/i);
  expect(guide).not.toMatch(/Up to \$2,400 \/ year \(\$200 \/ month\)/i);
});

test("AISH and ADAP explain the mandatory CDB or DTC outcome update", async ({ page }) => {
  for (const id of ["aish", "adap"]) {
    const entry = await catalogEntry(page, id);
    expect(entry.extra.taxNote).toMatch(/requires you to report the outcome/i);
    expect(entry.benefit.detail.tips.join(" ")).toMatch(/report the outcome of your CDB and\/or DTC application/i);
    expect(entry.benefit.detail.tips.join(" ")).toMatch(/February 28, 2026/i);
    expect(entry.benefit.detail.tips.join(" ")).toMatch(/\$200 was reduced from April 2026 benefits/i);

    const guide = await (await page.request.get(`/guides/${id}.html`)).text();
    expect(guide).toMatch(/report the outcome of your CDB and\/or DTC application/i);
  }
});

test("both Autism Funding records preserve the normal limit and the final-period exception", async ({ page }) => {
  for (const id of ["bc-autism-funding-under-6", "bc-autism-funding-6-18"]) {
    const entry = await catalogEntry(page, id);
    const copy = [entry.benefit.detail.about, ...entry.benefit.detail.tips].join(" ");
    expect(copy).toMatch(/normal.*20%/i);
    expect(copy).toMatch(/50%.*final aligned funding period|final aligned funding period.*50%/i);
    expect(copy).toMatch(/March 31, 2027/i);
    expect(copy).toMatch(/May 31, 2027/i);
    expect(copy).toMatch(/September 30, 2027/i);

    const guide = await (await page.request.get(`/guides/${id}.html`)).text();
    expect(guide).toMatch(/increased the allowable TTE portion to 50%|raised it to 50%/i);
    expect(guide).toMatch(/September 30, 2027/i);
  }
});

test("BC Bus Pass distinguishes the no-fee PWD choice from the senior fee", async ({ page }) => {
  const pass = await catalogEntry(page, "bc-bus-pass");
  const copy = [
    pass.benefit.amount,
    pass.benefit.note,
    pass.benefit.detail.about,
    ...pass.benefit.detail.tips,
  ].join(" ");

  expect(pass.benefit.amount).toBe(
    "No annual fee for PWD recipients; $45/year for eligible low-income seniors",
  );
  expect(copy).toMatch(/PWD recipients pay no annual fee/i);
  expect(copy).toMatch(/\$45.*low-income-senior/i);
  expect(copy).toMatch(/\$52 monthly cash transportation supplement/i);
  expect(pass.benefit.source).toMatch(/general-supplements-and-programs\/bc-bus-pass-program$/);

  const guide = await (await page.request.get("/guides/bc-bus-pass.html")).text();
  expect(guide).toMatch(/No annual fee for PWD recipients/i);
  expect(guide).toMatch(/\$45\/year for eligible low-income seniors/i);
  expect(guide).not.toMatch(/The fee is \$45 per year/i);
});
