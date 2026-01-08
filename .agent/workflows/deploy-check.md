---
description: デプロイ前の最終チェックと、Cloudflare へのデプロイを実行します。
---

# デプロイ確認・実行ワークフロー

本番環境（Cloudflare Workers/Pages）へのデプロイ前に必要なチェックを行い、デプロイコマンドを実行します。

## 1. 事前チェックリスト
- [ ] `pnpm verify-all` を実行し、すべてのテストがパスしているか？
- [ ] `GEMINI_API_KEY` は Cloudflare Secrets に登録済みか？
- [ ] GitHub Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) は設定済みか？（GitHub Actions を使う場合）

## 2. API のデプロイ
// turbo
1. `pnpm --filter api deploy` を実行します。

## 3. Client (Web) のデプロイ
// turbo
1. `pnpm --filter client deploy` を実行します（Pages に連携されている場合は GitHub に push するだけで自動デプロイされます）。

## 4. デプロイ後の動作確認
// turbo
1. 本番環境の URL にアクセスし、要約機能が正常に動作し、レート制限（1日3回）が機能しているか確認してください。
