# AI エージェント設定

このファイルは、AI エージェントがプロジェクトを理解するための設定ファイルです。

## 出力言語設定

**重要**: すべてのファイル作成・編集時、コミットメッセージは**日本語**で出力してください。

- コード内のコメント: 日本語
- 変数名・関数名: 英語（慣例に従う）
- ドキュメント: 日本語
- コミットメッセージ: 日本語
- このプロジェクトは日本語を標準言語として使用します

## プロジェクト概要

**expo-workers-monorepo**: Expo (React Native) + Cloudflare Workers (Hono) のマルチプラットフォームアプリ開発ボイラープレート。

このプロジェクトは、モバイル（iOS/Android）、Web、API を同一リポジトリで開発できる、すぐに使えるスターターテンプレートです。

## 技術スタック

### API

- **Cloudflare Workers**: エッジコンピューティング環境
- **Hono**: 高速 Web フレームワーク
- **Vitest**: ユニットテスト（6 tests）

### Client

- **Expo ~54.0**: React Native 開発プラットフォーム
- **React 19.1**: UI ライブラリ
- **React Native 0.81**: モバイル UI
- **TypeScript ~5.9**: 型安全
- **Vitest**: ユニットテスト（4 tests）

### 共通

- **pnpm workspace**: モノレポ管理
- **packages/types**: 共有型定義（@expo-workers/types）
- **Playwright**: E2E テスト（4 tests）
- **Biome**: Linter & Formatter（高速な Rust 製ツール）

### CI/CD

- **GitHub Actions**: 自動テスト（API + Client + E2E）
- **Wrangler**: Cloudflare Workers デプロイ

## クイックスタート

```bash
# 1. 依存関係をインストール
pnpm install

# 2. 開発サーバー起動（ワンライナー）
pnpm dev
# → API: http://localhost:8787
# → Client: http://localhost:8081

# 3. Web ブラウザで開く
# Expo のターミナルで 'w' キーを押す
```

## 開発コマンド

### 基本

```bash
# 開発サーバー起動（推奨）
pnpm dev          # API + Client を同時起動（predev で 8787 自動解放）

# 個別起動
pnpm --filter api dev      # API のみ
pnpm --filter client dev   # Client のみ
pnpm --filter client web   # Client Web のみ
```

### テスト

```bash
# ユニットテスト
pnpm --filter api test     # API（Vitest）
pnpm --filter client test  # Client（Vitest + React Testing Library）

# E2E テスト
pnpm test:e2e              # Playwright（Web 版統合テスト）
pnpm test:e2e:ui           # UI モード
pnpm test:e2e:debug        # デバッグモード
```

### Lint & Format

```bash
# Biome を使用（ESLint + Prettier より高速）
pnpm lint                  # チェックのみ
pnpm lint:fix              # 自動修正
pnpm format                # フォーマット
```

### デプロイ

```bash
# Cloudflare Workers にデプロイ
pnpm --filter api deploy

# 詳細は DEPLOY.md を参照
```

## ディレクトリ構造

```txt
expo-workers-monorepo/
├── apps/
│   ├── api/                    # Cloudflare Workers API
│   │   ├── src/
│   │   │   └── index.ts        # API エントリーポイント（Hono）
│   │   ├── test/               # Vitest テスト
│   │   └── wrangler.jsonc      # Workers 設定
│   └── client/                 # Expo アプリ
│       ├── lib/
│       │   └── apiClient.ts    # API クライアントヘルパー
│       ├── __tests__/          # Vitest テスト
│       ├── App.tsx             # メインコンポーネント
│       └── vitest.config.ts    # テスト設定
├── packages/
│   └── types/                  # 共有型定義
│       └── src/
│           └── index.ts        # User, ApiResponse など
├── e2e/                        # Playwright E2E テスト
│   └── app.spec.ts
├── .github/workflows/
│   ├── ci.yml                  # CI（テスト自動実行）
│   └── deploy.yml              # CD（自動デプロイ）
├── README.md                   # プロジェクトガイド
├── DEPLOY.md                   # デプロイ手順
└── TODO.md                     # タスク管理
```

## 環境変数

### Client 環境変数 (.env)

```bash
# apps/client/.env
EXPO_PUBLIC_HONO_API_URL=http://localhost:8787  # 開発環境
# EXPO_PUBLIC_HONO_API_URL=https://your-api.workers.dev  # 本番環境
```

