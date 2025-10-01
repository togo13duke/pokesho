# Implementation Plan: 後手の駒セット変更と初期配置の左右反転

**Branch**: `002-` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ Feature spec loaded successfully
2. Fill Technical Context
   → ✅ Detected: React + TypeScript, Vite, TailwindCSS
   → ✅ Structure Decision: Single project (frontend only)
3. Fill the Constitution Check section
   → ✅ Constitution v1.0.0 loaded
4. Evaluate Constitution Check section
   → ✅ No violations detected
   → ✅ Progress Tracking: Initial Constitution Check PASSED
5. Execute Phase 0 → research.md
   → ✅ research.md created (existing codebase analyzed, constitution check passed)
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → ✅ data-model.md created
   → ✅ quickstart.md created
   → ✅ contracts/ directory created (4 contract files)
   → ✅ CLAUDE.md updated
7. Re-evaluate Constitution Check section
   → ✅ No new violations
   → ✅ Progress Tracking: Post-Design Constitution Check PASSED
8. Plan Phase 2 → Task generation approach described below
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phase 2 is executed by the /tasks command.

## Summary

この機能は、視覚的区別とゲームバランス向上のため、後手の駒セットを変更します。先手は従来通りピカチュウ+御三家（フシギダネ、ゼニガメ、ヒトカゲ）を使用し、後手はテラパゴス+第九世代御三家（ニャオハ、クワッス、ホゲータ）を使用します。

また、初期配置で先手と後手のぞう役ときりん役を左右反転させることで、戦略性を向上させます。

**技術的アプローチ**:
- 型定義の拡張（`PieceType` に5種類追加）
- 役職ベースの駒変換ロジック（捕獲時に役職を保持し、捕獲者の駒セットに変換）
- 初期配置の更新（player2を後手用駒セットに変更）
- PokeAPI IDマッピングの追加
- 既存のゲームロジック、移動ルール、画像キャッシュとの互換性を維持

## Technical Context
**Language/Version**: TypeScript 5.6 with React 19
**Primary Dependencies**: React 19, Vite 7, TailwindCSS 3.4, PokeAPI
**Storage**: localStorage (画像キャッシュ)
**Testing**: Vitest (想定)
**Target Platform**: ブラウザ（Cloudflare Pages）
**Project Type**: single（フロントエンドのみ）
**Performance Goals**: 駒の移動レスポンス16ms以内（60fps）、初回ロード5秒以内、2回目以降1秒以内
**Constraints**: オフライン動作可能、バンドルサイズ500KB以下（gzip圧縮後）、最小限の依存関係
**Scale/Scope**: 8ファイル変更（型定義、定数、ユーティリティ、初期配置）、1ファイル新規作成（駒変換ロジック）

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. シンプルで直感的なUI
- ✅ 駒の視覚的区別により、先手と後手の識別が容易に
- ✅ 既存のワンクリック操作は変更なし
- ✅ 移動ルールは変更なし（役職は同一）

### II. 最小限の依存関係
- ✅ 新しいライブラリは不要
- ✅ React Hooksのみで実装可能

### III. ローカル優先設計
- ✅ 新しいポケモン画像も既存のキャッシュ機構で対応
- ✅ オフライン動作に影響なし

### IV. パフォーマンス第一
- ✅ 駒の種類が増えても、移動ロジックの計算量は変わらず
- ✅ 画像キャッシュは既存機構で対応

### V. アクセシビリティ
- ✅ 視覚的な区別が改善
- ✅ alt属性やaria-labelは既存の仕組みで対応

### 技術制約チェック
- ✅ React 19 + TypeScript環境を維持
- ✅ PokeAPIを利用
- ✅ クライアントサイドで完結
- ✅ バンドルサイズへの影響は最小限

### 憲法チェック結果
- ✅ Initial Constitution Check: PASS
- ✅ Post-Design Constitution Check: PASS
- ✅ 違反なし、正当化不要

## Project Structure

### Documentation (this feature)
```
specs/002-/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command) ✅
├── data-model.md        # Phase 1 output (/plan command) ✅
├── quickstart.md        # Phase 1 output (/plan command) ✅
├── contracts/           # Phase 1 output (/plan command) ✅
│   ├── type-definitions.contract.md
│   ├── piece-conversion.contract.md
│   ├── initial-board.contract.md
│   └── pokemon-constants.contract.md
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── types/
│   └── piece.ts                    # 変更: PieceType拡張、Role型追加
├── constants/
│   └── pokemon.ts                  # 変更: POKEMON_ID_MAP拡張
├── utils/
│   ├── pieceConversion.ts          # 新規: 駒変換ロジック
│   ├── initialBoard.ts             # 変更: player2の初期配置
│   ├── gameLogic.ts                # 変更: 王将役の汎用化
│   ├── moveRules.ts                # 変更: 後手用ポケモンのルール追加
│   └── imageCache.ts               # 変更なし（新しいIDに対応済み）
├── hooks/
│   └── useGameState.ts             # 小変更: 駒変換ロジックの統合
└── components/
    └── CapturedPieces.tsx          # 変更なし（型が拡張されるため自動対応）

tests/
├── unit/
│   ├── pieceConversion.test.ts     # 新規
│   ├── initialBoard.test.ts        # 変更
│   └── gameLogic.test.ts           # 変更
└── integration/
    └── pokemon-api.integration.test.ts  # 新規
```

