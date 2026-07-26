"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const HSTS = "max-age=15552000";

function generatedContext() {
  const source = fs
    .readFileSync(path.join(ROOT, "src", "benefits-context.js"), "utf8")
    .replace(/\bexport const /g, "globalThis.");
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context);
  return context;
}

function loadWorkerForTest() {
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
    __benefits: generatedContext(),
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

test("canonical HTTP requests use a method-preserving same-path HTTPS redirect", async () => {
  const worker = loadWorkerForTest();
  let assetCalls = 0;
  const env = {
    ASSETS: {
      async fetch() {
        assetCalls += 1;
        return new Response("asset");
      },
    },
  };

  for (const pathName of ["/", "/guides/dtc.html", "/app.js?v=47", "/api/link-health?full=1"]) {
    const response = await worker.fetch(
      new Request(`http://abilityfinder.ca${pathName}`, { method: "GET" }),
      env
    );
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `https://abilityfinder.ca${pathName}`);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal(assetCalls, 0);
});

test("HTTPS Worker and static-asset responses carry the conservative HSTS policy", async () => {
  const worker = loadWorkerForTest();
  const env = {
    ASSETS: {
      async fetch(request) {
        return new Response(`asset:${new URL(request.url).pathname}`, {
          status: 200,
          headers: { "X-Asset-Fixture": "kept" },
        });
      },
    },
    LINK_HEALTH: {
      async get() {
        return JSON.stringify({ status: "ok" });
      },
    },
  };

  for (const pathName of ["/", "/guides/dtc.html", "/app.js?v=47"]) {
    const response = await worker.fetch(
      new Request(`https://abilityfinder.ca${pathName}`),
      env
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("strict-transport-security"), HSTS);
    assert.equal(response.headers.get("x-asset-fixture"), "kept");
    assert.equal(await response.text(), `asset:${new URL(`https://abilityfinder.ca${pathName}`).pathname}`);
  }

  const api = await worker.fetch(
    new Request("https://abilityfinder.ca/api/link-health"),
    env
  );
  assert.equal(api.status, 200);
  assert.equal(api.headers.get("strict-transport-security"), HSTS);
  assert.equal(api.headers.get("cache-control"), "no-store");
});

test("local HTTP development remains usable and does not emit an ineffective HSTS header", async () => {
  const worker = loadWorkerForTest();
  const env = {
    ASSETS: { async fetch() { return new Response("local asset"); } },
  };
  const response = await worker.fetch(new Request("http://127.0.0.1:8787/"), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("strict-transport-security"), null);
  assert.equal(await response.text(), "local asset");
});

test("static assets declare HSTS without preload/subdomain expansion or Worker-first billing pressure", () => {
  const headers = fs.readFileSync(path.join(ROOT, "public", "_headers"), "utf8");
  const wrangler = fs.readFileSync(path.join(ROOT, "wrangler.jsonc"), "utf8");

  assert.match(headers, /^\s*Strict-Transport-Security:\s*max-age=15552000\s*$/m);
  assert.doesNotMatch(headers, /Strict-Transport-Security:[^\n]*(?:includeSubDomains|preload)/i);
  assert.doesNotMatch(wrangler, /run_worker_first/);
});

test("hostile browser origins are rejected before rate-limit, AI, or email bindings", async () => {
  const worker = loadWorkerForTest();
  const calls = { limit: 0, ai: 0, email: 0 };
  const env = {
    ASSETS: { async fetch() { return new Response("asset"); } },
    ASK_LIMIT: { async limit() { calls.limit += 1; return { success: true }; } },
    AI: { async run() { calls.ai += 1; throw new Error("must not run"); } },
    FEEDBACK_MAIL: { async send() { calls.email += 1; } },
  };

  for (const [pathName, body] of [
    ["/api/ask", { messages: [{ role: "user", content: "Synthetic question" }] }],
    ["/api/feedback", { kind: "feedback", message: "Synthetic feedback" }],
  ]) {
    const response = await worker.fetch(
      new Request(`https://abilityfinder.ca${pathName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://hostile.example",
        },
        body: JSON.stringify(body),
      }),
      env
    );
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("access-control-allow-origin"), null);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.deepEqual(calls, { limit: 0, ai: 0, email: 0 });
});

test("missing, opaque, and malformed browser origins fail closed", async () => {
  const worker = loadWorkerForTest();
  const env = {
    ASSETS: { async fetch() { return new Response("asset"); } },
    ASK_LIMIT: { async limit() { throw new Error("must not run"); } },
  };

  for (const origin of [null, "null", "https://abilityfinder.ca/path", "not a URL"]) {
    const headers = { "Content-Type": "application/json" };
    if (origin !== null) headers.Origin = origin;
    const response = await worker.fetch(
      new Request("https://abilityfinder.ca/api/ask", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: [{ role: "user", content: "Synthetic question" }] }),
      }),
      env
    );
    assert.equal(response.status, 403, String(origin));
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  }
});

test("exact same-origin assistant and feedback requests work without CORS headers", async () => {
  const worker = loadWorkerForTest();
  let emailCalls = 0;
  let aiCalls = 0;
  const aiStream = {
    async *[Symbol.asyncIterator]() {
      yield new TextEncoder().encode('data: {"response":"Open the checked guide."}\n\n');
      yield new TextEncoder().encode("data: [DONE]\n\n");
    },
  };
  const env = {
    ASSETS: { async fetch() { return new Response("asset"); } },
    ASK_LIMIT: { async limit() { return { success: true }; } },
    AI: { async run() { aiCalls += 1; return aiStream; } },
    FEEDBACK_MAIL: { async send() { emailCalls += 1; } },
  };
  const commonHeaders = {
    "Content-Type": "application/json",
    "Origin": "https://abilityfinder.ca",
  };

  const ask = await worker.fetch(
    new Request("https://abilityfinder.ca/api/ask", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ messages: [{ role: "user", content: "Synthetic question" }] }),
    }),
    env
  );
  assert.equal(ask.status, 200);
  assert.equal(ask.headers.get("access-control-allow-origin"), null);
  assert.match(await ask.text(), /Open the checked guide\./);

  const feedback = await worker.fetch(
    new Request("https://abilityfinder.ca/api/feedback", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ kind: "feedback", message: "Synthetic feedback" }),
    }),
    env
  );
  assert.equal(feedback.status, 200);
  assert.equal(feedback.headers.get("access-control-allow-origin"), null);
  assert.equal(feedback.headers.get("cache-control"), "no-store");
  assert.deepEqual({ aiCalls, emailCalls }, { aiCalls: 1, emailCalls: 1 });
});

test("OPTIONS is accepted only from the exact request origin and never enables CORS", async () => {
  const worker = loadWorkerForTest();
  const env = { ASSETS: { async fetch() { return new Response("asset"); } } };

  const sameOrigin = await worker.fetch(
    new Request("http://127.0.0.1:8787/api/feedback", {
      method: "OPTIONS",
      headers: { "Origin": "http://127.0.0.1:8787" },
    }),
    env
  );
  assert.equal(sameOrigin.status, 204);
  assert.equal(sameOrigin.headers.get("allow"), "POST, OPTIONS");
  assert.equal(sameOrigin.headers.get("access-control-allow-origin"), null);

  const hostile = await worker.fetch(
    new Request("https://abilityfinder.ca/api/feedback", {
      method: "OPTIONS",
      headers: { "Origin": "https://hostile.example" },
    }),
    env
  );
  assert.equal(hostile.status, 403);
  assert.equal(hostile.headers.get("access-control-allow-origin"), null);
});

test("feedback subjects allowlist kinds and reject header injection", async () => {
  const worker = loadWorkerForTest();
  let captured;
  const env = {
    ASK_LIMIT: { async limit() { return { success: true }; } },
    FEEDBACK_MAIL: { async send(msg) { captured = msg; } },
  };
  const headers = {
    "Content-Type": "application/json",
    "Origin": "https://abilityfinder.ca",
  };

  const injected = await worker.fetch(
    new Request("https://abilityfinder.ca/api/feedback", {
      method: "POST",
      headers,
      body: JSON.stringify({
        kind: "Bug\r\nBcc: attacker@evil.com",
        email: "",
        message: "hello",
      }),
    }),
    env
  );
  assert.equal(injected.status, 200);
  assert.ok(captured);
  assert.equal(captured.subject, "AbilityFinder feedback — Something else");
  assert.equal(/[\r\n]/.test(captured.subject), false);

  const legitimate = await worker.fetch(
    new Request("https://abilityfinder.ca/api/feedback", {
      method: "POST",
      headers,
      body: JSON.stringify({ kind: "Missing benefit", email: "", message: "hello" }),
    }),
    env
  );
  assert.equal(legitimate.status, 200);
  assert.equal(captured.subject, "AbilityFinder feedback — Missing benefit");
});
