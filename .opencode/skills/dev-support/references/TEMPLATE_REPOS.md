# テンプレートリポジトリ設定

## 概要
プロジェクト初期化時に使用するテンプレートリポジトリの設定

## 対応テンプレート

### Expo + Workers モノレポ
- **リポジトリ**: https://github.com/Keiji-Miyake/expo-workers-monorepo
- **スタック**: `typescript-web` または専用 `expo-workers`
- **説明**: Expo (React Native) + Cloudflare Workers のモノレポ構成
- **技術スタック**:
  - フロントエンド: Expo (React Native)
  - バックエンド: Cloudflare Workers (Hono)
  - パッケージ管理: pnpm workspace
  - 言語: TypeScript

### 使用方法（予定）

#### オプション1: init時にテンプレート指定
```bash
pnpm tsx scripts/manage-dev.ts init my-app typescript-web --template expo-workers
```

#### オプション2: 専用スタック
```bash
pnpm tsx scripts/manage-dev.ts init my-app expo-workers
```

## 実装状況

### ✅ 完了した機能
1. **コマンド拡張**
   - ✅ `--template` オプションの追加
   - ✅ テンプレートリポジトリのクローン機能（git clone使用）
   - ✅ テンプレート設定の保存

2. **テンプレートメタデータ**
   - ✅ リポジトリURL
   - ✅ 推奨ディレクトリ構造
   - ✅ 初期セットアップコマンド

3. **CONTEXT.mdへの記録**
   - ✅ プロジェクト情報（テンプレート名、URL、初期化日、パス）
   - ✅ セットアップコマンド

### 実装内容

#### 1. TEMPLATE_REPOS定義（scripts/manage-dev.ts）
```typescript
const TEMPLATE_REPOS: Record<string, TemplateRepo> = {
  'expo-workers': {
    name: 'expo-workers-monorepo',
    url: 'https://github.com/Keiji-Miyake/expo-workers-monorepo',
    stack: 'typescript-web',
    description: 'Expo + Cloudflare Workers モノレポテンプレート',
    setupCommands: [
      'pnpm install',
      'pnpm run build',
    ],
  },
};
```

#### 2. テンプレート初期化フロー
1. `git clone` でテンプレートリポジトリをクローン
2. `.git` ディレクトリを削除（新規リポジトリとして扱える）
3. `docs/dev/[feature-name]/` にドキュメントを生成
4. CONTEXT.mdにテンプレート情報を記録

## 次のステップ
1. ✅ `manage-dev.ts` に `--template` オプションを実装 - **完了**
2. ✅ テンプレートリポジトリのクローン処理を追加 - **完了**
3. ✅ テンプレート情報をCONTEXT.mdに自動記録 - **完了**
4. ⬜ 実際にexpo-workers-monorepoでテスト - **次回**

## 参考情報
- degit: テンプレートリポジトリの取得に便利
  ```bash
  npx degit Keiji-Miyake/expo-workers-monorepo my-app
  ```
- テンプレートリポジトリは `.git` ディレクトリを含まない形で取得
