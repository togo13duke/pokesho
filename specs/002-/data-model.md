# Data Model - 後手の駒セット変更と初期配置の左右反転

**日付**: 2025-10-01
**対象機能**: 後手の駒セット変更と初期配置の左右反転

## エンティティ定義

### 1. PieceType（駒タイプ）

**説明**: 各駒の種類を表す型

**拡張前**:
```typescript
type PieceType = 'pikachu' | 'bulbasaur' | 'squirtle' | 'charmander' | 'charizard'
```

**拡張後**:
```typescript
type PieceType =
  // 先手用
  | 'pikachu'      // 王将役
  | 'bulbasaur'    // ぞう役
  | 'squirtle'     // きりん役
  | 'charmander'   // ひよこ役
  | 'charizard'    // にわとり役（進化）
  // 後手用
  | 'terapagos'    // 王将役
  | 'sprigatito'   // ぞう役
  | 'quaxly'       // きりん役
  | 'fuecoco'      // ひよこ役
  | 'skeledirge'   // にわとり役（進化）
```

**バリデーションルール**:
- 10種類の値のいずれかであること

---

### 2. Role（役職）

**説明**: 駒の役職を表す型（新規追加）

```typescript
type Role = 'king' | 'elephant' | 'giraffe' | 'chick' | 'hen'
```

**定義**:
- `king`: 王将役（全方向1マス移動可能）
- `elephant`: ぞう役（斜め4方向移動可能）
- `giraffe`: きりん役（縦横4方向移動可能）
- `chick`: ひよこ役（前方1マス移動可能）
- `hen`: にわとり役（前後左右+斜め前移動可能、進化後）

**バリデーションルール**:
- 5種類の値のいずれかであること

---

### 3. Piece（駒）

**説明**: 盤面上または手駒の駒を表す

**既存定義**:
```typescript
interface Piece {
  id: string
  type: PieceType
  owner: Player
  isPromoted: boolean
  imageUrl: string
}
```

**変更**: なし（型定義は維持）

**バリデーションルール**:
- `id`: ユニークな識別子（形式: `{owner}-{type}-{index}`）
- `type`: 拡張後の `PieceType` のいずれか
- `owner`: `player1` または `player2`
- `isPromoted`: 進化している場合 `true`
- `imageUrl`: PokeAPIから取得した画像URL、またはプレースホルダー

**状態遷移**:
- 未進化 → 進化: `isPromoted: false` → `isPromoted: true`, `type` が進化先に変更
- 捕獲時: `owner` が変更、`type` が捕獲者の駒セットに変換、進化駒は `isPromoted: false` に戻る

---

### 4. RoleToPieceMap（役職から駒へのマッピング）

**説明**: 役職とプレイヤーから、対応する駒タイプを取得するマッピング（新規追加）

```typescript
type RoleToPieceMap = Record<Player, Record<Role, PieceType>>
```

**実装例**:
```typescript
const ROLE_TO_PIECE_MAP: RoleToPieceMap = {
  player1: {
    king: 'pikachu',
    elephant: 'bulbasaur',
    giraffe: 'squirtle',
    chick: 'charmander',
    hen: 'charizard',
  },
  player2: {
    king: 'terapagos',
    elephant: 'sprigatito',
    giraffe: 'quaxly',
    chick: 'fuecoco',
    hen: 'skeledirge',
  },
}
```

**バリデーションルール**:
- すべてのプレイヤーとすべての役職の組み合わせが定義されていること

---

### 5. PieceToRoleMap（駒から役職へのマッピング）

**説明**: 駒タイプから役職を逆引きするマッピング（新規追加）

```typescript
type PieceToRoleMap = Record<PieceType, Role>
```

**実装例**:
```typescript
const PIECE_TO_ROLE_MAP: PieceToRoleMap = {
  pikachu: 'king',
  bulbasaur: 'elephant',
  squirtle: 'giraffe',
  charmander: 'chick',
  charizard: 'hen',
  terapagos: 'king',
  sprigatito: 'elephant',
  quaxly: 'giraffe',
  fuecoco: 'chick',
  skeledirge: 'hen',
}
```

**バリデーションルール**:
- すべての `PieceType` が定義されていること

---

### 6. POKEMON_ID_MAP（PokeAPI IDマッピング）

**説明**: 駒タイプからPokeAPI IDへのマッピング

**拡張前**:
```typescript
const POKEMON_ID_MAP: Record<PieceType, number> = {
  pikachu: 25,
  bulbasaur: 1,
  squirtle: 7,
  charmander: 4,
  charizard: 6,
}
```

**拡張後**:
```typescript
const POKEMON_ID_MAP: Record<PieceType, number> = {
  // 先手用
  pikachu: 25,
  bulbasaur: 1,
  squirtle: 7,
  charmander: 4,
  charizard: 6,
  // 後手用
  terapagos: 1024,
  sprigatito: 906,
  quaxly: 912,
  fuecoco: 909,
  skeledirge: 911,
}
```

