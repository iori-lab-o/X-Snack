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
# apps/client/.env.example を参照
EXPO_PUBLIC_HONO_API_URL=http://localhost:8787  # 開発環境
# EXPO_PUBLIC_HONO_API_URL=https://your-api.workers.dev  # 本番環境
```

### API 環境変数

Cloudflare Workers のシークレットは `wrangler secret put` で設定。

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

