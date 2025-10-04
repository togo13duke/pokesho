import type { PieceType, Player, Direction } from '../types/piece'

export type MoveVector = [number, number]

export interface MoveRule {
  pieceType: PieceType
  directions: MoveVector[]
}

const KING_DIRECTIONS: MoveVector[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const ELEPHANT_DIRECTIONS: MoveVector[] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]

const GIRAFFE_DIRECTIONS: MoveVector[] = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

const CHICK_DIRECTIONS: MoveVector[] = [[-1, 0]]

const HEN_DIRECTIONS: MoveVector[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, 0],
]

const createMoveRule = (pieceType: PieceType, directions: MoveVector[]): MoveRule => ({
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

/**
 * 駒の移動可能方向を文字列表現で取得
 * @param pieceType 駒のタイプ
 * @param player プレイヤー（後手の場合は方向を反転）
 * @returns 移動可能な方向の配列
 */
export function getPossibleMoveDirections(pieceType: PieceType, player: Player): Direction[] {
  const rule = getMoveRule(pieceType)
  if (!rule) return []

  const directions: Direction[] = []

  for (const [rowOffset, colOffset] of rule.directions) {
    // player2（後手）の場合は方向を反転
    const actualRow = player === 'player2' ? -rowOffset : rowOffset
    const actualCol = player === 'player2' ? -colOffset : colOffset

    if (actualRow === -1 && actualCol === -1) directions.push('upLeft')
    else if (actualRow === -1 && actualCol === 0) directions.push('up')
    else if (actualRow === -1 && actualCol === 1) directions.push('upRight')
    else if (actualRow === 0 && actualCol === -1) directions.push('left')
    else if (actualRow === 0 && actualCol === 1) directions.push('right')
    else if (actualRow === 1 && actualCol === -1) directions.push('downLeft')
    else if (actualRow === 1 && actualCol === 0) directions.push('down')
    else if (actualRow === 1 && actualCol === 1) directions.push('downRight')
  }

  return directions
}
