# Data Model: ポケモン将棋

**Feature**: 001-3x4-2
**Date**: 2025-10-01
**Status**: Complete

---

## エンティティ概要

このドキュメントはポケモン将棋のデータモデルを定義します。すべての型定義はTypeScriptで記述され、`src/types/`配下に配置されます。

---

## 1. Piece (駒)

### Entity Definition
駒を表す基本エンティティ。盤面上または手駒として存在します。

### TypeScript型定義
```typescript
// src/types/piece.ts

export type PieceType = 'pikachu' | 'bulbasaur' | 'squirtle' | 'charmander' | 'charizard';

export type Player = 'player1' | 'player2';

export interface Piece {
  id: string;                    // 一意識別子 (例: "p1-pikachu")
  type: PieceType;               // 駒の種類
  owner: Player;                 // 所有者（先手/後手）
  isPromoted: boolean;           // 進化済みフラグ（charmander→charizardのみ使用）
  imageUrl: string;              // 画像URL（キャッシュまたはプレースホルダー）
}
```

### フィールド説明

| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| id | string | ✅ | 駒の一意識別子 | `"p1-pikachu"`, `"p2-charmander-1"` |
| type | PieceType | ✅ | 駒の種類（5種類） | `"pikachu"` |
| owner | Player | ✅ | 所有者（先手/後手） | `"player1"` |
| isPromoted | boolean | ✅ | 進化状態（charmander専用） | `false` |
| imageUrl | string | ✅ | 表示する画像のURL/Base64 | `"data:image/png;base64,..."` |

### バリデーションルール

1. **typeとisPromotedの整合性**
   - `type === 'charizard'` の場合、`isPromoted === true`
   - `type !== 'charmander'` の場合、`isPromoted === false` (常にfalse)
   - `type === 'charmander'` の場合、`isPromoted` は `true` または `false`

2. **idのユニーク性**
   - ゲーム内すべての駒で一意でなければならない
   - フォーマット: `{owner}-{type}-{index}`

---

## 2. Position (位置)

### Entity Definition
盤面上の座標を表します。

### TypeScript型定義
```typescript
// src/types/game.ts

export interface Position {
  row: number;    // 行（0-3）
  col: number;    // 列（0-2）
}
```

### バリデーションルール

- `row`: 0 〜 3 の整数
- `col`: 0 〜 2 の整数

### 座標系

```
    col: 0    1    2
row: 0 [ ]  [ ]  [ ]  ← 後手側最奥行
     1 [ ]  [ ]  [ ]
     2 [ ]  [ ]  [ ]
     3 [ ]  [ ]  [ ]  ← 先手側最奥行
```

- **先手（player1）**: 下から上へ進む（row 3 → 0）
- **後手（player2）**: 上から下へ進む（row 0 → 3）

---

## 3. Board (盤面)

### Entity Definition
3×4のマス目からなるゲーム盤面。

### TypeScript型定義
```typescript
// src/types/game.ts

export type Board = (Piece | null)[][];  // 4行 x 3列
```

### 構造
```typescript
[
  [null, piece2, null],          // row 0 (後手側最奥行)
  [piece3, null, piece4],        // row 1
  [null, piece5, null],          // row 2
  [piece1, null, piece6]         // row 3 (先手側最奥行)
]
```

### バリデーションルール

1. **サイズ固定**: 必ず `board.length === 4` かつ `board[i].length === 3`
2. **各マス**: `Piece | null` のみ（同じマスに複数の駒は不可）
3. **ピカチュウ存在**: 各プレイヤーのピカチュウが盤面または手駒に必ず1つ存在

---

## 4. CapturedPieces (手駒)

### Entity Definition
取得した相手の駒のリスト。

### TypeScript型定義
```typescript
// src/types/game.ts

export interface CapturedPieces {
  player1: Piece[];  // 先手の手駒
  player2: Piece[];  // 後手の手駒
}
```

### バリデーションルール

1. **所有権反転**: 手駒に追加された駒の `owner` は元の所有者のまま（取った側ではない）
2. **進化状態リセット**: 手駒になった駒が `charmander` (進化済み) の場合、`isPromoted = false` に戻す

---

## 5. GameState (ゲーム状態)

### Entity Definition
ゲーム全体の状態を管理する最上位エンティティ。

### TypeScript型定義
```typescript
// src/types/game.ts

export type GameStatus = 'playing' | 'player1_win' | 'player2_win';

export interface GameState {
  board: Board;
  capturedPieces: CapturedPieces;
  currentTurn: Player;
  gameStatus: GameStatus;
  selectedPiece: Position | null;
  validMoves: Position[];
}
```

### フィールド説明

| フィールド | 型 | 説明 |
|-----------|---|------|
| board | Board | 現在の盤面状態（3×4） |
| capturedPieces | CapturedPieces | 各プレイヤーの手駒 |
| currentTurn | Player | 現在のターン（player1/player2） |
| gameStatus | GameStatus | ゲーム状態（進行中/勝敗決定） |
| selectedPiece | Position \| null | 選択中の駒の位置 |
| validMoves | Position[] | 選択中の駒の移動可能マスリスト |

### 状態遷移図

