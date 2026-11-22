import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tool state and reports: the devenv (with Playwright's browsers), test and Lighthouse output.
    ".devenv/**",
    ".direnv/**",
    "test-results/**",
    "playwright-report/**",
    ".lighthouseci/**",
  ]),
]);

export default eslintConfig;
