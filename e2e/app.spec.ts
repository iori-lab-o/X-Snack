import { expect, test } from '@playwright/test';

test.describe('Expo + Cloudflare Workers 連携', () => {
  test('トップページが表示され、API から greeting を取得できる', async ({ page }) => {
    // Web アプリを開く
    await page.goto('/');

    // タイトルを確認
    await expect(page.getByText(/Expo \+ Cloudflare Workers/i)).toBeVisible();

    // API からデータを取得するまで待機（最大10秒）
    // 実際の API レスポンス: "Hello from modern Hono & Cloudflare!"
    await expect(page.getByText(/Hello from modern Hono & Cloudflare!/i)).toBeVisible({
      timeout: 10000,
    });

    // エラーが表示されていないことを確認
    await expect(page.getByText(/❌/)).not.toBeVisible();
  });

  test('Retry ボタンが動作する（エラー時）', async ({ page }) => {
    // API をブロックしてエラー状態を作る
    await page.route('**/api/greeting', (route) => route.abort());

    await page.goto('/');

    // エラーメッセージを確認
    await expect(page.getByText(/❌/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/再試行/i)).toBeVisible();

    // API ブロックを解除
    await page.unroute('**/api/greeting');

    // Retry ボタンをクリック
    await page.getByText(/再試行/i).click();

    // 成功メッセージを確認
    await expect(page.getByText(/Hello from modern Hono & Cloudflare!/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test('API サーバー情報が表示される', async ({ page }) => {
    await page.goto('/');

    // API URL が表示されることを確認
    await expect(page.getByText(/API:/i)).toBeVisible();
    await expect(page.getByText(/localhost:8787/i)).toBeVisible();
  });

  test('ページがレスポンシブである', async ({ page }) => {
    await page.goto('/');

    // デスクトップサイズ
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByText(/Expo \+ Cloudflare Workers/i)).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText(/Expo \+ Cloudflare Workers/i)).toBeVisible();
  });
});
