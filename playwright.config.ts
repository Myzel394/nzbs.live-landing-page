import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const desktop = { width: 1440, height: 900 };

// Chromium always; Firefox and WebKit (Safari's engine) with ALL_BROWSERS=1, as `just e2e-browsers` does.
const otherBrowsers = process.env.ALL_BROWSERS
  ? [
      { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: desktop } },
      { name: "webkit", use: { ...devices["Desktop Safari"], viewport: desktop } },
      { name: "iphone", use: { ...devices["iPhone 15"] } },
    ]
  : [];

// Runs against the production build, as the Next.js testing guide recommends.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: desktop } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    ...otherBrowsers,
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
