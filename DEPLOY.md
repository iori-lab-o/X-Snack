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

## X風要約AI 用の追加設定

### 1. KV Namespace の作成

```bash
cd apps/api

# 本番用KVネームスペースを作成
pnpm wrangler kv:namespace create RATE_LIMIT_KV --preview false

# 出力例:
# 🌀 Creating namespace with title "api-RATE_LIMIT_KV"
# ✨ Success!
# Add the following to your configuration file in your kv_namespaces array:
# { binding = "RATE_LIMIT_KV", id = "abc123def456..." }
```

取得したIDを `apps/api/wrangler.jsonc` の `kv_namespaces` に設定:

```jsonc
"kv_namespaces": [
  {
    "binding": "RATE_LIMIT_KV",
    "id": "abc123def456..."  // 取得したIDに置き換え
  }
]
```

### 2. AI Secrets の設定

#### Gemini API Key（必須推奨）

```bash
cd apps/api

# Gemini APIキーを設定
pnpm wrangler secret put GEMINI_API_KEY
# プロンプト: 「Enter a secret value:」でキーを入力
# 取得先: https://aistudio.google.com/app/apikey
```

#### Hugging Face Token（オプション）

```bash
# Hugging Face APIトークンを設定（オプション、トークンなしでも動作）
pnpm wrangler secret put HUGGINGFACE_API_TOKEN
# 取得先: https://huggingface.co/settings/tokens
```

#### Workers AI（自動設定）

`wrangler.jsonc` に以下が設定されていることを確認:

```jsonc
"ai": {
  "binding": "AI"
}
```

これにより、Cloudflare Workers AIが自動的に有効化されます（10k Neurons/日まで無料、超過時は自動停止）。

### 3. 設定の確認

```bash
# シークレット一覧を表示
pnpm wrangler secret list

# 期待される出力:
# GEMINI_API_KEY
# HUGGINGFACE_API_TOKEN (設定した場合)
```

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

または、`wrangler.jsonc` の `vars` で `ALLOWED_ORIGINS` を設定:

```jsonc
"vars": {
  "ALLOWED_ORIGINS": "https://your-domain.com,https://www.your-domain.com"
}
```

### X風要約AIが動作しない

#### Gemini API エラー

```bash
# シークレットが正しく設定されているか確認
pnpm wrangler secret list | grep GEMINI

# 再設定
pnpm wrangler secret put GEMINI_API_KEY
```

#### KV Namespace エラー

```bash
# KVネームスペースが存在するか確認
pnpm wrangler kv:namespace list

# wrangler.jsonc のIDが正しいか確認
cat wrangler.jsonc | grep -A 3 kv_namespaces
```

#### Workers AI エラー

- `wrangler.jsonc` に `"ai": {"binding": "AI"}` が設定されているか確認
- Cloudflare Dashboardで Workers AI が有効化されているか確認
- 無料枠（10k Neurons/日）超過時は自動停止（課金されません）

#### レート制限が機能しない

- KV Namespaceが正しく作成・バインドされているか確認
- `cf-connecting-ip` ヘッダーが取得できているか確認（Cloudflare経由のみ）
- ローカル開発時は `unknown` IPとして扱われます

### コスト管理

#### 完全無料運用の確認

1. **Gemini API**: <https://aistudio.google.com/app/apikey> で使用量確認
   - 無料枠: 60リクエスト/分
   - 超過時: 自動的に次のプロバイダーへ

2. **Workers AI**: Cloudflare Dashboard → Workers & Pages → AI
   - 無料枠: 10,000 Neurons/日
   - 設定: 無料枠超過時は自動停止（課金なし）

3. **Hugging Face**: 完全無料（レート制限のみ）

**重要**: 上記設定により、どのシナリオでも課金は発生しません。
