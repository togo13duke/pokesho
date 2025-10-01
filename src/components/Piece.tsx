import { memo, useMemo } from 'react'
import type { Piece as PieceData, Direction } from '../types/piece'
import { useImageCache } from '../hooks/useImageCache'
import { getPossibleMoveDirections } from '../utils/moveRules'

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

const DIRECTION_LABELS: Record<Direction, string> = {
  up: '上',
  down: '下',
  left: '左',
  right: '右',
  upLeft: '左上',
  upRight: '右上',
  downLeft: '左下',
  downRight: '右下',
}

const DIRECTION_MARKER_POSITIONS: Record<Direction, string> = {
  up: 'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  down: 'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  left: 'absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
  right: 'absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
  upLeft: 'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  upRight: 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2',
  downLeft: 'absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  downRight: 'absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2',
}

interface PieceProps {
  piece: PieceData
}

export const Piece = memo(({ piece }: PieceProps) => {
  const { imageUrl, isLoading } = useImageCache(piece.type)
  const ownerLabel = OWNER_LABEL[piece.owner]
  const pieceName = PIECE_NAMES[piece.type]
  const ariaLabel = `${ownerLabel}の${pieceName}`

  // 移動可能方向を計算（player2の場合は自動的に反転される）
  const directions = useMemo(
    () => getPossibleMoveDirections(piece.type, piece.owner),
    [piece.type, piece.owner]
  )

  // player2（後手）の駒は180度回転
  const rotationClass = piece.owner === 'player2' ? 'rotate-180' : ''

  return (
    <div className={`relative flex items-center justify-center ${rotationClass}`} aria-label={ariaLabel} role="img">
      {isLoading && <span className="absolute inset-0 animate-pulse rounded-lg bg-slate-200" />}
      <img
        src={imageUrl}
        alt={ariaLabel}
        className="relative z-[1] h-full w-full select-none object-contain"
        draggable={false}
      />
      {/* 移動方向マーカー */}
      {directions.map((direction) => (
        <svg
          key={direction}
          className={`${DIRECTION_MARKER_POSITIONS[direction]} h-2 w-2 text-gray-600`}
          viewBox="0 0 10 10"
          aria-label={`${DIRECTION_LABELS[direction]}に移動可能`}
        >
          <polygon points="5,0 8,6 2,6" fill="currentColor" />
        </svg>
      ))}
    </div>
  )
})

Piece.displayName = 'Piece'
