# Data Model - 後手駒の向き反転と視認性向上

**作成日**: 2025-10-04
**対象機能**: spec 003 - 後手駒の向き反転と視認性向上

## 概要

この機能は主にUIの視覚的拡張であり、新規のデータモデルは不要。既存の型定義に対して、以下の拡張を行う。

---

## 既存型定義の拡張

### 1. Player型（既存: `src/types/piece.ts`）

**変更なし** - 'player1'（先手）、'player2'（後手）で駒の向きを判定

```typescript
export type Player = 'player1' | 'player2';
```

**用途**:
- 駒の回転判定: `player === 'player2'` なら `rotate-180`
- 手駒エリアの背景色: `player === 'player1'` なら `bg-blue-50`

---

### 2. PieceType型（既存: `src/types/piece.ts`）

**変更なし** - 移動方向マーカーの生成に使用

```typescript
export type PieceType = 'pikachu' | 'bulbasaur' | 'squirtle' | 'charmander' | 'charizard';
```

**用途**:
- `moveRules.ts`から各駒タイプの移動可能方向を取得
- マーカーの配置位置を計算

---

### 3. 新規追加: Direction型（`src/types/piece.ts`に追加）

**追加理由**: 移動方向マーカーの生成に必要

```typescript
/**
 * 駒の移動可能方向
 * - 基本8方向: up, down, left, right, upLeft, upRight, downLeft, downRight
 */
export type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'upLeft'
  | 'upRight'
  | 'downLeft'
  | 'downRight';
```

**関連ロジック**:
```typescript
// src/utils/moveRules.ts に追加する関数
export function getPossibleMoveDirections(pieceType: PieceType, player: Player): Direction[] {
  // 各駒タイプの移動ルールから方向を抽出
  // 例: pikachu → ['up', 'upLeft', 'upRight', 'left', 'right', 'down']
}
```

---

### 4. 新規追加: PlayerColor型（`src/types/game.ts`に追加）

**追加理由**: ターン表示色の型安全性を確保

```typescript
/**
 * プレイヤーに対応する表示色（TailwindCSSクラス名）
 */
export type PlayerColor = 'bg-blue-50' | 'bg-red-50';

/**
 * プレイヤーから表示色へのマッピング
 */
export const PLAYER_COLORS: Record<Player, PlayerColor> = {
  player1: 'bg-blue-50',
  player2: 'bg-red-50',
};
```

**用途**:
- `Board.tsx`, `TurnDisplay.tsx`: 現在のターンに応じた背景色
- `CapturedPieces.tsx`: 所有プレイヤーの固定背景色

---

## 定数定義の追加

### src/constants/colors.ts（新規作成）

```typescript
/**
 * ターン表示色の定義
 * - 先手: 薄い青 (#E3F2FD相当 = Tailwind blue-50)
 * - 後手: 薄い赤 (#FFEBEE相当 = Tailwind red-50)
 */
export const TURN_COLORS = {
  player1: 'bg-blue-50',
  player2: 'bg-red-50',
} as const;

/**
 * アクセシビリティ情報
 * - WCAG AAコントラスト比: 両色ともblackテキストに対して17:1以上
 */
export const COLOR_CONTRAST_INFO = {
  'bg-blue-50': { hex: '#eff6ff', contrastRatio: 17.5 },
  'bg-red-50': { hex: '#fef2f2', contrastRatio: 18.2 },
} as const;
```

---

## コンポーネントProps拡張

### Piece.tsx Props

**変更なし** - 既存の `piece: Piece` と `player: Player` で十分

```typescript
interface PieceProps {
  piece: Piece;         // 駒情報（type, position含む）
  player: Player;       // 所有プレイヤー（回転判定に使用）
  onClick?: () => void; // 既存のクリックハンドラ
}
```

**内部状態追加**:
```typescript
// useMemoで計算結果をキャッシュ
const directions = useMemo(() => getPossibleMoveDirections(piece.type, player), [piece.type, player]);
const rotation = player === 'player2' ? 'rotate-180' : '';
```

---

### Board.tsx Props

**追加**: `currentTurn: Player` を受け取る（既存実装で受け取り済みの可能性あり）

```typescript
interface BoardProps {
  board: CellState[][];     // 既存
  onCellClick: (row: number, col: number) => void; // 既存
  currentTurn: Player;      // ターン表示色の判定に使用
  selectedPosition?: Position; // 既存
}
```

---

### CapturedPieces.tsx Props

**追加**: `player: Player` を明示的に受け取る

```typescript
interface CapturedPiecesProps {
  pieces: Piece[];   // 既存（捕獲された駒リスト）
  player: Player;    // 所有プレイヤー（固定背景色の判定に使用）
  onPieceClick?: (piece: Piece) => void; // 既存
}
```

---

## 状態管理への影響

### useGameState.ts（既存フック）

**変更なし** - 既存のゲーム状態で十分

```typescript
interface GameState {
  board: CellState[][];
  currentTurn: Player;      // ✅ ターン表示色に使用
  capturedPieces: {
    player1: Piece[];       // ✅ 手駒エリア背景色に使用
    player2: Piece[];       // ✅ 手駒エリア背景色に使用
  };
  winner: Player | null;
  // ... 他の状態
}
```

---

## バリデーションルール

### 駒の回転

- **条件**: `player === 'player2'`
- **適用**: CSS transform `rotate(180deg)`
- **検証**: 盤面上の後手駒すべてが180度回転すること

### 移動方向マーカー

- **条件**: 駒がピカチュウ、フシギダネ、ゼニガメ、ヒトカゲ、リザードンのいずれか
- **生成**: `getPossibleMoveDirections(piece.type, player)` の返り値に基づく
- **検証**: 各駒タイプで正しい方向数（1~8方向）のマーカーが表示されること

### ターン表示色

- **条件**: `currentTurn === 'player1'` → `bg-blue-50`, `currentTurn === 'player2'` → `bg-red-50`
- **適用範囲**: `Board.tsx`, `TurnDisplay.tsx`
- **検証**: ターン切り替え時に背景色が即座に変わること

### 手駒エリア固定色

- **条件**: `player === 'player1'` → `bg-blue-50`, `player === 'player2'` → `bg-red-50`
- **適用範囲**: `CapturedPieces.tsx`
- **検証**: ターンに関わらず、所有プレイヤーの色が維持されること

---

## データフロー

```
useGameState
  ├─ currentTurn (Player)
  │   ├→ Board.tsx (背景色)
  │   └→ TurnDisplay.tsx (背景色)
  │
  └─ board (CellState[][])
      └→ Cell.tsx → Piece.tsx
          ├─ piece.player (Player)
          │   ├→ 回転判定 (player2 → rotate-180)
          │   └→ 移動方向計算 (getPossibleMoveDirections)
          │
          └─ マーカー描画 (directions.map → SVG)

capturedPieces
  ├─ player1: Piece[]
  │   └→ CapturedPieces (player='player1', bg-blue-50)
  │
  └─ player2: Piece[]
      └→ CapturedPieces (player='player2', bg-red-50)
```

---

## まとめ

- **新規型定義**: `Direction`, `PlayerColor`, `PLAYER_COLORS`
- **新規定数ファイル**: `src/constants/colors.ts`
- **既存型の拡張**: なし（既存の `Player`, `PieceType` で対応可能）
- **状態管理の変更**: なし（既存の `useGameState` で十分）

この機能はデータモデルの変更が最小限であり、主にUIレイヤーでの視覚的拡張に留まる。
