import type { Piece, Player } from './piece'

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
