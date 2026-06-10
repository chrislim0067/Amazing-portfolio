import { defineConfig, devices } from '@playwright/test';

const referencePort = 34568;
const devPort = 34567;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 120_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
    colorScheme: 'light',
  },
  webServer: [
    {
      command: `node scripts/serve-reference.mjs`,
      port: referencePort,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      port: devPort,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
