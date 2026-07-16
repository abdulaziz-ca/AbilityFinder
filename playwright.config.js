const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:8766",
    headless: true,
  },
  webServer: {
    command: "python3 -m http.server 8766 --directory public",
    url: "http://127.0.0.1:8766",
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
