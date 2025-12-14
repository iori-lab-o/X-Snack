## 要点（短く）

- このリポジトリは pnpm ワークスペースの Expo (client) と Cloudflare Workers (api) のモノレポです。
- 主要な開発コマンド: `pnpm install && pnpm dev`（ルート）、個別: `pnpm --filter api dev`, `pnpm --filter client dev`。
- テスト: API は `pnpm --filter api test`、Client は `pnpm --filter client test`、E2E は `pnpm test:e2e`。

## すぐに役立つ参照（ファイル）

- API エントリポイント: `apps/api/src/index.ts`（Hono ルートがここに定義されています）
- Client の API ヘルパー: `apps/client/lib/apiClient.ts`（クライアント側呼び出しはここを経由）
- 共有型: `packages/types/src/index.ts`（API と Client の型をここで共有）
- パッケージ管理とスクリプト: `package.json`（ルート）および各サブパッケージの `package.json`
- Playwright 設定: `playwright.config.ts`（E2E の webServer 設定を参照）

## 期待される「やり方」・プロジェクト固有の慣習

- 言語: ドキュメントとコミットメッセージは日本語。コード内コメントは日本語、識別子は英語。
- ポート管理: ルートの `predev` スクリプトは `8787` ポートを事前解放します（`pnpm dlx kill-port 8787 || true`）。`pnpm dev` 実行前にこの挙動を期待してください。
- API は Cloudflare Workers / Hono で動きます。ローカル起動は `wrangler dev`（`pnpm --filter api dev` を使用）。デプロイは `wrangler deploy`（`pnpm --filter api deploy`）。
- 環境変数: `apps/client/.env`（`EXPO_PUBLIC_HONO_API_URL`）と Workers バインディング / secrets（`wrangler secret put` や `wrangler.jsonc` の `vars`）を参照。

## 典型的な作業フロー（短い手順）

1. 依存インストール: `pnpm install`
2. 開発: ルートから `pnpm dev`（API と Client が同時に起動）
   - API 単体: `pnpm --filter api dev`
   - Client Web: `pnpm --filter client web`（Playwright の webServer でも使われる）
3. テスト: `pnpm --filter api test`, `pnpm --filter client test`, `pnpm test:e2e`
4. リント/フォーマット: `pnpm lint`, `pnpm lint:fix`, `pnpm format`（Biome を使用）

## 実装・変更時の具体例

- 新しい API エンドポイントを追加する場合:
  - 編集: `apps/api/src/index.ts` にルートを追加（既存の `/api/greeting`, `/api/users`, `/api/summarize` を参照）
  - 型: 必要なら `packages/types/src/index.ts` に型を追加して Client と共有
  - テスト: `apps/api/test` に Vitest を追加し、`pnpm --filter api test` で確認

- Client からの API 呼び出しを追加する場合:
  - ヘルパー: `apps/client/lib/apiClient.ts` に関数を追加
  - UI: `apps/client/App.tsx` などで使用
  - 型: 相対パスで `../../../packages/types/src/index.js` をインポートして型安全を保つ

### X風要約AI の実装パターン

- **マルチプロバイダーフォールバック**: `apps/api/src/index.ts` の `/api/summarize` 参照
  - 優先順位: Gemini → Workers AI → Hugging Face → Mock
  - 各プロバイダーの失敗時に自動的に次へフォールバック
  - `provider` フィールドで使用されたAIを返却

- **レート制限**: Cloudflare KV を使用した IP ベースの制限
  - キー形式: `rate:{IP}:{YYYY-MM-DD}`
  - TTL: 86400秒（24時間自動削除）
  - 残り回数を `remainingCount` で返却

- **環境変数管理**:
  - ローカル: `apps/api/.dev.vars`（`.gitignore`済み）
  - 本番: `wrangler secret put` でシークレット設定
  - KV/AI: `wrangler.jsonc` の `kv_namespaces` と `ai` で設定

## CI / E2E の注意点

- Playwright は `playwright.config.ts` 内の `webServer` により開発サーバーを自動起動します。CI 環境では `reuseExistingServer: !process.env.CI` 設定に注意。
- E2E 実行時は `pnpm test:e2e` を使う。デバッグUI は `pnpm test:e2e:ui`。

## デプロイ / シークレット

- Cloudflare のシークレットや環境設定は `wrangler secret put` と `wrangler.jsonc` の `vars`/`kv_namespaces`/`ai` を利用します。
- `ALLOWED_ORIGINS` の挙動は `apps/api/src/index.ts` 内の CORS ロジックに依存します。

### X風要約AI 用の設定

1. **KV Namespace**: `pnpm wrangler kv:namespace create RATE_LIMIT_KV` で作成し、IDを `wrangler.jsonc` に設定
2. **Gemini API Key**: `pnpm wrangler secret put GEMINI_API_KEY` で設定（<https://aistudio.google.com/app/apikey>）
3. **Workers AI**: `wrangler.jsonc` に `"ai": {"binding": "AI"}` を設定（自動有効化、10k Neurons/日無料）
4. **Hugging Face Token**: オプション、`pnpm wrangler secret put HUGGINGFACE_API_TOKEN`（トークンなしでも動作）

**課金防止**: 全プロバイダーは無料枠超過時に自動停止またはフォールバック。課金は発生しません。

## ローカルでよくあるトラブルと即効の対応

- 8787 が残っている: ルート `predev` が通常解放するが、残っている場合は `fuser -k 8787/tcp` または `pnpm dlx kill-port 8787` を実行してください。
- Android SDK がない場合: Web モードで開発（`pnpm --filter client web` または `pnpm dev` の後に `w`）。

## 参考ファイル（短い一覧）

- `AGENT.md`, `README.md`（リポジトリの高レベル説明、X風要約AI機能含む）
- `DEPLOY.md`（デプロイ手順、AI環境変数設定含む）
- `apps/api/src/index.ts`（API 実装、マルチプロバイダーフォールバックのベース）
- `apps/api/wrangler.jsonc`（Workers設定、KV/AI バインディング）
- `apps/api/.dev.vars.example`（ローカル開発用環境変数テンプレート）
- `apps/client/App.tsx`（Client UI、要約機能とレート制限表示）
- `apps/client/lib/apiClient.ts`（Client 側 API 呼び出しの集約）
- `apps/client/lib/theme.ts`（テーマ定義、FontSizes.xxlarge 含む）
- `packages/types/src/index.ts`（共通型、SummarizeRequest/Response）
- `tsconfig.base.json`（ベースTypeScript設定、typo修正済み）

---
フィードバックください: ここで足りない点（例: より詳しいテスト手順、CI ジョブ名、特定のコーディングルール）を教えてください。明確になれば追記・修正します。
