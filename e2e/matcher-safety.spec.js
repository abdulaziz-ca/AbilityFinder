const { test, expect } = require("@playwright/test");

function answerModel(overrides = {}) {
  return {
    forWho: "self",
    disabilities: [],
    ageBand: "19to59",
    ageGroup: "adult",
    disabilityVerified: "yes",
    autismDiagnosis: null,
    onsetBefore18: null,
    canWalkFar: null,
    functionalNeeds: ["none"],
    province: "AB",
    msp: null,
    bcAssistance: null,
    circumstances: ["none"],
    citizenPR: true,
    dtc: "yes",
    situation: ["none"],
    income: "low",
    city: "Edmonton",
    postal: null,
    ...overrides,
  };
}

async function gotoReadyApp(page) {
  await page.goto("/");
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");
}

async function evaluateProfile(page, overrides = {}) {
  await gotoReadyApp(page);
  return page.evaluate((model) => {
    const evaluated = evaluateAnswers(model);
    return Object.fromEntries(
      evaluated.map(({ b, r }) => [
        b.id,
        {
          status: r.status,
          needs: r.needs.map((need) => ({
            text: need.text,
            actionUrl: need.action?.url || null,
          })),
          reasons: r.reasons,
        },
      ]),
    );
  }, answerModel(overrides));
}

test("unasked DTC and CPP criteria never become ready", async ({ page }) => {
  const results = await evaluateProfile(page, {
    situation: ["unableToWork"],
  });

  expect(results.dtc.status).toBe("almost");
  expect(results.dtc.needs).toHaveLength(2);
  expect(results["cpp-disability"].status).toBe("almost");
  expect(results["cpp-disability"].needs.map((need) => need.text).join(" ")).toMatch(
    /Statement of Contributions/i,
  );
});

test("Alberta core programs stay conditional until defining gates are confirmed", async ({ page }) => {
  const adult = await evaluateProfile(page, {
    disabilities: ["physical"],
    canWalkFar: false,
  });
  expect(adult["adult-health-benefit"].status).toBe("almost");
  expect(adult["parking-placard"].status).toBe("almost");

  const child = await evaluateProfile(page, {
    forWho: "child",
    ageBand: "6to11",
    ageGroup: "child",
    disabilities: ["physical"],
    canWalkFar: false,
  });
  expect(child.fscd.status).toBe("almost");

  const olderAdult = await evaluateProfile(page, {
    ageBand: "65plus",
    ageGroup: "senior",
    disabilities: ["intellectual"],
    onsetBefore18: true,
  });
  expect(olderAdult.pdd.status).toBe("almost");
  expect(olderAdult.pdd.reasons).not.toContain("This is for people aged 18–64.");
});

test("municipal recipient routes and placard vision criteria are not inferred", async ({ page }) => {
  const edmonton = await evaluateProfile(page, {
    dtc: "yes",
    situation: ["unableToWork"],
    city: "Edmonton",
  });
  expect(edmonton["edmonton-fare-assistance"].status).toBe("almost");

  const grandePrairie = await evaluateProfile(page, { city: "Grande Prairie" });
  expect(grandePrairie["grandeprairie-aish-pass"].status).toBe("almost");

  const stAlbert = await evaluateProfile(page, { city: "St. Albert" });
  expect(stAlbert["stalbert-subsidy"].status).toBe("almost");

  const vision = await evaluateProfile(page, {
    disabilities: ["vision"],
    city: "Calgary",
  });
  expect(vision["parking-placard"].status).toBe("almost");

  const noMobilityRoute = await evaluateProfile(page, {
    disabilities: ["mental"],
    city: "Calgary",
  });
  expect(noMobilityRoute["parking-placard"].status).toBe("no");
});

test("shared disability documentation no longer sends Alberta users to StudentAid BC", async ({ page }) => {
  const results = await evaluateProfile(page, {
    disabilityVerified: "no",
    situation: ["student"],
    city: "Calgary",
  });
  const albertaIds = ["adap", "dres", "ab-grant-disability"];
  const actionUrls = albertaIds.flatMap((id) =>
    (results[id]?.needs || []).map((need) => need.actionUrl).filter(Boolean),
  );

  expect(actionUrls).not.toContain(
    "https://studentaidbc.ca/apply/how-to-apply-disability-funding",
  );
});

test("Deaf Students grant keeps representative matcher statuses", async ({ page }) => {
  const ready = await evaluateProfile(page, {
    province: "BC",
    city: "Vancouver",
    situation: ["student"],
    disabilities: ["hearing"],
    disabilityVerified: "yes",
  });
  expect(ready["bc-access-grant-deaf-students"].status).toBe("ready");

  const needsVerification = await evaluateProfile(page, {
    province: "BC",
    city: "Vancouver",
    situation: ["student"],
    disabilities: ["hearing"],
    disabilityVerified: "no",
  });
  expect(needsVerification["bc-access-grant-deaf-students"].status).toBe("almost");

  const wrongDisability = await evaluateProfile(page, {
    province: "BC",
    city: "Vancouver",
    situation: ["student"],
    disabilities: ["physical"],
    disabilityVerified: "yes",
  });
  expect(wrongDisability["bc-access-grant-deaf-students"].status).toBe("no");
});

const achbUrl = "https://www.alberta.ca/alberta-child-health-benefit";
const achbDeclarationUrl = "https://cfr.forms.gov.ab.ca/Form/AEHB3654";

async function childHealthResult(page, overrides = {}) {
  const results = await evaluateProfile(page, {
    forWho: "child",
    ageBand: "6to11",
    ageGroup: "child",
    province: "AB",
    citizenPR: true,
    income: "low",
    situation: ["none"],
    ...overrides,
  });
  return results["child-health-benefit"];
}

test("Alberta Child Health Benefit keeps a child under 18 conditional, never ready", async ({ page }) => {
  const benefit = await childHealthResult(page);

  expect(benefit.status).toBe("almost");
  expect(benefit.status).not.toBe("ready");
  expect(benefit.needs).toHaveLength(2);
  expect(benefit.needs.map((need) => need.text).join(" ")).toMatch(/every family member/i);
  expect(benefit.needs.map((need) => need.text).join(" ")).toMatch(/Income Support.*AISH.*Child and Youth Support Program.*Non-Insured Health Benefits/i);

  const ineligibleStatus = await childHealthResult(page, { citizenPR: false });
  expect(ineligibleStatus.status).toBe("no");
  expect(ineligibleStatus.reasons).toContain("You must be a Canadian citizen or permanent resident.");
});

test("Alberta Child Health Benefit keeps an 18-year-old in high school conditional", async ({ page }) => {
  const benefit = await childHealthResult(page, {
    forWho: "self",
    ageBand: "18",
    ageGroup: "adult",
    situation: ["secondary"],
  });

  expect(benefit.status).toBe("almost");
  expect(benefit.status).not.toBe("ready");
  expect(benefit.needs.map((need) => need.text).join(" ")).toMatch(/lives at home.*grade 12.*AEHB3654/i);
  expect(benefit.needs.find((need) => /AEHB3654/.test(need.text))?.actionUrl).toBe(achbDeclarationUrl);
});

