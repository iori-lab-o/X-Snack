# TODO リスト

## ✅ 完了 (2025/11/02)

- [x] `pnpm dev` でポート競合の問題を解決
- [x] Expo の対話メニューを表示できるようにスクリプト修正
- [x] API クライアントヘルパー (`apps/client/lib/apiClient.ts`) を作成（旧 `api.ts` からリネーム）
- [x] README.md の作成（起動方法、トラブルシューティング）
- [x] 動作確認（Web モード）

## 📋 次回作業（優先度: 高）

- [x] **クライアント UI の実装**
  - `apps/client/App.tsx` にメイン画面を実装
  - API との連携サンプル（`api.getGreeting()` の呼び出し）
  - ローディング状態とエラーハンドリング

- [x] **API エンドポイントの拡充**
  - `apps/api/src/index.ts` に実際の API ロジックを追加
  - 追加: `GET /api/users`, `GET /api/users/:id`, `POST /api/users`, `GET /health`, `GET /`
  - CORS を開発向けに有効化

- [x] **環境変数の設定**
  - `apps/client/.env.example` を作成
  - 本番環境用の API URL 設定方法をドキュメント化

## 📋 今後の作業（優先度: 中）

- [x] **型定義の共有**
  - 共通の型定義を `packages/types` に分離（`@expo-workers/types` 作成済み）。

- [ ] **テストの追加**
  - API: vitest で統合テスト追加（実施済み）
  - Client: Jest または React Native Testing Library のセットアップ（未着手）

- [ ] **CI/CD の設定**
  - GitHub Actions で自動テスト（API）を実行（実施済み）
  - Cloudflare Workers へのデプロイ自動化（未着手）

## 📋 将来的な作業（優先度: 低）

- [ ] **Android 開発環境のセットアップ手順**
  - Android Studio インストールガイド
  - エミュレータ作成手順

- [ ] **追加機能の検討**
  - 認証機能（JWT など）
  - データベース連携（Cloudflare D1 など）
  - 状態管理ライブラリ（Redux, Zustand など）

## 🎯 動作確認状況

### ✅ 確認済み

- ワンライナー起動: `pnpm install && pnpm dev`
- API サーバー: <http://localhost:8787>
- クライアント: <http://localhost:8081>
- Web モードでの動作
- API クライアントヘルパー
- API エンドポイントの単体/結合テスト（Vitest）: `apps/api/test/*.spec.ts` 追加済み

### ⚠️ 未確認

- 実機での動作（Expo Go）
- Android エミュレータでの動作（SDK 未インストール）
- iOS シミュレータでの動作（macOS 環境が必要）
- 本番デプロイ（Cloudflare Workers）
