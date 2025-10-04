export type PieceType =
  | 'pikachu'
  | 'bulbasaur'
  | 'squirtle'
  | 'charmander'
  | 'charizard'
  | 'terapagos'
  | 'sprigatito'
  | 'quaxly'
  | 'fuecoco'
  | 'skeledirge'

export type Player = 'player1' | 'player2'

/**
 * 駒の移動可能方向
 * - 基本8方向: up, down, left, right, upLeft, upRight, downLeft, downRight
 */
export type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'upLeft'
  | 'upRight'
  | 'downLeft'
  | 'downRight'

export type Role = 'king' | 'elephant' | 'giraffe' | 'chick' | 'hen'

export type RoleToPieceMap = Record<Player, Record<Role, PieceType>>

export type PieceToRoleMap = Record<PieceType, Role>

export interface Piece {
  id: string
  type: PieceType
  owner: Player
  isPromoted: boolean
  imageUrl: string
}
