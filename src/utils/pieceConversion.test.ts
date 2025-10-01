import { convertCapturedPiece, PIECE_TO_ROLE_MAP, ROLE_TO_PIECE_MAP } from './pieceConversion'
import type { Piece, PieceType, Player } from '../types/piece'

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
    throw new Error('pieceConversion contract tests failed')
  }
}

const assertEqual = (actual: unknown, expected: unknown, message: string) => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`)
  }
}

const createPiece = (type: PieceType, owner: Player, overrides: Partial<Piece> = {}): Piece => ({
  id: overrides.id ?? `${owner}-${type}-fixture`,
  type,
  owner,
  isPromoted: overrides.isPromoted ?? (type === 'charizard' || type === 'skeledirge'),
  imageUrl: overrides.imageUrl ?? 'fixture-image-url',
})

const mirrorPlayer = (player: Player): Player => (player === 'player1' ? 'player2' : 'player1')

runTests([
  {
    name: '王将役の変換（terapagos → pikachu）',
    run: () => {
      const captured = createPiece('terapagos' as PieceType, 'player2')
      const result = convertCapturedPiece(captured, 'player1')
      assertEqual(result.type, 'pikachu', '捕獲後の駒タイプ')
      assertEqual(result.owner, 'player1', '捕獲後の所有者')
      assertEqual(result.isPromoted, false, '捕獲後の進化状態')
    },
  },
  {
    name: '王将役の変換（pikachu → terapagos）',
    run: () => {
      const captured = createPiece('pikachu', 'player1', { isPromoted: false })
      const result = convertCapturedPiece(captured, 'player2')
      assertEqual(result.type, 'terapagos', '捕獲後の駒タイプ')
      assertEqual(result.owner, 'player2', '捕獲後の所有者')
      assertEqual(result.isPromoted, false, '捕獲後の進化状態')
    },
  },
  {
    name: 'ひよこ役の変換（fuecoco → charmander）',
    run: () => {
      const captured = createPiece('fuecoco' as PieceType, 'player2', { isPromoted: false })
      const result = convertCapturedPiece(captured, 'player1')
      assertEqual(result.type, 'charmander', '捕獲後の駒タイプ')
      assertEqual(result.owner, 'player1', '捕獲後の所有者')
      assertEqual(result.isPromoted, false, '捕獲後の進化状態')
    },
  },
  {
    name: 'ひよこ役の変換（charmander → fuecoco）',
    run: () => {
      const captured = createPiece('charmander', 'player1', { isPromoted: false })
      const result = convertCapturedPiece(captured, 'player2')
      assertEqual(result.type, 'fuecoco', '捕獲後の駒タイプ')
      assertEqual(result.owner, 'player2', '捕獲後の所有者')
      assertEqual(result.isPromoted, false, '捕獲後の進化状態')
    },
  },
  {
    name: '進化駒の変換（skeledirge → charmander）',
    run: () => {
      const captured = createPiece('skeledirge' as PieceType, 'player2', { isPromoted: true })
      const result = convertCapturedPiece(captured, 'player1')
      assertEqual(result.type, 'charmander', '捕獲後の駒タイプ')
      assertEqual(result.owner, 'player1', '捕獲後の所有者')
      assertEqual(result.isPromoted, false, '捕獲後の進化状態')
    },
  },
  {
    name: '進化駒の変換（charizard → fuecoco）',
    run: () => {
      const captured = createPiece('charizard', 'player1', { isPromoted: true })
      const result = convertCapturedPiece(captured, 'player2')
      assertEqual(result.type, 'fuecoco', '捕獲後の駒タイプ')
      assertEqual(result.owner, 'player2', '捕獲後の所有者')
      assertEqual(result.isPromoted, false, '捕獲後の進化状態')
    },
  },
  {
    name: '全役職の変換（両プレイヤー）',
    run: () => {
      const players: Player[] = ['player1', 'player2']
      const roles: PieceType[] = Object.keys(PIECE_TO_ROLE_MAP) as PieceType[]

      for (const capturingPlayer of players) {
        const opponent = mirrorPlayer(capturingPlayer)

        for (const pieceType of roles) {
          const enemyPiece = createPiece(pieceType, opponent)
          const role = PIECE_TO_ROLE_MAP[pieceType]
          const expectedRole = role === 'hen' ? 'chick' : role
          const expectedType = ROLE_TO_PIECE_MAP[capturingPlayer][expectedRole]
          const result = convertCapturedPiece(enemyPiece, capturingPlayer)

          assertEqual(result.owner, capturingPlayer, '捕獲後の所有者')
          assertEqual(result.type, expectedType, `役職 ${role} の捕獲後タイプ`)
          assertEqual(result.isPromoted, false, '捕獲後の進化状態')
        }
      }
    },
  },
])
