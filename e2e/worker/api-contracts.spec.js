import { test, expect } from "@playwright/test";

const SAME_ORIGIN = "http://127.0.0.1:8788";

function expectNoCorsGrant(response) {
  expect(response.headers()["access-control-allow-origin"]).toBeUndefined();
}

test("security headers are served from _headers", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBeTruthy();

  const csp = response.headers()["content-security-policy"];
  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("script-src 'self'");

  const scriptSrc = csp
    .split(";")
    .map((directive) => directive.trim())
    .find((directive) => /^script-src(?:\s|$)/i.test(directive));
  expect(scriptSrc).toBeTruthy();
  expect(scriptSrc).not.toContain("'unsafe-inline'");

  expect(response.headers()["strict-transport-security"]).toContain("max-age=15552000");
});

test("SEC-02: the assistant API refuses cross-origin and origin-less callers", async ({ request }) => {
  const crossOrigin = await request.post("/api/ask", {
    headers: { Origin: "https://evil.example" },
    data: "{}",
  });
  expect(crossOrigin.status()).toBe(403);
  expect(crossOrigin.headers()["cache-control"]).toBe("no-store");
  expectNoCorsGrant(crossOrigin);

  const originless = await request.post("/api/ask", { data: "{}" });
  expect(originless.status()).toBe(403);
  expect(originless.headers()["cache-control"]).toBe("no-store");
  expectNoCorsGrant(originless);
});

test("SEC-02: a same-origin preflight is allowed without CORS grants", async ({ request }) => {
  const response = await request.fetch("/api/ask", {
    method: "OPTIONS",
    headers: { Origin: SAME_ORIGIN },
  });

  expect(response.status()).toBe(204);
  expectNoCorsGrant(response);
});

test("method handling", async ({ request }) => {
  const response = await request.get("/api/ask", {
    headers: { Origin: SAME_ORIGIN },
  });

  expect(response.status()).toBe(405);
});

test("SEC-04: oversized bodies are refused on both write endpoints", async ({ request }) => {
  const oversizedBody = "x".repeat(65_537);

  for (const endpoint of ["/api/ask", "/api/feedback"]) {
    const response = await request.post(endpoint, {
      headers: {
        Origin: SAME_ORIGIN,
        "Content-Type": "application/json",
        "Content-Length": String(oversizedBody.length),
      },
      data: oversizedBody,
    });

    expect(response.status(), endpoint).toBe(413);
    const json = await response.json();
    expect(json.error, endpoint).toMatch(/too large/i);
  }
});

test("SEC-04: a small malformed body still reaches validation", async ({ request }) => {
  const response = await request.post("/api/ask", {
    headers: {
      Origin: SAME_ORIGIN,
      "Content-Type": "application/json",
    },
    data: "not-json",
  });

  expect(response.status()).toBe(400);
  expect(response.status()).not.toBe(413);
});

test("the link-health report is public and serves from KV", async ({ request }) => {
  const response = await request.get("/api/link-health");
  expect(response.status()).toBe(200);
  await response.json();
});

test("DEPLOY-01: parked data is not served, and real assets are", async ({ request }) => {
  const guide = await request.get("/guides/aish");
  expect(guide.status()).toBe(200);

  const parkedData = await request.get("/data-provinces-later.js");
  expect(parkedData.status()).toBe(404);

  const missing = await request.get("/nope-does-not-exist");
  expect(missing.status()).toBe(404);
});