test("19to59 high school is only a conditional proxy for a possible 19-year-old", async ({ page }) => {
  const benefit = await childHealthResult(page, {
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
    situation: ["secondary"],
  });

  expect(benefit.status).toBe("almost");
  expect(benefit.status).not.toBe("ready");
  expect(benefit.needs.map((need) => need.text).join(" ")).toMatch(/exactly 19.*selected age band also includes older adults.*lives at home.*grade 12.*AEHB3654/i);
});

test("19to59 without high school and clearly older bands route Child Health Benefit to no", async ({ page }) => {
  const broadAdult = await childHealthResult(page, {
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
    situation: ["student"],
  });
  expect(broadAdult.status).toBe("no");

  for (const ageBand of ["60to64", "65plus"]) {
    const older = await childHealthResult(page, {
      forWho: "self",
      ageBand,
      ageGroup: ageBand === "65plus" ? "senior" : "adult",
      situation: ["secondary"],
    });
    expect(older.status).toBe("no");
  }
});

test("19to59 offers a clearly limited high-school choice", async ({ page }) => {
  await gotoReadyApp(page);
  const options = await page.evaluate(() => {
    const originalBand = answers.ageBand;
    answers.ageBand = "19to59";
    const situationStep = STEPS.find((step) => step.id === "situation");
    const values = situationStep.options().map((option) => ({ value: option.value, label: option.label }));
    answers.ageBand = originalBand;
    return values;
  });

  expect(options).toContainEqual({
    value: "secondary",
    label: "Age 19 and still attending high school through grade 12",
  });
});

test("supplied excluded government coverage cannot be inferred by the production matcher", async ({ page }) => {
  // This synthetic field deliberately is not part of the production questionnaire.
  // Supplying a known Income Support case documents the limitation: the matcher
  // cannot consume it as an exclusion or infer that coverage has been cleared.
  const benefit = await childHealthResult(page, {
    governmentHealthCoverage: ["Income Support"],
  });
  const coverageNeed = benefit.needs.find((need) => /Income Support/.test(need.text));

  expect(benefit.status).toBe("almost");
  expect(benefit.status).not.toBe("ready");
  expect(coverageNeed).toBeTruthy();
  expect(coverageNeed.text).toMatch(/not receiving government health-benefit coverage.*Income Support.*AISH.*Child and Youth Support Program.*Non-Insured Health Benefits/i);
  expect(coverageNeed.text).toMatch(/Private or other health plans are not exclusions.*use them first.*remaining eligible costs/i);
  expect(coverageNeed.text).toMatch(/Canadian Dental Care Plan first.*remaining eligible dental costs/i);
  expect(coverageNeed.actionUrl).toBe(achbUrl);
});

test("Child Health Benefit exposes the official source and AEHB3654 links", async ({ page }) => {
  await gotoReadyApp(page);
  const record = await page.evaluate(() => {
    const benefit = BENEFITS.find((item) => item.id === "child-health-benefit");
    return {
      applyUrl: benefit.applyUrl,
      source: benefit.source,
      declarationUrl: benefit.declarationUrl,
      declarationText: benefit.declarationText,
      html: renderGuideBody(benefit, { status: "almost", needs: [], reasons: [] }),
    };
  });

  expect(record.applyUrl).toBe(achbUrl);
  expect(record.source).toBe(achbUrl);
  expect(record.declarationUrl).toBe(achbDeclarationUrl);
  expect(record.declarationText).toMatch(/AEHB3654/);
  expect(record.html).toContain(`href="${achbUrl}"`);
  expect(record.html).toContain(`href="${achbDeclarationUrl}"`);
});

const dresUrl = "https://www.alberta.ca/disability-related-employment-supports";

async function expectDresConditional(page, overrides = {}) {
  const results = await evaluateProfile(page, {
    province: "AB",
    ageBand: "19to59",
    disabilityVerified: "yes",
    situation: ["working"],
    ...overrides,
  });
  expect(results.dres.status).toBe("almost");
  expect(results.dres.status).not.toBe("ready");
  return results.dres;
}

test("DRES keeps a documented employed Alberta adult conditional", async ({ page }) => {
  const dres = await expectDresConditional(page);
  expect(dres.needs).toHaveLength(3);
  expect(dres.needs.map((need) => need.actionUrl)).toEqual([
    dresUrl,
    dresUrl,
    dresUrl,
  ]);
});

test("DRES does not hard-reject citizenPR=false and confirms Convention Refugee status", async ({ page }) => {
  const dres = await expectDresConditional(page, { citizenPR: false });
  const statusNeed = dres.needs.find((need) => /Convention Refugee/.test(need.text));
  expect(statusNeed).toBeTruthy();
  expect(statusNeed.text).toMatch(/reside in Alberta/i);
  expect(statusNeed.text).toMatch(/legally entitled to work or train in Canada/i);
  expect(statusNeed.actionUrl).toBe(dresUrl);
  expect(dres.reasons).not.toContain("You must be a Canadian citizen or permanent resident.");
});

test("DRES hard-routes age under 16 to no", async ({ page }) => {
  const results = await evaluateProfile(page, {
    ageBand: "12to15",
    ageGroup: "child",
    disabilityVerified: "yes",
    situation: ["working"],
  });
  expect(results.dres.status).toBe("no");
  expect(results.dres.reasons).toContain("You must be at least 16.");
});

test("DRES warns institution students and ordinary-training-only profiles", async ({ page }) => {
  const dres = await expectDresConditional(page, {
    situation: ["student"],
    attendsPublicInstitution: true,
    trainingOnly: true,
  });
  const warning = dres.needs.map((need) => need.text).join(" ");
  expect(warning).toMatch(/Alberta Education-funded K–12/);
  expect(warning).toMatch(/publicly funded Alberta post-secondary institution/);
  expect(warning).toMatch(/contact the school or institution for disability accommodations/i);
  expect(warning).toMatch(/does not fund ordinary job matching, employment or skills training, or wage subsidies/i);
});

test("DRES injected employment and covered-device facts cannot manufacture ready", async ({ page }) => {
  const dres = await expectDresConditional(page, {
    functionalNeeds: ["equipment"],
    dresAlbertaResident: true,
    dresLegalWorkStatus: true,
    dresConventionRefugee: true,
    dresPermanentLongTermBarrier: true,
    dresEmploymentDestined: true,
    dresCoveredAccommodation: "assistive device",
    dresInstitutionExcluded: false,
  });
  expect(dres.needs).toHaveLength(3);
  expect(dres.needs.every((need) => need.actionUrl === dresUrl)).toBe(true);
});

