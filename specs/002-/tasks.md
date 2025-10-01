# Tasks: 後手の駒セット変更と初期配置の左右反転

**Input**: Design documents from `/specs/002-/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Tech stack: React 19, TypeScript 5.6, Vite 7, TailwindCSS 3.4
   → ✅ Structure: Single project (src/, tests/)
2. Load optional design documents:
   → ✅ data-model.md: PieceType, Role, RoleToPieceMap, PieceToRoleMap
   → ✅ contracts/: 4 contract files
   → ✅ research.md: 技術的決定事項を抽出
3. Generate tasks by category:
   → Setup: なし（既存プロジェクト）
   → Tests: 契約テスト4件、統合テスト
   → Core: 型定義、定数、駒変換ロジック、初期配置、ゲームロジック
   → Integration: フック統合
   → Polish: ビルド、Lint、手動検証
4. Apply task rules:
   → 異なるファイル = [P]
   → 同じファイル = 順次
   → テストを実装前に作成（TDD）
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All contracts have tests
   → ✅ All entities have models
   → ✅ All logic implemented
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root (このプロジェクトはこの構造)
- Paths are absolute from repository root

---

## Phase 3.1: Setup
（既存プロジェクトのため、セットアップタスクなし）

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### 契約テスト
- [x] **T001** [P] 型定義の契約テストを作成: `src/types/piece.test.ts`
  - PieceTypeが10種類のリテラル型を受け入れることを検証
  - Roleが5種類のリテラル型を受け入れることを検証
  - 契約: `specs/002-/contracts/type-definitions.contract.md`

- [x] **T002** [P] 駒変換ロジックの契約テストを作成: `src/utils/pieceConversion.test.ts`
  - 王将役の変換テスト（terapagos → pikachu、pikachu → terapagos）
  - ひよこ役の変換テスト（fuecoco → charmander、charmander → fuecoco）
  - 進化駒の変換テスト（skeledirge → charmander、charizard → fuecoco）
  - すべての役職の変換テスト（全組み合わせ）
  - 契約: `specs/002-/contracts/piece-conversion.contract.md`

- [x] **T003** [P] 初期配置の契約テストを作成: `src/utils/initialBoard.test.ts`
  - player1の初期配置検証（bulbasaur, pikachu, squirtle, charmander）
  - player2の初期配置検証（quaxly, terapagos, sprigatito, fuecoco）
  - ぞう役ときりん役の左右反転検証
  - 駒の個数検証（各プレイヤー4駒）
  - 契約: `specs/002-/contracts/initial-board.contract.md`

- [x] **T004** [P] PokeAPI IDマッピングの契約テストを作成: `src/constants/pokemon.test.ts`
  - POKEMON_ID_MAPが10種類すべて定義されていることを検証
  - player1用ポケモンのID検証（pikachu: 25, bulbasaur: 1, squirtle: 7, charmander: 4, charizard: 6）
  - player2用ポケモンのID検証（terapagos: 1024, sprigatito: 906, quaxly: 912, fuecoco: 909, skeledirge: 911）
  - 契約: `specs/002-/contracts/pokemon-constants.contract.md`

### 統合テスト
- [x] **T005** [P] PokeAPI統合テストを作成: `src/constants/pokemon.integration.test.ts`
  - すべてのPOKEMON_ID_MAPのIDに対してPokeAPIから画像が取得できることを検証
  - タイムアウト: 30秒

**重要**: T001-T005のテストはすべて失敗する状態で作成すること（実装前のため）

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### 型定義層
- [x] **T006** [P] PieceType拡張: `src/types/piece.ts`
  - 後手用5種類を追加（terapagos, sprigatito, quaxly, fuecoco, skeledirge）
  - Role型を新規追加（king, elephant, giraffe, chick, hen）
  - T001のテストがパスすることを確認

### 定数層
- [x] **T007** [P] POKEMON_ID_MAP拡張: `src/constants/pokemon.ts`
  - 後手用5種類のPokeAPI IDを追加
  - T004のテストがパスすることを確認

### 駒変換ロジック層（新規ファイル）
- [x] **T008** 駒変換ユーティリティ作成: `src/utils/pieceConversion.ts`
  - PIECE_TO_ROLE_MAP定義（10種類のPieceType → Role）
  - ROLE_TO_PIECE_MAP定義（Player × Role → PieceType）
  - convertCapturedPiece関数実装
    - 捕獲された駒の役職を取得
    - 進化駒は未進化に戻す
    - 捕獲者の駒セットに変換
  - T002のテストがパスすることを確認

### 初期配置層
- [x] **T009** 初期配置の更新: `src/utils/initialBoard.ts`
  - player2の後列を変更（quaxly, terapagos, sprigatito）
  - player2の前列中央をfuecocoに変更
  - T003のテストがパスすることを確認

### 移動ルール層
- [x] **T010** 移動ルールの追加: `src/utils/moveRules.ts`
  - terapagos（王将）の移動ルール追加
  - sprigatito（ぞう）の移動ルール追加
  - quaxly（きりん）の移動ルール追加
  - fuecoco（ひよこ）の移動ルール追加
  - skeledirge（にわとり）の移動ルール追加

### ゲームロジック層
- [x] **T011** ゲームロジックの汎用化: `src/utils/gameLogic.ts`
  - checkPikachuCapture → checkKingCapture に変更（pikachu と terapagos を王将役として扱う）
  - checkTry の王将役判定を汎用化（PIECE_TO_ROLE_MAPを使用）
  - evaluateGameStatus の更新

---

## Phase 3.4: Integration

### フック統合
- [x] **T012** ゲーム状態フックの統合: `src/hooks/useGameState.ts`
  - movePiece関数に駒変換ロジックを統合
    - 駒を捕獲した際、convertCapturedPieceを呼び出す
  - placeCapturedPiece関数の動作確認（型が拡張されたため、自動対応されているはず）

---

## Phase 3.5: Polish

### ビルドと検証
- [x] **T013** [P] TypeScriptビルド検証
  - `npm run build` を実行し、エラーがないことを確認
  - 型エラーが0件であることを確認

- [x] **T014** [P] Lintチェック
  - `npm run lint` を実行し、エラーがないことを確認

### 手動検証
- [x] **T015** quickstart.mdによる手動検証
  - 初期配置の確認（先手・後手の駒セットと配置）
  - 駒の移動ルールの確認（すべての役職）
  - 進化機能の確認（ホゲータ → ラウドボーン）
  - 駒の捕獲と変換（すべての組み合わせ）
  - 手駒の配置
  - 勝敗判定（王将役の捕獲、敵陣到達）
  - 画像の取得とキャッシュ
  - エッジケースの確認
  - quickstart.md: `specs/002-/quickstart.md`
  - FR-006: 移動ルールの同一性確認

---

## Dependencies

```
Phase 3.2 (Tests)
  ├─ T001-T005 [P] (parallel, different files)
  └─ GATE: All tests must FAIL before proceeding

