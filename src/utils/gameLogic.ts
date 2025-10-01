import type { Board, CapturedPieces, GameStatus } from '../types/game'
import type { Player } from '../types/piece'

const BACK_RANK_BY_PLAYER: Record<Player, number> = {
  player1: 3,
  player2: 0,
}

export function checkPikachuCapture(capturedPieces: CapturedPieces): Player | null {
  if (capturedPieces.player1.some((piece) => piece.type === 'pikachu')) {
    return 'player1'
  }

  if (capturedPieces.player2.some((piece) => piece.type === 'pikachu')) {
    return 'player2'
  }

  return null
}

export function checkTry(board: Board): Player | null {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col]
      if (piece?.type === 'pikachu') {
        const opponent = piece.owner === 'player1' ? 'player2' : 'player1'
        const targetRank = BACK_RANK_BY_PLAYER[opponent]
        if (row === targetRank) {
          return piece.owner
        }
      }
    }
  }

  return null
}

export function evaluateGameStatus(board: Board, capturedPieces: CapturedPieces): GameStatus {
  const captureWinner = checkPikachuCapture(capturedPieces)
  if (captureWinner) {
    return captureWinner === 'player1' ? 'player1_win' : 'player2_win'
  }

  const tryWinner = checkTry(board)
  if (tryWinner) {
    return tryWinner === 'player1' ? 'player1_win' : 'player2_win'
  }

  return 'playing'
}
