# GitHub Secrets 設定手順

このドキュメントでは、X-Snack の自動デプロイに必要な GitHub Secrets の設定方法を説明します。

## 📋 必要なシークレット

| シークレット名 | 説明 | 必須 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Workers へのデプロイ権限を持つトークン | ✅ 必須 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare アカウント ID | ✅ 必須 |

## 🔧 設定手順

### 1. Cloudflare API Token の取得

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 右上のアカウントアイコン → **My Profile** をクリック
3. 左メニューから **API Tokens** を選択
4. **Create Token** をクリック
5. **Edit Cloudflare Workers** テンプレートの **Use template** をクリック
6. 権限を確認（以下が必要）:
   - **Account** → **Cloudflare Workers Scripts** → **Edit**
   - **Zone** → **Workers Routes** → **Edit** (オプション)
7. **Account Resources** で対象のアカウントを選択
8. **Continue to summary** → **Create Token** をクリック
9. 表示されたトークンをコピー（⚠️ この画面を閉じると二度と表示されません）

### 2. Cloudflare Account ID の取得

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 右側のサイドバーに **Account ID** が表示されています
   - または Workers & Pages → 任意のプロジェクト → 右側のサイドバー
3. **Account ID** をコピー

### 3. GitHub Secrets への登録

#### 方法A: Web UIから設定（推奨）

1. GitHub リポジトリ（[https://github.com/iori-lab-o/X-Snack](https://github.com/iori-lab-o/X-Snack)）にアクセス
2. **Settings** タブをクリック
3. 左メニューから **Secrets and variables** → **Actions** を選択
4. **New repository secret** をクリック
5. 以下の2つのシークレットを登録:

**シークレット 1:**

- Name: `CLOUDFLARE_API_TOKEN`
- Secret: 手順1でコピーしたトークン
- **Add secret** をクリック

**シークレット 2:**

- Name: `CLOUDFLARE_ACCOUNT_ID`
- Secret: 手順2でコピーしたAccount ID
- **Add secret** をクリック

#### 方法B: GitHub CLI から設定

```bash
# GitHub CLI がインストールされている場合
gh secret set CLOUDFLARE_API_TOKEN
# トークンを貼り付けて Enter

gh secret set CLOUDFLARE_ACCOUNT_ID
# Account ID を貼り付けて Enter
```

## ✅ 設定確認

### 1. Secrets が登録されているか確認

1. GitHub リポジトリの **Settings** → **Secrets and variables** → **Actions**
2. 以下の2つが表示されていればOK:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

### 2. デプロイワークフローのテスト

#### 手動トリガーでテスト

1. GitHub リポジトリの **Actions** タブをクリック
2. 左メニューから **Deploy to Cloudflare Workers** を選択
3. **Run workflow** → ブランチ `main` を選択 → **Run workflow** をクリック
4. ワークフローが成功すれば設定完了 ✅

#### 自動トリガーでテスト

```bash
# ローカルで適当な変更をコミット
git add .
git commit -m "test: GitHub Actions デプロイテスト"
git push origin main

# GitHub Actions のログを確認
# https://github.com/iori-lab-o/X-Snack/actions
```

## 🔒 セキュリティのベストプラクティス

### ✅ 実施済み

- API Token は Workers 専用の権限のみ付与
- Secrets は暗号化されて保存
- ワークフローログには表示されない（マスク処理）

### 📝 推奨事項

- **API Token の定期的なローテーション**: 3-6ヶ月ごと
- **最小権限の原則**: 必要最低限の権限のみ付与
- **Token の有効期限設定**: 可能であれば期限付きトークンを使用

## 🐛 トラブルシューティング

### エラー: `Authentication error`

**原因**: API Token が無効または権限不足

**対処法**:

1. Token を再生成
2. 権限に **Workers Scripts: Edit** が含まれているか確認
3. GitHub Secrets を更新

### エラー: `Account ID not found`

**原因**: Account ID が間違っている

**対処法**:

1. Cloudflare Dashboard で正しい Account ID をコピー
2. GitHub Secrets を更新

### デプロイは成功するがアプリが動かない

**原因**: Cloudflare Workers の環境変数（Secrets）が未設定

**対処法**:

1. Cloudflare Dashboard → Workers & Pages → `expo-workers-api`
2. **Settings** → **Variables** タブ
3. 以下を設定:
   - `GEMINI_API_KEY` (必須)
   - `HUGGINGFACE_API_TOKEN` (オプション)
   - `ALLOWED_ORIGINS` (必須)

または CLI から:

```bash
cd apps/api
pnpm wrangler secret put GEMINI_API_KEY
pnpm wrangler secret put ALLOWED_ORIGINS
```

## 📚 関連ドキュメント

- [DEPLOY.md](DEPLOY.md): 詳細なデプロイ手順
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml): ワークフロー定義
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/): 公式ドキュメント

---

**最終更新**: 2025-12-12
