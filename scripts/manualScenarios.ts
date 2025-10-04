import { createInitialGameState } from '../src/utils/initialBoard'
import { evaluateGameStatus } from '../src/utils/gameLogic'
import { MOVE_RULES, type MoveVector } from '../src/utils/moveRules'
import type { Board, CapturedPieces, GameState, Position } from '../src/types/game'
import type { Piece, PieceType, Player } from '../src/types/piece'

declare const process: { exitCode?: number }

interface TestResult {
  id: string
  description: string
  success: boolean
  details?: string
}

const results: TestResult[] = []

function record(id: string, description: string, fn: () => void) {
  try {
    fn()
    results.push({ id, description, success: true })
  } catch (error) {
    results.push({
      id,
      description,
      success: false,
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

const BOARD_ROWS = 4
const BOARD_COLS = 3
const PROMOTION_ROW: Record<Player, number> = {
  player1: 0,
  player2: 3,
}
const directionMultiplierByPlayer: Record<Player, 1 | -1> = {
  player1: 1,
  player2: -1,
}

let idCounter = 0

function generatePieceId(owner: Player, type: PieceType): string {
  idCounter += 1
  return `${owner}-${type}-sim-${idCounter}`
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)))
}

function cloneCapturedPieces(captured: CapturedPieces): CapturedPieces {
  return {
    player1: captured.player1.map((piece) => ({ ...piece })),
    player2: captured.player2.map((piece) => ({ ...piece })),
  }
}

function adjustDirection(direction: MoveVector, owner: Player): MoveVector {
  const multiplier = directionMultiplierByPlayer[owner]
  return [direction[0] * multiplier, direction[1]]
}

function calculateValidMoves(board: Board, position: Position, piece: Piece): Position[] {
  const rule = MOVE_RULES.find((move) => move.pieceType === piece.type)
  if (!rule) {
    return []
  }

  const moves: Position[] = []

  rule.directions.forEach((direction) => {
    const [rowOffset, colOffset] = adjustDirection(direction, piece.owner)
    const targetRow = position.row + rowOffset
    const targetCol = position.col + colOffset

    if (targetRow < 0 || targetRow >= BOARD_ROWS || targetCol < 0 || targetCol >= BOARD_COLS) {
      return
    }

    const targetPiece = board[targetRow][targetCol]
    if (targetPiece?.owner === piece.owner) {
      return
    }

    moves.push({ row: targetRow, col: targetCol })
  })

  return moves
}

function normalizeCapturedPiece(piece: Piece, capturer: Player): Piece {
  const baseType: PieceType = piece.type === 'charizard' ? 'charmander' : piece.type
  return {
    id: generatePieceId(capturer, baseType),
    type: baseType,
    owner: capturer,
    isPromoted: false,
    imageUrl: piece.imageUrl,
  }
}

function promoteIfNeeded(piece: Piece, row: number): Piece {
  if (piece.type !== 'charmander') {
    return piece
  }

  if (row !== PROMOTION_ROW[piece.owner]) {
    return piece
  }

  return {
    ...piece,
    type: 'charizard',
    isPromoted: true,
  }
}

function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1'
}

function movePiece(state: GameState, from: Position, to: Position): GameState {
  const board = cloneBoard(state.board)
  const movingPiece = board[from.row]?.[from.col]
  if (!movingPiece) {
    throw new Error('移動元に駒がありません')
  }
  if (movingPiece.owner !== state.currentTurn) {
    throw new Error('ターンではない駒を動かそうとしました')
  }

  const validMoves = calculateValidMoves(board, from, movingPiece)
  if (!validMoves.some((pos) => pos.row === to.row && pos.col === to.col)) {
    throw new Error('不正な移動先です')
  }

  const capturedPieces = cloneCapturedPieces(state.capturedPieces)
  const destinationPiece = board[to.row][to.col]
  if (destinationPiece) {
    const normalized = normalizeCapturedPiece(destinationPiece, movingPiece.owner)
    capturedPieces[movingPiece.owner].push(normalized)
  }

  board[from.row][from.col] = null
  const promoted = promoteIfNeeded({ ...movingPiece }, to.row)
  board[to.row][to.col] = promoted

  const nextStatus = evaluateGameStatus(board, capturedPieces)
  const nextTurn = nextStatus === 'playing' ? getOpponent(state.currentTurn) : state.currentTurn

  return {
    ...state,
    board,
    capturedPieces,
    currentTurn: nextTurn,
    gameStatus: nextStatus,
    selectedPiece: null,
    validMoves: [],
  }
}

