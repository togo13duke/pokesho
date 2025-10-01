import { PLACEHOLDER_IMAGE_PATH } from '../constants/pokemon'
import type { GameState } from '../types/game'
import type { Piece, PieceType, Player } from '../types/piece'

function createPiece(type: PieceType, owner: Player, index: number): Piece {
  return {
    id: `${owner}-${type}-${index}`,
    type,
    owner,
    isPromoted: type === 'charizard' || type === 'skeledirge',
    imageUrl: PLACEHOLDER_IMAGE_PATH,
  }
}

export function createInitialGameState(): GameState {
  return {
    board: [
      [
        createPiece('quaxly', 'player2', 0),
        createPiece('terapagos', 'player2', 0),
        createPiece('sprigatito', 'player2', 0),
      ],
      [
        null,
        createPiece('fuecoco', 'player2', 0),
        null,
      ],
      [
        null,
        createPiece('charmander', 'player1', 0),
        null,
      ],
      [
        createPiece('bulbasaur', 'player1', 0),
        createPiece('pikachu', 'player1', 0),
        createPiece('squirtle', 'player1', 0),
      ],
    ],
    capturedPieces: {
      player1: [],
      player2: [],
    },
    currentTurn: 'player1',
    gameStatus: 'playing',
    selectedPiece: null,
    validMoves: [],
  }
}
