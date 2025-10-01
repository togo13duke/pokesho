import type { MouseEvent, KeyboardEvent } from 'react'
import { Piece } from './Piece'
import type { Piece as PieceData } from '../types/piece'
import type { Position } from '../types/game'

const OWNER_LABEL: Record<PieceData['owner'], string> = {
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

interface CellProps {
  position: Position
  piece: PieceData | null
  isHighlighted: boolean
  isSelected: boolean
  onSelect: (row: number, col: number) => void
  tabIndex?: number
}

export function Cell({ position, piece, isHighlighted, isSelected, onSelect, tabIndex = 0 }: CellProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onSelect(position.row, position.col)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(position.row, position.col)
    }

    if (event.key === 'Escape') {
      event.stopPropagation()
      event.currentTarget.blur()
    }
  }

  const baseLabel = `${position.row + 1}行${position.col + 1}列`
  const pieceLabel = piece ? `${OWNER_LABEL[piece.owner]}の${PIECE_NAMES[piece.type]}` : '空きマス'
  const ariaLabel = `${baseLabel}: ${pieceLabel}`

  return (
    <button
      type="button"
      role="gridcell"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative flex aspect-square items-center justify-center rounded-xl border border-slate-300 transition
        ${isHighlighted ? 'bg-yellow-300/70 ring-2 ring-yellow-500' : 'bg-slate-100'}
        ${isSelected ? 'ring-2 ring-offset-2 ring-poke-blue' : ''}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-poke-blue`}
    >
      {piece ? <Piece piece={piece} /> : null}
    </button>
  )
}
