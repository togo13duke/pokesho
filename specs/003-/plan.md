
# Implementation Plan: 後手駒の向き反転と視認性向上

**Branch**: `003-` | **Date**: 2025-10-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/togo/Repositories/pokesho/specs/003-/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
この機能は、ポケモン将棋の視認性を向上させるため、以下の3つの主要な改善を実装します:
1. **後手駒の180度回転表示**: 対面プレイ時に両プレイヤーが自分の駒を正しい向きで見られるよう、後手の駒を上下逆向きに表示
2. **移動方向マーカーの追加**: 全ての駒の周囲に移動可能方向を示す小さな三角形や点を常時表示し、初心者にも分かりやすく
3. **ターン表示色の適用**: 盤面全体とメッセージエリアの背景色を、現在のターン（先手: #E3F2FD、後手: #FFEBEE）に応じて変化させ、手駒エリアは所有プレイヤーの色で常時表示

## Technical Context
**Language/Version**: TypeScript 5.x (React 19)
**Primary Dependencies**: React 19, Vite 7, TailwindCSS 3.4
**Storage**: N/A（UIのみの機能、状態はReact state管理）
**Testing**: Vite標準のテスト環境（React Testing Library想定）
**Target Platform**: ブラウザ（モダンブラウザ対応）
**Project Type**: single（既存のReact + Viteプロジェクト）
**Performance Goals**: 駒の回転・マーカー描画は16ms以内（60fps維持）、色変更は即座に反映
**Constraints**: オフライン動作必須、バンドルサイズ増加は最小限（アイコン/SVG使用で<5KB）、既存のコンポーネント構造を維持
**Scale/Scope**: 既存の5コンポーネント（Piece.tsx, Board.tsx, Cell.tsx, TurnDisplay.tsx, CapturedPieces.tsx）の修正が中心

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. シンプルで直感的なUI
- ✅ **準拠**: 移動方向マーカーの追加により、初心者でもルールを理解しやすくなる
- ✅ **準拠**: ターン表示色により、現在の手番が一目で分かる
- ✅ **準拠**: 後手駒の回転により、対面プレイ時の視認性が向上
- ⚠️ **注意**: マーカーのデザインは駒画像と明確に区別でき、視覚的にシンプルであること

### II. 最小限の依存関係
- ✅ **準拠**: 新規ライブラリの追加なし（CSS transform、SVG/Tailwindのみ使用）
- ✅ **準拠**: 既存のReact + TailwindCSSで実装可能

### III. ローカル優先設計
- ✅ **準拠**: 完全にクライアントサイドのUI変更のみ、外部API不要
- ✅ **準拠**: すべての処理はブラウザ内で完結

### IV. パフォーマンス第一
- ✅ **準拠**: CSS transformによる回転は高速（GPU加速）
- ✅ **準拠**: 色変更はTailwindクラスの切り替えのみで即座
- ⚠️ **注意**: 移動方向マーカーの描画が再レンダリングを引き起こさないよう、React.memoを活用
- ⚠️ **検証必要**: 12駒×複数マーカーの描画が60fps（16ms以内）を維持すること

### V. アクセシビリティ
- ✅ **準拠**: 色変更は背景色のみで、テキストコントラストは維持
- ⚠️ **注意**: 移動方向マーカーにaria-label付与が必要
- ⚠️ **注意**: 色覚異常を考慮し、青/赤の明度差を十分確保（WCAG AA準拠）

**初期判定**: PASS（注意事項は設計時に対応）

---

**Phase 1設計後の再評価**:

### I. シンプルで直感的なUI
- ✅ **準拠**: マーカーデザインは小さな三角形/点で、駒画像と明確に区別（research.md確認済み）
- ✅ **準拠**: 実装方法がシンプル（SVG polygon、数ポイントのみ）

### II. 最小限の依存関係
- ✅ **準拠**: 新規依存ゼロ、インラインSVGとTailwindクラスのみ

### III. ローカル優先設計
- ✅ **準拠**: すべてクライアントサイドで完結、外部リソース不要

### IV. パフォーマンス第一
- ✅ **準拠**: React.memo + useMemoによる最適化を設計に明記（data-model.md）
- ✅ **準拠**: パフォーマンス検証手順をquickstart.mdに記載（60fps維持確認）
- ✅ **準拠**: CSS transformはGPU加速、Tailwindクラス切り替えは高速

