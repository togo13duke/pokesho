# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MOST IMPORTANT EXECUTION INSTRUCTIONS
- All communication with users must be conducted in Japanese!!
- The documents created must be in Japanese!!

## Project Overview

This is a React + TypeScript + Vite project with a minimal setup. The project uses:
- **React 19** with TypeScript
- **Vite 7** for build tooling and dev server with HMR (Hot Module Replacement)
- **ESLint** with TypeScript and React-specific rules
- **@vitejs/plugin-react** using Babel for Fast Refresh

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler + Vite build)
npm run build

# Lint codebase
npm run lint

# Preview production build
npm run preview
```

## Project Structure

- **src/main.tsx** - Application entry point that renders the root React component
- **src/App.tsx** - Main application component
- **tsconfig.json** - Root TypeScript config (references app and node configs)
- **tsconfig.app.json** - TypeScript config for application code (strict mode enabled, includes src/)
- **tsconfig.node.json** - TypeScript config for build scripts/config files
- **vite.config.ts** - Vite configuration
- **eslint.config.js** - ESLint flat config with React hooks and refresh plugins

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
When the user says: "continue"
1) Check the contents of `docs/progress.md`
2) Execute `.claude/commands/implement.md`
3) After completion, write the progress to `docs/progress.md`