test("DRES copy contains only published examples, exclusions and official actions", async ({ page }) => {
  await gotoReadyApp(page);
  const dres = await page.evaluate(() => {
    const benefit = BENEFITS.find((item) => item.id === "dres");
    return {
      benefit,
      value: BENEFIT_VALUES.dres,
      meta: BENEFIT_META.dres || null,
      extra: BENEFIT_EXTRA.dres || null,
    };
  });
  const copy = JSON.stringify(dres);

  for (const publishedExample of [
    "assistive devices, equipment or technology",
    "ASL interpreting and captioning",
    "academic aide or note taker",
    "communication or hearing devices for work",
    "workplace access or modification",
    "work-related vehicle modifications",
  ]) {
    expect(copy).toContain(publishedExample);
  }
  for (const exclusion of [
    "medical treatments or therapies",
    "daily-living items",
    "job matching",
    "employment and skills training",
    "wage subsidies",
  ]) {
    expect(copy).toContain(exclusion);
  }
  expect(copy).toContain("Alberta Education-funded K–12");
  expect(copy).toContain("publicly funded Alberta post-secondary institution");
  expect(copy).not.toMatch(
    /(?<!not )\b(?:funds?|funding for|pays? for|covers?|provides?|offers?)\b[^.!?]{0,120}\b(?:ordinary training|training supports?|coaching|tutoring|focus\/?organization tools?|exam accommodations?|finish training)\b/i,
  );
  expect(copy).not.toMatch(/one of the easiest|very flexible|diagnosis/i);
  expect(dres.benefit.applyUrl).toBe(dresUrl);
  expect(dres.benefit.source).toBe(dresUrl);
  expect(dres.benefit.detail.phone).toBe(
    "Alberta Supports Contact Centre 780-644-9992 or 1-877-644-9992",
  );
  expect(dres.benefit.requires).toEqual([
    "age16plus",
    "ab",
    "disabilityDoc",
    "dresResidencyAndStatus",
    "dresDisabilityBarrier",
    "dresEmploymentRoute",
  ]);
  expect(dres.meta).toBeNull();
  expect(dres.extra).toBeNull();
});

const abGrantConfirmationNeeds = [
  "Confirm Alberta student-funding eligibility, a full-time course load of at least 60% (or a documented reduced load of at least 40%), and at least $1 of Alberta calculated need.",
  "For this financial-assistance application, confirm an approved Schedule 4 lists current disability-related service or equipment costs with quotes or estimates, and that approved costs remain after federal funding is allocated first.",
];
const abGrantPolicyUrl =
  "https://studentaid.alberta.ca/policy/student-aid-policy-manual/eligibility-for-student-loans-and-grants/alberta-student-grants/";

async function expectAbGrantAlmost(page, overrides = {}) {
  const results = await evaluateProfile(page, {
    situation: ["student"],
    province: "AB",
    disabilityVerified: "yes",
    ...overrides,
  });
  const grant = results["ab-grant-disability"];
  expect(grant.status).toBe("almost");
  expect(grant.status).not.toBe("ready");
  expect(grant.needs.map((need) => need.text)).toEqual(abGrantConfirmationNeeds);
  expect(grant.needs.map((need) => need.actionUrl)).toEqual([
    abGrantPolicyUrl,
    abGrantPolicyUrl,
  ]);
  for (const need of grant.needs) {
    expect(new URL(need.actionUrl).hostname).toBe("studentaid.alberta.ca");
  }
  return grant;
}

test("Alberta disability grant first and repeat applications require current confirmations", async ({ page }) => {
  await expectAbGrantAlmost(page, { abGrantApplication: "first" });
  await expectAbGrantAlmost(page, { abGrantApplication: "repeat" });
});

test("Alberta disability grant never infers requested costs or a federal funding gap", async ({ page }) => {
  await expectAbGrantAlmost(page, {
    abGrantRequestedDisabilityCosts: false,
  });
  await expectAbGrantAlmost(page, {
    abGrantRequestedDisabilityCosts: true,
    abGrantFederalCoverage: "full",
  });
});

test("Alberta disability grant does not manufacture ready from unsupported excess-cost facts", async ({ page }) => {
  await expectAbGrantAlmost(page, {
    abGrantRequestedDisabilityCosts: true,
    abGrantCostsApproved: true,
    abGrantFederalCoverage: "eligible-excess",
    abGrantStudyLoadEligible: true,
    abGrantCalculatedNeed: 1,
  });

  const notStudent = await evaluateProfile(page, {
    province: "AB",
    disabilityVerified: "yes",
    situation: ["none"],
  });
  expect(notStudent["ab-grant-disability"].status).toBe("no");
  expect(notStudent["ab-grant-disability"].reasons).toContain(
    "This is for post-secondary students.",
  );

  const notAlberta = await evaluateProfile(page, {
    province: "ON",
    disabilityVerified: "yes",
    situation: ["student"],
  });
  expect(notAlberta["ab-grant-disability"].status).toBe("no");
  expect(notAlberta["ab-grant-disability"].reasons).toContain(
    "This is an Alberta program.",
  );
});

test("Alberta disability grant copy states current federal-first rules without overclaims", async ({ page }) => {
  await gotoReadyApp(page);
  const copy = await page.evaluate(() => {
    const benefit = BENEFITS.find((entry) => entry.id === "ab-grant-disability");
    return JSON.stringify({
      benefit,
      value: BENEFIT_VALUES[benefit.id],
      meta: BENEFIT_META[benefit.id],
    });
  });

  expect(copy).toMatch(/federal funding is allocated first/i);
  expect(copy).toMatch(/current financial-assistance application|each new financial-assistance application/i);
  expect(copy).toMatch(/quotes or estimates/i);
  expect(copy).toMatch(/verification already on file may sometimes be reusable/i);
  expect(copy).toMatch(/\$3,000 per loan year/i);
  expect(copy).toMatch(/receipts by the end of the study period/i);
  expect(copy).toMatch(/unused or undocumented funding.*returned|unused funding.*must be returned/i);
  expect(copy).not.toMatch(/top-up|stacks on top|automatic(?:ally)? stack/i);
  expect(copy).not.toMatch(/Schedule 4 \(once\)|submit medical documentation once|no extra form/i);
  expect(copy).not.toMatch(/one-time submission|documentation is.*reused in future years/i);
});

test("DTC disability amount is not presented as cash, tax savings, or back-pay estimate", async ({ page }) => {
  await gotoReadyApp(page);
  const dtcModel = await page.evaluate(() => {
    const benefit = BENEFITS.find((entry) => entry.id === "dtc");
    const value = BENEFIT_VALUES.dtc;
    return {
      amount: benefit.amount,
      summary: benefit.summary,
      hasMasterKey: Object.prototype.hasOwnProperty.call(benefit, "masterKey"),
      excludeFromEstimate: value.excludeFromEstimate,
      annualMax: value.annualMax ?? null,
      annualTotal: reportAnnualTotal([{ b: benefit }]),
      moneyBand: renderMoneyBand([], [{ b: benefit, r: evaluate(benefit) }]),
      priorityScore: priorityScore(benefit),
    };
  });

  expect(dtcModel.amount).toMatch(/non-refundable tax credit/i);
  expect(dtcModel.summary).not.toMatch(/master key/i);
  expect(dtcModel.hasMasterKey).toBe(false);
  expect(dtcModel.excludeFromEstimate).toBe(true);
  expect(dtcModel.annualMax).toBeNull();
  expect(dtcModel.annualTotal).toBe(0);
  expect(dtcModel.moneyBand).not.toMatch(/back-pay|retroYears|\$25,000/i);
  expect(dtcModel.priorityScore).toBeLessThan(10);

  await expect(page.locator("body")).not.toContainText("$10,138");
  await expect(page.locator(".pv-hero-val")).toHaveText("Amounts vary");
});

