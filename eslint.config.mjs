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
    ".netlify/**",
    "test-results/**",
    "playwright-report/**",
    "out/**",
    "build/**",
    "dist/**",
    ".test-fixtures/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
