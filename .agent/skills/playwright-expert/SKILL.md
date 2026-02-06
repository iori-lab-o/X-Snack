---
name: Playwright Expert
description: E2Eテスト（Playwright）が失敗した際に、原因特定と修正案の提示を行う専門家スキル
---

# Playwright Expert Skill

## 役割
E2Eテスト（Playwright）が失敗した際に、原因特定と修正案の提示を行う専門家。

## 能力

### 1. トレース分析
- `test-results/` ディレクトリ内のアーティファクトを確認し、失敗時のスクリーンショットやトレースログを分析する。
- スクリーンショットから視覚的な不具合やレイアウト崩れを特定する。
- トレースファイル（`.zip`）を展開し、ネットワークリクエストやコンソールエラーを調査する。

### 2. タイミング診断
- Headlessモード特有のタイミング問題を検出する。
- `await` 漏れによるレースコンディションを特定する。
- `waitForSelector`, `waitForNavigation`, `waitForLoadState` の適切な使用を提案する。
- ネットワーク待機（`waitForResponse`）の不足を指摘する。

### 3. セレクタ修正
- DOM構造の変化により無効になったセレクタを特定する。
- `data-testid` の欠落や変更を検出し、修正コードを提案する。
- より堅牢なセレクタ戦略（ロール、ラベル、テストID）への移行を推奨する。

## 使用タイミング
- `pnpm test:e2e` が失敗した時。
- ユーザーから「テストがなぜ落ちたか調べて」と指示された時。
- CI/CDパイプラインでE2Eテストが失敗した時。

## 診断手順

### Step 1: エラーメッセージの確認
テスト出力からエラーの種類を分類する：
- `TimeoutError`: 要素が見つからない、またはタイミング問題
- `AssertionError`: 期待値と実際値の不一致
- `Error: page.click`: クリック対象の要素が無効

### Step 2: アーティファクトの調査
```bash
# スクリーンショットの確認
ls -la test-results/**/

# トレースがある場合は確認
npx playwright show-trace test-results/**/trace.zip
```

### Step 3: 原因分析と修正案の提示
エラータイプに応じた具体的な修正コードを提案する。

## 一般的な問題と解決策

### タイミング問題
```typescript
// ❌ 問題: 要素が表示される前にクリック
await page.click('#button');

// ✅ 解決: 要素の表示を待つ
await page.waitForSelector('#button', { state: 'visible' });
await page.click('#button');
```

### セレクタの脆弱性
```typescript
// ❌ 問題: 構造に依存したセレクタ
await page.click('div > div > button');

// ✅ 解決: data-testid を使用
await page.click('[data-testid="submit-button"]');
```

### ネットワーク待機
```typescript
// ❌ 問題: APIレスポンスを待たずに進行
await page.click('#submit');
expect(page.locator('#result')).toBeVisible();

// ✅ 解決: レスポンスを待つ
await Promise.all([
  page.waitForResponse('**/api/submit'),
  page.click('#submit'),
]);
await expect(page.locator('#result')).toBeVisible();
```