```
┌─────────┐
│ playing │
└────┬────┘
     │
     ├─ ピカチュウ捕獲 ────→ player1_win / player2_win
     │
     └─ トライ成功 ────→ player1_win / player2_win
```

### バリデーションルール

1. **ターン整合性**: `gameStatus === 'playing'` の場合のみ `currentTurn` が意味を持つ
2. **選択状態**: `selectedPiece !== null` の場合、`validMoves.length >= 0`
3. **勝敗確定後**: `gameStatus !== 'playing'` の場合、それ以上の操作を受け付けない

---

## 6. MoveRule (移動ルール)

### Entity Definition
各駒タイプの移動パターンを定義。

### TypeScript型定義
```typescript
// src/utils/moveRules.ts

export type Direction = [number, number];  // [rowOffset, colOffset]

export interface MoveRule {
  pieceType: PieceType;
  directions: Direction[];
}

export const MOVE_RULES: MoveRule[] = [
  {
    pieceType: 'pikachu',
    directions: [
      [-1, -1], [-1, 0], [-1, 1],  // 上方向3マス
      [0, -1],           [0, 1],    // 左右
      [1, -1],  [1, 0],  [1, 1]     // 下方向3マス
    ]
  },
  {
    pieceType: 'bulbasaur',
    directions: [
      [-1, -1], [-1, 1],  // 斜め上
      [1, -1],  [1, 1]    // 斜め下
    ]
  },
  {
    pieceType: 'squirtle',
    directions: [
      [-1, 0],  // 上
      [0, -1], [0, 1],  // 左右
      [1, 0]   // 下
    ]
  },
  {
    pieceType: 'charmander',
    directions: [
      [-1, 0]  // 前方1マスのみ（所有者により反転）
    ]
  },
  {
    pieceType: 'charizard',
    directions: [
      [-1, -1], [-1, 0], [-1, 1],  // 前方3マス
      [0, -1],           [0, 1],    // 左右
      [1, 0]                        // 後方1マス
    ]
  }
];
```

### 特殊ルール

1. **charmander/charizardの向き**
   - `owner === 'player1'`: 上方向が前（`[-1, 0]`）
   - `owner === 'player2'`: 下方向が前（`[1, 0]`）

2. **移動先制約**
   - 盤面外は無効
   - 自分の駒がいるマスは無効
   - 相手の駒がいるマスは有効（取得可能）

---

## 7. ImageCache (画像キャッシュ)

### Entity Definition
PokeAPIから取得した画像データをlocalStorageで管理。

### TypeScript型定義
```typescript
// src/types/game.ts

export interface ImageCacheEntry {
  pokemonId: number;
  imageData: string;  // Base64エンコード済み画像
  cachedAt: number;   // キャッシュ日時（Unix timestamp）
}
```

### localStorageキー構造

```
pokemon-image-25  →  "data:image/png;base64,iVBORw0KG..."
pokemon-image-1   →  "data:image/png;base64,iVBORw0KG..."
pokemon-image-7   →  "data:image/png;base64,iVBORw0KG..."
pokemon-image-4   →  "data:image/png;base64,iVBORw0KG..."
pokemon-image-6   →  "data:image/png;base64,iVBORw0KG..."
```

### Pokemon ID マッピング

| PieceType | Pokemon ID | 名前 |
|----------|-----------|------|
| pikachu | 25 | ピカチュウ |
| bulbasaur | 1 | フシギダネ |
| squirtle | 7 | ゼニガメ |
| charmander | 4 | ヒトカゲ |
| charizard | 6 | リザードン |

---

## エンティティ関係図

```
GameState
├── Board (4x3配列)
│   └── Piece | null
│       ├── type: PieceType
│       ├── owner: Player
│       └── imageUrl: string (ImageCache参照)
│
├── CapturedPieces
│   ├── player1: Piece[]
│   └── player2: Piece[]
│
├── currentTurn: Player
├── gameStatus: GameStatus
├── selectedPiece: Position | null
└── validMoves: Position[]

MoveRule[]
└── pieceType → Direction[]

ImageCache (localStorage)
└── pokemonId → Base64 imageData
```

---

## 初期状態

```typescript
// src/utils/initialBoard.ts

export function createInitialGameState(): GameState {
  return {
    board: [
      // row 0 (後手側最奥行)
      [
        createPiece('bulbasaur', 'player2'),
        createPiece('pikachu', 'player2'),
        createPiece('squirtle', 'player2')
      ],
      // row 1
      [
        null,
        createPiece('charmander', 'player2'),
        null
      ],
      // row 2
      [
        null,
        createPiece('charmander', 'player1'),
        null
      ],
      // row 3 (先手側最奥行)
      [
        createPiece('bulbasaur', 'player1'),
        createPiece('pikachu', 'player1'),
        createPiece('squirtle', 'player1')
      ]
    ],
    capturedPieces: {
      player1: [],
      player2: []
    },
    currentTurn: 'player1',
    gameStatus: 'playing',
    selectedPiece: null,
    validMoves: []
  };
}
```

---

## 次のステップ

Phase 1で quickstart.md を作成し、このデータモデルを使用した統合テストシナリオを定義します。
