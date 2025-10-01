# Tasks: 後手駒の向き反転と視認性向上

**Input**: Design documents from `/Users/togo/Repositories/pokesho/specs/003-/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/component-interface.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript 5.x, React 19, Vite 7, TailwindCSS 3.4
2. Load design documents:
   → data-model.md: Direction型、PlayerColor型、colors.ts定数
   → contracts/: Piece, Board, TurnDisplay, CapturedPieces, getPossibleMoveDirections
   → research.md: CSS transform、SVG polygon、React.memo最適化
3. Generate tasks by category:
   → Setup: 型定義、定数ファイル
   → Utility: getPossibleMoveDirections関数
   → Components: Piece, Board, TurnDisplay, CapturedPieces
   → Tests: Contract tests for each component
   → Polish: 統合検証、パフォーマンステスト
4. Apply task rules:
   → 型定義3タスク[P]（異なるファイル）
   → コンポーネント修正はPiece完了後に他3つ[P]可能
   → Contract testsは対応コンポーネント完了後に[P]可能
5. Number tasks sequentially (T001, T002...)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/` at repository root
- Paths shown below use `/Users/togo/Repositories/pokesho/src/`

---

## Phase 3.1: Setup - 型定義と定数

- [x] **T001 [P]** `src/types/piece.ts`にDirection型を追加
  ```typescript
  export type Direction =
    | 'up' | 'down' | 'left' | 'right'
    | 'upLeft' | 'upRight' | 'downLeft' | 'downRight';
  ```
  **参照**: data-model.md Section 3

- [x] **T002 [P]** `src/types/game.ts`にPlayerColor型とPLAYER_COLORS定数を追加
  ```typescript
  export type PlayerColor = 'bg-blue-50' | 'bg-red-50';
  export const PLAYER_COLORS: Record<Player, PlayerColor> = {
    player1: 'bg-blue-50',
    player2: 'bg-red-50',
  };
  ```
  **参照**: data-model.md Section 4

- [x] **T003 [P]** `src/constants/colors.ts`を新規作成し、TURN_COLORSとCOLOR_CONTRAST_INFOを定義
  ```typescript
  export const TURN_COLORS = {
    player1: 'bg-blue-50',
    player2: 'bg-red-50',
  } as const;
  export const COLOR_CONTRAST_INFO = {
    'bg-blue-50': { hex: '#eff6ff', contrastRatio: 17.5 },
    'bg-red-50': { hex: '#fef2f2', contrastRatio: 18.2 },
  } as const;
  ```
  **参照**: data-model.md 定数定義の追加

---

## Phase 3.2: Utility関数の実装

- [x] **T004** `src/utils/moveRules.ts`にgetPossibleMoveDirections関数を実装
  - 入力: `pieceType: PieceType`, `player: Player`
  - 出力: `Direction[]`
  - ロジック: 既存の移動ルール関数から方向を抽出（ピカチュウ: 6方向、フシギダネ等: 1方向、リザードン: 6方向）
  - player2の場合は方向を反転（'up' → 'down'等）
  **参照**: data-model.md Section 3, contracts/component-interface.md Section 5
  **依存**: T001完了後

---

## Phase 3.3: コンポーネント修正

- [x] **T005** `src/components/Piece.tsx`に駒の回転と移動方向マーカーを実装
  - **回転実装**:
    - `piece.player === 'player2'`の場合、駒を囲むdivに`rotate-180`クラスを適用
    - CSS transformでGPU加速による回転
  - **マーカー実装**:
    - `useMemo`で`getPossibleMoveDirections(piece.type, piece.player)`を呼び出し、結果をキャッシュ
    - 各方向に対してSVG `<polygon>`を生成（三角形: `points="0,0 5,10 -5,10"`）
    - Tailwindクラスで配置（例: 上方向 = `absolute top-0 left-1/2 -translate-x-1/2`）
    - 各SVGに`aria-label="[方向]に移動可能"`を付与
    - マーカー色: `text-gray-600`（駒画像と区別）
  - **最適化**: コンポーネント全体を`React.memo`でラップ
  **参照**: research.md Section 1-2, contracts/component-interface.md Section 1, data-model.md コンポーネントProps拡張
  **依存**: T001, T004完了後

- [x] **T006 [P]** `src/components/Board.tsx`にターン表示色の背景を実装
  - Props: `currentTurn: Player`を受け取る（既存実装で受け取っている可能性あり、未受け取りなら追加）
  - 盤面全体を囲む要素に`className`で動的クラスを適用:
    ```tsx
    className={`board ${currentTurn === 'player1' ? 'bg-blue-50' : 'bg-red-50'}`}
    ```
  **参照**: contracts/component-interface.md Section 2, research.md Section 3
  **依存**: T002完了後、T005完了後（Pieceコンポーネントが先）

