import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/environments';

/**
 * Playwright configuration
 * Projects are split by test type (ui / api / visual / accessibility) so each
 * can be run, reported on, and parallelized independently — mirrors how a
 * real pipeline stages fast feedback (API/smoke) before slower cross-browser runs.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: config.retries,
  workers: config.workers,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: config.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    headless: config.headless,
  },

  projects: [
    // ---- UI: cross-browser desktop ----
    {
      name: 'chromium-ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'] },
    },
    // ---- UI: mobile viewport ----
    {
      name: 'mobile-chrome',
      testDir: './tests/ui',
      grep: /@mobile/,
      use: { ...devices['Pixel 7'] },
    },

    // ---- API: no browser needed, fastest feedback loop ----
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: config.apiBaseUrl },
    },

    // ---- Visual regression ----
    {
      name: 'visual',
      testDir: './tests/visual',
      use: { ...devices['Desktop Chrome'] },
    },

    // ---- Accessibility (axe-core) ----
    {
      name: 'accessibility',
      testDir: './tests/accessibility',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