test("money band covers empty, ready, mixed, zero-total, and RDSP states", async ({ page }) => {
  await gotoReadyApp(page);
  const model = await page.evaluate(() => {
    const entry = (id) => ({ b: BENEFITS.find((benefit) => benefit.id === id), r: { status: "almost" } });
    const text = (html) => {
      const node = document.createElement("div");
      node.innerHTML = html;
      return node.textContent.replace(/\s+/g, " ").trim();
    };
    const originalLang = LANG;
    LANG = "en";
    try {
      const cwb = entry("cwb-disability");
      const child = entry("child-disability-benefit");
      const dtc = entry("dtc");
      const rdsp = entry("rdsp");
      const mixedReady = [cwb, child];
      return {
        empty: renderMoneyBand([], []),
        mixed: text(renderMoneyBand(mixedReady, [rdsp])),
        mixedAnnualTotal: reportAnnualTotal(mixedReady),
        zeroTotal: text(renderMoneyBand([dtc], [])),
        almostOnly: text(renderMoneyBand([], [cwb])),
        almostRdsp: text(renderMoneyBand([], [rdsp])),
        readyRdsp: text(renderMoneyBand([rdsp], [])),
      };
    } finally {
      LANG = originalLang;
    }
  });

  expect(model.empty).toBe("");
  expect(model.mixedAnnualTotal).toBe(4300);
  expect(model.mixed).toContain("Up to ~$4,300 / year");
  expect(model.mixed).not.toContain("$90,000");
  expect(model.zeroTotal).toContain("Ready to apply — value varies by program");
  expect(model.zeroTotal).not.toMatch(/\$[\d,]+/);
  expect(model.almostOnly).toContain("Your next step is to confirm one thing");
  expect(model.almostOnly).not.toMatch(/\$[\d,]+/);
  expect(model.almostRdsp).toContain("Your next step is to confirm one thing");
  expect(model.almostRdsp).not.toContain("$90,000");
  expect(model.almostRdsp).not.toContain("$4,500");
  expect(model.readyRdsp).toContain("Up to ~$4,500 / year");
  expect(model.readyRdsp).toContain("up to $90,000 lifetime (RDSP)");
});

test("money and all-conditional result copy is complete in English and French", async ({ page }) => {
  await gotoReadyApp(page);
  const copy = await page.evaluate(() => {
    const entry = (id) => ({
      b: BENEFITS.find((benefit) => benefit.id === id),
      r: { status: "almost", needs: [], reasons: [] },
    });
    const text = (html) => {
      const node = document.createElement("div");
      node.innerHTML = html;
      return node.textContent.replace(/\s+/g, " ").trim();
    };
    const originalLang = LANG;
    try {
      LANG = "en";
      const en = {
        one: resultsBlurb(0, 1),
        many: resultsBlurb(0, 2),
        almost: text(renderMoneyBand([], [entry("rdsp")])),
        ready: text(renderMoneyBand([entry("rdsp")], [])),
        group: renderMatchedGroups([], [entry("rdsp")], {}),
      };
      LANG = "fr";
      const fr = {
        one: resultsBlurb(0, 1),
        many: resultsBlurb(0, 2),
        mixed: resultsBlurb(1, 1),
        almost: text(renderMoneyBand([], [entry("rdsp")])),
        ready: text(renderMoneyBand([entry("rdsp")], [])),
        group: renderMatchedGroups([], [entry("rdsp")], {}),
      };
      return { en, fr };
    } finally {
      LANG = originalLang;
    }
  });

  expect(copy.en.one).toContain("This program is not ruled out");
  expect(copy.en.one).not.toContain("These 1 programs");
  expect(copy.en.many).toContain("These 2 programs are not ruled out");
  expect(copy.en.almost).toContain("Your next step is to confirm one thing");
  expect(copy.en.ready).toContain("Up to ~$4,500 / year");
  expect(copy.en.group).toMatch(/group-title almost primary/);
  expect(copy.en.group).toContain("Programs to confirm");

  expect(copy.fr.one).toContain("Ce programme n’est pas écarté");
  expect(copy.fr.many).toContain("Ces 2 programmes ne sont pas écartés");
  expect(copy.fr.one + copy.fr.many).not.toMatch(/CIPH|crédit d.impôt/i);
  expect(copy.fr.mixed).not.toMatch(/CIPH|crédit d.impôt/i);
  expect(copy.fr.almost).toContain("Votre prochaine étape : confirmer une chose");
  expect(copy.fr.ready).toContain("Jusqu’à ~$4,500 / an");
  expect(copy.fr.ready).toContain("jusqu’à $90,000 à vie (REEI)");
  expect(copy.fr.group).toMatch(/group-title almost primary/);
  expect(copy.fr.group).toContain("Programmes à confirmer");
});

test("results UX helpers preserve matcher definitions, values, questions, and input ordering", async ({ page }) => {
  await gotoReadyApp(page);
  const preserved = await page.evaluate(() => {
    const snapshot = () => JSON.stringify({
      benefits: BENEFITS.map((benefit) => ({ id: benefit.id, requires: benefit.requires })),
      reqs: Object.entries(REQS).map(([key, req]) => [key, {
        fixed: req.fixed,
        unmet: req.unmet,
        hasTest: typeof req.test === "function",
        action: req.action || null,
      }]),
      values: BENEFIT_VALUES,
      steps: STEPS.map((step) => ({ id: step.id, type: step.type })),
    });
    const before = snapshot();
    const ready = ["cwb-disability", "child-disability-benefit"].map((id) => ({
      b: BENEFITS.find((benefit) => benefit.id === id),
      r: { status: "ready", needs: [], reasons: [] },
    }));
    const almost = ["rdsp", "dtc"].map((id) => ({
      b: BENEFITS.find((benefit) => benefit.id === id),
      r: { status: "almost", needs: [], reasons: [] },
    }));
    const readyOrder = ready.map((entry) => entry.b.id);
    const almostOrder = almost.map((entry) => entry.b.id);
    renderMoneyBand(ready, almost);
    resultsBlurb(ready.length, almost.length);
    renderMatchedGroups(ready, almost, {});
    return {
      unchanged: before === snapshot(),
      readyOrder,
      readyOrderAfter: ready.map((entry) => entry.b.id),
      almostOrder,
      almostOrderAfter: almost.map((entry) => entry.b.id),
    };
  });

  expect(preserved.unchanged).toBe(true);
  expect(preserved.readyOrderAfter).toEqual(preserved.readyOrder);
  expect(preserved.almostOrderAfter).toEqual(preserved.almostOrder);
});

