import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/member3",
  workers: 1,
  outputDir: ".tooling/test-results",
  use: {
    baseURL: "http://127.0.0.1:8093",
    viewport: { width: 390, height: 844 },
    channel: process.platform === "win32" ? "msedge" : undefined,
  },
  webServer: {
    command: "node scripts/serve-member3.cjs",
    url: "http://127.0.0.1:8093/payment",
    reuseExistingServer: false,
  },
});
