# Changelog

## v2.2 (2026-01-18) - プロジェクト全体ドキュメント対応 📚

### 主要変更
- **二層ドキュメント構造**: Project-level (`docs/`) + Feature-level (`docs/dev/[feature-name]/`)
- **アーキテクチャ整合性チェック**: 新機能開発時に既存アーキテクチャとの整合性確認
- **ADR対応**: Architecture Decision Records作成支援
- **Feature依存関係管理**: `docs/dev/README.md`でfeature間の依存関係を追跡
- **ドキュメント成熟度レベル**: プロジェクト規模に応じた構造提案（Startup/Growing/Mature）

### 新規テンプレート追加
- `ADR_TEMPLATE.md`: アーキテクチャ決定記録テンプレート
- `DEV_README_TEMPLATE.md`: 開発中feature一覧テンプレート
- `DOCS_INDEX_TEMPLATE.md`: ドキュメント索引テンプレート
- `ARCHITECTURE_TEMPLATE.md`: プロジェクトアーキテクチャテンプレート

### ワークフロー強化
- **セッション開始**: プロジェクト全体のドキュメント構造確認を追加
- **Feature開発**: アーキテクチャ確認、feature登録、ADR提案を追加
- **セッション終了**: プロジェクトレベルドキュメント更新判断を追加

### 後方互換性
- 既存のfeatureベースドキュメント構造は引き続きサポート
- ドキュメント構造が不完全なプロジェクトにも柔軟に対応

### レビュー結果（Gemini CLI）
- 総合評価: **S (Excellent)** 🏆
- 達成度: **99%** (v2.1: 98% → 向上)
- 判定: **APPROVE (承認)**
- 評価: スケーラビリティとアーキテクチャ整合性が付加され、個人開発から大規模チーム開発までシームレスに対応可能
- 詳細: `references/REVIEW_FEEDBACK_V8.md`

---

## v2.1 (2026-01-18) - S評価達成 🏆

### 改善点
- **情報の重複削除**: Core Capabilitiesセクション削除、Agent Instructionsに統合
- **Manual-first approach**: スクリプト使用を「ユーザー明示指示時のみ」に制限
- **既存プロジェクト対応**: Existing Project Integrationセクション新設
- **行数最適化**: 176行 → 160行（16行削減）

### レビュー結果
- 総合評価: **S (Excellent)**
- S評価達成度: 98%
- 承認: APPROVE（リリース推奨）

---

## v2.0 (2026-01-18) - 公式仕様準拠版

### 主要変更
- **skill.yaml削除**: 非公式ファイルを削除、SKILL.mdに統合
- **公式仕様準拠**: YAML frontmatter + Markdown指示形式
- **ディレクトリ整理**: 開発ドキュメントをreferences/に移動
- **柔軟な時間設定**: 15/30/45/60/90分のセッション時間対応

### レビュー結果
- 総合評価: A (優良)
- 公式仕様準拠度: 高

---

## v1.0 (2026-01-16) - 初期リリース

### 主要機能
- ドキュメント駆動開発（SPEC, DESIGN, TEST_PLAN, ROADMAP, CONTEXT）
- 短時間開発セッション管理（30分固定）
- 作業中断・再開サポート
- 技術スタック非依存
