# Dev Support Skill

プロジェクト管理スキル - 短時間で中断可能な開発セッションに最適化。

**バージョン**: 2.2  
**評価**: S (Excellent) - 99%達成度

## 概要

このスキルは、作業の中断・再開が頻繁に発生する開発環境において、コンテキストの喪失を最小化します。
**技術スタック不問**で、あらゆるプロジェクトで使用できます。
**作業時間は柔軟に対応**：15分/30分/60分/90分など、あなたのスケジュールに合わせて調整可能。

### v2.2の新機能
- **二層ドキュメント構造**: プロジェクト全体とfeature個別のドキュメント管理
- **アーキテクチャ整合性**: 新機能が既存設計と整合するか自動チェック
- **ADR（Architecture Decision Records）**: 技術的決定の記録と追跡
- **Feature依存関係管理**: 開発中feature間の関係を可視化
- **ドキュメント成熟度対応**: プロジェクト規模に応じた構造提案（Startup/Growing/Mature）

### 主な機能
- **仕様設計サポート**: SPEC.mdで要件を整理
- **アーキテクチャ設計**: DESIGN.mdで技術選定と構成を記録
- **プロジェクト全体設計**: ARCHITECTURE.mdでシステム全体を管理
- **テスト計画**: TEST_PLAN.mdでテストケースを管理
- **進捗管理**: ROADMAP.mdでマイルストーンを追跡
- **作業コンテキスト保存**: CONTEXT.mdで中断・再開をサポート
- **柔軟な時間管理**: セッション時間をカスタマイズ可能

## インストール

```bash
# スキルディレクトリが存在しない場合は作成
mkdir -p ~/.gemini/skills/dev-support

# このディレクトリの内容をコピー
cp -r . ~/.gemini/skills/dev-support/

# Antigravity用シンボリックリンク（必要に応じて）
ln -s ~/.gemini/skills/dev-support ~/.gemini/antigravity/skills/dev-support
```

## 使い方

### 1. プロジェクトフォルダで作業開始

```bash
cd ~/my-project

# AI エージェントを起動
gh copilot  # または gemini cli, antigravity など
```

### 2. セッション時間を設定

```
> 作業を再開。今回は45分で。
```

エージェントが`docs/dev/**/CONTEXT.md`を読み、前回の作業状況を伝えます。

### 3. 新機能開発を開始

```
> 新機能「ユーザープロフィール編集」を60分で開発開始
```

### 4. 作業を中断

```
> 作業を中断
```

詳細は`SKILL.md`をご覧ください。

## 補助ツール（オプション）

`scripts/manage-dev.ts`でドキュメント管理を補助できます。

```bash
cd ~/.gemini/skills/dev-support/scripts
pnpm install
pnpm tsx manage-dev.ts summary
```

## 対応エージェント

- GitHub Copilot CLI
- Gemini CLI
- Anthropic Claude (Claude Code, Claude.ai, API)
- Antigravity
- その他の互換エージェント

## ライセンス

MIT License
