# Contract: Initial Board Setup

**日付**: 2025-10-01
**対象**: 初期配置の更新

## 契約内容

### 1. createInitialGameState 関数の変更

**ファイル**: `src/utils/initialBoard.ts`

**契約**:
```typescript
export function createInitialGameState(): GameState {
  return {
    board: [
      [
        createPiece('quaxly', 'player2', 0),       // Row 0, Col 0
        createPiece('terapagos', 'player2', 0),    // Row 0, Col 1
        createPiece('sprigatito', 'player2', 0),   // Row 0, Col 2
      ],
      [
        null,                                      // Row 1, Col 0
        createPiece('fuecoco', 'player2', 0),      // Row 1, Col 1
        null,                                      // Row 1, Col 2
      ],
      [
        null,                                      // Row 2, Col 0
        createPiece('charmander', 'player1', 0),   // Row 2, Col 1
        null,                                      // Row 2, Col 2
      ],
      [
        createPiece('bulbasaur', 'player1', 0),    // Row 3, Col 0
        createPiece('pikachu', 'player1', 0),      // Row 3, Col 1
        createPiece('squirtle', 'player1', 0),     // Row 3, Col 2
      ],
    ],
    capturedPieces: {
      player1: [],
      player2: [],
    },
    currentTurn: 'player1',
    gameStatus: 'playing',
    selectedPiece: null,
    validMoves: [],
  }
}
```

**検証方法**:
- 盤面は3×4（3列×4行）
- player1（先手）後列: `bulbasaur`, `pikachu`, `squirtle`（左から右）
- player1（先手）前列: 中央に `charmander`
- player2（後手）後列: `quaxly`, `terapagos`, `sprigatito`（左から右）
- player2（後手）前列: 中央に `fuecoco`
- 初期ターンは `player1`
- ゲームステータスは `playing`

---

## 契約テスト

### テストケース 1: 初期配置の検証

```typescript
// src/utils/initialBoard.test.ts
import { createInitialGameState } from './initialBoard'

describe('createInitialGameState', () => {
  it('should create initial board with correct player1 pieces', () => {
    const state = createInitialGameState()

    // Row 3 (player1 back row)
    expect(state.board[3][0]?.type).toBe('bulbasaur')
    expect(state.board[3][0]?.owner).toBe('player1')
    expect(state.board[3][1]?.type).toBe('pikachu')
    expect(state.board[3][1]?.owner).toBe('player1')
    expect(state.board[3][2]?.type).toBe('squirtle')
    expect(state.board[3][2]?.owner).toBe('player1')

    // Row 2 (player1 front row)
    expect(state.board[2][0]).toBeNull()
    expect(state.board[2][1]?.type).toBe('charmander')
    expect(state.board[2][1]?.owner).toBe('player1')
    expect(state.board[2][2]).toBeNull()
  })

  it('should create initial board with correct player2 pieces', () => {
    const state = createInitialGameState()

    // Row 0 (player2 back row)
    expect(state.board[0][0]?.type).toBe('quaxly')
    expect(state.board[0][0]?.owner).toBe('player2')
    expect(state.board[0][1]?.type).toBe('terapagos')
    expect(state.board[0][1]?.owner).toBe('player2')
    expect(state.board[0][2]?.type).toBe('sprigatito')
    expect(state.board[0][2]?.owner).toBe('player2')

    // Row 1 (player2 front row)
    expect(state.board[1][0]).toBeNull()
    expect(state.board[1][1]?.type).toBe('fuecoco')
    expect(state.board[1][1]?.owner).toBe('player2')
    expect(state.board[1][2]).toBeNull()
  })

  it('should have elephant and giraffe in reversed positions', () => {
    const state = createInitialGameState()

    // player1: elephant on left (col 0), giraffe on right (col 2)
    expect(state.board[3][0]?.type).toBe('bulbasaur') // elephant
    expect(state.board[3][2]?.type).toBe('squirtle')  // giraffe

    // player2: giraffe on left (col 0), elephant on right (col 2)
    expect(state.board[0][0]?.type).toBe('quaxly')      // giraffe
    expect(state.board[0][2]?.type).toBe('sprigatito')  // elephant
  })

  it('should initialize game state correctly', () => {
    const state = createInitialGameState()

    expect(state.currentTurn).toBe('player1')
    expect(state.gameStatus).toBe('playing')
    expect(state.capturedPieces.player1).toEqual([])
    expect(state.capturedPieces.player2).toEqual([])
    expect(state.selectedPiece).toBeNull()
    expect(state.validMoves).toEqual([])
  })
})
```

**期待結果**: テストがパスする

---

### テストケース 2: 駒の個数検証

```typescript
describe('createInitialGameState - Piece counts', () => {
  it('should have 4 pieces per player', () => {
    const state = createInitialGameState()

    const player1Pieces = state.board.flat().filter(piece => piece?.owner === 'player1')
    const player2Pieces = state.board.flat().filter(piece => piece?.owner === 'player2')

    expect(player1Pieces.length).toBe(4)
    expect(player2Pieces.length).toBe(4)
  })

  it('should have 1 king, 1 elephant, 1 giraffe, 1 chick per player', () => {
    const state = createInitialGameState()

    const player1Pieces = state.board.flat().filter(piece => piece?.owner === 'player1')
    const player2Pieces = state.board.flat().filter(piece => piece?.owner === 'player2')

    const player1Types = player1Pieces.map(p => p?.type).sort()
    const player2Types = player2Pieces.map(p => p?.type).sort()

    expect(player1Types).toEqual(['bulbasaur', 'charmander', 'pikachu', 'squirtle'])
    expect(player2Types).toEqual(['fuecoco', 'quaxly', 'sprigatito', 'terapagos'])
  })
})
```

**期待結果**: テストがパスする

---

## 破壊的変更チェック

- ✅ 関数のシグネチャは変更なし
- ✅ 戻り値の型は変更なし
- ⚠️ player2の初期配置が変更（視覚的な変更のみ、ゲームロジックへの影響なし）
- ❌ 破壊的変更なし（既存のゲームロジックと互換性あり）
