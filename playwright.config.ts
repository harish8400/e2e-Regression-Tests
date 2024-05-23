import { defineConfig, devices } from '@playwright/test';
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Run tests in files in parallel
  forbidOnly: !!process.env.CI, // Fail the build on CI if you accidentally left test.only in the source code.
  retries: process.env.CI ? 1 : 0, // Retry on CI only
  workers: process.env.CI ? 2 : undefined, // Set level of parallel tests on CI - 0 is recommended unless self hosted like GROW is.
  reporter: [["html"], ["line"], ["allure-playwright"], ["junit", { outputFile: "test-results/junit.xml" }]], // Reporter to use. See https://playwright.dev/docs/test-reporters
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: process.env.CI ? true : false,
    trace: 'on-first-retry', // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
  },

  projects: [ // Configure projects for major browsers
    { name: 'setup', testMatch: /.*\.setup\.ts/ }, // Setup project
    {
      name: 'setup_api',
      testMatch: /.*setup\.api.ts/
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chromium'],
        storageState: 'playwright/.auth/user.json', // Use prepared auth state.
        viewport: null,

        launchOptions: {
          args: ["--start-maximized"]
        },
        video: "on",
        screenshot: "on",
        actionTimeout: 10 * 1000, // 10 seconds
      },
      dependencies: ['setup'],
    }
  ],

  timeout: 10 * 60 * 1000 // 10 minutes
});