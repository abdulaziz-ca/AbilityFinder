"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const {
  assertGroundingNarrativeSafe,
  prohibitedGroundingMatches,
  redactGroundingNarrative,
} = require("../scripts/benefits-context-safety");

const ROOT = path.join(__dirname, "..");

function generatedContext() {
  const source = fs
    .readFileSync(path.join(ROOT, "src", "benefits-context.js"), "utf8")
    .replace(/\bexport const /g, "globalThis.");
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context);
  return context;
}

function loadWorkerForTest(generated) {
  let source = fs.readFileSync(path.join(ROOT, "src", "index.js"), "utf8");
  source = source
    .replace(
      /import\s*\{[\s\S]*?\}\s*from\s*"\.\/benefits-context\.js";/,
      "const { BENEFITS_CONTEXT, BENEFIT_DETAILS, BENEFITS_SCOPE, PRACTITIONER_FORM_CONTEXT } = globalThis.__benefits;"
    )
    .replace(
      /import\s*\{\s*runLinkCheck,\s*REPORT_KEY\s*\}\s*from\s*"\.\/link-check\.js";/,
      "const { runLinkCheck, REPORT_KEY } = globalThis.__linkCheck;"
    )
    .replace(/\bexport default\s*\{/, "globalThis.__worker = {");

  const context = {
    __benefits: generated,
    __linkCheck: { runLinkCheck: async () => {}, REPORT_KEY: "test-report" },
    console,
    Headers,
    ReadableStream,
    Request,
    Response,
    TextDecoder,
    TextEncoder,
    URL,
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.__worker;
}

test("grounding redaction covers money, percentages, age limits, cutoffs, and phone numbers", () => {
  const unsafe = [
    "$2,450.40 per year",
    "CAD 200",
    "£20",
    "twenty Canadian dollars",
    "75%",
    "75 / 50 / 25%",
    "twenty per cent",
    "half-price",
    "under 18",
    "age sixteen",
    "19+",
    "ages 6-18",
    "18th birthday",
    "income under 45,000",
    "1-800-555-0199",
    "dial 2-1-1",
  ].join(" · ");

  const redacted = redactGroundingNarrative(unsafe);
  assert.deepEqual(prohibitedGroundingMatches(redacted), []);
  assert.match(redacted, /\[amount — see the guide\]/);
  assert.match(redacted, /\[percentage — see the guide\]/);
  assert.match(redacted, /\[age limit — see the guide\]/);
  assert.match(redacted, /\[cutoff — see the guide\]/);
  assert.match(redacted, /\[phone — see the guide\]/);
  assert.doesNotMatch(redacted, /75\s*\/\s*50|2-1-1|%/);
});

test("the safety assertion fails closed when prohibited facts survive", () => {
  assert.throws(
    () => assertGroundingNarrativeSafe("Recipients receive $200 and must be under 18.", "fixture"),
    /fixture contains prohibited numeric or contact facts/
  );
});

test("generated narrative grounding contains no prohibited numeric or contact facts", () => {
  const generated = generatedContext();

  assertGroundingNarrativeSafe(generated.BENEFITS_CONTEXT, "catalogue");
  for (const [id, detail] of Object.entries(generated.BENEFIT_DETAILS)) {
    assertGroundingNarrativeSafe(detail.name, `${id} name`);
    assertGroundingNarrativeSafe(detail.text, `${id} detail`);
    if (detail.phone) {
      assert.equal(typeof detail.phone, "string");
      assert.ok(detail.phone.trim(), `${id} contact is an explicit typed field`);
      assert.doesNotMatch(detail.text, new RegExp(detail.phone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
});

test("assistant scope is generated from the live BC catalogue switch", () => {
  const generated = generatedContext();
  const worker = fs.readFileSync(path.join(ROOT, "src", "index.js"), "utf8");

  assert.equal(generated.BENEFITS_SCOPE.bcEnabled, true);
  assert.deepEqual(
    Array.from(generated.BENEFITS_SCOPE.provinces),
    ["Alberta", "British Columbia"]
  );
  assert.match(worker, /BENEFITS_SCOPE\.label/);
  assert.match(worker, /BENEFITS_SCOPE\.provinces/);
  assert.doesNotMatch(worker, /Scope is Alberta and federal Canada only/);
});

test("Worker sends the generated BC scope and redacted catalogue to AI", async () => {
  const generated = generatedContext();
  const worker = loadWorkerForTest(generated);
  let requestOptions;
  const aiStream = {
    async *[Symbol.asyncIterator]() {
      yield new TextEncoder().encode('data: {"response":"Please open the guide."}\n\n');
      yield new TextEncoder().encode("data: [DONE]\n\n");
    },
  };
  const env = {
    AI: {
      async run(_model, options) {
        requestOptions = options;
        return aiStream;
      },
    },
    ASK_LIMIT: { async limit() { return { success: true }; } },
    ASSETS: { async fetch() { return new Response("asset"); } },
  };
  const request = new Request("https://abilityfinder.ca/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Connecting-IP": "192.0.2.1",
      "Origin": "https://abilityfinder.ca",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Does AbilityFinder cover British Columbia?" }],
    }),
  });

  const response = await worker.fetch(request, env);
  const body = await response.text();
  const system = requestOptions.messages[0].content;
  const catalogue = system
    .split("## THE BENEFIT LIST — YOUR ONLY SOURCE OF TRUTH")[1]
    .split("## FORMS A PRACTITIONER MUST SIGN")[0];

  assert.equal(response.status, 200);
  assert.match(body, /Please open the guide\./);
  assert.match(system, /Alberta, British Columbia, and federal Canada/);
  assert.match(system, /outside Alberta and British Columbia/);
  assertGroundingNarrativeSafe(catalogue, "Worker catalogue prompt");
});

test("Worker preserves zero-valued fragmented AI tokens instead of dropping them", async () => {
  const generated = generatedContext();
  const worker = loadWorkerForTest(generated);
  const aiStream = {
    async *[Symbol.asyncIterator]() {
      yield new TextEncoder().encode('data: {"response":"Form T"}\n');
      yield new TextEncoder().encode('data: {"response":0}\n');
      yield new TextEncoder().encode('data: {"response":" is only an SSE fixture."}\n');
      yield new TextEncoder().encode("data: [DONE]\n\n");
    },
  };
  const env = {
    AI: { async run() { return aiStream; } },
    ASK_LIMIT: { async limit() { return { success: true }; } },
    ASSETS: { async fetch() { return new Response("asset"); } },
  };
  const request = new Request("https://abilityfinder.ca/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://abilityfinder.ca",
    },
    body: JSON.stringify({ messages: [{ role: "user", content: "Which form?" }] }),
  });

  const response = await worker.fetch(request, env);
  const body = await response.text();

  assert.match(body, /Form T/);
  assert.match(body, /"0"/);
  assert.match(body, /event: done/);
});
