import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E テスト設定
 * Web 版の Expo アプリをテストします
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Dev サーバーを自動起動
  webServer: [
    {
      command: 'pnpm --filter api dev',
      url: 'http://localhost:8787',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'pnpm --filter client web',
      url: 'http://localhost:8081',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
