
# Implementation Plan: ポケモン将棋

**Branch**: `001-3x4-2` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/togo/Repositories/pokesho/specs/001-3x4-2/spec.md`

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

どうぶつしょうぎのルールをベースにしたポケモン将棋をブラウザゲームとして実装。3×4盤面で2人対戦、駒の移動・キャプチャ・進化・勝敗判定を含む完全なゲームロジックをReact + TypeScript + Viteで構築。PokeAPIから画像を取得してlocalStorageにキャッシュし、オフラインで動作する軽量なWebアプリケーション。

## Technical Context
**Language/Version**: TypeScript 5.8.3 (React 19.1.1)
**Primary Dependencies**: React 19, Vite 7, TailwindCSS, PokeAPI (画像取得のみ)
**Storage**: localStorage (画像キャッシュ)
**Testing**: Vitest (Vite標準)
**Target Platform**: モダンブラウザ（Chrome, Firefox, Safari, Edge最新版）
**Project Type**: single (フロントエンドのみの単一プロジェクト)
**Performance Goals**: 60fps駒移動、初回ロード5秒以内、キャッシュヒット時1秒以内
**Constraints**: オフライン動作必須、バンドルサイズ500KB以下、サーバーサイド処理なし
**Scale/Scope**: 小規模（1画面、ローカル2人対戦のみ）

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. シンプルで直感的なUI
✅ **PASS** - ワンクリック操作、ハイライト表示、ターン表示はすべてFRで明確に定義済み

### II. 最小限の依存関係
✅ **PASS** - React + TypeScript + Vite + TailwindCSSのみ使用、追加ライブラリなし

### III. ローカル優先設計
✅ **PASS** - PokeAPI画像はlocalStorageにキャッシュ、ゲームロジックは完全クライアントサイド

### IV. パフォーマンス第一
✅ **PASS** - 60fps目標、React.memo/useMemo活用予定、NFR-001〜003で明確化済み

### V. アクセシビリティ
✅ **PASS** - aria-label、キーボード操作、カラーコントラスト考慮を設計に含める

### 技術制約
✅ **PASS** - React 19 + TypeScript + Vite + TailwindCSS + localStorage使用、サーバーレス

### パフォーマンス基準
✅ **PASS** - NFR-001〜003で5秒/1秒/16msの基準を満たす設計

**結論**: すべての憲法原則に準拠。違反なし。

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
├── components/
│   ├── Board.tsx           # 盤面コンポーネント
│   ├── Cell.tsx            # マスコンポーネント
│   ├── Piece.tsx           # 駒コンポーネント
│   ├── CapturedPieces.tsx  # 手駒表示エリア
│   ├── TurnDisplay.tsx     # ターン表示
│   └── GameOverMessage.tsx # 勝敗メッセージ
├── hooks/
│   ├── useGameState.ts     # ゲーム状態管理
│   └── useImageCache.ts    # 画像キャッシュ管理
├── types/
│   ├── game.ts             # ゲーム関連型定義
│   └── piece.ts            # 駒関連型定義
├── utils/
│   ├── moveRules.ts        # 駒の移動ルール
│   ├── gameLogic.ts        # ゲームロジック（勝敗判定など）
│   ├── initialBoard.ts     # 初期配置
│   └── imageCache.ts       # 画像キャッシュ機能
├── constants/
│   └── pokemon.ts          # ポケモン定数（ID、名前など）
├── App.tsx                 # メインアプリケーション
└── main.tsx                # エントリーポイント

public/
└── placeholder/
    └── piece-placeholder.png # プレースホルダー画像
```

**Structure Decision**: 単一プロジェクト構成（Option 1）を採用。フロントエンドのみのReactアプリケーションとして、src/配下にcomponents, hooks, types, utils, constantsを配置。テストは後述のquickstart.mdで手動テストを優先し、自動テストは将来の拡張として位置づける。

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

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

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
- [x] Complexity deviations documented (なし)

**Generated Artifacts**:
- ✅ `/specs/001-3x4-2/plan.md` (このファイル)
- ✅ `/specs/001-3x4-2/research.md`
- ✅ `/specs/001-3x4-2/data-model.md`
- ✅ `/specs/001-3x4-2/quickstart.md`
- ✅ `/specs/001-3x4-2/tasks.md` (/tasks コマンドで生成)
- ✅ `/CLAUDE.md` (更新完了)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
