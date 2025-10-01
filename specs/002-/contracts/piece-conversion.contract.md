# Contract: Piece Conversion Logic

**日付**: 2025-10-01
**対象**: 駒の変換ロジック

## 契約内容

### 1. PIECE_TO_ROLE_MAP の定義

**ファイル**: `src/utils/pieceConversion.ts`

**契約**:
```typescript
export const PIECE_TO_ROLE_MAP: Record<PieceType, Role> = {
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

**検証方法**:
- すべての `PieceType` が定義されている
- すべての値が有効な `Role` である

---

### 2. ROLE_TO_PIECE_MAP の定義

**ファイル**: `src/utils/pieceConversion.ts`

**契約**:
```typescript
export const ROLE_TO_PIECE_MAP: Record<Player, Record<Role, PieceType>> = {
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

**検証方法**:
- すべてのプレイヤーとすべての役職の組み合わせが定義されている
- すべての値が有効な `PieceType` である

---

### 3. convertCapturedPiece 関数

**ファイル**: `src/utils/pieceConversion.ts`

**契約**:
```typescript
export function convertCapturedPiece(
  capturedPiece: Piece,
  capturingPlayer: Player,
): Piece
```

**入力**:
- `capturedPiece`: 捕獲された駒
- `capturingPlayer`: 捕獲したプレイヤー

**出力**:
- 変換後の駒

**変換ルール**:
1. 捕獲された駒の役職を取得
2. 進化駒（`hen`）の場合、未進化（`chick`）に戻す
3. 捕獲者の駒セットから対応する駒タイプを取得
4. 新しい駒を生成（`owner`、`type`、`isPromoted: false`、`imageUrl`はプレースホルダー）

**検証方法**:
- すべての入力に対して有効な出力を返す
- 進化駒は未進化に戻る
- 捕獲者の所有になる

---

## 契約テスト

### テストケース 1: 王将役の変換

```typescript
// src/utils/pieceConversion.test.ts
import { convertCapturedPiece } from './pieceConversion'
import type { Piece } from '../types/piece'

describe('convertCapturedPiece - King role', () => {
  it('should convert terapagos to pikachu when captured by player1', () => {
    const capturedPiece: Piece = {
      id: 'player2-terapagos-0',
      type: 'terapagos',
      owner: 'player2',
      isPromoted: false,
      imageUrl: 'placeholder',
    }

    const result = convertCapturedPiece(capturedPiece, 'player1')

    expect(result.type).toBe('pikachu')
    expect(result.owner).toBe('player1')
    expect(result.isPromoted).toBe(false)
  })

  it('should convert pikachu to terapagos when captured by player2', () => {
    const capturedPiece: Piece = {
      id: 'player1-pikachu-0',
      type: 'pikachu',
      owner: 'player1',
      isPromoted: false,
      imageUrl: 'placeholder',
    }

    const result = convertCapturedPiece(capturedPiece, 'player2')

    expect(result.type).toBe('terapagos')
    expect(result.owner).toBe('player2')
    expect(result.isPromoted).toBe(false)
  })
})
```

**期待結果**: テストがパスする

---

### テストケース 2: ひよこ役の変換

```typescript
describe('convertCapturedPiece - Chick role', () => {
  it('should convert fuecoco to charmander when captured by player1', () => {
    const capturedPiece: Piece = {
      id: 'player2-fuecoco-0',
      type: 'fuecoco',
      owner: 'player2',
      isPromoted: false,
      imageUrl: 'placeholder',
    }

    const result = convertCapturedPiece(capturedPiece, 'player1')

    expect(result.type).toBe('charmander')
    expect(result.owner).toBe('player1')
    expect(result.isPromoted).toBe(false)
  })

  it('should convert charmander to fuecoco when captured by player2', () => {
    const capturedPiece: Piece = {
      id: 'player1-charmander-0',
      type: 'charmander',
      owner: 'player1',
      isPromoted: false,
      imageUrl: 'placeholder',
    }

    const result = convertCapturedPiece(capturedPiece, 'player2')

    expect(result.type).toBe('fuecoco')
    expect(result.owner).toBe('player2')
    expect(result.isPromoted).toBe(false)
  })
})
```

**期待結果**: テストがパスする

---

### テストケース 3: 進化駒の変換

```typescript
describe('convertCapturedPiece - Promoted pieces', () => {
  it('should convert skeledirge to charmander (unpromoted) when captured by player1', () => {
    const capturedPiece: Piece = {
      id: 'player2-skeledirge-0',
      type: 'skeledirge',
      owner: 'player2',
      isPromoted: true,
      imageUrl: 'placeholder',
    }

    const result = convertCapturedPiece(capturedPiece, 'player1')

    expect(result.type).toBe('charmander')
    expect(result.owner).toBe('player1')
    expect(result.isPromoted).toBe(false)
  })

  it('should convert charizard to fuecoco (unpromoted) when captured by player2', () => {
    const capturedPiece: Piece = {
      id: 'player1-charizard-0',
      type: 'charizard',
      owner: 'player1',
      isPromoted: true,
      imageUrl: 'placeholder',
    }

    const result = convertCapturedPiece(capturedPiece, 'player2')

    expect(result.type).toBe('fuecoco')
    expect(result.owner).toBe('player2')
    expect(result.isPromoted).toBe(false)
  })
})
```

**期待結果**: テストがパスする

---

### テストケース 4: すべての役職の変換

```typescript
describe('convertCapturedPiece - All roles', () => {
  it('should convert all player2 pieces to player1 pieces', () => {
    const testCases = [
      { captured: 'terapagos', expected: 'pikachu' },
      { captured: 'sprigatito', expected: 'bulbasaur' },
      { captured: 'quaxly', expected: 'squirtle' },
      { captured: 'fuecoco', expected: 'charmander' },
      { captured: 'skeledirge', expected: 'charmander' }, // 進化駒は未進化に戻る
    ]

    testCases.forEach(({ captured, expected }) => {
      const capturedPiece: Piece = {
        id: `player2-${captured}-0`,
        type: captured as PieceType,
        owner: 'player2',
        isPromoted: captured === 'skeledirge',
        imageUrl: 'placeholder',
      }

      const result = convertCapturedPiece(capturedPiece, 'player1')

      expect(result.type).toBe(expected)
      expect(result.owner).toBe('player1')
      expect(result.isPromoted).toBe(false)
    })
  })

  it('should convert all player1 pieces to player2 pieces', () => {
    const testCases = [
      { captured: 'pikachu', expected: 'terapagos' },
      { captured: 'bulbasaur', expected: 'sprigatito' },
      { captured: 'squirtle', expected: 'quaxly' },
      { captured: 'charmander', expected: 'fuecoco' },
      { captured: 'charizard', expected: 'fuecoco' }, // 進化駒は未進化に戻る
    ]

    testCases.forEach(({ captured, expected }) => {
      const capturedPiece: Piece = {
        id: `player1-${captured}-0`,
        type: captured as PieceType,
        owner: 'player1',
        isPromoted: captured === 'charizard',
        imageUrl: 'placeholder',
      }

      const result = convertCapturedPiece(capturedPiece, 'player2')

      expect(result.type).toBe(expected)
      expect(result.owner).toBe('player2')
      expect(result.isPromoted).toBe(false)
    })
  })
})
```

**期待結果**: テストがパスする

---

## 破壊的変更チェック

- ✅ 新規ファイル作成（既存コードへの影響なし）
- ✅ 新規エクスポート関数
- ❌ 破壊的変更なし
