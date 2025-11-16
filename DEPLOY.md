# Cloudflare Workers デプロイ手順

このプロジェクトは GitHub Actions による自動デプロイが設定されています。

## 前提条件

1. **Cloudflare アカウント**
   - [Cloudflare](https://dash.cloudflare.com/sign-up) でアカウントを作成

2. **API トークンの取得**
   - Cloudflare Dashboard → My Profile → API Tokens
   - "Create Token" → "Edit Cloudflare Workers" テンプレートを使用
   - 必要な権限:
     - Account: Workers Scripts (Edit)
     - Zone: Workers Routes (Edit) ※カスタムドメインを使う場合

3. **アカウント ID の取得**
   - Cloudflare Dashboard → Workers & Pages → 右側に表示される "Account ID"

## GitHub Secrets の設定

リポジトリの Settings → Secrets and variables → Actions で以下を追加:

- `CLOUDFLARE_API_TOKEN`: 上記で取得した API トークン
- `CLOUDFLARE_ACCOUNT_ID`: 上記で取得したアカウント ID

## デプロイ方法

### 自動デプロイ（推奨）

`main` ブランチへの push で自動的にデプロイされます:

```bash
git add .
git commit -m "feat: 新機能を追加"
git push origin main
```

### 手動デプロイ

GitHub の Actions タブから "Deploy to Cloudflare Workers" を選択し、"Run workflow" をクリック。

### ローカルからデプロイ

```bash
# API ディレクトリで実行
cd apps/api
pnpm wrangler deploy

# または、ルートから
pnpm --filter api deploy
```

## デプロイ後の確認

デプロイが成功すると、Cloudflare Workers の URL が表示されます:

```text
https://api.<your-subdomain>.workers.dev
```

API の動作確認:

```bash
curl https://api.<your-subdomain>.workers.dev/api/greeting
```

## カスタムドメインの設定（任意）

1. Cloudflare Dashboard → Workers & Pages → あなたの Worker
2. Settings → Triggers → Custom Domains
3. "Add Custom Domain" でドメインを追加

## トラブルシューティング

### デプロイが失敗する

- GitHub Secrets が正しく設定されているか確認
- API トークンの権限が正しいか確認
- Cloudflare アカウントが Workers を有効化しているか確認

### デプロイ後に 404 エラー

- `wrangler.jsonc` の `name` が一意であることを確認
- ルート設定が正しいか確認

### CORS エラー

本番環境用に `apps/api/src/index.ts` の CORS 設定を調整してください:

```typescript
app.use('/*', cors({
  origin: ['https://your-production-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
```
