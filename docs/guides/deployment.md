# デプロイガイド

## 概要
このプロジェクトでは、継続的デプロイ（CD）に GitHub Actions を使用しています。

## コンポーネント

### API (Cloudflare Workers)
- **トリガー**: `main` ブランチへのプッシュ。
- **ワークフロー**: `.github/workflows/deploy.yml`
- **コマンド**: `pnpm --filter api deploy`
- **要件**:
  - `CLOUDFLARE_API_TOKEN` (Repository Secret)
  - `CLOUDFLARE_ACCOUNT_ID` (Repository Secret)

### Client (Web)
- 現在は手動またはローカルビルド。
- **将来**: Cloudflare Pages または Vercel との統合。

## セットアップ手順
詳細な手順については [GITHUB_SECRETS_SETUP.md](../../GITHUB_SECRETS_SETUP.md) を参照してください。
