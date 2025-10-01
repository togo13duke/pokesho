import { useCallback, useMemo, useState } from 'react'
import { PLACEHOLDER_IMAGE_PATH } from '../constants/pokemon'
import type { Board, CapturedPieces, GameState, GameStatus, Position } from '../types/game'
import type { Piece, PieceType, Player } from '../types/piece'
import { evaluateGameStatus } from '../utils/gameLogic'
import { createInitialGameState } from '../utils/initialBoard'
import { convertCapturedPiece } from '../utils/pieceConversion'
import { MOVE_RULES, type Direction } from '../utils/moveRules'

interface UseGameStateResult {
  board: Board
  capturedPieces: CapturedPieces
  currentTurn: Player
  gameStatus: GameStatus
  selectedBoardPiece: Position | null
  selectedCapturedPieceId: string | null
  highlightPositions: Position[]
  hasEmptyCell: boolean
  handleCellClick: (row: number, col: number) => void
  handleCapturedPieceClick: (pieceId: string) => void
  cancelSelection: () => void
  restartGame: () => void
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

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)))
}

function cloneCapturedPieces(captured: CapturedPieces): CapturedPieces {
  return {
    player1: captured.player1.map((piece) => ({ ...piece })),
    player2: captured.player2.map((piece) => ({ ...piece })),
  }
}

function isWithinBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS
}

function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1'
}

function hasEmptyCellOnBoard(board: Board): boolean {
  return board.some((row) => row.some((cell) => cell === null))
}

function generatePieceId(owner: Player, type: PieceType): string {
  const globalCrypto = typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined
  if (globalCrypto && 'randomUUID' in globalCrypto) {
    return `${owner}-${type}-${globalCrypto.randomUUID()}`
  }

  const randomSuffix = Math.random().toString(36).slice(2, 10)
  return `${owner}-${type}-${Date.now()}-${randomSuffix}`
}

function normalizeCapturedPiece(piece: Piece, capturer: Player): Piece {
  const converted = convertCapturedPiece(piece, capturer)
  return {
    ...converted,
    id: generatePieceId(capturer, converted.type),
  }
}

function promoteIfNeeded(piece: Piece, row: number): Piece {
  const shouldPromote = row === PROMOTION_ROW[piece.owner]

  if (piece.type === 'charmander' && shouldPromote) {
    return {
      ...piece,
      type: 'charizard',
      isPromoted: true,
      imageUrl: PLACEHOLDER_IMAGE_PATH,
    }
  }

  if (piece.type === 'fuecoco' && shouldPromote) {
    return {
      ...piece,
      type: 'skeledirge',
      isPromoted: true,
      imageUrl: PLACEHOLDER_IMAGE_PATH,
    }
  }

  return piece
}

function adjustDirection(direction: Direction, owner: Player): Direction {
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

    if (!isWithinBounds(targetRow, targetCol)) {
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

function computeEmptyCells(board: Board): Position[] {
  const emptyCells: Position[] = []
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      if (!board[row][col]) {
        emptyCells.push({ row, col })
      }
    }
  }
  return emptyCells
}

