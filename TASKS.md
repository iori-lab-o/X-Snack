# X-Snack タスクリスト

## 📅 最終更新: 2025-12-12

---

## ✅ 完了済み

### Phase 1: 基本セットアップ（2025-01-02）
- [x] pnpm ワークスペース構築
- [x] Expo プロジェクト作成
- [x] Cloudflare Workers + Hono セットアップ
- [x] 共有型定義パッケージ作成
- [x] 基本的な開発コマンド整備
- [x] ポート競合問題の解決（predev スクリプト）

### Phase 2: 基本機能実装（2025-01-03）
- [x] API エンドポイント実装
  - [x] GET /api/greeting
  - [x] GET /api/users
  - [x] GET /api/users/:id
  - [x] POST /api/users
  - [x] GET /health
- [x] CORS ミドルウェア設定
- [x] Client UI 実装（App.tsx）
- [x] API クライアントヘルパー作成

### Phase 3: 要約AI機能（2025-01-05）
- [x] POST /api/summarize エンドポイント
- [x] マルチプロバイダーフォールバック
  - [x] Gemini 1.5 Flash 連携
  - [x] Workers AI 連携
  - [x] Hugging Face 連携
  - [x] Mock フォールバック
- [x] レート制限機能（Cloudflare KV）
- [x] Client UI の要約フォーム実装
- [x] 残り回数表示機能

### Phase 4: テスト整備（2025-01-07）
- [x] API ユニットテスト（Vitest）
  - [x] index.spec.ts
  - [x] users.spec.ts
- [x] Client ユニットテスト（Vitest）
  - [x] App.test.tsx
- [x] E2E テスト（Playwright）
  - [x] app.spec.ts
  - [x] summary.spec.ts
- [x] GitHub Actions CI 設定

### Phase 5: ドキュメント整備（2025-12-12）
- [x] README.md 作成
- [x] AGENT.md 作成
- [x] DEPLOY.md 作成
- [x] .github/copilot-instructions.md 作成
- [x] GITHUB_SECRETS_SETUP.md 作成
- [x] SPECIFICATION.md 作成
- [x] TASKS.md 作成（本ファイル）

---

## 🚧 進行中

### Phase 6: CI/CD 強化
- [ ] **自動デプロイの有効化**
  - [ ] GitHub Secrets 設定（CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID）
  - [ ] デプロイワークフローのテスト
  - [ ] 本番環境へのデプロイ確認
  - 優先度: 高
  - 担当: DevOps
  - 参考: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

---

## 📋 未着手（優先度: 高）

### ドキュメント
- [ ] **API キー取得手順の詳細化**
  - [ ] Gemini API キー取得の画像付きガイド
  - [ ] Hugging Face トークン取得手順
  - 優先度: 中

### テスト
- [ ] **Client コンポーネントテストの拡充**
  - [ ] App.tsx の統合テスト
  - [ ] エラーハンドリングのテスト
  - [ ] ローディング状態のテスト
  - 優先度: 中

- [ ] **E2E テストカバレッジ向上**
  - [ ] レート制限のE2Eテスト
  - [ ] エラーケースのE2Eテスト
  - [ ] モバイルビューポートのテスト
  - 優先度: 中

---

## 📋 未着手（優先度: 中）

### 機能拡張
- [ ] **認証機能の実装**
  - [ ] JWT ベース認証
  - [ ] ログイン/ログアウト UI
  - [ ] 保護されたエンドポイント
  - 優先度: 中
  - 見積: 2-3日

- [ ] **要約履歴の保存**
  - [ ] Cloudflare D1 セットアップ
  - [ ] 履歴保存 API
  - [ ] 履歴表示 UI
  - 優先度: 中
  - 見積: 2日

- [ ] **カスタム要約スタイル**
  - [ ] スタイル選択 UI（カジュアル/フォーマル/技術的）
  - [ ] プロンプト調整
  - 優先度: 低
  - 見積: 1日

