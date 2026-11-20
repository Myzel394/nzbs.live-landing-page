# nzbs.live landing page

Marketing site for nzbs.live, built with Next.js (App Router), prerendered at build and deployed on Vercel.
The approved design lives in `design-reference/` (see `design-reference/NOTES.md`).

Requires Node 24 (`.nvmrc`) and npm.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm test` | Vitest unit tests (`src/**/*.test.ts`) |
| `npm run test:e2e` | Playwright against the production build (`tests/`) |
| `npm run lhci` | Lighthouse CI budgets (run `npm run build` first) |
