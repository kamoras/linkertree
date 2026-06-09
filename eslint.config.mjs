// Flat ESLint config (ESLint 9+/Next 16). `next lint` was removed in Next 16,
// so linting now runs through the ESLint CLI (`npm run lint` -> `eslint .`).
import next from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  { ignores: [".next/**", "node_modules/**"] },
  ...next,
];

export default config;
