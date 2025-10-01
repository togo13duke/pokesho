import { createInitialGameState } from './initialBoard'

interface TestCase {
  name: string
  run: () => void
}

const runTests = (cases: TestCase[]) => {
  let hasFailure = false
  for (const testCase of cases) {
    try {
      testCase.run()
      console.log(`ok - ${testCase.name}`)
    } catch (error) {
      hasFailure = true
      console.error(`not ok - ${testCase.name}`)
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    }
  }
  if (hasFailure) {
    throw new Error('initialBoard contract tests failed')
  }
}

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const state = createInitialGameState()

runTests([
  {
    name: 'player1 の初期配置が仕様通り',
    run: () => {
      const backRow = state.board[3]
      const frontRow = state.board[2]

      assert(backRow?.[0]?.type === 'bulbasaur', 'player1 後列左は bulbasaur')
      assert(backRow?.[1]?.type === 'pikachu', 'player1 後列中央は pikachu')
      assert(backRow?.[2]?.type === 'squirtle', 'player1 後列右は squirtle')
      assert(frontRow?.[1]?.type === 'charmander', 'player1 前列中央は charmander')
    },
  },
  {
    name: 'player2 の初期配置が仕様通り',
    run: () => {
      const backRow = state.board[0]
      const frontRow = state.board[1]

      assert(backRow?.[0]?.type === 'quaxly', 'player2 後列左は quaxly')
      assert(backRow?.[1]?.type === 'terapagos', 'player2 後列中央は terapagos')
      assert(backRow?.[2]?.type === 'sprigatito', 'player2 後列右は sprigatito')
      assert(frontRow?.[1]?.type === 'fuecoco', 'player2 前列中央は fuecoco')
    },
  },
  {
    name: 'ぞう役ときりん役の左右が反転している',
    run: () => {
      const player1BackRow = state.board[3]
      const player2BackRow = state.board[0]

      assert(player1BackRow?.[0]?.type === 'bulbasaur', 'player1 の左端は bulbasaur')
      assert(player1BackRow?.[2]?.type === 'squirtle', 'player1 の右端は squirtle')
      assert(player2BackRow?.[0]?.type === 'quaxly', 'player2 の左端は quaxly (きりん役)')
      assert(player2BackRow?.[2]?.type === 'sprigatito', 'player2 の右端は sprigatito (ぞう役)')
    },
  },
  {
    name: '各プレイヤーの駒は4体ずつ',
    run: () => {
      const counts = { player1: 0, player2: 0 }
      for (const row of state.board) {
        for (const cell of row) {
          if (cell) {
            counts[cell.owner] += 1
          }
        }
      }
      assert(counts.player1 === 4, 'player1 の駒数は4')
      assert(counts.player2 === 4, 'player2 の駒数は4')
    },
  },
])
