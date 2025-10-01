import type { CapturedPieces as CapturedPiecesState } from '../types/game'
import type { Piece as PieceData, Player } from '../types/piece'
import { Piece } from './Piece'

const PLAYER_LABEL: Record<Player, string> = {
  player1: '先手',
  player2: '後手',
}

const PIECE_NAMES: Record<PieceData['type'], string> = {
  pikachu: 'ピカチュウ',
  bulbasaur: 'フシギダネ',
  squirtle: 'ゼニガメ',
  charmander: 'ヒトカゲ',
  charizard: 'リザードン',
  terapagos: 'テラパゴス',
  sprigatito: 'ニャオハ',
  quaxly: 'クワッス',
  fuecoco: 'ホゲータ',
  skeledirge: 'ラウドボーン',
}

interface CapturedPiecesProps {
  capturedPieces: CapturedPiecesState
  currentTurn: Player
  selectedCapturedPieceId: string | null
  hasEmptyCell: boolean
  onSelect: (pieceId: string) => void
}

function HandSection({
  owner,
  pieces,
  isActive,
  selectedCapturedPieceId,
  hasEmptyCell,
  onSelect,
}: {
  owner: Player
  pieces: PieceData[]
  isActive: boolean
  selectedCapturedPieceId: string | null
  hasEmptyCell: boolean
  onSelect: (pieceId: string) => void
}) {
  return (
    <section className="flex flex-1 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-center text-lg font-semibold text-slate-700">{PLAYER_LABEL[owner]}の手駒</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {pieces.length === 0 ? (
          <p className="col-span-full text-center text-sm text-slate-500">手駒はありません</p>
        ) : (
          pieces.map((piece) => {
            const isSelected = piece.id === selectedCapturedPieceId
            const isDisabled = !isActive || !hasEmptyCell
            const ariaLabel = `${PLAYER_LABEL[owner]}の手駒: ${PIECE_NAMES[piece.type]}`

            return (
              <button
                key={piece.id}
                type="button"
                onClick={() => !isDisabled && onSelect(piece.id)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-label={ariaLabel}
                className={`flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition
                  ${isSelected ? 'ring-2 ring-poke-red' : ''}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poke-blue focus-visible:ring-offset-2'}`}
              >
                <Piece piece={piece} />
              </button>
            )
          })
        )}
      </div>
    </section>
  )
}

export function CapturedPieces({
  capturedPieces,
  currentTurn,
  selectedCapturedPieceId,
  hasEmptyCell,
  onSelect,
}: CapturedPiecesProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <HandSection
        owner="player1"
        pieces={capturedPieces.player1}
        isActive={currentTurn === 'player1'}
        selectedCapturedPieceId={selectedCapturedPieceId}
        hasEmptyCell={hasEmptyCell}
        onSelect={onSelect}
      />
      <HandSection
        owner="player2"
        pieces={capturedPieces.player2}
        isActive={currentTurn === 'player2'}
        selectedCapturedPieceId={selectedCapturedPieceId}
        hasEmptyCell={hasEmptyCell}
        onSelect={onSelect}
      />
    </div>
  )
}
