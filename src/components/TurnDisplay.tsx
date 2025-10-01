import type { Player } from '../types/piece'

const TURN_LABEL: Record<Player, string> = {
  player1: '先手の番',
  player2: '後手の番',
}

interface TurnDisplayProps {
  currentTurn: Player
}

export function TurnDisplay({ currentTurn }: TurnDisplayProps) {
  return (
    <div className="rounded-full bg-poke-blue/10 px-6 py-2 text-center text-lg font-semibold text-poke-blue">
      {TURN_LABEL[currentTurn]}
    </div>
  )
}

