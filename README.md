# nzbs.live landing page

Marketing site for nzbs.live, built with Next.js (App Router), prerendered at build and deployed on Vercel.
The approved design lives in `design-reference/` (see `design-reference/NOTES.md`).

## Environment

Everything comes from [devenv](https://devenv.sh): Node 24, npm, just and nixfmt from nixpkgs;
the npm packages (Next.js, Playwright, Lighthouse CI, Vercel CLI) from `package-lock.json`; and
Playwright's pinned Chromium, downloaded into `.devenv/state/ms-playwright` on first shell entry.

```sh
direnv allow   # or: devenv shell
just           # list the commands
```

| Command | What it does |
| --- | --- |
| `just dev` (or `devenv up`) | Dev server on http://localhost:3000 |
| `just build` / `just start` | Production build, or build and serve it |
| `just check` | ESLint, TypeScript and Vitest unit tests |
| `just e2e` | Playwright against the production build (`tests/`) |
| `just lighthouse` | Production build, then Lighthouse CI with the budgets in `lighthouserc.json` |
| `just setup` | Reinstall npm packages and the Playwright Chromium by hand |