- [x] **T007 [P]** `src/components/TurnDisplay.tsx`にターン表示色の背景を実装
  - Props: `currentTurn: Player`を受け取る
  - 要素全体に動的背景色クラスを適用:
    ```tsx
    className={`turn-display ${currentTurn === 'player1' ? 'bg-blue-50' : 'bg-red-50'}`}
    ```
  **参照**: contracts/component-interface.md Section 3, research.md Section 3
  **依存**: T002完了後、T005完了後

- [x] **T008 [P]** `src/components/CapturedPieces.tsx`にプレイヤー固定色の背景を実装
  - Props: `player: Player`を明示的に受け取る（既存実装で受け取っている可能性あり）
  - 手駒エリア全体に固定背景色を適用（ターンに関わらず常に同じ色）:
    ```tsx
    className={`captured ${player === 'player1' ? 'bg-blue-50' : 'bg-red-50'}`}
    ```
  - 手駒の駒は現在の所有プレイヤーの向きで表示（`<Piece player={player} />`として渡す）
  **参照**: contracts/component-interface.md Section 4, research.md Section 3
  **依存**: T002完了後、T005完了後

---

## Phase 3.4: Contract Tests（テスト環境がある場合）

**注意**: 既存プロジェクトにテスト環境（React Testing Library等）が未設定の場合、Phase 3.5の手動検証のみ実施

- [ ] **T009 [P]** Piece componentのcontract testを実装（`src/components/Piece.test.tsx`）
  - 後手の駒が`rotate-180`クラスを持つことを検証
  - 先手の駒が`rotate-180`クラスを持たないことを検証
  - 移動方向マーカー（`svg[aria-label*="移動可能"]`）が表示されることを検証
  - 各マーカーにaria-labelが付与されていることを検証
  **参照**: contracts/component-interface.md Section 1
  **依存**: T005完了後

- [ ] **T010 [P]** Board componentのcontract testを実装（`src/components/Board.test.tsx`）
  - `currentTurn="player1"`時に`bg-blue-50`クラスが適用されることを検証
  - `currentTurn="player2"`時に`bg-red-50`クラスが適用されることを検証
  - ターン切り替え時に背景色が変化することを検証
  **参照**: contracts/component-interface.md Section 2
  **依存**: T006完了後

- [ ] **T011 [P]** TurnDisplay componentのcontract testを実装（`src/components/TurnDisplay.test.tsx`）
  - `currentTurn="player1"`時に`bg-blue-50`クラスとテキスト「先手」が表示されることを検証
  - `currentTurn="player2"`時に`bg-red-50`クラスとテキスト「後手」が表示されることを検証
  **参照**: contracts/component-interface.md Section 3
  **依存**: T007完了後

- [ ] **T012 [P]** CapturedPieces componentのcontract testを実装（`src/components/CapturedPieces.test.tsx`）
  - `player="player1"`時に常に`bg-blue-50`クラスが適用されることを検証
  - `player="player2"`時に常に`bg-red-50`クラスが適用されることを検証
  - 手駒の駒が所有プレイヤーの向き（回転なし/あり）で表示されることを検証
  **参照**: contracts/component-interface.md Section 4
  **依存**: T008完了後

- [ ] **T013 [P]** getPossibleMoveDirections関数のunit testを実装（`src/utils/moveRules.test.ts`）
  - ピカチュウが6方向を返すことを検証
  - フシギダネが前方1方向を返すことを検証
  - player2の駒で方向が反転することを検証（'up' → 'down'）
  **参照**: contracts/component-interface.md Section 5
  **依存**: T004完了後

---

## Phase 3.5: 統合検証とポリッシュ

- [ ] **T014** quickstart.mdのStep 1-6を手動で実行し、動作確認
  - Step 1: 後手駒の180度回転確認
  - Step 2: 移動方向マーカー確認（全駒に常時表示、正しい方向数）
  - Step 3: ターン表示色確認（先手: 青、後手: 赤、即座に切り替え）
  - Step 4: 手駒エリア固定色確認（ターンに関わらず所有プレイヤー色維持）
  - Step 5: 進化時の動作確認（ヒトカゲ→リザードン、回転とマーカー）
  - Step 6: アクセシビリティ検証（aria-label読み上げ）
  **参照**: quickstart.md Section 1-6
  **依存**: T005-T008完了後

- [ ] **T015** パフォーマンステスト（Chrome DevTools Performance）
  - 駒の移動時にFPS 60維持（16ms/frame以内）を確認
  - ターン切り替え時の再レンダリングが16ms以内を確認
  - React DevTools Profilerで無駄な再レンダリングがないことを確認
  **参照**: quickstart.md Step 7, research.md Section 4
  **依存**: T014完了後

