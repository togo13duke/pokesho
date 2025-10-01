import { PLACEHOLDER_IMAGE_PATH } from '../constants/pokemon'
import type { Piece, PieceToRoleMap, PieceType, Player, Role, RoleToPieceMap } from '../types/piece'

export const PIECE_TO_ROLE_MAP: PieceToRoleMap = {
  pikachu: 'king',
  bulbasaur: 'elephant',
  squirtle: 'giraffe',
  charmander: 'chick',
  charizard: 'hen',
  terapagos: 'king',
  sprigatito: 'elephant',
  quaxly: 'giraffe',
  fuecoco: 'chick',
  skeledirge: 'hen',
}

export const ROLE_TO_PIECE_MAP: RoleToPieceMap = {
  player1: {
    king: 'pikachu',
    elephant: 'bulbasaur',
    giraffe: 'squirtle',
    chick: 'charmander',
    hen: 'charizard',
  },
  player2: {
    king: 'terapagos',
    elephant: 'sprigatito',
    giraffe: 'quaxly',
    chick: 'fuecoco',
    hen: 'skeledirge',
  },
}

const demoteRole = (role: Role): Role => {
  if (role === 'hen') {
    return 'chick'
  }
  return role
}

export function convertCapturedPiece(capturedPiece: Piece, capturingPlayer: Player): Piece {
  const role = PIECE_TO_ROLE_MAP[capturedPiece.type]
  const normalizedRole = demoteRole(role)
  const convertedType: PieceType = ROLE_TO_PIECE_MAP[capturingPlayer][normalizedRole]

  return {
    id: capturedPiece.id,
    type: convertedType,
    owner: capturingPlayer,
    isPromoted: false,
    imageUrl: PLACEHOLDER_IMAGE_PATH,
  }
}