test("DTC practitioner finder exposes the current scoped CRA certification matrix", async ({ page }) => {
  await gotoReadyApp(page);
  const signerModel = await page.evaluate(() => {
    const benefit = BENEFITS.find((entry) => entry.id === "dtc");
    return {
      matrix: DTC_SIGNER_SCOPES,
      html: practitionerFinder(benefit),
    };
  });

  expect(signerModel.matrix).toEqual([
    { name: "Medical doctor", search: "family doctor", scope: "All impairments" },
    { name: "Nurse practitioner", search: "nurse practitioner", scope: "All impairments" },
    { name: "Optometrist", search: "optometrist", scope: "Vision only" },
    { name: "Audiologist", search: "audiologist", scope: "Hearing only" },
    { name: "Occupational therapist", search: "occupational therapist", scope: "Walking, feeding or dressing only" },
    { name: "Physiotherapist", search: "physiotherapist", scope: "Walking only" },
    { name: "Psychologist", search: "psychologist", scope: "Mental functions only" },
    { name: "Speech-language pathologist", search: "speech-language pathologist", scope: "Speaking only" },
  ]);
  expect(signerModel.html).toContain("Who can certify depends on the functional category");
  expect(signerModel.html).toContain("Check the current CRA matrix");
  expect(signerModel.html).not.toContain("whoever you can get in to see soonest");
  expect(signerModel.html).not.toMatch(/podiatrist/i);
});

test("generated DTC guide uses corrected value and prioritization language", async ({ page }) => {
  const response = await page.request.get("/guides/dtc.html");
  expect(response.ok()).toBe(true);
  const guide = await response.text();

  expect(guide).toMatch(/non-refundable tax credit/i);
  expect(guide).not.toMatch(/master key|single most important step|\$10,138|up to \$25,000/i);
  expect(guide).toMatch(/refund depends on the tax situation for each year/i);
});

test("Alberta disability programs never return ready from unasked criteria", async ({ page }) => {
  const results = await evaluateProfile(page, {
    disabilityVerified: "yes",
    situation: ["unableToWork"],
    income: "low",
    functionalNeeds: ["equipment"],
    province: "AB",
    ageBand: "19to59",
    citizenPR: true,
  });

  const aishNeeds = results.aish.needs.map((need) => need.text).join(" ");
  const adapNeeds = results.adap.needs.map((need) => need.text).join(" ");
  const aadlNeeds = results.aadl.needs.map((need) => need.text).join(" ");
  const adultHealthNeeds = results["adult-health-benefit"].needs
    .map((need) => need.text)
    .join(" ");

  for (const id of ["aish", "adap", "aadl", "adult-health-benefit"]) {
    expect(results[id].status).toBe("almost");
  }

  expect(aishNeeds).toMatch(/\$100,000/);
  // DATA-46: Alberta official wording is "a severe disability that permanently
  // prevents employment" — assert the official test, not the earlier phrasing.
  expect(aishNeeds).toMatch(/permanently prevents employment/);
  expect(adapNeeds).toMatch(/significantly impedes/);
  expect(adapNeeds).toMatch(/\$100,000/);
  expect(aadlNeeds).toMatch(/Alberta Health Care Insurance Plan/);
  expect(aadlNeeds).toMatch(/approved vendor/);
  expect(aadlNeeds).toMatch(/Veterans Affairs/);
  expect(adultHealthNeeds).toMatch(/\$16,580/);
  expect(adultHealthNeeds).toMatch(/high ongoing prescription drug needs/);

  expect(results.aadl.needs).toHaveLength(3);
  expect(results.aish.needs).toHaveLength(2);
  expect(results.adap.needs).toHaveLength(2);
  expect(results["adult-health-benefit"].needs).toHaveLength(2);
});

test("no Alberta answer combination reaches ready", async ({ page }) => {
  const targetIds = ["aish", "adap", "aadl", "adult-health-benefit"];
  await gotoReadyApp(page);

  for (const income of ["low", "moderate", "high"]) {
    for (const disabilityVerified of ["yes", "no", "unsure"]) {
      for (const situation of [["unableToWork"], ["working"], ["none"]]) {
        for (const functionalNeeds of [["equipment"], ["dailyLiving"], ["none"], ["unsure"]]) {
          const statuses = await page.evaluate(
            ({ model, ids }) => {
              const evaluated = evaluateAnswers(model);
              return Object.fromEntries(
                evaluated
                  .filter(({ b }) => ids.includes(b.id))
                  .map(({ b, r }) => [b.id, r.status]),
              );
            },
            {
              model: answerModel({
                income,
                disabilityVerified,
                situation,
                functionalNeeds,
                province: "AB",
                ageBand: "19to59",
                citizenPR: true,
              }),
              ids: targetIds,
            },
          );

          for (const id of targetIds) {
            expect(statuses[id]).not.toBe("ready");
          }
        }
      }
    }
  }
});

test("jurisdiction, age and status produce a clean no-match", async ({ page }) => {
  const albertaIds = ["aish", "adap", "aadl", "adult-health-benefit"];
  const adultProgramIds = ["aish", "adap", "adult-health-benefit"];

  const outsideAlberta = await evaluateProfile(page, {
    province: "BC",
    functionalNeeds: ["equipment"],
  });
  for (const id of albertaIds) expect(outsideAlberta[id].status).toBe("no");

  const senior = await evaluateProfile(page, { ageBand: "65plus" });
  for (const id of adultProgramIds) expect(senior[id].status).toBe("no");

  const nonCitizen = await evaluateProfile(page, { citizenPR: false });
  for (const id of adultProgramIds) expect(nonCitizen[id].status).toBe("no");

  const noEquipmentNeed = await evaluateProfile(page, { functionalNeeds: ["none"] });
  expect(noEquipmentNeed.aadl.status).toBe("no");
});

test("shared predicates are unchanged for other programs", async ({ page }) => {
  await gotoReadyApp(page);
  const sharedPredicateResults = await page.evaluate((model) => {
    const changedIds = new Set(["aish", "adap", "aadl", "adult-health-benefit"]);
    return evaluateAnswers(model)
      .filter(
        ({ b }) =>
          !changedIds.has(b.id) &&
          b.requires.some((requirement) =>
            ["disabilityDoc", "lowIncome"].includes(requirement),
          ),
      )
      .map(({ b, r }) => ({ id: b.id, status: r.status }));
  }, answerModel());

  expect(sharedPredicateResults.length).toBeGreaterThanOrEqual(6);
  // The shared predicates must still DISCRIMINATE - not collapse every
  // consumer to the same verdict - and must still evaluate without throwing.
  expect(
    sharedPredicateResults.every(({ status }) => ["ready", "almost", "no"].includes(status)),
  ).toBe(true);
  expect(new Set(sharedPredicateResults.map(({ status }) => status)).size).toBeGreaterThanOrEqual(2);
});

const bcWitnessIds = [
  "bc-pwd-designation",
  "bc-disability-assistance-pwd",
  "bc-cy-disability-benefit",
  "bc-fuel-tax-refund-disabilities",
  "bc-icbc-disability-discount",
  "bc-property-tax-deferment-disabilities",
  "bc-healthy-kids",
  "bc-workbc-employment-services",
  "coquitlam-far",
];