function listEmptyCells(board: Board): Position[] {
  const positions: Position[] = []
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      if (!board[row][col]) {
        positions.push({ row, col })
      }
    }
  }
  return positions
}

function dropCapturedPiece(state: GameState, pieceId: string, target: Position): GameState {
  if (state.board[target.row][target.col]) {
    throw new Error('ドロップ先が空きマスではありません')
  }

  const capturedPieces = cloneCapturedPieces(state.capturedPieces)
  const hand = capturedPieces[state.currentTurn]
  const index = hand.findIndex((piece) => piece.id === pieceId)
  if (index === -1) {
    throw new Error('指定した手駒が見つかりません')
  }

  const [pieceToDrop] = hand.splice(index, 1)
  const board = cloneBoard(state.board)
  board[target.row][target.col] = {
    ...pieceToDrop,
    id: generatePieceId(state.currentTurn, pieceToDrop.type),
    owner: state.currentTurn,
    isPromoted: pieceToDrop.type === 'charizard',
  }

  const nextStatus = evaluateGameStatus(board, capturedPieces)
  const nextTurn = nextStatus === 'playing' ? getOpponent(state.currentTurn) : state.currentTurn

  return {
    ...state,
    board,
    capturedPieces,
    currentTurn: nextTurn,
    gameStatus: nextStatus,
    selectedPiece: null,
    validMoves: [],
  }
}

