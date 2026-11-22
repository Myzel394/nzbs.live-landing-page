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

# Re-capture the social preview (src/app/opengraph-image.png) from the hero, on a fresh production build.
og-image: build
    #!/usr/bin/env bash
    set -euo pipefail
    port=3400
    if curl -s -o /dev/null "http://localhost:$port"; then echo "port $port is in use: stop that server first" >&2; exit 1; fi
    # next itself, not npx, so the trap stops the server and not a wrapper.
    node_modules/.bin/next start -p $port &
    server=$!
    trap 'kill $server 2>/dev/null' EXIT
    for _ in $(seq 60); do curl -sf -o /dev/null "http://localhost:$port" && break; sleep 0.5; done
    curl -sf -o /dev/null "http://localhost:$port" || { echo "the server did not start" >&2; exit 1; }
    node scripts/og-image.mjs "http://localhost:$port"

# Lint, typecheck and unit tests.
check:
    npm run lint
    npm run typecheck
    npm test

# Playwright end-to-end tests against the production build.
e2e:
    npm run test:e2e

# The Playwright suite in Firefox and WebKit (Safari's engine) too, on desktop and an iPhone.
e2e-browsers:
    npx playwright install firefox webkit
    ALL_BROWSERS=1 npm run test:e2e

# Re-record the screenshot baselines after an intended visual change (review the PNG diff before committing).
e2e-update-visuals:
    npx playwright test tests/visual.spec.ts --update-snapshots

# Lighthouse CI on a fresh production build, using the budgets in lighthouserc.json.
lighthouse: build
    CHROME_PATH="$(node -p "require('playwright-core').chromium.executablePath()")" npm run lhci