Phase 3.3 (Core Implementation)
  ├─ T006, T007 [P] (parallel, different files)
  ├─ T008 (depends on T006 - needs Role type)
  ├─ T009 (depends on T006 - needs PieceType extension)
  ├─ T010 (depends on T006 - needs PieceType extension)
  └─ T011 (depends on T008 - needs PIECE_TO_ROLE_MAP)

Phase 3.4 (Integration)
  └─ T012 (depends on T008, T011)

Phase 3.5 (Polish)
  ├─ T013, T014 [P] (parallel, independent)
  └─ T015 (depends on T013, T014)
```

---

## Parallel Execution Examples

### Tests (Phase 3.2)
```bash
# Launch T001-T005 together:
```
```
Task: "型定義の契約テストを作成: src/types/piece.test.ts"
Task: "駒変換ロジックの契約テストを作成: src/utils/pieceConversion.test.ts"
Task: "初期配置の契約テストを作成: src/utils/initialBoard.test.ts"
Task: "PokeAPI IDマッピングの契約テストを作成: src/constants/pokemon.test.ts"
Task: "PokeAPI統合テストを作成: src/constants/pokemon.integration.test.ts"
```

### Core Implementation (Phase 3.3)
```bash
# Launch T006-T007 together (after T001-T005 fail):
```
```
Task: "PieceType拡張: src/types/piece.ts"
Task: "POKEMON_ID_MAP拡張: src/constants/pokemon.ts"
```

### Polish (Phase 3.5)
```bash
# Launch T013-T014 together:
```
```
Task: "TypeScriptビルド検証"
Task: "Lintチェック"
```

---

## Notes
- **[P] tasks** = 異なるファイル、依存関係なし
- **TDD原則**: テストが失敗することを確認してから実装
- **契約テスト**: 各契約ファイル（contracts/）に対応するテストを作成
- **統合テスト**: PokeAPIとの統合を検証
- **手動検証**: quickstart.mdの全ステップを実行
- **型安全性**: TypeScriptの型システムを活用し、コンパイルエラーをゼロに

---

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - ✅ 4 contract files → 4 contract test tasks [P] (T001-T004)
   - ✅ 1 integration scenario → 1 integration test task [P] (T005)

2. **From Data Model**:
   - ✅ PieceType entity → T006
   - ✅ Role entity → T006
   - ✅ POKEMON_ID_MAP → T007
   - ✅ RoleToPieceMap, PieceToRoleMap → T008

3. **From Research**:
   - ✅ 初期配置の変更 → T009
   - ✅ 移動ルールの追加 → T010
   - ✅ ゲームロジックの汎用化 → T011

4. **Ordering**:
   - ✅ Tests (T001-T005) → Core (T006-T011) → Integration (T012) → Polish (T013-T015)

---

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (T001-T004)
- [x] All entities have model tasks (T006-T008)
- [x] All tests come before implementation (T001-T005 before T006-T011)
- [x] Parallel tasks truly independent ([P] tasks use different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task

---

## 総タスク数: 15

**Phase 3.2**: 5タスク（テスト）
**Phase 3.3**: 6タスク（実装）
**Phase 3.4**: 1タスク（統合）
**Phase 3.5**: 3タスク（検証）
