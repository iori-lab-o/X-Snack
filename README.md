# expo-workers-monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/pnpm-10.20.0-orange)](https://pnpm.io/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-blue)](https://expo.dev/)
[![Hono](https://img.shields.io/badge/Hono-^4.10-red)](https://hono.dev/)

⚡ **Expo (React Native) + Cloudflare Workers (Hono) monorepo boilerplate with pnpm workspace**

マルチプラットフォームアプリ（iOS / Android / Web）と Cloudflare Workers API を同一ワークスペースで開発できるボイラープレートです。

## 📁 構成

## 🌟 機能

### 🐦 X風要約AI

長文をTwitter/Xの投稿に最適な形式（280字以内、ハッシュタグ付き、キャッチーな文章）に要約するAI機能を搭載。

#### 主要機能

- **入力**: 長文テキスト（最大1500文字、ブログ記事、ニュース、論文など）
- **出力**: X投稿用の280字以内の要約（ハッシュタグ2〜3個、絵文字最大2個）
- **シェア**: ワンクリックでクリップボードにコピー
- **利用制限**: 1日3回まで（IPベース、残り回数表示）

#### 🤖 マルチプロバイダーAI戦略（完全無料・課金なし）

3段階の自動フォールバックで**100%無料運用**を実現:

1. **Primary: Gemini API** (`gemini-1.5-flash`)
   - 最高品質の要約生成
   - 無料枠: 60リクエスト/分
   - 超過時: 自動的に次のプロバイダーへフォールバック

2. **Secondary: Cloudflare Workers AI** (`llama-3.2-1b-instruct`)
   - 10,000 Neurons/日まで**完全無料**
   - ⚠️ **課金防止設定**: 無料枠超過時は自動停止（課金されません）
   - 同じWorkers環境で動作（低レイテンシ）

3. **Tertiary: Hugging Face Inference API** (`google/flan-t5-base`)
   - **完全無料**（APIトークンなしでも動作）
   - レート制限あり、最終手段として使用

4. **Fallback: Mock応答**
   - 全AI一時利用不可時でも動作継続

**どのプロバイダーを使用しても課金は一切発生しません！**

## 🚀 クイックスタート

### 基本セットアップ（ワンライナー）

```bash
pnpm install && pnpm dev
```

このコマンドで以下が同時に起動します：

- **API サーバー**: <http://localhost:8787> (Cloudflare Workers ローカル)
- **Expo Metro Bundler**: <http://localhost:8081> (クライアント開発サーバー)

> **注意**: ポート 8081 や 8787 が既に使用中の場合はエラーになります。その場合は実行中のプロセスを停止してから再実行してください。

### 🤖 X風要約AI のセットアップ

完全無料で動作しますが、最高品質を得るために以下の設定を推奨します:

#### 1. Gemini API キーを取得（推奨、無料）

```bash
# 1. https://aistudio.google.com/app/apikey でAPIキーを取得

# 2. API用の環境変数ファイルを作成
cd apps/api
echo "GEMINI_API_KEY=取得したキー" > .dev.vars

# 3. 開発サーバーを起動
cd ../..
pnpm dev
```

#### 2. KV ネームスペースを作成（レート制限用）

```bash
cd apps/api

# KVネームスペースを作成
pnpm wrangler kv:namespace create RATE_LIMIT_KV

# 出力されたIDをコピーして wrangler.jsonc に設定
# "id": "YOUR_KV_NAMESPACE_ID_HERE" を実際のIDに置き換え
```

#### 3. （オプション）Hugging Face トークン

```bash
# トークンなしでも動作しますが、レート制限が緩和されます
# https://huggingface.co/settings/tokens でトークンを取得

# apps/api/.dev.vars に追記
echo "HUGGINGFACE_API_TOKEN=取得したトークン" >> apps/api/.dev.vars
```

#### セットアップなしでも動作します

上記の設定なしでも、モックモードで要約機能を試すことができます。`pnpm dev` を実行して Web ブラウザで確認してください。

## 📱 クライアントの起動

Expo アプリの起動後、ターミナルに対話メニューが表示されます：

- **`w`** キーを押す: Web ブラウザで起動
- **`i`** キーを押す: iOS シミュレータで起動
- **`a`** キーを押す: Android エミュレータで起動
- **`r`** キーを押す: アプリをリロード
- **QR コード**: Expo Go アプリでスキャンして実機で実行

## 🔗 API とクライアントの連携

クライアントから API を呼び出す例：

```typescript
// apps/client/App.tsx
import { useEffect, useState } from 'react';
import { api } from './lib/apiClient';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getGreeting().then(data => {
      setMessage(data.message);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message || 'Loading...'}</Text>
    </View>
  );
}
```

API ヘルパーは `apps/client/lib/apiClient.ts` に定義されています。

### API エンドポイント例

API 側 (`apps/api/src/index.ts`) では以下のエンドポイントが定義されています：

- `GET /api/greeting` - サンプルの greeting メッセージを返す

新しいエンドポイントを追加する場合は、`apps/api/src/index.ts` を編集してください。

## 🛠️ 開発コマンド

### ルートディレクトリ

```bash
# 依存パッケージのインストール
pnpm install

# API とクライアントを同時起動
pnpm dev
```

### API のみ (`apps/api`)

```bash
# API サーバーのみ起動
pnpm --filter api dev

# テスト実行
pnpm --filter api test

# Cloudflare にデプロイ
pnpm --filter api deploy
```

### クライアントのみ (`apps/client`)

```bash
# クライアントのみ起動
pnpm --filter client dev

# Android で起動
pnpm --filter client android

# iOS で起動
pnpm --filter client ios

# Web で起動
pnpm --filter client web
```

## 📦 技術スタック

### API

- **Hono**: 高速な Web フレームワーク
- **Cloudflare Workers**: エッジでの実行環境
- **Vitest**: テストフレームワーク

### クライアント

- **Expo**: React Native 開発プラットフォーム
- **React Native**: クロスプラットフォーム UI
- **TypeScript**: 型安全な開発

### テスト

- **Vitest**: API のユニットテスト
- **Playwright**: Web 版の E2E テスト

### CI/CD

- **GitHub Actions**: 自動テスト・デプロイ
- **Wrangler**: Cloudflare Workers デプロイツール

## 🔧 環境変数

### Client 環境変数

クライアント側で API の URL を変更する場合は、環境変数を設定できます：

```bash
# apps/client/.env
EXPO_PUBLIC_HONO_API_URL=https://your-api.workers.dev
```

開発環境ではデフォルトで `http://localhost:8787` が使用されます。

### API 環境変数（X風要約AI用）

```bash
# apps/api/.dev.vars（ローカル開発用）
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE           # Primary AI（必須推奨）
HUGGINGFACE_API_TOKEN=YOUR_HF_TOKEN_HERE          # Tertiary AI（オプション）
```

### Cloudflare Workers シークレット（本番環境）

```bash
cd apps/api

# Gemini API Key を設定
pnpm wrangler secret put GEMINI_API_KEY
# プロンプトでキーを入力

# Hugging Face Token を設定（オプション）
pnpm wrangler secret put HUGGINGFACE_API_TOKEN

# KV Namespace ID は wrangler.jsonc に直接記載
# Workers AI は自動的に有効化されます（設定不要）
```

**重要**: `.dev.vars` ファイルは `.gitignore` に含まれており、コミットされません。

## 📝 次のステップ

1. `apps/client/App.tsx` を編集してクライアント UI を作成
2. `apps/api/src/index.ts` に新しい API エンドポイントを追加
3. `apps/client/lib/apiClient.ts` に API ヘルパー関数を追加
4. Cloudflare Workers にデプロイして本番環境で動作確認（[DEPLOY.md](./DEPLOY.md) 参照）

## 🧪 テスト

### API テスト

```bash
# API のユニットテスト（Vitest）
pnpm --filter api test
```

### Client テスト

```bash
# Client のユニットテスト（Vitest + React Testing Library）
pnpm --filter client test
```

### E2E テスト

```bash
# Playwright E2E テスト（Web 版）
pnpm test:e2e

# UI モードで実行
pnpm test:e2e:ui

# デバッグモード
pnpm test:e2e:debug
```

## ⚠️ トラブルシューティング

### Android SDK が見つからない

```sh
Error: Failed to resolve the Android SDK path
```

このエラーが出る場合は、以下のいずれかの方法で開発できます：

### 方法1: Web で開発する（推奨）

```bash
# ターミナルで 'w' キーを押す、または
pnpm --filter client web
```

ブラウザで <http://localhost:8081> が開きます。

### 方法2: Android Studio をインストールする**

1. [Android Studio](https://developer.android.com/studio) をダウンロード・インストール
2. Android SDK のパスを環境変数に設定:

   ```bash
   # ~/.bashrc または ~/.zshrc に追加
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. エミュレータを作成して起動
4. `pnpm dev` を実行して `a` キーを押す

### 方法3: 実機で開発する

1. スマートフォンに [Expo Go](https://expo.dev/client) アプリをインストール
2. `pnpm dev` を実行
3. 表示される QR コードを Expo Go でスキャン

### ポートが既に使用されている

```bash
# 別のターミナルで実行中のプロセスを確認
lsof -i :8081  # Expo
lsof -i :8787  # API

# プロセスを停止してから再実行
pnpm dev
```

### 8787 の API が停止していない（Ctrl+D で終了した場合）

`Ctrl+D` はシェルへの EOF 入力で、子プロセス（wrangler/workerd）に終了シグナルが届かず 8787 が残ることがあります。以下の方法で停止してください（Linux, bash）。

方法 A: ポートを直接 kill（簡単）

```bash
# 8787/TCP を使用中のプロセスを強制終了
fuser -k 8787/tcp || true

# 代替: lsof がある場合
kill -9 $(lsof -ti tcp:8787) 2>/dev/null || true
```

方法 B: Node ユーティリティで解放

```bash
# 一時実行（プロジェクトに依存を追加しません）
pnpm dlx kill-port 8787
```

方法 C: プロセスを特定して終了

```bash
# プロセス特定
ss -ltnp | grep :8787 || lsof -i :8787 -nP

# PID を指定して終了（例: 12345）
kill 12345 || kill -9 12345
```

予防策（設定済み）: 当リポジトリではルートの `package.json` に `predev` を設定済みです。`pnpm dev` の前に自動で 8787 を解放します。終了は `Ctrl+C` を推奨します（`Ctrl+D` は使用しない）。

### node_modules が見つからない

```bash
# 依存関係を再インストール
pnpm install
```

### Expo アプリが表示されない

- ファイアウォールで開発サーバーのポートが開いているか確認
- 実機とPCが同じネットワークに接続されているか確認

### X風要約AIが動作しない

#### モックモードで動作している

開発モードでは、AIキー未設定時にモックモードで動作します。実際のAIを使用するには:

```bash
# Gemini APIキーを設定
cd apps/api
echo "GEMINI_API_KEY=YOUR_KEY" > .dev.vars
pnpm dev
```

#### レート制限エラーが出る

1日3回の制限に達した場合は、翌日（UTC 0時）にリセットされます。開発中に制限をリセットしたい場合:

```bash
# KVストアをクリア（ローカル開発のみ）
cd apps/api
pnpm wrangler kv:key delete "rate:YOUR_IP:YYYY-MM-DD" --namespace-id=YOUR_KV_ID
```

#### Gemini API エラー

- APIキーが正しいか確認: <https://aistudio.google.com/app/apikey>
- 無料枠（60req/min）を超えていないか確認
- エラー時は自動的にWorkers AIまたはHugging Faceにフォールバックします

#### Workers AI エラー

- `wrangler.jsonc` に `"ai": {"binding": "AI"}` が設定されているか確認
- 無料枠（10k Neurons/日）超過時は自動停止（課金されません）

#### すべてのAIが失敗する

全プロバイダーが一時的に利用不可の場合、モック応答が返されます。これは正常な動作です。
