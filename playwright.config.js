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
    baseURL: "http://127.0.0.1:8766",
    headless: true,
    // Traces are uploaded as an artifact on failure; cheap because they are
    // only recorded for tests that actually fail.
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 8766 --directory public",
    url: "http://127.0.0.1:8766",
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
