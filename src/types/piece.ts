export type PieceType = 'pikachu' | 'bulbasaur' | 'squirtle' | 'charmander' | 'charizard'

export type Player = 'player1' | 'player2'

export interface Piece {
  id: string
  type: PieceType
  owner: Player
  isPromoted: boolean
  imageUrl: string
}
