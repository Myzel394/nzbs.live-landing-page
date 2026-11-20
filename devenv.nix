# Dev environment: `devenv shell` (or direnv), then `just` for the commands, or `devenv up` for the dev server.
# Everything the project needs comes from here; npm packages are pinned in package-lock.json.
{
  pkgs,
  lib,
  config,
  ...
}:
let
  root = config.devenv.root;
in
{
  packages = with pkgs; [
    just # task runner (justfile)
    svgo # optimises the service logos in public/logos
    nixfmt # formats devenv.nix
  ];

  # Node 24 matches `engines.node` in package.json and the Vercel build.
  # npm dependencies (Next.js, ESLint, Vitest, Playwright, Lighthouse CI, Vercel CLI)
  # are installed from package-lock.json when the shell starts.
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  # Playwright and Lighthouse CI use the Chromium build pinned by @playwright/test,
  # downloaded once into the devenv state folder.
  env.PLAYWRIGHT_BROWSERS_PATH = "${config.devenv.state}/ms-playwright";

  # Runs after the npm install from languages.javascript.
  enterShell = lib.mkAfter ''
    if [ -d ${root}/node_modules/playwright-core ] &&
      [ ! -x "$(node -p "require('playwright-core').chromium.executablePath()" 2>/dev/null)" ]; then
      npx playwright install chromium
    fi
  '';

  # `devenv up` runs the dev server through the matching justfile recipe.
  processes.web.exec = "exec just -f ${root}/justfile dev";
}