const qualifyingBcAdult = {
  province: "BC",
  city: "Coquitlam",
  ageBand: "19to59",
  citizenPR: true,
  msp: "yes",
  bcAssistance: "pwd",
  income: "low",
  functionalNeeds: ["dailyLiving", "equipment", "transitBarrier"],
  circumstances: ["vehicleOwner", "homeowner"],
  disabilities: ["physical"],
};

const qualifyingBcChild = {
  ...qualifyingBcAdult,
  forWho: "child",
  ageBand: "6to11",
  ageGroup: "child",
  functionalNeeds: ["childHighNeeds"],
  bcAssistance: "none",
  msp: "yes",
};

test("BC programs never return ready from unasked criteria", async ({ page }) => {
  const adult = await evaluateProfile(page, qualifyingBcAdult);
  for (const id of [
    "bc-pwd-designation",
    "bc-disability-assistance-pwd",
    "bc-fuel-tax-refund-disabilities",
    "bc-icbc-disability-discount",
    "bc-property-tax-deferment-disabilities",
    "bc-workbc-employment-services",
    "coquitlam-far",
  ]) {
    expect(adult[id].status).toBe("almost");
  }

  const child = await evaluateProfile(page, qualifyingBcChild);
  expect(child["bc-cy-disability-benefit"].status).toBe("almost");
  expect(child["bc-healthy-kids"].status).toBe("almost");
});

test("BC needs carry the official wording", async ({ page }) => {
  const adult = await evaluateProfile(page, qualifyingBcAdult);
  const child = await evaluateProfile(page, qualifyingBcChild);
  const needsText = (results, id) =>
    results[id].needs.map((need) => need.text).join(" ");

  expect(needsText(adult, "bc-disability-assistance-pwd")).toMatch(/\$100,000/);
  expect(needsText(adult, "bc-disability-assistance-pwd")).toMatch(/\$200,000/);
  expect(needsText(adult, "bc-pwd-designation")).toMatch(/prescribed-class/i);
  expect(needsText(adult, "bc-pwd-designation")).toMatch(/not automatically lost/i);
  expect(needsText(adult, "bc-pwd-designation")).toMatch(/at least two years/);
  expect(needsText(adult, "bc-disability-assistance-pwd")).toMatch(/at least two years/);
  expect(needsText(child, "bc-cy-disability-benefit")).toMatch(/April 1, 2027/);
  expect(needsText(child, "bc-cy-disability-benefit")).toMatch(/Support is available now/);
  expect(needsText(adult, "bc-fuel-tax-refund-disabilities")).toMatch(/BCANDS/);
  expect(needsText(adult, "bc-fuel-tax-refund-disabilities")).toMatch(/CNIB/);
  expect(needsText(adult, "bc-icbc-disability-discount")).toMatch(/registration is confirmed/);
  expect(needsText(adult, "bc-property-tax-deferment-disabilities")).toMatch(/25% equity/);
  expect(needsText(adult, "bc-property-tax-deferment-disabilities")).toMatch(/at least one year/);
  expect(needsText(child, "bc-healthy-kids")).toMatch(/\$42,000/);
  expect(needsText(adult, "bc-workbc-employment-services")).toMatch(/unemployed or underemployed/);
  expect(needsText(adult, "coquitlam-far")).toMatch(/refugees/);
  expect(needsText(adult, "coquitlam-far")).toMatch(/study or work permit/);
});

test("no BC answer combination reaches ready", async ({ page }) => {
  const models = [];
  for (const income of ["low", "moderate", "high"]) {
    for (const bcAssistance of ["pwd", "other", "none"]) {
      for (const msp of ["yes", "no"]) {
        for (const functionalNeeds of [
          ["dailyLiving"],
          ["equipment"],
          ["transitBarrier"],
          ["childHighNeeds"],
          ["none"],
        ]) {
          for (const circumstances of [["vehicleOwner", "homeowner"], ["none"]]) {
            for (const ageBand of ["6to11", "19to59", "65plus"]) {
              models.push(
                answerModel({
                  ...qualifyingBcAdult,
                  province: "BC",
                  income,
                  bcAssistance,
                  msp,
                  functionalNeeds,
                  circumstances,
                  ageBand,
                }),
              );
            }
          }
        }
      }
    }
  }

  await gotoReadyApp(page);
  const readyMatches = await page.evaluate(
    ({ profiles, ids }) =>
      profiles.flatMap((model, index) =>
        evaluateAnswers(model)
          .filter(({ b, r }) => ids.includes(b.id) && r.status === "ready")
          .map(({ b }) => ({ id: b.id, index, model })),
      ),
    { profiles: models, ids: bcWitnessIds },
  );

  expect(readyMatches).toEqual([]);
});

test("preserved BC no-match gates still fire", async ({ page }) => {
  const outsideBc = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    province: "AB",
    city: "Edmonton",
  });
  for (const id of bcWitnessIds) expect(outsideBc[id].status).toBe("no");

  const noMsp = await evaluateProfile(page, { ...qualifyingBcChild, msp: "no" });
  expect(noMsp["bc-healthy-kids"].status).toBe("no");

  const receivesPwd = await evaluateProfile(page, {
    ...qualifyingBcChild,
    bcAssistance: "pwd",
  });
  expect(receivesPwd["bc-healthy-kids"].status).toBe("no");

  const noAssistance = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    bcAssistance: "none",
  });
  // bcPwdStatus is fixed:false by design — someone without the designation can
  // still apply for it, so the program stays visible with a confirm step
  // rather than being hidden behind a hard no-match.
  expect(noAssistance["bc-property-tax-deferment-disabilities"].status).toBe("almost");
  expect(
    noAssistance["bc-property-tax-deferment-disabilities"].needs
      .map((need) => need.text)
      .join(" "),
  ).toMatch(/PWD designation or disability assistance/i);

  const noCircumstances = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    circumstances: ["none"],
  });
  expect(noCircumstances["bc-property-tax-deferment-disabilities"].status).toBe("no");
  expect(noCircumstances["bc-fuel-tax-refund-disabilities"].status).toBe("no");

  const adult = await evaluateProfile(page, {
    ...qualifyingBcChild,
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
  });
  expect(adult["bc-cy-disability-benefit"].status).toBe("no");

  const outsideCoquitlam = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    city: "Kelowna",
  });
  expect(outsideCoquitlam["coquitlam-far"].status).toBe("no");
});

test("under-inclusion regressions are fixed", async ({ page }) => {
  const moderateIncomeFamily = await evaluateProfile(page, {
    ...qualifyingBcChild,
    income: "moderate",
    msp: "yes",
    bcAssistance: "none",
    forWho: "child",
    ageBand: "6to11",
  });
  expect(moderateIncomeFamily["bc-healthy-kids"].status).not.toBe("no");
  expect(moderateIncomeFamily["bc-healthy-kids"].status).toBe("almost");

  const unemployedAdult = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    situation: ["none"],
    income: "low",
  });
  expect(unemployedAdult["bc-workbc-employment-services"].status).not.toBe("no");
  expect(unemployedAdult["bc-workbc-employment-services"].status).toBe("almost");
});

