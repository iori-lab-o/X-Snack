# TODO リスト

## ✅ 完了 (2025/11/16)

### コア機能実装

- [x] X風要約AI機能の完全実装（マルチプロバイダーフォールバック）
  - Gemini → Workers AI → Hugging Face → Mock の4段階フォールバック
  - IP別レート制限（1日3回、KV使用）
  - 280字以内の要約、ハッシュタグ2-3個、絵文字最大2個

### テスト環境整備

- [x] APIテスト: 6/6 passing（Vitest）
- [x] Clientテスト: 4/4 passing（Vitest + React Testing Library）
- [x] TypeScriptエラー全修正
- [x] Markdown lintエラー全修正

### ドキュメント整備

- [x] README.md: AI機能詳細、セットアップ手順
- [x] AGENT.md: AI実装仕様、環境変数設定
- [x] DEPLOY.md: デプロイ手順、シークレット設定
- [x] copilot-instructions.md: AI開発ガイド

### ローカル開発環境セットアップ（一部完了）

- [x] KV Namespace作成完了
  - ID: `52ae784c023c4275b480bc178bd5887d`
  - wrangler.jsonc に設定済み
- [x] .dev.vars ファイル作成済み
- [ ] **次回作業: Gemini API Key の設定**

## 🎯 次回作業（2025/11/17〜）

### 1. Gemini API Key設定（優先度: 最高）

```bash
# 1. Gemini API Keyを取得
# <https://aistudio.google.com/app/apikey> でAPIキーを取得（無料）

# 2. .dev.vars に設定
cd apps/api
nano .dev.vars  # または code .dev.vars

# 以下の行を編集:
GEMINI_API_KEY=実際に取得したAPIキー

# 3. ローカルテスト
cd ../..
pnpm dev

# 4. Clientで要約機能をテスト
# http://localhost:8081 でテキスト入力して「要約する」
```

### 2. 実際のAI要約テスト（優先度: 高）

- [ ] Gemini APIでの要約動作確認
- [ ] レート制限の動作確認（3回目まで、4回目でエラー）
- [ ] 残り回数表示の確認
- [ ] Workers AIフォールバックの確認（Gemini無効化して試す）

### 3. 本番デプロイ準備（優先度: 中）

```bash
# Cloudflare Secretsの設定
cd apps/api
pnpm wrangler secret put GEMINI_API_KEY
# (オプション) pnpm wrangler secret put HUGGINGFACE_API_TOKEN

# デプロイ
pnpm wrangler deploy
```

## 📋 将来的な作業（優先度: 低）

- [ ] **CI/CD の設定**
  - GitHub Actions で自動テスト（API + Client）を実行（APIは実施済み）
  - Cloudflare Workers へのデプロイ自動化（未着手）

- [ ] **Android 開発環境のセットアップ手順**
  - Android Studio インストールガイド
  - エミュレータ作成手順

- [ ] **追加機能の検討**
  - 認証機能（JWT など）
  - データベース連携（Cloudflare D1 など）
  - 状態管理ライブラリ（Redux, Zustand など）

## 🎯 現在の状態まとめ

### ✅ 完成済み

- コア機能実装（X風要約AI）
- マルチプロバイダーフォールバック
- レート制限（KV設定済み）
- 全テスト合格（10/10）
- ドキュメント完備

### ⚙️ 設定済み

- KV Namespace: `52ae784c023c4275b480bc178bd5887d`
- .dev.vars ファイル作成済み
- wrangler.jsonc 設定完了

### 🔑 次回必須作業

- **Gemini API Key の取得と設定**（<https://aistudio.google.com/app/apikey>）
- ローカルでの動作確認

### 💰 課金について

- **全て無料**: Gemini（60req/min）、Workers AI（10k Neurons/日）、Hugging Face（完全無料）
- **課金なし設定**: 無料枠超過時は自動停止またはフォールバック