### V. アクセシビリティ
- ✅ **準拠**: aria-label付与を契約に明記（contracts/component-interface.md）
- ✅ **準拠**: 色コントラスト検証をresearch.mdに記載（WCAG AA準拠）

**最終判定**: PASS（すべての憲法原則に準拠、複雑性の追加なし）

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/           # React UIコンポーネント（修正対象）
│   ├── Piece.tsx        # 駒コンポーネント（回転、マーカー追加）
│   ├── Board.tsx        # 盤面コンポーネント（背景色変更）
│   ├── Cell.tsx         # セルコンポーネント（影響なし）
│   ├── TurnDisplay.tsx  # ターン表示（背景色変更）
│   ├── CapturedPieces.tsx # 手駒エリア（背景色追加）
│   └── GameOverMessage.tsx # 勝敗メッセージ（影響なし）
├── hooks/               # カスタムフック（修正不要）
│   ├── useGameState.ts
│   └── useImageCache.ts
├── utils/               # ゲームロジック（修正不要）
│   ├── gameLogic.ts
│   ├── moveRules.ts     # 移動ルール（マーカー生成に参照）
│   ├── initialBoard.ts
│   └── imageCache.ts
├── types/               # 型定義（新規追加の可能性）
│   ├── game.ts
│   └── piece.ts
└── constants/           # 定数（色定義追加）
    └── pokemon.ts
```

**Structure Decision**: 既存のsingle project構造を維持。主に`src/components/`配下の既存コンポーネント5ファイルを修正し、`src/constants/`に新しい色定義を追加する。新規コンポーネントの追加は不要（既存コンポーネントの拡張で対応）。

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

**実施済み**: `/Users/togo/Repositories/pokesho/specs/003-/research.md` に以下を記載:
- CSS transformによる駒回転（GPU加速、Tailwind `rotate-180`）
- SVG polygonによる移動方向マーカー（バンドルサイズ増加なし）
- Tailwind標準色（blue-50/red-50）によるターン表示
- React.memo + useMemoによるパフォーマンス最適化
- aria-labelによるアクセシビリティ対応

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

**実施済み**:
- ✅ `data-model.md`: 新規型定義（Direction, PlayerColor）、既存型の拡張方針を記載
- ✅ `contracts/component-interface.md`: コンポーネント契約とcontract tests定義
- ✅ `quickstart.md`: 7ステップの動作確認手順（回転、マーカー、色、パフォーマンス等）
- ✅ `CLAUDE.md`: TypeScript/React/Tailwindの技術情報を追加（update-agent-context.sh実行済み）

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **型定義タスク**:
   - `Direction`型の追加（src/types/piece.ts）
   - `PlayerColor`型と`PLAYER_COLORS`定数の追加（src/types/game.ts）
   - 色定数ファイルの作成（src/constants/colors.ts）

2. **Utilityロジックタスク**:
   - `getPossibleMoveDirections`関数の実装（src/utils/moveRules.ts）
   - 既存の移動ルールから方向を抽出するロジック

3. **コンポーネント修正タスク**（優先順位順）:
   - `Piece.tsx`: 駒の回転 + 移動方向マーカー表示（最重要）
   - `Board.tsx`: ターン表示色の背景適用
   - `TurnDisplay.tsx`: ターン表示色の背景適用
   - `CapturedPieces.tsx`: プレイヤー固定色の背景適用

4. **Contract Testタスク**（各コンポーネント修正後）:
   - Piece component tests（回転、マーカー、aria-label）
   - Board component tests（背景色切り替え）
   - TurnDisplay component tests（背景色）
   - CapturedPieces component tests（固定色）
   - getPossibleMoveDirections unit tests

5. **統合テスト**:
   - quickstart.mdの7ステップ手動検証
   - パフォーマンステスト（Chrome DevTools）
   - アクセシビリティテスト（スクリーンリーダー）

**Ordering Strategy**:
- 型定義 → Utility関数 → コンポーネント修正 → テスト
- コンポーネント間の依存: Piece（独立）→ Board/TurnDisplay/CapturedPieces（並列可）
- [P]マーク: 型定義3タスク、Board/TurnDisplay/CapturedPieces修正（Piece完了後）

**Estimated Output**: 約20タスク
- 型定義: 3タスク
- Utility関数: 2タスク（実装 + テスト）
- コンポーネント修正: 4タスク
- Contract tests: 5タスク
- 統合検証: 3タスク
- ドキュメント更新: 3タスク（README、進捗記録等）

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented（偏差なし）

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
