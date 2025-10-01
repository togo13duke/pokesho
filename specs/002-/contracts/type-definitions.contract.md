# Contract: Type Definitions

**日付**: 2025-10-01
**対象**: 型定義の拡張

## 契約内容

### 1. PieceType の拡張

**ファイル**: `src/types/piece.ts`

**契約**:
```typescript
export type PieceType =
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

**検証方法**:
- TypeScriptコンパイラが10種類のリテラル型を認識
- 既存の `PieceType` を使用しているコードでエラーが発生しない

---

### 2. Role 型の追加

**ファイル**: `src/types/piece.ts`

**契約**:
```typescript
export type Role = 'king' | 'elephant' | 'giraffe' | 'chick' | 'hen'
```

**検証方法**:
- 5種類のリテラル型が定義されている
- エクスポートされている

---

### 3. Piece インターフェースの維持

**ファイル**: `src/types/piece.ts`

**契約**:
```typescript
export interface Piece {
  id: string
  type: PieceType
  owner: Player
  isPromoted: boolean
  imageUrl: string
}
```

**検証方法**:
- インターフェース定義が変更されていない
- 既存のコードでエラーが発生しない

---

## 契約テスト

### テストケース 1: PieceType の型チェック

```typescript
// src/types/piece.test.ts
import type { PieceType } from './piece'

describe('PieceType', () => {
  it('should accept all 10 piece types', () => {
    const types: PieceType[] = [
      'pikachu', 'bulbasaur', 'squirtle', 'charmander', 'charizard',
      'terapagos', 'sprigatito', 'quaxly', 'fuecoco', 'skeledirge',
    ]
    expect(types.length).toBe(10)
  })
})
```

**期待結果**: テストがパスする

---

### テストケース 2: Role の型チェック

```typescript
// src/types/piece.test.ts
import type { Role } from './piece'

describe('Role', () => {
  it('should accept all 5 roles', () => {
    const roles: Role[] = ['king', 'elephant', 'giraffe', 'chick', 'hen']
    expect(roles.length).toBe(5)
  })
})
```

**期待結果**: テストがパスする

---

## 破壊的変更チェック

- ✅ `PieceType` に値を追加するのみ（既存の5種類は維持）
- ✅ `Piece` インターフェースは変更なし
- ✅ `Player` 型は変更なし
- ❌ 破壊的変更なし
