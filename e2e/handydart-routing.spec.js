const { test, expect } = require("@playwright/test");

const TRANSLINK = "https://www.translink.ca/handydart";
const CHOOSER = "https://www.bctransit.com/";
const VICTORIA = "https://www.bctransit.com/victoria/riderinfo/handydart/register/";
const KELOWNA = "https://www.bctransit.com/kelowna/riderinfo/handydart/register/";
const KAMLOOPS = "https://www.bctransit.com/kamloops/riderinfo/handydart/register/";
const NANAIMO = "https://www.bctransit.com/nanaimo/riderinfo/handydart/register/";

async function inspectHandyDart(page, cityMode) {
  return page.evaluate((mode) => {
    answers = {
      ...BLANK(),
      province: "BC",
      functionalNeeds: ["transitBarrier"],
    };
    if (mode !== "missing") answers.city = mode;

    const records = Object.fromEntries(
      BENEFITS
        .filter((benefit) => ["handydart-translink", "handydart-bctransit"].includes(benefit.id))
        .map((benefit) => [benefit.id, {
          applyUrl: resolveUrl(benefit.applyUrl),
          source: resolveUrl(benefit.source),
          requires: [...benefit.requires],
          status: evaluate(benefit).status,
        }])
    );
    return {
      records,
      matchedIds: Object.entries(records)
        .filter(([, record]) => record.status !== "no")
        .map(([id]) => id),
    };
  }, cityMode);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#app h1")).toBeVisible();
});

test("live handyDART catalog routes verified cities and safe fallbacks", async ({ page }) => {
  const cases = [
    { city: "Victoria", expected: VICTORIA, bcStatus: "ready" },
    { city: "Colwood", expected: VICTORIA, bcStatus: "ready" },
    { city: "Langford", expected: VICTORIA, bcStatus: "ready" },
    { city: "Saanich", expected: VICTORIA, bcStatus: "ready" },
    { city: "Kelowna", expected: KELOWNA, bcStatus: "ready" },
    { city: "Kamloops", expected: KAMLOOPS, bcStatus: "ready" },
    { city: "Nanaimo", expected: NANAIMO, bcStatus: "ready" },
    { city: "Parksville", expected: NANAIMO, bcStatus: "ready" },
    { city: "Abbotsford", expected: CHOOSER, bcStatus: "ready", fallback: true },
    { city: "Other / my town isn't listed", expected: CHOOSER, bcStatus: "ready", fallback: true },
    { city: null, expected: CHOOSER, bcStatus: "no", fallback: true },
    { city: "missing", expected: CHOOSER, bcStatus: "no", fallback: true },
    { city: "Arbitrary Unknown City", expected: CHOOSER, bcStatus: "ready", fallback: true },
  ];

  const vancouver = await inspectHandyDart(page, "Vancouver");
  expect(vancouver.records["handydart-translink"]).toEqual({
    applyUrl: TRANSLINK,
    source: TRANSLINK,
    requires: ["bc", "metroVancouver", "transitBarrier"],
    status: "ready",
  });
  expect(vancouver.records["handydart-bctransit"].requires).toEqual([
    "bc", "outsideMetroVancouver", "transitBarrier",
  ]);
  expect(vancouver.records["handydart-bctransit"].status).toBe("no");
  expect(vancouver.matchedIds).toContain("handydart-translink");
  expect(vancouver.matchedIds).not.toContain("handydart-bctransit");

  for (const item of cases) {
    const result = await inspectHandyDart(page, item.city);
    const bcTransit = result.records["handydart-bctransit"];
    expect(bcTransit.requires).toEqual(["bc", "outsideMetroVancouver", "transitBarrier"]);
    expect(bcTransit.applyUrl).toBe(item.expected);
    expect(bcTransit.source).toBe(item.expected);
    expect(bcTransit.status).toBe(item.bcStatus);
    expect(result.records["handydart-translink"].requires).toEqual([
      "bc", "metroVancouver", "transitBarrier",
    ]);
    expect(result.records["handydart-translink"].status).toBe("no");
    if (item.fallback) {
      expect(bcTransit.applyUrl).not.toContain("/victoria/");
      expect(bcTransit.source).not.toContain("/victoria/");
    }
  }
});

test("static BC Transit handyDART guide uses the system chooser", async ({ page }) => {
  await page.goto("/guides/handydart-bctransit.html");
  const officialLinks = page.locator(".side-card .guide-link");
  await expect(officialLinks).toHaveCount(1);
  await expect(officialLinks.first()).toHaveAttribute("href", CHOOSER);
  expect(await officialLinks.first().getAttribute("href")).not.toContain("/victoria/");
});