- [ ] **T016** アクセシビリティ検証
  - スクリーンリーダー（macOS VoiceOver / Windows Narrator）でaria-label読み上げ確認
  - 色コントラスト比がWCAG AA準拠（青/赤背景で17:1以上）を確認
  - キーボード操作でゲームプレイ可能（既存実装の維持確認）
  **参照**: quickstart.md Step 6, research.md Section 5
  **依存**: T014完了後

- [x] **T017** バンドルサイズ確認
  - `npm run build`を実行
  - ビルド後のバンドルサイズ増加が<5KB（SVG/CSSのみ追加）を確認
  - 新規依存ライブラリが追加されていないことを確認
  **参照**: plan.md Constraints
  **依存**: T005-T008完了後
  **結果**: バンドルサイズ 204.13 kB (gzip: 64.74 kB)、新規依存なし

- [x] **T018** ドキュメント更新
  - `docs/progress.md`（存在する場合）に実装完了を記録
  - `specs/003-/tasks.md`の全タスクチェックボックスを完了マーク
  - README.md（必要に応じて）に新機能（移動方向マーカー、ターン表示色）を記載
  **依存**: T014-T017完了後

---

## Dependencies

**Phase順序**:
1. Setup（T001-T003）→ すべて並列可能 [P]
2. Utility（T004）→ T001完了後
3. Components（T005-T008）:
   - T005（Piece）: T001, T004完了後
   - T006-T008（Board/TurnDisplay/CapturedPieces）: T002, T005完了後に並列可能 [P]
4. Tests（T009-T013）: 対応コンポーネント/関数完了後に並列可能 [P]
5. Polish（T014-T018）: T005-T008完了後、順次実行

**依存グラフ**:
```
T001, T002, T003 [P]
  ↓
T004（T001に依存）
  ↓
T005（T001, T004に依存）
  ↓
T006, T007, T008 [P]（T002, T005に依存）
  ↓
T009, T010, T011, T012, T013 [P]（対応する実装タスクに依存）
  ↓
T014 → T015, T016, T017 [P] → T018
```

---

## Parallel Execution Examples

### Setup Phase並列実行（T001-T003）
```bash
# 3つの型定義/定数ファイルを並列作成
Task: "Direction型をsrc/types/piece.tsに追加"
Task: "PlayerColor型とPLAYER_COLORSをsrc/types/game.tsに追加"
Task: "src/constants/colors.tsを新規作成"
```

### Component修正並列実行（T006-T008）
**前提**: T005（Piece.tsx）完了後
```bash
# 3つのコンポーネントを並列修正
Task: "Board.tsxにターン表示色の背景を実装"
Task: "TurnDisplay.tsxにターン表示色の背景を実装"
Task: "CapturedPieces.tsxにプレイヤー固定色の背景を実装"
```

### Contract Tests並列実行（T009-T013）
**前提**: 対応する実装タスク完了後
```bash
# 5つのcontract testsを並列実行
Task: "Piece.test.tsxを実装"
Task: "Board.test.tsxを実装"
Task: "TurnDisplay.test.tsxを実装"
Task: "CapturedPieces.test.tsxを実装"
Task: "moveRules.test.tsを実装"
```

### Polish並列実行（T015-T017）
**前提**: T014（手動検証）完了後
```bash
# パフォーマンス/アクセシビリティ/バンドルサイズを並列検証
Task: "Chrome DevToolsでパフォーマンステスト"
Task: "スクリーンリーダーでアクセシビリティ検証"
Task: "npm run buildでバンドルサイズ確認"
```

---

## Notes

- **[P]タスク**: 異なるファイルで独立、並列実行可能
- **テストなしの場合**: T009-T013をスキップし、T014-T017の手動検証のみ実施
- **コミット**: 各タスク完了後にgit commitを推奨（例: `feat: T005 - Piece.tsxに回転とマーカーを実装`）
- **避けるべきこと**: 同じファイルを複数の[P]タスクで修正、曖昧なタスク記述

---

## Validation Checklist
*実行前の確認*

- [x] すべてのcontractsに対応するテストあり（T009-T013）
- [x] すべての新規型定義にタスクあり（T001-T003）
- [x] すべてのコンポーネント修正にタスクあり（T005-T008）
- [x] テストは実装後に実行（TDD的にはテスト先行が理想だが、既存コンポーネント修正のため実装後テスト）
- [x] 並列タスクは真に独立（異なるファイル）
- [x] 各タスクに正確なファイルパスを記載
- [x] 同じファイルを修正する[P]タスクなし

---

**総タスク数**: 18タスク（Setup 3 + Utility 1 + Components 4 + Tests 5 + Polish 5）
**推定所要時間**: 4-6時間（テストなしの場合3-4時間）
**次のステップ**: T001から順次実行、または並列実行可能なタスクをバッチ処理
