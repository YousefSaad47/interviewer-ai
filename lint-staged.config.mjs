/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "**/*.{ts,tsx}": [
    "biome lint --no-errors-on-unmatched",
    "biome format --no-errors-on-unmatched",
    "biome check --no-errors-on-unmatched",
  ],
  "**/*.json": "biome format --no-errors-on-unmatched",
  "apps/form-builder/**/*.py": [
    "uvx ruff check --fix",
    "uvx ruff format",
  ],
};
