import { useMemo } from 'react'
import type { Board as BoardState, Position } from '../types/game'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardState
  highlightPositions: Position[]
  selectedPosition: Position | null
  onCellSelect: (row: number, col: number) => void
}

export function Board({ board, highlightPositions, selectedPosition, onCellSelect }: BoardProps) {
  const highlightKeySet = useMemo(() => {
    return new Set(highlightPositions.map((position) => `${position.row}-${position.col}`))
  }, [highlightPositions])

  const selectedKey = selectedPosition ? `${selectedPosition.row}-${selectedPosition.col}` : null

  return (
    <div
      role="grid"
      aria-label="3×4のポケモン将棋盤面"
      className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-200 p-4 shadow-inner"
    >
      {board.map((row, rowIndex) => (
        <div role="row" key={`row-${rowIndex}`} className="contents">
          {row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`
            const isHighlighted = highlightKeySet.has(cellKey)
            const isSelected = selectedKey === cellKey

            return (
              <Cell
                key={cellKey}
                position={{ row: rowIndex, col: colIndex }}
                piece={cell}
                isHighlighted={isHighlighted}
                isSelected={isSelected}
                onSelect={onCellSelect}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

