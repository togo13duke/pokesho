import type { PieceType } from '../types/piece'

export type Direction = [number, number]

export interface MoveRule {
  pieceType: PieceType
  directions: Direction[]
}

export const MOVE_RULES: MoveRule[] = [
  {
    pieceType: 'pikachu',
    directions: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ],
  },
  {
    pieceType: 'bulbasaur',
    directions: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  },
  {
    pieceType: 'squirtle',
    directions: [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
  },
  {
    pieceType: 'charmander',
    directions: [[-1, 0]],
  },
  {
    pieceType: 'charizard',
    directions: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
  },
]

export function getMoveRule(pieceType: PieceType): MoveRule | undefined {
  return MOVE_RULES.find((rule) => rule.pieceType === pieceType)
}
