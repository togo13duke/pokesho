**技術スタック**

* **フロントエンド**: React 19 + TypeScript
* **ビルドツール**: Vite 7（HMR対応）
* **状態管理**: React Hooks（useGameState、useImageCache）
* **UI**: Tailwind CSS 3.4
* **Linting**: ESLint 9 + TypeScript ESLint
* **画像管理**: PokeAPIから取得、localStorageにキャッシュ（5秒タイムアウト）
* **ホスティング**: Cloudflare Pages

**実装済み機能**

✅ **Phase 1: コア機能（spec 001）**
1. 画像キャッシュシステム（utils/imageCache.ts、hooks/useImageCache.ts）
2. 盤面表示と初期配置（components/Board.tsx、utils/initialBoard.ts）
3. ターン管理・表示（components/TurnDisplay.tsx）
4. 駒の移動ロジック（utils/moveRules.ts）
5. キャッチ機能（hooks/useGameState.ts）
6. 勝敗判定（utils/gameLogic.ts）

✅ **Phase 2: 拡張機能（spec 001）**
7. 成り（進化）システム（hooks/useGameState.ts: promoteIfNeeded）
8. 打つ機能（hooks/useGameState.ts: dropCapturedPiece）
9. 手駒表示エリア（components/CapturedPieces.tsx）
10. 勝敗メッセージ（components/GameOverMessage.tsx）

✅ **Phase 3: 後手駒セット変更（spec 002）**
11. 第9世代御三家導入（テラパゴス、ニャオハ、クワッス、ホゲータ）
12. 初期配置左右反転
13. 駒変換システム更新（utils/pieceConversion.ts）

✅ **Phase 4: 視認性向上（spec 003）**
14. 後手駒180度回転表示（components/Piece.tsx）
15. 移動方向マーカー表示（utils/moveRules.ts: getPossibleMoveDirections）
16. ターン別背景色（types/game.ts: PLAYER_COLORS、components/Board.tsx）

**技術実装の詳細**

**アーキテクチャ**
* フィーチャーベースの構成（src/components, src/hooks, src/utils）
* TypeScript strict mode有効化
* React 19のauto-batching、useCallback/useMemo最適化

**ゲームロジックの実装方針**
* Role-Based Movement System（king/elephant/giraffe/chick/hen）
* MoveVector（方向ベクトル配列）による駒移動定義
* Player 2の移動は自動的に方向反転
* 盤面は4×3のBoard型（CellState[][]）

**パフォーマンス最適化**
* React.memoによるPiece/Cellコンポーネント最適化
* useMemoによるハイライト計算のメモ化
* 画像プリロード＆localStorageキャッシュ

**除外機能（スコープ外）**

* 待った機能
* 棋譜の保存/再生
* CPU対戦
* 千日手判定