**Structure Decision**: Single project構造を選択。フロントエンドのみのReactアプリケーションであり、バックエンドは不要。既存の`src/`ディレクトリ構造を維持し、必要な箇所のみ変更・追加。

## Phase 0: Outline & Research

**Status**: ✅ Complete

**Output**: [research.md](./research.md)

### 実施内容
1. **既存コードベース調査**:
   - `src/types/piece.ts`: 型定義の現状把握
   - `src/constants/pokemon.ts`: PokeAPI IDマッピングの確認
   - `src/utils/initialBoard.ts`: 初期配置ロジックの確認
   - `src/utils/moveRules.ts`: 移動ルールの確認
   - `src/utils/gameLogic.ts`: 勝敗判定ロジックの確認

2. **技術的決定事項**:
   - PieceTypeを拡張（10種類に）
   - 役職ベースの変換ロジック実装（`pieceConversion.ts`）
   - PokeAPI ID確認（テラパゴス: 1024、ニャオハ: 906、クワッス: 912、ホゲータ: 909、ラウドボーン: 911）

3. **憲法チェック**: すべての原則をクリア

4. **リスクと対策**: PokeAPI取得失敗時のフォールバックは既存機構を利用

## Phase 1: Design & Contracts

**Status**: ✅ Complete

**Output**:
- [data-model.md](./data-model.md)
- [quickstart.md](./quickstart.md)
- [contracts/](./contracts/)
- [CLAUDE.md](../../CLAUDE.md) (updated)

### 1. Data Model
- `PieceType`: 5種類 → 10種類に拡張
- `Role`: 新規追加（5種類の役職）
- `RoleToPieceMap`: 役職 × プレイヤー → 駒タイプ
- `PieceToRoleMap`: 駒タイプ → 役職
- `POKEMON_ID_MAP`: 5種類 → 10種類に拡張

### 2. Contracts
- **type-definitions.contract.md**: PieceTypeとRole型の契約
- **piece-conversion.contract.md**: 駒変換ロジックの契約
- **initial-board.contract.md**: 初期配置の契約
- **pokemon-constants.contract.md**: PokeAPI IDマッピングの契約

各契約にはテストケースが含まれており、実装時に契約テストを作成します。

### 3. Quickstart
手動での検証手順を定義（9ステップ）:
1. 初期配置の確認
2. 駒の移動ルールの確認
3. 進化機能の確認
4. 駒の捕獲と変換
5. 手駒の配置
6. 勝敗判定
7. 画像の取得とキャッシュ
8. エッジケースの確認
9. ビルドとTypeScriptチェック

### 4. Agent Context Update
CLAUDE.mdを更新し、新しい技術コンテキスト（駒セット変更、駒変換ロジック）を追加。

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. Load `.specify/templates/tasks-template.md` as base
2. Generate tasks from Phase 1 design docs:
   - 各契約 → 契約テスト作成タスク [P]
   - 各エンティティ → 型定義/定数更新タスク [P]
   - 駒変換ロジック → 新規ユーティリティ作成タスク
   - 初期配置 → 既存ユーティリティ更新タスク
   - ゲームロジック → 既存ロジック更新タスク
   - 統合テスト → quickstart.md ベースのテストタスク

**Ordering Strategy**:
1. **Phase A: 型定義とデータ層** [P]
   - PieceType拡張
   - Role型追加
   - POKEMON_ID_MAP拡張
   - 契約テスト作成（型定義、定数）

2. **Phase B: 駒変換ロジック** [P]
   - pieceConversion.ts作成
   - PIECE_TO_ROLE_MAP / ROLE_TO_PIECE_MAP定義
   - 契約テスト作成（駒変換）

3. **Phase C: 初期配置とゲームロジック**
   - initialBoard.ts更新（player2の配置変更）
   - moveRules.ts更新（後手用ポケモンのルール追加）
   - gameLogic.ts更新（王将役の汎用化）
   - 契約テスト作成（初期配置）

4. **Phase D: 統合と検証**
   - useGameState.ts更新（駒変換ロジック統合）
   - 統合テスト実行
   - quickstart.md手動検証
   - ビルドとTypeScriptチェック

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**Dependencies**:
- Phase Aのタスクは並列実行可能 [P]
- Phase Bは Phase A完了後
- Phase Cは Phase B完了後
- Phase Dは Phase C完了後

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

（該当なし：憲法違反なし）

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
