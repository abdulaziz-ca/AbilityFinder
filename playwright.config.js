const { defineConfig, devices } = require("@playwright/test");

// TEST-02 step 4: run against all three engines, not just Chromium.
//
// The app is plain HTML/CSS/classic JavaScript with no build, which lowers the
// risk — but it leans on precisely the APIs that diverge between engines:
// IndexedDB (persistence and restore), <dialog>, focus management, native radio
// and checkbox semantics, prefers-reduced-motion, forced-colors, Intl date
// handling and getAnimations().
//
// WebKit matters most here and is not a box-ticking exercise: this is a
// disability product, its audience skews toward iOS, and VoiceOver runs on
// Safari. A defect that only appears in WebKit lands on the users least able to
// work around it. Firefox is nearly free once the matrix exists.
const ENGINES = [
  { id: "chromium", device: devices["Desktop Chrome"] },
  { id: "firefox", device: devices["Desktop Firefox"] },
  { id: "webkit", device: devices["Desktop Safari"] },
];

module.exports = defineConfig({
  testDir: "./e2e",
  // CI runners are materially slower than a dev machine — the same suite takes
  // roughly 1.75x longer there. Some tests legitimately do a lot of work: the
  // age-appropriate-schooling test walks the whole wizard five times, about 55
  // interactions, inside one test. Give CI proportionate headroom rather than
  // trimming coverage or weakening waits to fit an arbitrary limit.
  timeout: process.env.CI ? 90_000 : 45_000,
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

  projects: ENGINES.flatMap((engine) => [
    {
      // The product suite. A plain static server is enough here and is fast.
      name: `app-${engine.id}`,
      testDir: "./e2e",
      testIgnore: "**/worker/**",
      use: { ...engine.device, baseURL: "http://127.0.0.1:8766" },
    },
    {
      // TEST-02: the static server serves no _headers and no Worker, so the
      // production CSP, the security headers and every /api/* contract were
      // invisible to the suite. REL-05 — the crash-recovery button broken by the
      // real CSP — shipped and lived in production for exactly that reason.
      // These run against `wrangler dev`, which applies _headers and runs the
      // actual Worker.
      //
      // Worth running on every engine despite being only 11 tests: CSP
      // enforcement is implemented per-engine, so "the policy is applied" is a
      // claim each browser has to demonstrate for itself.
      name: `worker-${engine.id}`,
      testDir: "./e2e/worker",
      use: { ...engine.device, baseURL: "http://127.0.0.1:8788" },
    },
  ]),

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
