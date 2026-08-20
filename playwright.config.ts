import { defineConfig, devices } from "@playwright/test";

const backendUrl = process.env.E2E_BACKEND_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    actionTimeout: 30_000,
    navigationTimeout: 120_000,
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: backendUrl
    ? {
        command: "pnpm dev",
        env: {
          ...process.env,
          API_BASE_URL: backendUrl,
        },
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