test("the Alberta slice is preserved", async ({ page }) => {
  const results = await evaluateProfile(page, {
    province: "AB",
    city: "Edmonton",
    ageBand: "19to59",
    citizenPR: true,
    disabilityVerified: "yes",
    situation: ["unableToWork"],
    income: "low",
    functionalNeeds: ["equipment"],
  });

  for (const id of ["aish", "adap", "aadl", "adult-health-benefit"]) {
    expect(results[id].status).toBe("almost");
  }
  expect(results.aish.needs).toHaveLength(2);
  expect(results.adap.needs).toHaveLength(2);
  expect(results.aadl.needs).toHaveLength(3);
  expect(results["adult-health-benefit"].needs).toHaveLength(2);
  expect(results.aish.needs.map((need) => need.text).join(" ")).toMatch(/\$100,000/);
});

test("shared predicates still serve their other consumers", async ({ page }) => {
  const changedIds = new Set([
    ...bcWitnessIds,
    "aish",
    "adap",
    "aadl",
    "adult-health-benefit",
  ]);
  await gotoReadyApp(page);
  const sharedPredicateResults = await page.evaluate(
    ({ model, excludedIds }) =>
      evaluateAnswers(model)
        .filter(({ b }) => !excludedIds.includes(b.id))
        .map(({ b, r }) => ({ id: b.id, status: r.status })),
    { model: answerModel(), excludedIds: [...changedIds] },
  );

  expect(sharedPredicateResults.length).toBeGreaterThanOrEqual(6);
  // The shared predicates must still DISCRIMINATE - not collapse every
  // consumer to the same verdict - and must still evaluate without throwing.
  expect(
    sharedPredicateResults.every(({ status }) => ["ready", "almost", "no"].includes(status)),
  ).toBe(true);
  expect(new Set(sharedPredicateResults.map(({ status }) => status)).size).toBeGreaterThanOrEqual(2);
});

test("federal programs never return ready from unasked criteria", async ({ page }) => {
  const adultProfile = {
    province: "AB",
    city: "Edmonton",
    ageBand: "19to59",
    dtc: "yes",
    income: "low",
    situation: ["working"],
    disabilityVerified: "yes",
    functionalNeeds: ["equipment"],
    citizenPR: true,
  };
  const adult = await evaluateProfile(page, adultProfile);
  for (const id of ["cdb-adult", "rdsp", "cwb-disability"]) {
    expect(adult[id].status).toBe("almost");
  }

  const student = await evaluateProfile(page, {
    ...adultProfile,
    situation: ["student"],
  });
  for (const id of ["csg-disability", "csg-dse"]) {
    expect(student[id].status).toBe("almost");
  }

  const child = await evaluateProfile(page, {
    forWho: "child",
    ageBand: "6to11",
    ageGroup: "child",
    dtc: "yes",
    province: "AB",
    city: "Edmonton",
  });
  expect(child["child-disability-benefit"].status).toBe("almost");
});

test("federal needs carry the official wording", async ({ page }) => {
  const adultProfile = {
    province: "AB",
    city: "Edmonton",
    ageBand: "19to59",
    dtc: "yes",
    income: "low",
    situation: ["working"],
    disabilityVerified: "yes",
    functionalNeeds: ["equipment"],
    citizenPR: true,
  };
  const adult = await evaluateProfile(page, adultProfile);
  const student = await evaluateProfile(page, {
    ...adultProfile,
    situation: ["student"],
  });
  const child = await evaluateProfile(page, {
    forWho: "child",
    ageBand: "6to11",
    ageGroup: "child",
    dtc: "yes",
    province: "AB",
    city: "Edmonton",
  });
  const needsText = (results, id) =>
    results[id].needs.map((need) => need.text).join(" ");

  expect(needsText(adult, "cdb-adult")).toMatch(/filed your 2025 federal income tax return/);
  expect(needsText(adult, "cdb-adult")).toMatch(
    /temporary resident who has lived in Canada throughout the previous 18 months/,
  );
  expect(needsText(adult, "cdb-adult")).toMatch(/federal penitentiary/);
  expect(needsText(adult, "cdb-adult")).toMatch(
    /reduce the benefit, in some cases to zero/,
  );
  expect(needsText(child, "child-disability-benefit")).toMatch(
    /paid together with the Canada Child Benefit/,
  );
  expect(needsText(child, "child-disability-benefit")).toMatch(/primarily responsible/);
  expect(needsText(adult, "rdsp")).toMatch(/social insurance number/);
  expect(needsText(adult, "rdsp")).toMatch(/turns 59/);
  expect(needsText(adult, "rdsp")).toMatch(/\$200,000/);
  expect(needsText(adult, "rdsp")).toMatch(/turns 49/);
  expect(needsText(adult, "cwb-disability")).toMatch(
    /full-time student for more than 13 weeks/,
  );
  expect(needsText(adult, "cwb-disability")).toMatch(/at least 90 days/);
  expect(needsText(adult, "cwb-disability")).toMatch(/diplomat/);
  expect(needsText(student, "csg-disability")).toMatch(/assessed financial need/);
  expect(needsText(student, "csg-disability")).toMatch(/designated school/);
  expect(needsText(student, "csg-disability")).toMatch(
    /Northwest Territories, Nunavut and Quebec/,
  );
  expect(needsText(student, "csg-dse")).toMatch(/rehabilitation caseworker/);
  expect(needsText(student, "csg-dse")).toMatch(/confirming their cost/);
});

test("RDSP keeps contributions and grants as separate deadlines", async ({ page }) => {
  const results = await evaluateProfile(page, {
    province: "AB",
    city: "Edmonton",
    ageBand: "19to59",
    dtc: "yes",
    income: "low",
    situation: ["working"],
    disabilityVerified: "yes",
    functionalNeeds: ["equipment"],
    citizenPR: true,
  });
  const needs = results.rdsp.needs;
  const contributionsIndex = needs.findIndex((need) => /turns 59/.test(need.text));
  const grantsIndex = needs.findIndex((need) => /turns 49/.test(need.text));

  expect(contributionsIndex).toBeGreaterThanOrEqual(0);
  expect(grantsIndex).toBeGreaterThanOrEqual(0);
  expect(contributionsIndex).not.toBe(grantsIndex);
  expect(needs[contributionsIndex].text).toMatch(/\$200,000/);
  expect(needs[contributionsIndex].text).not.toMatch(/grant|bond/i);
  expect(needs[grantsIndex].text).toMatch(/Grant|Bond/);
  expect(needs[grantsIndex].text).not.toMatch(/\$200,000/);
});

test("no federal answer combination reaches ready", async ({ page }) => {
  const targetIds = [
    "cdb-adult",
    "child-disability-benefit",
    "rdsp",
    "cwb-disability",
    "csg-disability",
    "csg-dse",
  ];
  const models = [];
  for (const dtc of ["yes", "no", "unsure"]) {
    for (const income of ["low", "moderate", "high"]) {
      for (const situation of [["working"], ["student"], ["unableToWork"], ["none"]]) {
        for (const ageBand of ["6to11", "19to59", "60to64", "65plus"]) {
          for (const citizenPR of [true, false]) {
            models.push(
              answerModel({
                dtc,
                income,
                situation,
                ageBand,
                citizenPR,
                province: "AB",
              }),
            );
          }
        }
      }
    }
  }

  await gotoReadyApp(page);
  const readyMatches = await page.evaluate(
    ({ profiles, ids }) =>
      profiles.flatMap((model, index) =>
        evaluateAnswers(model)
          .filter(({ b, r }) => ids.includes(b.id) && r.status === "ready")
          .map(({ b }) => ({ id: b.id, index, model })),
      ),
    { profiles: models, ids: targetIds },
  );

  expect(readyMatches).toEqual([]);
});

