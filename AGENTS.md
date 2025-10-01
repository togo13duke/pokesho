# Repository Guidelines

## MOST IMPORTANT EXECUTION INSTRUCTIONS
- All communication with users must be conducted in Japanese!!
- The documents created must be in Japanese!!

## Project Structure & Module Organization
This Vite + React app keeps all runtime code under `src/`. `main.tsx` bootstraps the UI by rendering `App.tsx`; add new feature modules near related components to keep imports local. Place images and SVGs in `src/assets/` so Vite can optimize them at build time. Static files needed at predictable URLs belong in `public/` (for example, replace `public/vite.svg` when branding). Configuration lives at the repo root: `vite.config.ts` for tooling, `tsconfig*.json` for TypeScript targets, and `eslint.config.js` for linting rules. Use `docs/steering/` for decision records or design notes when changes need extra context.

## Build, Test, and Development Commands
Run `npm install` once after cloning to sync dependencies. `npm run dev` starts the Vite dev server with hot module reload at `http://localhost:5173`. Use `npm run build` to type-check (`tsc -b`) and create a production bundle in `dist/`. `npm run preview` serves that bundle locally, matching deployment behavior. `npm run lint` executes ESLint across the project and should be clean before you open a pull request.

## Coding Style & Naming Conventions
The codebase is TypeScript-first; favor function components and React hooks. Follow the default 2-space indentation and single-quote imports already present. Name files by responsibility: `PascalCase.tsx` for components, `camelCase.ts` for helpers, and keep CSS co-located (e.g., `Component.css`). Let ESLint surface style issues—avoid disabling rules unless you document the rationale. Prefer explicit prop types and keep modules under 200 lines when possible.

## Testing Guidelines
Automated tests are not yet configured. When introducing a test suite, prefer Vitest with React Testing Library so it integrates with Vite. Place spec files in `src/__tests__/` or alongside components as `Component.test.tsx`, and ensure they run headlessly. Include coverage for stateful hooks and edge cases before merging substantial UI work, and note any gaps in the pull request description.

## Commit & Pull Request Guidelines
History currently uses short, imperative messages (e.g., `Initial commit from Specify template`); continue that style by focusing commits on a single concern. Reference an issue key when applicable and avoid work-in-progress commits. Pull requests need a concise summary, screenshots or GIFs for UI updates, a list of manual or automated test steps, and any follow-up tasks. Request review once linting passes and dependencies are up to date.

## Development Workflow
When the user says: "continue"
1) Check the contents of `docs/progress.md`
2) Execute `.codex/prompts/implement.md`
3) After completion, write the progress to `docs/progress.md`