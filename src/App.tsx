import { useEffect } from 'react'
import { Board } from './components/Board'
import { CapturedPieces } from './components/CapturedPieces'
import { GameOverMessage } from './components/GameOverMessage'
import { TurnDisplay } from './components/TurnDisplay'
import { useGameState } from './hooks/useGameState'

function App() {
  const {
    board,
    capturedPieces,
    currentTurn,
    gameStatus,
    selectedBoardPiece,
    selectedCapturedPieceId,
    highlightPositions,
    hasEmptyCell,
    handleCellClick,
    handleCapturedPieceClick,
    cancelSelection,
    restartGame,
  } = useGameState()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelSelection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cancelSelection])

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-amber-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800">pokesho ポケモン将棋</h1>
          <p className="max-w-prose text-base text-slate-600">
            PokeAPIの画像を使った3×4のポケモン将棋。駒をクリックして移動し、相手の王様（ピカチュウ or テラパゴス）を捕まえるか、
            自分の王様（ピカチュウ or テラパゴス）でトライを成功させましょう。
          </p>
          <TurnDisplay currentTurn={currentTurn} />
        </header>

        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4">
            <Board
              board={board}
              highlightPositions={highlightPositions}
              selectedPosition={selectedBoardPiece}
              currentTurn={currentTurn}
              onCellSelect={handleCellClick}
            />
            {gameStatus !== 'playing' ? (
              <GameOverMessage status={gameStatus} onRestart={restartGame} />
            ) : (
              <button
                type="button"
                onClick={cancelSelection}
                className="text-sm text-slate-500 underline-offset-4 hover:underline"
              >
                選択を解除
              </button>
            )}
          </div>

          <aside className="flex flex-1 flex-col gap-4">
            <CapturedPieces
              capturedPieces={capturedPieces}
              currentTurn={currentTurn}
              selectedCapturedPieceId={selectedCapturedPieceId}
              hasEmptyCell={hasEmptyCell}
              onSelect={handleCapturedPieceClick}
            />
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-700">遊び方</h2>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>駒をクリックして移動先をハイライト表示。</li>
                <li>手駒をクリックして空きマスにドロップ。</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
