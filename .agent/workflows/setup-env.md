---
description: 環境変数（特に Gemini API Key）の設定と検証をガイドします。
---

# 環境変数セットアップ・ワークフロー

このワークフローは、X-Snack の要約機能に必要な Gemini API Key などの環境変数を設定し、動作を確認する手順をガイドします。

## 1. Gemini API Key の取得
// turbo
1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセスして、無料の API キーを取得してください。

## 2. ローカル環境変数の設定
`apps/api/.dev.vars` ファイルを作成（または編集）し、取得したキーを設定します。

```bash
# apps/api/.dev.vars
GEMINI_API_KEY=あなたのAPIキー
```

## 3. 設定の検証
API を起動して、設定が正しく読み込まれているか確認します。

// turbo
1. `pnpm --filter api dev` を実行して API を起動します。
2. 別のターミナルで `curl http://localhost:8787/health` を実行し、`success: true` が返ってくることを確認してください。

## 4. 本番環境（Cloudflare）への設定
デプロイ時にも必要となるため、Cloudflare Workers の Secret として登録します。

// turbo
1. `cd apps/api && pnpm wrangler secret put GEMINI_API_KEY` を実行し、指示に従ってキーを入力してください。
