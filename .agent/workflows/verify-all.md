---
description: Lint、Unit Test、E2E Test を一括で実行し、プロジェクトの品質を確認します。
---

# 全体検証ワークフロー

このワークフローは、コードの品質と動作が正常であることを確認するために必要なすべてのテストとチェックを実行します。

## 1. 静的解析 (Lint & Format)
// turbo
1. `pnpm lint` を実行して、コードスタイルと構文に問題がないか確認します。
2. 問題がある場合は `pnpm lint:fix` で自動修正を試みてください。

## 2. ユニットテスト
API と Client のロジックを個別に検証します。

// turbo
1. `pnpm --filter api test` (API のテスト)
2. `pnpm --filter client test` (Client のテスト)

## 3. E2E テスト
Playwright を使用して、実際のブラウザでの動作を検証します。

// turbo
1. `pnpm dev` で開発サーバーを起動した状態で、
2. `pnpm test:e2e` を実行してブラウザテストを行います。
