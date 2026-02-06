# AGENTS.md - AI Coding Agent Instructions

このファイルはAIコーディングエージェント向けの開発ガイドラインです。

## AIエージェント運用ルール（最優先・厳守）

AIエージェントは、本プロジェクトにおいて以下のルールを例外なく適用すること：

### 言語設定
- **基本言語**: ユーザーへの回答、提案、解説、ドキュメント（README等）の更新はすべて**日本語**で行う。
- **コード内コメント**: 日本語で記述する。
- **変数名・関数名**: プログラミング慣習に従い、セマンティックな**英語**を使用する。

### コミットメッセージ規約 (Conventional Commits 1.0.0 準拠)
すべてのコミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に従い、日本語で記述すること。

**書式:** `<type>(<optional scope>): <description>`

**主な type:**
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（ホワイトスペース、フォーマット等）
- `refactor`: バグ修正も機能追加も行わないコード変更
- `perf`: パフォーマンス向上
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやドキュメント生成などの補助ツール、ライブラリの変更

**例:**
- `feat(api): Gemini APIのフォールバックロジックを実装`
- `fix(client): モバイル端末でのレイアウト崩れを修正`
- `docs: AGENTS.mdにコミット規約を追記`

### 開発スタイル
- **結論から話す**: ユーザーへの回答は結論を先頭に置く。
- **効率化の視点**: 常に自動化やAI活用による開発効率向上の提案を含める。

### 安全策
- **AI 要約の回数制限**: 1日のシステム全体の合計回数（1,000回）および個別IPごとの制限（3回）が正しく機能していることを常に意識し、これらを不用意に削除・変更しないこと。
- **課金防止**: Free プランの範囲内で動作させることを最優先とし、有料リソースの追加には必ずユーザーの同意を得ること。

## プロジェクト概要

**expo-workers-monorepo**: Expo (React Native) + Cloudflare Workers (Hono) のマルチプラットフォームアプリ開発ボイラープレート。
モバイル（iOS/Android）、Web、API を同一リポジトリで開発できるスターターテンプレートです。

- **構成**: pnpm ワークスペースによるモノレポ
- **パッケージマネージャー**: pnpm 10.20.0
- **言語**: TypeScript (strict mode)
- **アプリ**: X風要約AI - 長文をTwitter/X向けに要約

## 技術スタック

### API (Cloudflare Workers)
- **Runtime**: Cloudflare Workers
- **Framework**: Hono (高速 Web フレームワーク)
- **Testing**: Vitest (Unit)
- **AI**: Gemini 1.5 Flash (Primary), Workers AI Llama 3 (Secondary), HuggingFace (Tertiary)

### Client (Expo)
- **Platform**: Expo ~54.0 (React Native 0.81)
- **UI**: React 19.1
- **Testing**: Vitest (Unit), React Testing Library

### 共通・ツール
- **Monorepo**: pnpm workspace
- **Types**: `@expo-workers/types` (共有型定義)
- **E2E**: Playwright
- **Lint/Format**: Biome (高速 Rust 製ツール)
- **CI/CD**: GitHub Actions

## ディレクトリ構造

```
expo-workers-monorepo/
├── apps/
│   ├── api/          # Cloudflare Workers (Hono) - ポート 8787
│   │   ├── src/      # Hono アプリケーション
│   │   └── wrangler.jsonc # Workers 設定
│   └── client/       # Expo (React Native Web対応) - ポート 8081
│       ├── lib/      # APIクライアント等
│       └── App.tsx   # メインコンポーネント
├── packages/
│   └── types/        # 共有型定義 (@expo-workers/types)
└── e2e/              # Playwright E2E テスト
```

## 開発コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動 (API + Client 同時)
pnpm dev

# 個別起動
pnpm --filter api dev      # API のみ (wrangler dev)
pnpm --filter client dev   # Client のみ (expo start) (w: web, i: ios, a: android)
pnpm --filter client web   # Client Web版
```

## テストコマンド

```bash
# 全テスト実行
pnpm --filter api test        # API単体テスト (Vitest + Cloudflare Workers Pool)
pnpm --filter client test     # Clientテスト (Vitest + jsdom)
pnpm test:e2e                 # E2E (Playwright)

# 単一テストファイル実行
pnpm --filter api test -- --run apps/api/test/users.spec.ts
pnpm --filter client test -- --run apps/client/__tests__/App.test.tsx

# CIモード (watch無効)
pnpm --filter api test -- --run
pnpm --filter client test -- --run
```

## リント・フォーマット

```bash
pnpm lint          # Biome check
pnpm lint:fix      # 自動修正
pnpm format        # フォーマット適用
```

## コードスタイル (Biome設定)

- **インデント**: スペース 2
- **クォート**: シングルクォート `'`
- **セミコロン**: 必須
- **TypeScript**: strict mode

## 命名規則

- **ファイル**: camelCase (`apiClient.ts`, `users.spec.ts`)
- **コンポーネント**: PascalCase (`App.tsx`)
- **変数・関数**: camelCase (`fetchApi`)
- **型・インターフェース**: PascalCase (`SummarizeRequest`, `ApiResponse`)
- **定数**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## X風要約AI の実装詳細

### マルチプロバイダーフォールバック戦略

完全無料・課金なしを実現する3段階フォールバック:

1. **Gemini API** (`gemini-1.5-flash`): Primary、最高品質、60req/min無料
2. **Cloudflare Workers AI** (`llama-3.2-1b-instruct`): Secondary、10k Neurons/日無料
3. **Hugging Face** (`google/flan-t5-base`): Tertiary、完全無料
4. **Mock応答**: 全AI失敗時のフォールバック

### 入出力仕様

- **入力**: 最大1500文字 (超過時は自動トリム)
- **出力**: 280字以内 (本文 + ハッシュタグ)
- **ハッシュタグ**: 2〜3個、末尾に統一
- **絵文字**: 最大2個

### レート制限
- **制限**: 1日3回/IP
- **管理**: Cloudflare KV (`rate:{IP}:{YYYY-MM-DD}`)
- **超過時**: HTTP 429 エラー

## 環境変数

### Client (`apps/client/.env`)
```bash
EXPO_PUBLIC_HONO_API_URL=http://localhost:8787  # 開発環境
# EXPO_PUBLIC_HONO_API_URL=https://your-api.workers.dev  # 本番環境
```

### API ローカル (`apps/api/.dev.vars`)
GitHubリポジトリにはコミットしないでください。
```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
HUGGINGFACE_API_TOKEN=YOUR_HF_TOKEN_HERE (Optional)
```

### API 本番 (Cloudflare Secrets)
```bash
pnpm wrangler secret put GEMINI_API_KEY
pnpm wrangler secret put HUGGINGFACE_API_TOKEN
```

## API 開発パターン

### エンドポイント追加
1. `apps/api/src/index.ts` にルート追加
2. `packages/types/src/index.ts` に型追加 (共有型)
3. `apps/api/test/` にテスト追加

### クライアント連携
- `apps/client/lib/apiClient.ts` を使用
- 型は `@expo-workers/types` からインポート
