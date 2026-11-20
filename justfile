#!/usr/bin/env just --justfile
# Run inside the devenv shell (direnv loads it), which provides Node 24, npm and just.

_default:
    just --list -u

# Install npm dependencies and Playwright's Chromium (the devenv shell does this on entry).
setup:
    npm ci
    npx playwright install chromium

# Start the Next.js dev server on http://localhost:3000.
dev:
    npm run dev

# Build the production site.
build:
    npm run build

# Build, then serve the production site on http://localhost:3000.
start: build
    npm run start

# Lint, typecheck and unit tests.
check:
    npm run lint
    npm run typecheck
    npm test

# Playwright end-to-end tests against the production build.
e2e:
    npm run test:e2e

# Lighthouse CI on a fresh production build, using the budgets in lighthouserc.json.
lighthouse: build
    CHROME_PATH="$(node -p "require('playwright-core').chromium.executablePath()")" npm run lhci
