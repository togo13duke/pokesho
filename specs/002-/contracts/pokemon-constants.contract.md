# Contract: Pokemon Constants

**日付**: 2025-10-01
**対象**: PokeAPI IDマッピングの拡張

## 契約内容

### 1. POKEMON_ID_MAP の拡張

**ファイル**: `src/constants/pokemon.ts`

**契約**:
```typescript
import type { PieceType } from '../types/piece'

export const POKEMON_ID_MAP: Record<PieceType, number> = {
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

export const PLACEHOLDER_IMAGE_PATH = '/placeholder/piece-placeholder.png'
```

**検証方法**:
- すべての `PieceType` に対応する正の整数値が定義されている
- PokeAPI IDが有効である（https://pokeapi.co/api/v2/pokemon/{id} が存在する）

---

## 契約テスト

### テストケース 1: POKEMON_ID_MAP の完全性

```typescript
// src/constants/pokemon.test.ts
import { POKEMON_ID_MAP } from './pokemon'

describe('POKEMON_ID_MAP', () => {
  it('should have entries for all 10 piece types', () => {
    const expectedTypes = [
      'pikachu', 'bulbasaur', 'squirtle', 'charmander', 'charizard',
      'terapagos', 'sprigatito', 'quaxly', 'fuecoco', 'skeledirge',
    ]

    expectedTypes.forEach(type => {
      expect(POKEMON_ID_MAP).toHaveProperty(type)
      expect(typeof POKEMON_ID_MAP[type as keyof typeof POKEMON_ID_MAP]).toBe('number')
      expect(POKEMON_ID_MAP[type as keyof typeof POKEMON_ID_MAP]).toBeGreaterThan(0)
    })
  })

  it('should have correct PokeAPI IDs for player1 pieces', () => {
    expect(POKEMON_ID_MAP.pikachu).toBe(25)
    expect(POKEMON_ID_MAP.bulbasaur).toBe(1)
    expect(POKEMON_ID_MAP.squirtle).toBe(7)
    expect(POKEMON_ID_MAP.charmander).toBe(4)
    expect(POKEMON_ID_MAP.charizard).toBe(6)
  })

  it('should have correct PokeAPI IDs for player2 pieces', () => {
    expect(POKEMON_ID_MAP.terapagos).toBe(1024)
    expect(POKEMON_ID_MAP.sprigatito).toBe(906)
    expect(POKEMON_ID_MAP.quaxly).toBe(912)
    expect(POKEMON_ID_MAP.fuecoco).toBe(909)
    expect(POKEMON_ID_MAP.skeledirge).toBe(911)
  })
})
```

**期待結果**: テストがパスする

---

### テストケース 2: PokeAPI画像取得の検証（統合テスト）

```typescript
// src/constants/pokemon.integration.test.ts
import { POKEMON_ID_MAP } from './pokemon'

describe('POKEMON_ID_MAP - PokeAPI Integration', () => {
  it('should fetch valid images from PokeAPI for all piece types', async () => {
    const pieceTypes = Object.keys(POKEMON_ID_MAP) as (keyof typeof POKEMON_ID_MAP)[]

    for (const type of pieceTypes) {
      const id = POKEMON_ID_MAP[type]
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`

      const response = await fetch(url)
      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data.sprites.front_default).toBeTruthy()
    }
  }, 30000) // タイムアウト: 30秒
})
```

**期待結果**: すべてのPokeAPI IDが有効で、画像が取得できる

---

## 破壊的変更チェック

- ✅ 既存のマッピングは変更なし
- ✅ 新しいマッピングを追加するのみ
- ❌ 破壊的変更なし