export function useGameState(): UseGameStateResult {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())
  const [selectedCapturedPieceId, setSelectedCapturedPieceId] = useState<string | null>(null)
  const [dropPositions, setDropPositions] = useState<Position[]>([])

  const hasEmptyCell = useMemo(() => hasEmptyCellOnBoard(gameState.board), [gameState.board])

  const highlightPositions = useMemo(() => {
    return selectedCapturedPieceId ? dropPositions : gameState.validMoves
  }, [dropPositions, gameState.validMoves, selectedCapturedPieceId])

  const cancelSelection = useCallback(() => {
    setSelectedCapturedPieceId(null)
    setDropPositions([])
    setGameState((prev) => ({
      ...prev,
      selectedPiece: null,
      validMoves: [],
    }))
  }, [])

  const selectBoardPiece = useCallback(
    (row: number, col: number) => {
      const piece = gameState.board[row][col]
      if (!piece || piece.owner !== gameState.currentTurn) {
        return
      }

      const moves = calculateValidMoves(gameState.board, { row, col }, piece)

      setSelectedCapturedPieceId(null)
      setDropPositions([])
      setGameState((prev) => ({
        ...prev,
        selectedPiece: { row, col },
        validMoves: moves,
      }))
    },
    [gameState.board, gameState.currentTurn],
  )

  const handleCapturedPieceClick = useCallback(
    (pieceId: string) => {
      if (gameState.gameStatus !== 'playing') {
        return
      }

      if (!hasEmptyCell) {
        return
      }

      const currentHand = gameState.capturedPieces[gameState.currentTurn]
      const capturedPiece = currentHand.find((piece) => piece.id === pieceId)
      if (!capturedPiece) {
        return
      }

      if (selectedCapturedPieceId === pieceId) {
        cancelSelection()
        return
      }

      const emptyCells = computeEmptyCells(gameState.board)
      setSelectedCapturedPieceId(pieceId)
      setDropPositions(emptyCells)
      setGameState((prev) => ({
        ...prev,
        selectedPiece: null,
        validMoves: [],
      }))
    },
    [cancelSelection, gameState.board, gameState.capturedPieces, gameState.currentTurn, gameState.gameStatus, hasEmptyCell, selectedCapturedPieceId],
  )

  const dropCapturedPiece = useCallback(
    (row: number, col: number) => {
      if (!selectedCapturedPieceId) {
        return
      }

      const currentHand = gameState.capturedPieces[gameState.currentTurn]
      const pieceIndex = currentHand.findIndex((piece) => piece.id === selectedCapturedPieceId)
      if (pieceIndex === -1) {
        return
      }

      const capturedPieces = cloneCapturedPieces(gameState.capturedPieces)
      const [pieceToDrop] = capturedPieces[gameState.currentTurn].splice(pieceIndex, 1)
      const newPiece: Piece = {
        id: generatePieceId(gameState.currentTurn, pieceToDrop.type),
        type: pieceToDrop.type,
        owner: gameState.currentTurn,
        isPromoted: pieceToDrop.type === 'charizard',
        imageUrl: PLACEHOLDER_IMAGE_PATH,
      }

      const board = cloneBoard(gameState.board)
      board[row][col] = newPiece

      const nextStatus = evaluateGameStatus(board, capturedPieces)
      const nextTurn = nextStatus === 'playing' ? getOpponent(gameState.currentTurn) : gameState.currentTurn

      setGameState({
        board,
        capturedPieces,
        currentTurn: nextTurn,
        gameStatus: nextStatus,
        selectedPiece: null,
        validMoves: [],
      })

      setSelectedCapturedPieceId(null)
      setDropPositions([])
    },
    [gameState.board, gameState.capturedPieces, gameState.currentTurn, selectedCapturedPieceId],
  )

  const movePiece = useCallback(
    (targetRow: number, targetCol: number) => {
      const selected = gameState.selectedPiece
      if (!selected) {
        return
      }

      const movingPiece = gameState.board[selected.row]?.[selected.col]
      if (!movingPiece) {
        return
      }

      const board = cloneBoard(gameState.board)
      const capturedPieces = cloneCapturedPieces(gameState.capturedPieces)
      const destinationPiece = board[targetRow][targetCol]

      if (destinationPiece) {
        const normalized = normalizeCapturedPiece(destinationPiece, gameState.currentTurn)
        capturedPieces[gameState.currentTurn].push(normalized)
      }

      board[selected.row][selected.col] = null
      const promotedPiece = promoteIfNeeded(
        {
          ...movingPiece,
        },
        targetRow,
      )
      board[targetRow][targetCol] = promotedPiece

      const nextStatus = evaluateGameStatus(board, capturedPieces)
      const nextTurn = nextStatus === 'playing' ? getOpponent(gameState.currentTurn) : gameState.currentTurn

      setGameState({
        board,
        capturedPieces,
        currentTurn: nextTurn,
        gameStatus: nextStatus,
        selectedPiece: null,
        validMoves: [],
      })

      setSelectedCapturedPieceId(null)
      setDropPositions([])
    },
    [gameState.board, gameState.capturedPieces, gameState.currentTurn, gameState.selectedPiece],
  )

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState.gameStatus !== 'playing') {
        return
      }

      const isDropAction = Boolean(selectedCapturedPieceId)

      if (isDropAction) {
        const isValidDrop = dropPositions.some((position) => position.row === row && position.col === col)
        if (isValidDrop && !gameState.board[row][col]) {
          dropCapturedPiece(row, col)
        }
        return
      }

      if (gameState.selectedPiece) {
        const isSameCell = gameState.selectedPiece.row === row && gameState.selectedPiece.col === col
        const isValidMove = gameState.validMoves.some((position) => position.row === row && position.col === col)

        if (isSameCell) {
          cancelSelection()
          return
        }

        if (isValidMove) {
          movePiece(row, col)
          return
        }
      }

      const piece = gameState.board[row][col]
      if (piece && piece.owner === gameState.currentTurn) {
        selectBoardPiece(row, col)
        return
      }

      cancelSelection()
    },
    [cancelSelection, dropCapturedPiece, dropPositions, gameState.board, gameState.currentTurn, gameState.gameStatus, gameState.selectedPiece, gameState.validMoves, movePiece, selectBoardPiece, selectedCapturedPieceId],
  )

  const restartGame = useCallback(() => {
    setGameState(createInitialGameState())
    setSelectedCapturedPieceId(null)
    setDropPositions([])
  }, [])

  return {
    board: gameState.board,
    capturedPieces: gameState.capturedPieces,
    currentTurn: gameState.currentTurn,
    gameStatus: gameState.gameStatus,
    selectedBoardPiece: gameState.selectedPiece,
    selectedCapturedPieceId,
    highlightPositions,
    hasEmptyCell,
    handleCellClick,
    handleCapturedPieceClick,
    cancelSelection,
    restartGame,
  }
}
