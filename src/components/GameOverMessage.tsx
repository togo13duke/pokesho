import type { GameStatus } from '../types/game'

const STATUS_MESSAGE: Record<Exclude<GameStatus, 'playing'>, string> = {
  player1_win: '先手の勝利！',
  player2_win: '後手の勝利！',
}

interface GameOverMessageProps {
  status: Exclude<GameStatus, 'playing'>
  onRestart: () => void
}

export function GameOverMessage({ status, onRestart }: GameOverMessageProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-poke-yellow/20 p-6 text-center shadow-lg">
      <p className="text-2xl font-bold text-poke-red">{STATUS_MESSAGE[status]}</p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-full bg-poke-red px-6 py-2 text-lg font-semibold text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-poke-red"
      >
        リスタート
      </button>
    </div>
  )
}

