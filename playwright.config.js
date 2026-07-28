const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  fullyParallel: false,
  // On CI the default reporter writes failures only into the job log, which is
  // not readable without a token — a failure there is undiagnosable from
  // outside. The built-in "github" reporter emits ::error:: annotations that
  // carry the file, line and message, and those ARE readable through the public
  // check-runs annotations API. Keep "line" alongside it for the log itself.
  reporter: process.env.CI ? [["github"], ["line"]] : "line",
  // Never retry. A retried flake reads as a pass and hides exactly the timing
  // fragility TEST-02 exists to remove.
  retries: 0,
  use: {
    headless: true,
    // Traces are uploaded as an artifact on failure; cheap because they are
    // only recorded for tests that actually fail.
    trace: "retain-on-failure",
  },

  projects: [
    {
      // The product suite. A plain static server is enough here and is fast.
      name: "app",
      testDir: "./e2e",
      testIgnore: "**/worker/**",
      use: { baseURL: "http://127.0.0.1:8766" },
    },
    {
      // TEST-02: the static server serves no _headers and no Worker, so the
      // production CSP, the security headers and every /api/* contract were
      // invisible to the suite. REL-05 — the crash-recovery button broken by the
      // real CSP — shipped and lived in production for exactly that reason.
      // These run against `wrangler dev`, which applies _headers and runs the
      // actual Worker.
      name: "worker",
      testDir: "./e2e/worker",
      use: { baseURL: "http://127.0.0.1:8788" },
    },
  ],

  webServer: [
    {
      command: "python3 -m http.server 8766 --directory public",
      url: "http://127.0.0.1:8766",
      reuseExistingServer: true,
      timeout: 15_000,
    },
    {
      // --local keeps this offline and credential-free: KV, send_email, the rate
      // limiter and assets are all simulated. The AI binding is "not supported"
      // locally, which is why no test here exercises a successful /api/ask; the
      // contracts that matter (origin, method, body size) all resolve before the
      // AI binding is ever touched.
      command: "npx wrangler dev --port 8788 --local",
      url: "http://127.0.0.1:8788/api/link-health",
      reuseExistingServer: true,
      timeout: 90_000,
    },
  ],
});