**バリデーションルール**:
- すべての `PieceType` に対応する正の整数値が定義されていること

---

### 7. InitialBoardLayout（初期配置）

**説明**: ゲーム開始時の盤面配置

**変更前の配置**:
```
Row 0 (player2後列): bulbasaur, pikachu, squirtle
Row 1 (player2前列):    null,  charmander,   null
Row 2 (player1前列):    null,  charmander,   null
Row 3 (player1後列): bulbasaur, pikachu, squirtle
```

**変更後の配置**:
```
Row 0 (player2後列):  quaxly,  terapagos, sprigatito
Row 1 (player2前列):   null,     fuecoco,      null
Row 2 (player1前列):   null,   charmander,      null
Row 3 (player1後列): bulbasaur, pikachu,   squirtle
```

**バリデーションルール**:
- 3×4の盤面
- player1: 王将1、ぞう1、きりん1、ひよこ1
- player2: 王将1、ぞう1、きりん1、ひよこ1
- 先手後列: 左から「ぞう、王将、きりん」
- 後手後列: 左から「きりん、王将、ぞう」

---

## エンティティ関係図

```
Player (player1 / player2)
  |
  +-- owns --> Piece (type, owner, isPromoted, imageUrl)
  |              |
  |              +-- has type --> PieceType (10 types)
  |              |
  |              +-- maps to --> Role (5 roles) via PIECE_TO_ROLE_MAP
  |
  +-- maps to --> PieceType (per role) via ROLE_TO_PIECE_MAP

PieceType --> maps to --> PokeAPI ID via POKEMON_ID_MAP
Role --> defines --> MoveRule (directions)
```

---

## 変換ロジック

### 捕獲時の駒変換

**入力**:
- `capturedPiece`: 捕獲された駒（`Piece`）
- `capturingPlayer`: 捕獲したプレイヤー（`Player`）

**出力**:
- 変換後の駒（`Piece`）

**変換ルール**:
1. 捕獲された駒の役職を取得: `role = PIECE_TO_ROLE_MAP[capturedPiece.type]`
2. 進化駒の場合、未進化役職に戻す: `if (role === 'hen') { role = 'chick' }`
3. 捕獲者の駒セットから対応する駒タイプを取得: `newType = ROLE_TO_PIECE_MAP[capturingPlayer][role]`
4. 新しい駒を生成:
   - `owner`: `capturingPlayer`
   - `type`: `newType`
   - `isPromoted`: `false`
   - `imageUrl`: プレースホルダー（後でキャッシュから更新）

**例**:
- 先手がテラパゴス（王将役）を捕獲 → ピカチュウに変換
- 後手がヒトカゲ（ひよこ役）を捕獲 → ホゲータに変換
- 先手がラウドボーン（にわとり役）を捕獲 → ヒトカゲ（進化前）に変換

---

## データフロー

### 1. ゲーム開始
```
createInitialGameState()
  → player1: bulbasaur, pikachu, squirtle, charmander
  → player2: quaxly, terapagos, sprigatito, fuecoco
  → 画像をPokeAPIから取得（キャッシュ優先）
```

### 2. 駒の移動
```
selectPiece(position)
  → PIECE_TO_ROLE_MAP[piece.type] → role
  → MOVE_RULES[role] → valid directions
  → ハイライト表示
```

### 3. 駒の捕獲
```
movePiece(from, to)
  → capturedPiece = board[to]
  → role = PIECE_TO_ROLE_MAP[capturedPiece.type]
  → if (role === 'hen') { role = 'chick' }
  → newType = ROLE_TO_PIECE_MAP[capturingPlayer][role]
  → capturedPieces[capturingPlayer].push({ ...capturedPiece, type: newType, owner: capturingPlayer, isPromoted: false })
```

### 4. 手駒の配置
```
placeCapturedPiece(piece, position)
  → board[position] = piece
  → capturedPieces[player].remove(piece)
```

### 5. 進化判定
```
movePiece(from, to)
  → if (piece.type === 'charmander' && to.row === 0) { piece.type = 'charizard', piece.isPromoted = true }
  → if (piece.type === 'fuecoco' && to.row === 3) { piece.type = 'skeledirge', piece.isPromoted = true }
```

### 6. 勝敗判定
```
evaluateGameStatus()
  → checkKingCapture(): capturedPieces に role='king' が存在するか
  → checkTry(): board上に role='king' が敵陣最奥行にいるか
```

---

## まとめ

### 新規エンティティ
- `Role`: 駒の役職（5種類）
- `RoleToPieceMap`: 役職 × プレイヤー → 駒タイプ
- `PieceToRoleMap`: 駒タイプ → 役職

### 拡張エンティティ
- `PieceType`: 5種類 → 10種類
- `POKEMON_ID_MAP`: 5種類 → 10種類

### 変更ロジック
- 初期配置: player2を後手用駒セットに変更
- 駒変換: 捕獲時に役職ベースで変換
- 勝敗判定: 王将役（`pikachu` と `terapagos`）の汎用化