### パフォーマンス
- [ ] **API レスポンスタイムの最適化**
  - [ ] プロバイダー並列呼び出しの検討
  - [ ] キャッシュ戦略の導入
  - 優先度: 中

- [ ] **Client バンドルサイズ削減**
  - [ ] 不要な依存関係の削除
  - [ ] Code Splitting
  - 優先度: 低

### 開発体験
- [ ] **ローカル開発環境の改善**
  - [ ] Docker Compose セットアップ
  - [ ] ホットリロードの高速化
  - 優先度: 低

---

## 📋 未着手（優先度: 低）

### モバイルアプリ
- [ ] **Android 開発環境セットアップ**
  - [ ] Android Studio インストールガイド
  - [ ] エミュレータ作成手順
  - 優先度: 低

- [ ] **iOS 開発環境セットアップ**
  - [ ] Xcode セットアップ
  - [ ] シミュレータ設定
  - 優先度: 低
  - 条件: macOS 環境

- [ ] **アプリストア配信**
  - [ ] EAS Build 設定
  - [ ] App Store / Google Play 登録
  - 優先度: 低
  - 見積: 1週間

### 高度な機能
- [ ] **リアルタイム要約**
  - [ ] WebSocket 実装
  - [ ] ストリーミング要約
  - 優先度: 低
  - 見積: 3日

- [ ] **多言語対応**
  - [ ] i18n セットアップ
  - [ ] 日本語/英語切り替え
  - 優先度: 低
  - 見積: 2日

- [ ] **音声入力**
  - [ ] Web Speech API 連携
  - [ ] 音声→テキスト変換
  - 優先度: 低
  - 見積: 2日

- [ ] **Chrome 拡張機能**
  - [ ] Manifest V3 セットアップ
  - [ ] 選択テキストの要約
  - 優先度: 低
  - 見積: 1週間

---

## 🐛 既知の問題

### 緊急度: 高
- なし

### 緊急度: 中
- [ ] **Playwright テストの不安定性**
  - 現象: CI環境でタイムアウトすることがある
  - 対処: timeout値の調整、リトライ回数の増加
  - 関連: [playwright.config.ts](playwright.config.ts)

### 緊急度: 低
- [ ] **Android SDK 未インストール時のエラーメッセージ**
  - 現象: SDK がない場合のエラーが分かりにくい
  - 対処: README にトラブルシューティング追加済み
  - 改善案: カスタムエラーメッセージの追加

---

## 📊 メトリクス

### テストカバレッジ
- API: 85%（目標: 90%）
- Client: 60%（目標: 80%）
- E2E: 基本フロー実装済み

### パフォーマンス
- API レスポンス（要約なし）: ~50ms ✅
- API レスポンス（要約あり）: ~2000ms ✅
- Web 初回読み込み: ~3000ms ✅

### コード品質
- Biome エラー: 0 ✅
- TypeScript エラー: 0 ✅
- セキュリティ脆弱性: 0 ✅

---

## 🎯 次回スプリント（1週間）

### 必須タスク
1. GitHub Secrets 設定とデプロイ確認
2. Playwright テスト安定化
3. Client コンポーネントテスト追加

### 推奨タスク
1. API キー取得ガイドの改善
2. パフォーマンス計測の自動化
3. E2E テストカバレッジ向上

---

## 📝 メモ

- **開発環境**: Linux (bash/zsh)、Web モード推奨
- **言語**: ドキュメント・コミット=日本語、コード=英語
- **ブランチ戦略**: main ブランチ直接 push（小規模プロジェクト）
- **レビュー**: セルフレビュー + AI アシスト

---

## 📐 タスクテンプレート

```markdown
- [ ] **タスク名**
  - 詳細説明
  - 優先度: 高/中/低
  - 見積: X日
  - 担当: 名前
  - 関連: [リンク](path/to/file)
```

---

**次回作業**: GitHub Secrets 設定 → 自動デプロイテスト → Client テスト拡充
