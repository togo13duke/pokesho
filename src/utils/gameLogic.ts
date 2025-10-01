import type { Board, CapturedPieces, GameStatus } from '../types/game'
import type { Piece, Player } from '../types/piece'
import { PIECE_TO_ROLE_MAP } from './pieceConversion'

const BACK_RANK_BY_PLAYER: Record<Player, number> = {
  player1: 3,
  player2: 0,
}

const isKingPiece = (piece: Piece | null | undefined): boolean => {
  if (!piece) {
    return false
  }
  return PIECE_TO_ROLE_MAP[piece.type] === 'king'
}

export function checkKingCapture(capturedPieces: CapturedPieces): Player | null {
  if (capturedPieces.player1.some((piece) => isKingPiece(piece))) {
    return 'player1'
  }

  if (capturedPieces.player2.some((piece) => isKingPiece(piece))) {
    return 'player2'
  }

  return null
}

export function checkTry(board: Board): Player | null {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col]
      if (!piece) {
        continue
      }

      if (!isKingPiece(piece)) {
        continue
      }

      const opponent = piece.owner === 'player1' ? 'player2' : 'player1'
      const targetRank = BACK_RANK_BY_PLAYER[opponent]
      if (row === targetRank) {
        return piece.owner
      }
    }
  }

  return null
}

export function evaluateGameStatus(board: Board, capturedPieces: CapturedPieces): GameStatus {
  const captureWinner = checkKingCapture(capturedPieces)
  if (captureWinner) {
    return captureWinner === 'player1' ? 'player1_win' : 'player2_win'
  }

  const tryWinner = checkTry(board)
  if (tryWinner) {
    return tryWinner === 'player1' ? 'player1_win' : 'player2_win'
  }

  return 'playing'
}
