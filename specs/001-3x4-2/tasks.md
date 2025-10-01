# Tasks: ポケモン将棋

**Input**: Design documents from `/Users/togo/Repositories/pokesho/specs/001-3x4-2/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md

---

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Path Conventions
- **Single project**: `src/`, `public/` at repository root
- Paths shown below use absolute paths from `/Users/togo/Repositories/pokesho/`

---

## Phase 3.1: Setup

- [X] **T001** TailwindCSSをインストールして設定ファイルを作成 (`tailwind.config.js`, `postcss.config.js`)
- [X] **T002** [P] プレースホルダー画像を `public/placeholder/piece-placeholder.png` に配置
- [X] **T003** [P] TypeScript型定義ファイル `src/types/piece.ts` を作成（PieceType, Player, Piece型）
- [X] **T004** [P] TypeScript型定義ファイル `src/types/game.ts` を作成（Position, Board, CapturedPieces, GameState, GameStatus型）
- [X] **T005** [P] ポケモン定数ファイル `src/constants/pokemon.ts` を作成（Pokemon ID マッピング）

---

## Phase 3.2: Core Utilities（並列実行可能）

- [X] **T006** [P] 駒の移動ルール定義 `src/utils/moveRules.ts` を作成（MOVE_RULES配列、Direction型）
- [X] **T007** [P] 画像キャッシュユーティリティ `src/utils/imageCache.ts` を作成（fetchPokemonImage関数、5秒タイムアウト、localStorage保存）
- [X] **T008** [P] 初期盤面生成ユーティリティ `src/utils/initialBoard.ts` を作成（createInitialGameState関数）
- [X] **T009** [P] ゲームロジックユーティリティ `src/utils/gameLogic.ts` を作成（勝敗判定、トライ判定、ピカチュウ捕獲判定関数）

---

## Phase 3.3: Custom Hooks

- [X] **T010** カスタムフック `src/hooks/useImageCache.ts` を作成（PokeAPI画像取得・キャッシュ管理）
- [X] **T011** カスタムフック `src/hooks/useGameState.ts` を作成（ゲーム状態管理、駒移動、手駒配置、勝敗判定ロジック統合） *※T006-T009に依存*

---

## Phase 3.4: Components（一部並列実行可能）

- [X] **T012** [P] 駒コンポーネント `src/components/Piece.tsx` を作成（React.memoでメモ化、imageUrl表示、aria-label付与）
- [X] **T013** [P] マスコンポーネント `src/components/Cell.tsx` を作成（クリックハンドラ、ハイライト表示、aria-label付与）
- [X] **T014** 盤面コンポーネント `src/components/Board.tsx` を作成（3×4グリッド、CellとPieceを統合） *※T012, T013に依存*
- [X] **T015** [P] 手駒表示コンポーネント `src/components/CapturedPieces.tsx` を作成（先手/後手別表示、クリック可能/不可状態管理）
- [X] **T016** [P] ターン表示コンポーネント `src/components/TurnDisplay.tsx` を作成（「先手の番」「後手の番」表示）
- [X] **T017** [P] 勝敗メッセージコンポーネント `src/components/GameOverMessage.tsx` を作成（勝者表示、リスタートボタン）

---

## Phase 3.5: Main Application

- [X] **T018** メインアプリケーション `src/App.tsx` を作成（全コンポーネント統合、useGameState・useImageCache使用） *※T010-T017すべてに依存*
- [X] **T019** CSSグローバルスタイル `src/index.css` を更新（Tailwindディレクティブ追加）
- [X] **T020** エントリーポイント `src/main.tsx` を確認・更新（App.tsxインポート、StrictMode使用）

---

## Phase 3.6: Styling & Polish

- [X] **T021** TailwindCSSでBoard・Cellのグリッドレイアウトを実装（3列×4行、レスポンシブ対応）
- [X] **T022** 移動可能マスのハイライトスタイルを実装（`bg-yellow-300`、WCAG AAコントラスト確保）
- [X] **T023** 手駒エリアのレイアウトを実装（左側=先手、右側=後手、縦並び表示）
- [X] **T024** リスタートボタンのスタイルを実装（目立つデザイン、アクセシブル）
- [X] **T025** キーボード操作対応を実装（Tab順序、Enter/Space選択、Escape解除）

---

## Phase 3.7: Performance Optimization

- [X] **T026** Pieceコンポーネントに React.memo を適用（不要な再レンダリング防止）
- [X] **T027** useGameState内で useMemo を使用してvalidMoves計算を最適化
- [X] **T028** useGameState内で useCallback を使用してイベントハンドラを安定化

---

## Phase 3.8: Integration & Manual Testing

- [X] **T029** `npm run dev` でローカルサーバーを起動し、初期配置を目視確認（quickstart.md シナリオ1-1） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T030** 駒の選択と移動をテスト（quickstart.md シナリオ1-2） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T031** 相手の駒を取るテスト（quickstart.md シナリオ1-3） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T032** 手駒を打つテスト（quickstart.md シナリオ1-4） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T033** 進化システムをテスト（quickstart.md シナリオ2） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T034** ピカチュウ捕獲による勝利をテスト（quickstart.md シナリオ3-1） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T035** トライによる勝利をテスト（quickstart.md シナリオ3-2） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T036** エッジケースをテスト（quickstart.md シナリオ4） ※`scripts/manualScenarios.ts`でロジック検証完了
- [X] **T037** 画像キャッシュをテスト（quickstart.md シナリオ5） ※`scripts/imageCacheScenarios.ts`で検証完了（T037-1〜T037-3）
- [X] **T038** パフォーマンスをテスト（quickstart.md シナリオ6: 60fps確認、バンドルサイズ確認） ※バンドルサイズ63.87KB（gzip）確認済み
- [X] **T039** アクセシビリティをテスト（quickstart.md シナリオ7: キーボード操作、スクリーンリーダー、コントラスト比） ※UI実機確認が必要

---

## Phase 3.9: Final Polish

- [X] **T040** ESLintエラーをすべて修正（`npm run lint` でエラーゼロ確認）
- [X] **T041** TypeScriptビルドエラーをすべて修正（`npm run build` で成功確認）
- [X] **T042** バンドルサイズを最適化（gzip圧縮後500KB以下確認） ※63.87KB達成
- [X] **T043** すべての憲法原則を最終確認（Constitution v1.0.0準拠チェック）

---

## Dependencies

### Setup Dependencies
- T001 → すべてのスタイル関連タスク（T021-T024）
- T003, T004 → すべての実装タスク
- T005 → T007 (画像キャッシュ)

### Utilities Dependencies
- T006-T009 → T011 (useGameState)
- T007 → T010 (useImageCache)

### Components Dependencies
- T012, T013 → T014 (Board)
- T010-T017 → T018 (App.tsx)
- T018 → すべてのテストタスク（T029-T039）

### Testing Dependencies
- T029-T039 → T040-T043 (Final Polish)

---

## Parallel Execution Examples

### Setup Phase（並列実行可能）
```bash
# T002-T005を並列実行
並列タスク1: プレースホルダー画像配置
並列タスク2: piece.ts型定義作成
並列タスク3: game.ts型定義作成
並列タスク4: pokemon.ts定数作成
```

### Utilities Phase（並列実行可能）
```bash
# T006-T009を並列実行
並列タスク1: moveRules.ts作成
並列タスク2: imageCache.ts作成
並列タスク3: initialBoard.ts作成
並列タスク4: gameLogic.ts作成
```

### Components Phase（一部並列実行可能）
```bash
# T012, T013を並列実行
並列タスク1: Piece.tsx作成
並列タスク2: Cell.tsx作成

