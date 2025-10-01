import { memo } from 'react'
import type { Piece as PieceData } from '../types/piece'
import { useImageCache } from '../hooks/useImageCache'

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

const OWNER_LABEL: Record<PieceData['owner'], string> = {
  player1: '先手',
  player2: '後手',
}

interface PieceProps {
  piece: PieceData
}

export const Piece = memo(({ piece }: PieceProps) => {
  const { imageUrl, isLoading } = useImageCache(piece.type)
  const ownerLabel = OWNER_LABEL[piece.owner]
  const pieceName = PIECE_NAMES[piece.type]
  const ariaLabel = `${ownerLabel}の${pieceName}`

  return (
    <div className="relative flex items-center justify-center" aria-label={ariaLabel} role="img">
      {isLoading && <span className="absolute inset-0 animate-pulse rounded-lg bg-slate-200" />}
      <img
        src={imageUrl}
        alt={ariaLabel}
        className="relative z-[1] h-full w-full select-none object-contain"
        draggable={false}
      />
    </div>
  )
})

Piece.displayName = 'Piece'