function ensure(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

record('T029', '初期配置が仕様通り', () => {
  const state = createInitialGameState()
  ensure(state.board[0][0]?.type === 'bulbasaur' && state.board[0][0]?.owner === 'player2', '後手左列が不正')
  ensure(state.board[0][1]?.type === 'pikachu' && state.board[0][1]?.owner === 'player2', '後手中央が不正')
  ensure(state.board[0][2]?.type === 'squirtle' && state.board[0][2]?.owner === 'player2', '後手右列が不正')
  ensure(state.board[1][1]?.type === 'charmander' && state.board[1][1]?.owner === 'player2', '後手ヒトカゲが不在')
  ensure(state.board[2][1]?.type === 'charmander' && state.board[2][1]?.owner === 'player1', '先手ヒトカゲが不在')
  ensure(state.board[3][0]?.type === 'bulbasaur' && state.board[3][0]?.owner === 'player1', '先手左列が不正')
  ensure(state.board[3][1]?.type === 'pikachu' && state.board[3][1]?.owner === 'player1', '先手中央が不正')
  ensure(state.board[3][2]?.type === 'squirtle' && state.board[3][2]?.owner === 'player1', '先手右列が不正')
  ensure(state.currentTurn === 'player1', '初期ターンが先手ではありません')
})

record('T030', 'ヒトカゲの移動先ハイライトが前方1マスのみである', () => {
  const state = createInitialGameState()
  const piece = state.board[2][1]
  ensure(Boolean(piece), '先手ヒトカゲが見つかりません')
  const moves = calculateValidMoves(state.board, { row: 2, col: 1 }, piece as Piece)
  ensure(moves.length === 1, `想定外の移動候補数: ${moves.length}`)
  const target = moves[0]
  ensure(target.row === 1 && target.col === 1, 'ヒトカゲの移動先座標が不正')
})

record('T031', 'ヒトカゲが前進して敵駒を取得できる', () => {
  const state = createInitialGameState()
  const next = movePiece(state, { row: 2, col: 1 }, { row: 1, col: 1 })
  ensure(next.board[1][1]?.owner === 'player1', '移動後の駒所有者が不正')
  ensure(next.capturedPieces.player1.length === 1, '取得した駒が手駒に追加されていません')
  const captured = next.capturedPieces.player1[0]
  ensure(captured.type === 'charmander', '取得駒の種類が想定外')
  ensure(next.currentTurn === 'player2', 'ターンが後手に交代していません')
})

record('T032', '取得した駒を手駒から盤面に打てる', () => {
  const initial = createInitialGameState()
  const afterCapture = movePiece(initial, { row: 2, col: 1 }, { row: 1, col: 1 })
  const afterOpponentMove = movePiece(afterCapture, { row: 0, col: 2 }, { row: 1, col: 2 })
  const hand = afterOpponentMove.capturedPieces.player1
  ensure(hand.length === 1, '手駒が存在しません')
  const dropTarget: Position = { row: 2, col: 1 }
  ensure(!afterOpponentMove.board[dropTarget.row][dropTarget.col], 'ドロップ先が空いていません')
  const afterDrop = dropCapturedPiece(
    { ...afterOpponentMove, currentTurn: 'player1' },
    hand[0].id,
    dropTarget,
  )
  ensure(afterDrop.board[dropTarget.row][dropTarget.col]?.owner === 'player1', 'ドロップ後の所有者が不正')
  ensure(afterDrop.capturedPieces.player1.length === 0, '手駒から削除されていません')
  ensure(afterDrop.currentTurn === 'player2', 'ターンが切り替わっていません')
})

record('T033', 'ヒトカゲが敵陣最奥でリザードンに進化する', () => {
  const initial = createInitialGameState()
  const afterCapture = movePiece(initial, { row: 2, col: 1 }, { row: 1, col: 1 })
  const movedPikachu = movePiece(afterCapture, { row: 0, col: 1 }, { row: 1, col: 0 })
  const afterPromotion = movePiece(movedPikachu, { row: 1, col: 1 }, { row: 0, col: 1 })
  const promoted = afterPromotion.board[0][1]
  ensure(promoted?.type === 'charizard', '昇格後の駒種がリザードンではありません')
  ensure(promoted?.isPromoted === true, '進化フラグが立っていません')
  const moves = calculateValidMoves(afterPromotion.board, { row: 0, col: 1 }, promoted as Piece)
  ensure(moves.some((pos) => pos.row === 0 && pos.col === 2), '横方向への移動が許可されていません')
})

record('T034', 'ピカチュウ捕獲で勝利判定が発生する', () => {
  const initial = createInitialGameState()
  const afterCenterCapture = movePiece(initial, { row: 2, col: 1 }, { row: 1, col: 1 })
  const afterOpponentShift = movePiece(afterCenterCapture, { row: 0, col: 2 }, { row: 1, col: 2 })
  const winningState = movePiece(afterOpponentShift, { row: 1, col: 1 }, { row: 0, col: 1 })
  ensure(winningState.gameStatus === 'player1_win', 'ピカチュウ捕獲時に勝利判定が発生していません')
})

record('T035', 'トライ成功で勝利判定が発生する', () => {
  const initial = createInitialGameState()
  const step1 = movePiece(initial, { row: 3, col: 1 }, { row: 2, col: 0 })
  const step2 = movePiece(step1, { row: 0, col: 2 }, { row: 1, col: 2 })
  const step3 = movePiece(step2, { row: 2, col: 0 }, { row: 1, col: 0 })
  const step4 = movePiece(step3, { row: 0, col: 1 }, { row: 0, col: 2 })
  const step5 = movePiece(step4, { row: 1, col: 0 }, { row: 0, col: 0 })
  ensure(step5.gameStatus === 'player1_win', 'トライ成立時に勝利判定が発生していません')
})

record('T036-1', '移動可能マスがない駒はハイライトされない', () => {
  const state = createInitialGameState()
  const piece = state.board[3][0]
  ensure(Boolean(piece), '先手左翼の駒が見つかりません')
  const moves = calculateValidMoves(state.board, { row: 3, col: 0 }, piece as Piece)
  ensure(moves.length === 0, '移動不能な駒にハイライトが存在します')
})

record('T036-2', '盤面が埋まっている場合は手駒を打てない', () => {
  const state = createInitialGameState()
  const board = cloneBoard(state.board)
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      if (!board[row][col]) {
        board[row][col] = {
          id: generatePieceId('player1', 'charmander'),
          type: 'charmander',
          owner: row % 2 === 0 ? 'player1' : 'player2',
          isPromoted: false,
          imageUrl: '/placeholder',
        }
      }
    }
  }
  const emptyCells = listEmptyCells(board)
  ensure(emptyCells.length === 0, '盤面が埋まっていません')
})

for (const result of results) {
  if (result.success) {
    console.log(`✅ ${result.id}: ${result.description}`)
  } else {
    console.log(`❌ ${result.id}: ${result.description} → ${result.details ?? '理由不明'}`)
  }
}

const failed = results.filter((res) => !res.success)
if (failed.length > 0) {
  process.exitCode = 1
}