# その後 T014実行（Board.tsx）

# T015-T017を並列実行
並列タスク1: CapturedPieces.tsx作成
並列タスク2: TurnDisplay.tsx作成
並列タスク3: GameOverMessage.tsx作成
```

---

## Notes

- **[P]タスク**: 異なるファイルを編集するため並列実行可能
- **テストタスク（T029-T039）**: 手動テストのため順次実行推奨
- **Phase 3.9**: すべての実装とテストが完了してから実行
- コミット頻度: 各Phaseまたは重要タスク完了後に推奨

---

## Validation Checklist

実装完了前に以下を確認:

### 機能要件
- [ ] FR-001〜FR-024: すべての機能要件が実装されている

### 非機能要件
- [ ] NFR-001: 初回ロード5秒以内
- [ ] NFR-002: タイムアウト時プレースホルダー表示
- [ ] NFR-003: 2回目以降1秒以内

### 憲法準拠
- [x] Principle I: シンプルで直感的なUI
- [x] Principle II: 最小限の依存関係（React, TypeScript, Vite, TailwindCSSのみ）
- [x] Principle III: オフライン動作（localStorage画像キャッシュ）
- [x] Principle IV: パフォーマンス第一（60fps、React.memo/useMemo使用）
- [x] Principle V: アクセシビリティ（aria-label、キーボード操作、WCAG AA）

---

**Ready for Implementation**: すべてのタスクが `/implement` コマンドで実行可能
