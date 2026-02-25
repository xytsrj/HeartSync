# AGENTS.md

## Cursor Cloud specific instructions

**Project:** HeartSync — a React SPA that generates deep conversation prompts via Google Gemini AI.

**Stack:** React 19 + Vite 7 + Tailwind CSS v4 (no backend, no database). Package manager: **npm** (lockfile: `package-lock.json`).

### Running the app

- `npm run dev` starts the Vite dev server (default port 5173). Use `--host 0.0.0.0` for external access.
- The app requires `VITE_GEMINI_API_KEY` in a `.env` file for AI card generation. Without it the UI loads fine but clicking "Generate" shows an error toast. Create `.env` from `env.example`.

### Lint / Build / Test

- `npm run lint` — ESLint. The codebase has **15 pre-existing lint errors** (mostly `react-hooks/purity` warnings about `Math.random` in `useMemo` and unused-var warnings). These are known and do not block the build.
- `npm run build` — Vite production build.
- **No test framework** is configured; there are no automated tests to run.

### Gotchas

- The `env.example` file is named `env.example` (not `.env.example`).
- The Gemini model referenced is `gemini-2.5-flash-preview-09-2025`; if the model is retired the API call will fail even with a valid key.
- The entire app logic lives in `src/App.jsx` (~404 lines, single-file SPA).
