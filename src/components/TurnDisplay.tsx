import type { Player } from '../types/piece'
import { PLAYER_COLORS } from '../types/game'

const TURN_LABEL: Record<Player, string> = {
  player1: '先手の番',
  player2: '後手の番',
}

interface TurnDisplayProps {
  currentTurn: Player
}

export function TurnDisplay({ currentTurn }: TurnDisplayProps) {
  const backgroundColorClass = PLAYER_COLORS[currentTurn]

  return (
    <div className={`rounded-full px-6 py-2 text-center text-lg font-semibold text-gray-800 ${backgroundColorClass}`}>
      {TURN_LABEL[currentTurn]}
    </div>
  )
}

