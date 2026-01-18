# システムアーキテクチャ

## 概要
X-Snack は、AI を使用して X（旧 Twitter）風のテキスト要約を提供するクロスプラットフォームアプリケーション（Web/モバイル）です。React Native (Expo) クライアントと Cloudflare Workers API (Hono) で構成されています。

## 主要コンポーネント

### 1. Client (`apps/client`)
- **フレームワーク**: Expo SDK (React Native)
- **プラットフォーム**: Web (本番), iOS/Android (計画中)
- **UI ライブラリ**: React Native Paper / Custom UI
- **状態管理**: React Hooks / Context

### 2. API (`apps/api`)
- **ランタイム**: Cloudflare Workers
- **フレームワーク**: Hono (超高速 Web フレームワーク)
- **言語**: TypeScript

### 3. Services
- **ストレージ**: Cloudflare KV (レート制限用)
- **AI プロバイダー**:
  - Primary: Gemini 2.5 Flash Lite (Google)
  - Secondary: Cloudflare Workers AI
  - Tertiary: Hugging Face Inference API

## ディレクトリ構造
```
/
├── apps/
│   ├── api/            # Hono API Worker
│   └── client/         # Expo React Native App
├── packages/
│   └── types/          # 共有 TypeScript 定義
├── docs/               # プロジェクトドキュメント
└── .github/            # CI/CD ワークフロー
```
