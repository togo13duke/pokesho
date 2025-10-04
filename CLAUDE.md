# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MOST IMPORTANT EXECUTION INSTRUCTIONS
- All communication with users must be conducted in Japanese!!
- The documents created must be in Japanese!!
- Only the content of CLAUDE.md should be written in English !!

## Project Overview

**Pokesho (ポケモン将棋)** is a browser-based strategy game combining Pokemon characters with "Doubutsu Shogi" (Animal Chess) rules. This is a React + TypeScript + Vite project implementing a 3×4 board game where two players compete using different Pokemon sets:
- **Player 1 (先手)**: Pikachu, Bulbasaur, Squirtle, Charmander (evolves to Charizard)
- **Player 2 (後手)**: Terapagos, Sprigatito, Quaxly, Fuecoco (evolves to Skeledirge)

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
- **gameLogic.ts** - Victory condition evaluation (capture king or try)
- **moveRules.ts** - Movement validation using `MoveVector` (directional tuples) mapped to piece roles (king, elephant, giraffe, chick, hen). Also provides `getPossibleMoveDirections()` for UI markers
- **initialBoard.ts** - Board setup with asymmetric Pokemon sets (Player 1: Gen 1 starters, Player 2: Gen 9 starters)
- **pieceConversion.ts** - Converts captured pieces to current owner's Pokemon equivalent
- **imageCache.ts** - PokeAPI image fetching with localStorage caching and 5-second timeout

### State Management (`src/hooks/`)
- **useGameState.ts** - Central game state hook managing:
  - Board state (4×3 grid with CellState)
  - Turn switching with automatic promotion check
  - Captured pieces (手駒) separated by player
  - Move validation and highlighting
  - Victory conditions (capture Pikachu/Terapagos or reach opponent's back row)
- **useImageCache.ts** - Image preloading with fallback to placeholder

### Components (`src/components/`)
- **Piece.tsx** - Displays Pokemon with:
  - 180° rotation for Player 2 pieces (spec 003)
  - Movement direction markers (SVG polygons) showing valid moves (spec 003)
  - React.memo optimization
- **Board.tsx** - 3×4 grid with turn-based background color (blue for Player 1, red for Player 2) (spec 003)
- **TurnDisplay.tsx** - Turn indicator with color-coded background
- **CapturedPieces.tsx** - Hand pieces (手駒) with player-specific fixed colors
- **Cell.tsx** - Individual cell with click handling and highlighting

### Type Definitions (`src/types/`)
- **piece.ts** - Core types:
  - `PieceType`: 10 Pokemon (5 per player)
  - `Role`: Game role abstraction (king, elephant, giraffe, chick, hen)
  - `Direction`: 8 directional strings for UI markers (spec 003)
  - `Player`: 'player1' | 'player2'
- **game.ts** - Game state types:
  - `GameState`: Complete game state with board, turn, captured pieces
  - `CellState`: Empty cell or Piece reference
  - `PlayerColor`: Turn display colors (spec 003)

### Constants (`src/constants/`)
- **pokemon.ts** - Pokemon ID mappings to PokeAPI (e.g., 'pikachu' → 25)
- **colors.ts** - Turn display color constants (#E3F2FD, #FFEBEE) (spec 003)

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

### Feature Development Process
When the user says: "continue implementing"
1) Check the contents of `docs/progress.md`
2) Execute `.claude/commands/implement.md`
3) After completion, write the progress to `docs/progress.md`
4) Update `specs/.../tasks.md` checkboxes

### Specification-Driven Development
All new features follow this workflow (managed in `specs/###-*/`):
1. `/specify` - Create spec.md (business requirements, no implementation details)
2. `/clarify` - Resolve ambiguities interactively (records in spec.md)
3. `/plan` - Generate technical design (research.md, data-model.md, contracts/, quickstart.md)
4. `/tasks` - Generate ordered implementation tasks (tasks.md)
5. `/analyze` - Validate consistency across spec/plan/tasks before implementation
6. `/implement` or manual execution - Execute tasks.md

### Constitution Compliance
All implementations must adhere to `.specify/memory/constitution.md` principles:
1. **Simple & Intuitive UI** - One-click actions, visual highlights, clear turn display
2. **Minimal Dependencies** - React, Vite, TailwindCSS only (no new libraries without justification)
3. **Offline-First** - All game logic client-side, PokeAPI only for initial image fetch
4. **Performance** - 60fps target (16ms), React.memo/useMemo optimizations required
5. **Accessibility** - aria-labels, keyboard support, WCAG AA color contrast

## Key Game Rules & Implementation Notes

### Victory Conditions
- Capture opponent's king (Pikachu for Player 1, Terapagos for Player 2)
- OR move your king to opponent's back row (row 0 for Player 1, row 3 for Player 2) = **Try**

### Evolution System
- Charmander → Charizard when reaching row 0 (Player 1)
- Fuecoco → Skeledirge when reaching row 3 (Player 2)
- Evolution triggers automatically on move completion (see `useGameState.ts`)

### Piece Conversion (手駒システム)
- Captured pieces convert to current owner's equivalent Pokemon via `pieceConversion.ts`
- Example: Captured Terapagos → Pikachu when owned by Player 1
- Placement allowed on any empty cell during owner's turn

### Role-Based Movement System
- Each Pokemon maps to a `Role` (king/elephant/giraffe/chick/hen)
- Move rules defined by `MoveVector` arrays (directional offsets)
- Player 2's moves auto-invert direction (handled in `moveRules.ts`)
- UI direction markers use `Direction` strings ('up', 'down', etc.) converted from MoveVectors

### Image Loading
- PokeAPI URLs constructed from Pokemon IDs in `constants/pokemon.ts`
- 5-second timeout with fallback to `/placeholder.png`
- localStorage cache prevents repeat API calls
