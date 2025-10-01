# Repository Guidelines

## MOST IMPORTANT EXECUTION INSTRUCTIONS
- All communication with users must be conducted in Japanese!!
- The documents created must be in Japanese!!
- Only the content of AGENTS.md should be written in English !!


## Project Overview

**Pokesho (ポケモン将棋)** is a browser-based strategy game combining Pokemon characters with "Doubutsu Shogi" (Animal Chess) rules. This is a React + TypeScript + Vite project implementing a 3×4 board game where two players compete using Pokemon pieces (Pikachu, Bulbasaur, Squirtle, Charmander, and evolved Charizard).

Tech stack:
- **React 19** with TypeScript
- **Vite 7** for build tooling and dev server with HMR (Hot Module Replacement)
- **Tailwind CSS 3.4** for styling
- **ESLint** with TypeScript and React-specific rules
- **@vitejs/plugin-react** using Babel for Fast Refresh

## Development Commands

```bash
# Install dependencies after cloning
npm install

# Start development server with HMR at http://localhost:5173
npm run dev

# Build for production (runs TypeScript compiler + Vite build)
npm run build

# Lint codebase
npm run lint

# Preview production build
npm run preview
```

## Code Architecture

The codebase follows a feature-based organization within `src/`:

### Core Game Logic (`src/utils/`)
- **gameLogic.ts** - Core game state management (move execution, capture, victory conditions)
- **moveRules.ts** - Piece movement validation logic for each Pokemon type
- **initialBoard.ts** - Board initialization with starting piece positions
- **imageCache.ts** - Pokemon image fetching from PokeAPI with 5-second timeout and fallback

### State Management (`src/hooks/`)
- **useGameState.ts** - Main game state hook managing board, turn, captured pieces, and win conditions
- **useImageCache.ts** - Image loading hook with caching and fallback logic

### Components (`src/components/`)
- **App.tsx** - Root component orchestrating game flow
- **Board.tsx** - 3×4 game board with cell highlighting
- **Cell.tsx** - Individual board cell with click handling
- **Piece.tsx** - Pokemon piece display with image rendering
- **CapturedPieces.tsx** - Display area for captured pieces (手駒)
- **TurnDisplay.tsx** - Current turn indicator
- **GameOverMessage.tsx** - Victory message with restart button

### Type Definitions (`src/types/`)
- **game.ts** - GameState, Position, CellState types
- **piece.ts** - PieceType, Player, Piece types with evolution logic

### Constants (`src/constants/`)
- **pokemon.ts** - Pokemon name mappings and PokeAPI URLs

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Main application component
├── components/           # UI components
├── hooks/                # Custom React hooks
├── utils/                # Game logic and utilities
├── types/                # TypeScript type definitions
├── constants/            # Pokemon data and constants
└── assets/               # Static assets (optimized by Vite)

specs/001-3x4-2/          # Feature specification documents
├── spec.md               # Requirements and acceptance criteria
├── data-model.md         # Data structures and relationships
├── plan.md               # Implementation plan
├── tasks.md              # Task checklist with progress
└── quickstart.md         # Getting started guide

docs/
├── steering/             # Product design decisions
│   ├── product.md        # Product overview
│   ├── structure.md      # Project structure
│   └── tech.md           # Technical decisions
└── progress.md           # Implementation progress log

.claude/commands/         # Claude Code workflow commands
```

## TypeScript Configuration

The project uses TypeScript project references with two separate configs:
- App code uses strict type checking with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` enabled
- Module resolution is set to "bundler" mode for Vite compatibility
- JSX is configured as "react-jsx" for automatic runtime

## Build Process

The build command (`npm run build`) runs in two stages:
1. TypeScript compilation (`tsc -b`) validates types across all project references
2. Vite build (`vite build`) bundles the application for production

Both stages must succeed for a successful build.

## Development Workflow
When the user says: "continue implementing"
1) Check the contents of `docs/progress.md`
2) Execute `.codex/prompts/implement.md`
3) After completion, write the progress to `docs/progress.md`.
4) Update `specs/.../tasks.md` checkboxes.


## Key Game Rules & Implementation Notes

- **Victory Conditions**: Capture opponent's Pikachu OR move your Pikachu to the back row (try)
- **Evolution System**: Charmander auto-evolves to Charizard when reaching the opponent's back row
- **Captured Pieces (手駒)**: Captured pieces can be placed on any empty cell during your turn
- **Turn-based**: Players alternate turns; the current turn is always displayed
- **Image Loading**: Pokemon images load from PokeAPI with a 5-second timeout; fallback to placeholders on failure
