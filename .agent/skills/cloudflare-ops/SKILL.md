---
name: Cloudflare Ops
description: Cloudflare Workers/Pages へのデプロイ前後の環境確認とトラブルシュートを行う専門家スキル
---

# Cloudflare Ops Skill

## 役割
Cloudflare Workers/Pages へのデプロイ前後の環境確認とトラブルシュートを行う専門家。

## 能力

### 1. 環境変数チェック
- `wrangler secret list` を実行し、必須Secretが存在するか検証する。
- 必須Secret一覧:
  - `GEMINI_API_KEY`: Gemini API認証用
- ローカルの `.dev.vars` と本番環境のSecretの整合性を確認する。

### 2. ログ監視
- デプロイ直後に `wrangler tail` を使用して、リアルタイムログを確認する。
- 本番環境でのエラーを検出する：
  - レート制限（429 Too Many Requests）
  - 認証エラー（401 Unauthorized）
  - 内部エラー（500 Internal Server Error）
- エラーパターンから根本原因を推測する。

### 3. デプロイエラー解析
認証エラー（Code 10000番台）やバインディングエラーが発生した際の対処法を提示する。

| エラーコード | 原因 | 対処法 |
|------------|------|--------|
| 10000 | 認証失敗 | `wrangler login` を再実行、またはAPIトークンを確認 |
| 10001 | 権限不足 | Cloudflareダッシュボードでトークン権限を確認 |
| 10002 | アカウントID不正 | `wrangler.jsonc` の `account_id` を確認 |
| 10021 | バインディングエラー | KV/D1/R2の設定名とリソースの存在を確認 |

## 使用タイミング
- `/deploy-check` ワークフロー実行前。
- `wrangler deploy` が失敗した時。
- 本番環境の挙動がおかしい時（エラーが多発、レスポンスが遅いなど）。

## 診断手順

### Step 1: デプロイ前チェック
```bash
# 認証状態の確認
wrangler whoami

# Secretの一覧確認
wrangler secret list

# 設定ファイルの検証
cat wrangler.jsonc
```

### Step 2: デプロイ実行とログ監視
```bash
# デプロイ実行
wrangler deploy

# リアルタイムログの確認（エラー発生時）
wrangler tail --format pretty
```

### Step 3: エラー分析
エラーメッセージから原因を特定し、上記の対処法テーブルに基づいて修正案を提示する。

## 一般的な問題と解決策

### 認証エラー
```bash
# ❌ エラー: Authentication error
✘ [ERROR] A request to the Cloudflare API failed.

# ✅ 解決: 再ログイン
wrangler login
# または CI/CD環境の場合
# CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID を確認
```

### Secret未設定
```bash
# ❌ エラー: Missing secret
Error: Missing required secret: GEMINI_API_KEY

# ✅ 解決: Secretを設定
wrangler secret put GEMINI_API_KEY
# 値を入力
```

### 互換性日付エラー
```jsonc
// ❌ wrangler.jsonc に古い日付
"compatibility_date": "2023-01-01"

// ✅ 最新の安定日付に更新
"compatibility_date": "2024-09-23"
```

### KV/バインディングエラー
```bash
# ❌ エラー: Could not find binding
Error: Could not find binding 'MY_KV' in your Wrangler configuration.

# ✅ 解決: wrangler.jsonc にバインディングを追加
# または Cloudflareダッシュボードでリソースを作成
wrangler kv namespace create MY_KV
```
