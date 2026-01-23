# AGENTS.md - AI Coding Agent Instructions

このファイルはAIコーディングエージェント向けの開発ガイドラインです。

## プロジェクト概要

- **構成**: pnpm ワークスペースによるモノレポ (Expo + Cloudflare Workers)
- **パッケージマネージャー**: pnpm 10.20.0
- **言語**: TypeScript (strict mode)
- **アプリ**: X風要約AI - 長文をTwitter/X向けに要約

## ディレクトリ構造

```
apps/
  api/          # Cloudflare Workers (Hono) - ポート 8787
  client/       # Expo (React Native Web対応)
packages/
  types/        # 共有型定義 (@expo-workers/types)
```

## 開発コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動 (API + Client 同時)
pnpm dev

# 個別起動
pnpm --filter api dev      # API のみ (wrangler dev)
pnpm --filter client dev   # Client のみ (expo start)
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

# テストパターン指定
pnpm --filter api test -- --run -t "GET /api/users"

# CIモード (watch無効)
pnpm --filter api test -- --run
pnpm --filter client test -- --run

# E2Eデバッグ
pnpm test:e2e:ui              # UIモード
pnpm test:e2e:debug           # デバッグモード
```

## リント・フォーマット

```bash
pnpm lint          # Biome check
pnpm lint:fix      # 自動修正
pnpm format        # フォーマット適用
```

## コードスタイル (Biome設定)

### フォーマット
- インデント: スペース 2
- 行幅: 100文字
- 改行: LF
- クォート: シングルクォート `'`
- セミコロン: 必須
- トレイリングカンマ: ES5形式
- アロー関数括弧: 常に付ける `(x) => x`

### リントルール
- `noExplicitAny`: error (any禁止)
- `noDoubleEquals`: warn (=== を使用)
- `noNonNullAssertion`: warn (! 非推奨)
- `useConst`: error (const優先)
- `noUnusedVariables`: error (未使用変数禁止)

### TypeScript
- strict: true
- esModuleInterop: true
- moduleResolution: bundler

## 命名規則

- **ファイル**: camelCase (`apiClient.ts`, `users.spec.ts`)
- **コンポーネント**: PascalCase (`App.tsx`)
- **変数・関数**: camelCase (`fetchApi`, `validateApiUrl`)
- **型・インターフェース**: PascalCase (`SummarizeRequest`, `ApiResponse`)
- **定数**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## インポート順序

Biome が自動整理。手動では以下の順序を推奨:

```typescript
// 1. 外部パッケージ
import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';

// 2. ワークスペースパッケージ
import type { SummarizeRequest } from '@expo-workers/types';

// 3. 相対パス
import { api } from '../lib/apiClient';
```

## 型定義

- 共有型は `packages/types/src/index.ts` に定義
- API の型エクスポート: `export type AppType = typeof app;`
- レスポンス型には `ApiResponse<T>` を使用

```typescript
// 正しい例
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## エラーハンドリング

```typescript
// API エラーレスポンス形式
return c.json({ success: false, error: 'エラーメッセージ' }, 400);

// try-catch パターン
try {
  // 処理
} catch (error) {
  console.error('説明:', error);
  return c.json({ success: false, error: '処理中にエラーが発生しました' }, 500);
}
```

## 日本語開発設定

- **ドキュメント・コミットメッセージ**: 日本語
- **コード内コメント**: 日本語
- **識別子 (変数名・関数名)**: 英語
- **エラーメッセージ**: 日本語 (ユーザー向け)
- **ログ出力**: 日本語可

## API 開発パターン

### エンドポイント追加
1. `apps/api/src/index.ts` にルート追加
2. 必要に応じて `packages/types/src/index.ts` に型追加
3. `apps/api/test/` にテスト追加

### Hono ルート例
```typescript
app.get('/api/example', (c) => {
  return c.json({ success: true, data: { /* ... */ } });
});

app.post('/api/example', async (c) => {
  const body = await c.req.json<RequestType>();
  // バリデーション
  if (!body.field) {
    return c.json({ success: false, error: '必須項目です' }, 400);
  }
  return c.json({ success: true, data: result }, 201);
});
```

## テスト作成

### API テスト (Cloudflare Workers Pool)
```typescript
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';

it('unit: GET /api/endpoint', async () => {
  const request = new Request('http://example.com/api/endpoint');
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  expect(response.status).toBe(200);
});
```

### Client テスト (React Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/apiClient', () => ({ api: { method: vi.fn() } }));

it('コンポーネントテスト', async () => {
  render(<Component />);
  expect(screen.getByText(/テキスト/)).toBeTruthy();
});
```

## 環境変数

- **Client**: `apps/client/.env` に `EXPO_PUBLIC_HONO_API_URL`
- **API ローカル**: `apps/api/.dev.vars` (gitignore済み)
- **API 本番**: `wrangler secret put SECRET_NAME`

## よくあるトラブル

- **ポート 8787 が使用中**: `pnpm dlx kill-port 8787`
- **Android SDK なし**: `pnpm --filter client web` で Web 開発

## 参考ファイル

- API実装: `apps/api/src/index.ts`
- APIクライアント: `apps/client/lib/apiClient.ts`
- 共有型: `packages/types/src/index.ts`
- Workers設定: `apps/api/wrangler.jsonc`
- CI設定: `.github/workflows/ci.yml`