test("preserved federal no-match gates still fire", async ({ page }) => {
  const senior = await evaluateProfile(page, { ageBand: "65plus" });
  expect(senior["cdb-adult"].status).toBe("no");

  const adult = await evaluateProfile(page, {
    forWho: "self",
    ageBand: "19to59",
  });
  expect(adult["child-disability-benefit"].status).toBe("no");

  const overContributionAge = await evaluateProfile(page, { ageBand: "60to64" });
  expect(overContributionAge.rdsp.status).toBe("no");

  const notWorking = await evaluateProfile(page, { situation: ["none"] });
  expect(notWorking["cwb-disability"].status).toBe("no");

  const notStudent = await evaluateProfile(page, { situation: ["working"] });
  expect(notStudent["csg-disability"].status).toBe("no");
  expect(notStudent["csg-dse"].status).toBe("no");
});

test("BC students are routed to StudentAid BC, not called ineligible", async ({ page }) => {
  const results = await evaluateProfile(page, {
    province: "BC",
    city: "Vancouver",
    situation: ["student"],
    ageBand: "19to59",
    dtc: "yes",
    disabilityVerified: "yes",
    msp: "yes",
    bcAssistance: "none",
    income: "low",
  });

  for (const id of ["csg-disability", "csg-dse"]) {
    expect(results[id].status).toBe("no");
    const reasons = results[id].reasons.join(" ");
    expect(reasons).toMatch(/StudentAid BC/);
    expect(reasons).not.toMatch(/not eligible|ineligible/i);
  }

  for (const id of [
    "bc-csg-students-disabilities",
    "bc-assistance-program-students-disabilities",
  ]) {
    expect(results[id]).toBeTruthy();
    expect(results[id].status).not.toBe("no");
    expect(["ready", "almost"]).toContain(results[id].status);
  }
});

test("Alberta and BC slices are preserved", async ({ page }) => {
  const alberta = await evaluateProfile(page, {
    province: "AB",
    city: "Edmonton",
    ageBand: "19to59",
    citizenPR: true,
    disabilityVerified: "yes",
    situation: ["unableToWork"],
    income: "low",
    functionalNeeds: ["equipment"],
  });

  expect(alberta.aish.status).toBe("almost");
  expect(alberta.aish.needs).toHaveLength(2);
  expect(alberta.adap.status).toBe("almost");
  expect(alberta.adap.needs).toHaveLength(2);
  expect(alberta.aadl.status).toBe("almost");
  expect(alberta.aadl.needs).toHaveLength(3);
  expect(alberta["adult-health-benefit"].status).toBe("almost");
  expect(alberta["adult-health-benefit"].needs).toHaveLength(2);

  const bc = await evaluateProfile(page, {
    province: "BC",
    city: "Coquitlam",
    ageBand: "19to59",
    msp: "yes",
    bcAssistance: "pwd",
    citizenPR: true,
    income: "low",
    functionalNeeds: ["dailyLiving", "equipment", "transitBarrier"],
    circumstances: ["vehicleOwner", "homeowner"],
  });
  for (const id of [
    "bc-pwd-designation",
    "bc-disability-assistance-pwd",
    "bc-fuel-tax-refund-disabilities",
    "bc-icbc-disability-discount",
    "bc-property-tax-deferment-disabilities",
    "bc-workbc-employment-services",
    "coquitlam-far",
  ]) {
    expect(bc[id].status).toBe("almost");
  }
});

test("ready remains reachable while the Alberta child profile stays conditional", async ({ page }) => {
  const albertaLowIncomeChild = await evaluateProfile(page, {
    forWho: "child",
    province: "AB",
    ageBand: "6to11",
    ageGroup: "child",
    income: "low",
  });
  const abReady = Object.values(albertaLowIncomeChild).filter((r) => r.status === "ready");
  expect(abReady).toHaveLength(0);
  expect(albertaLowIncomeChild["child-health-benefit"].status).toBe("almost");
  expect(albertaLowIncomeChild["child-health-benefit"].needs.map((need) => need.text).join(" ")).toMatch(/government health-benefit coverage/i);

  const bcPwdAdult = await evaluateProfile(page, {
    province: "BC",
    city: "Coquitlam",
    msp: "yes",
    bcAssistance: "pwd",
    functionalNeeds: ["dailyLiving", "equipment", "transitBarrier"],
    circumstances: ["vehicleOwner", "homeowner"],
  });
  const bcReady = Object.values(bcPwdAdult).filter((r) => r.status === "ready");
  expect(bcReady.length).toBeGreaterThan(0);
});

test("renovation tax credits stay conditional on the work actually being done, never ready", async ({ page }) => {
  const results = await evaluateProfile(page, {
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
    province: "BC",
    citizenPR: true,
    dtc: "yes",
    circumstances: ["homeowner"],
    situation: ["none"],
    disabilities: ["physical"],
    disabilityVerified: "yes",
  });

  for (const id of ["home-accessibility-tax-credit", "bc-home-reno-tax-credit", "multigenerational-home-renovation-tax-credit"]) {
    const benefit = results[id];
    expect(benefit, `expected a result for ${id}`).toBeTruthy();
    expect(benefit.status, `${id} must not claim readiness before the work is done`).toBe("almost");
    expect(benefit.status).not.toBe("ready");
    expect(benefit.needs.map((need) => need.text).join(" ")).toMatch(/only once the qualifying renovation has actually been done/i);
  }
});

test("Kelowna KFAP is refused for post-secondary students, who the City excludes", async ({ page }) => {
  const asStudent = await evaluateProfile(page, {
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
    province: "BC",
    city: "Kelowna",
    citizenPR: true,
    income: "low",
    situation: ["student"],
    disabilities: ["physical"],
    disabilityVerified: "yes",
  });
  const kfap = asStudent["kelowna-recreation-assistance"];
  expect(kfap, "expected a result for kelowna-recreation-assistance").toBeTruthy();
  expect(kfap.status, "the City publishes this exclusion, so it must be a hard no").toBe("no");
  expect(kfap.reasons.join(" ")).toMatch(/post-secondary students/i);
  expect(kfap.reasons.join(" ")).toMatch(/discounted student rate/i);

  const notStudent = await evaluateProfile(page, {
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
    province: "BC",
    city: "Kelowna",
    citizenPR: true,
    income: "low",
    situation: ["none"],
    disabilities: ["physical"],
    disabilityVerified: "yes",
  });
  const kfapOther = notStudent["kelowna-recreation-assistance"];
  expect(kfapOther.reasons.join(" ")).not.toMatch(/post-secondary students/i);
});
