import { expect, test } from '@playwright/test';

test.describe('Expo + Cloudflare Workers 連携', () => {
  test('トップページが表示され、タイトルが確認できる', async ({ page }) => {
    // Web アプリを開く
    await page.goto('/');

    // タイトルを確認
    await expect(page.getByText(/X風要約AI/i)).toBeVisible();
    await expect(page.getByText(/長文をXの投稿に最適化/i)).toBeVisible();
  });

  test('API サーバー情報が表示される', async ({ page }) => {
    await page.goto('/');

    // フッターの情報を確認
    await expect(page.getByText(/Powered by Cloudflare Workers AI/i)).toBeVisible();
  });

  test('ページがレスポンシブである', async ({ page }) => {
    await page.goto('/');

    // デスクトップサイズ
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByText(/X風要約AI/i)).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText(/X風要約AI/i)).toBeVisible();
  });
});
