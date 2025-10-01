import type { Piece, Player } from './piece'

/**
 * プレイヤーに対応する表示色（TailwindCSSクラス名）
 */
export type PlayerColor = 'bg-blue-50' | 'bg-red-50'

/**
 * プレイヤーから表示色へのマッピング
 */
export const PLAYER_COLORS: Record<Player, PlayerColor> = {
  player1: 'bg-blue-50',
  player2: 'bg-red-50',
}

export interface Position {
  row: number
  col: number
}

export type Board = (Piece | null)[][]

export interface CapturedPieces {
  player1: Piece[]
  player2: Piece[]
}

export type GameStatus = 'playing' | 'player1_win' | 'player2_win'

export interface GameState {
  board: Board
  capturedPieces: CapturedPieces
  currentTurn: Player
  gameStatus: GameStatus
  selectedPiece: Position | null
  validMoves: Position[]
}

export interface ImageCacheEntry {
  pokemonId: number
  imageData: string
  cachedAt: number
}
