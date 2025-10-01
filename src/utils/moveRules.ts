import type { PieceType } from '../types/piece'

export type Direction = [number, number]

export interface MoveRule {
  pieceType: PieceType
  directions: Direction[]
}

const KING_DIRECTIONS: Direction[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const ELEPHANT_DIRECTIONS: Direction[] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]

const GIRAFFE_DIRECTIONS: Direction[] = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

const CHICK_DIRECTIONS: Direction[] = [[-1, 0]]

const HEN_DIRECTIONS: Direction[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, 0],
]

const createMoveRule = (pieceType: PieceType, directions: Direction[]): MoveRule => ({
  pieceType,
  directions,
})

export const MOVE_RULES: MoveRule[] = [
  createMoveRule('pikachu', KING_DIRECTIONS),
  createMoveRule('terapagos', KING_DIRECTIONS),
  createMoveRule('bulbasaur', ELEPHANT_DIRECTIONS),
  createMoveRule('sprigatito', ELEPHANT_DIRECTIONS),
  createMoveRule('squirtle', GIRAFFE_DIRECTIONS),
  createMoveRule('quaxly', GIRAFFE_DIRECTIONS),
  createMoveRule('charmander', CHICK_DIRECTIONS),
  createMoveRule('fuecoco', CHICK_DIRECTIONS),
  createMoveRule('charizard', HEN_DIRECTIONS),
  createMoveRule('skeledirge', HEN_DIRECTIONS),
]

export function getMoveRule(pieceType: PieceType): MoveRule | undefined {
  return MOVE_RULES.find((rule) => rule.pieceType === pieceType)
}