### API 環境変数（X風要約AI用）

#### ローカル開発（apps/api/.dev.vars）

```bash
# Primary AI（必須推奨、無料）
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Tertiary AI（オプション、トークンなしでも動作）
HUGGINGFACE_API_TOKEN=YOUR_HF_TOKEN_HERE
```

#### 本番環境（Cloudflare Secrets）

```bash
# Gemini API Key
pnpm wrangler secret put GEMINI_API_KEY

# Hugging Face Token（オプション）
pnpm wrangler secret put HUGGINGFACE_API_TOKEN
```

#### Cloudflare Bindings（wrangler.jsonc）

```jsonc
{
  "kv_namespaces": [
    {"binding": "RATE_LIMIT_KV", "id": "YOUR_KV_NAMESPACE_ID"}
  ],
  "ai": {"binding": "AI"}  // Workers AI（Secondary、自動有効化）
}
```

**重要**: Workers AIは無料枠超過時に自動停止（課金なし設定）

## 重要な注意事項

1. **開発環境**: Linux (bash)、Android SDK なし → Web モード推奨
2. **起動**: `pnpm dev` で API (8787) と Client (8081) が同時起動
3. **対話メニュー**: Expo の対話キー（w, a, i, r など）が使用可能
4. **API 連携**: `apps/client/lib/apiClient.ts` を通じて API にアクセス
5. **型共有**: `@expo-workers/types` で API と Client の型を共有
6. **ポート管理**: predev スクリプトで 8787 を自動解放（Ctrl+C で終了推奨）

## API エンドポイント

現在実装されているエンドポイント：

- `GET /`: API 情報
- `GET /api/greeting`: サンプル greeting
- `GET /api/users`: ユーザー一覧
- `GET /api/users/:id`: ユーザー詳細
- `POST /api/users`: ユーザー作成
- `GET /health`: ヘルスチェック
- **`POST /api/summarize`: X風要約AI（マルチプロバイダーフォールバック）**

### X風要約AI の実装詳細

#### マルチプロバイダーフォールバック戦略

完全無料・課金なしを実現する3段階フォールバック:

1. **Gemini API** (`gemini-1.5-flash`): Primary、最高品質、60req/min無料
2. **Cloudflare Workers AI** (`llama-3.2-1b-instruct`): Secondary、10k Neurons/日無料、課金なし
3. **Hugging Face** (`google/flan-t5-base`): Tertiary、完全無料、最終手段
4. **Mock応答**: 全AI失敗時のフォールバック

#### レート制限

- **制限**: 1日3回/IP（Cloudflare KVで管理）
- **キー形式**: `rate:{IP}:{YYYY-MM-DD}`
- **TTL**: 86400秒（24時間、UTC 0時に自動リセット）
- **超過時**: HTTP 429、エラーメッセージ、remainingCount: 0

#### 入出力仕様

- **入力制限**: 最大1500文字（超過時は自動トリム）
- **出力形式**: 280字以内（本文 + ハッシュタグ）
- **ハッシュタグ**: 2〜3個、末尾に統一
- **絵文字**: 最大2個
- **重複除去**: ハッシュタグの自動重複削除

#### レスポンスフィールド

- `success`: 成功/失敗
- `data.summary`: 要約本文（280字以内）
- `data.hashtags`: 抽出されたハッシュタグ配列
- `data.characterCount`: 文字数
- `remainingCount`: 残り利用回数（0〜3）
- `provider`: 使用したAI（gemini/workers-ai/huggingface/mock）

## テスト戦略

- **ユニットテスト**: API と Client のコンポーネント・ロジックを個別テスト（Vitest）
- **E2E テスト**: Web 版の完全なユーザーフローをテスト（Playwright）
- **CI**: GitHub Actions で全テストを自動実行

## 次のステップ

1. **API 開発**: `apps/api/src/index.ts` に新しいエンドポイントを追加
2. **Client 開発**: `apps/client/App.tsx` で UI を実装
3. **型共有**: `packages/types/src/index.ts` に共通型を追加
4. **テスト**: `__tests__/` にユニットテスト、`e2e/` に E2E テストを追加
5. **デプロイ**: GitHub Secrets を設定して自動デプロイを有効化（DEPLOY.md 参照）

