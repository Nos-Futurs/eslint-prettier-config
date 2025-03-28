// @ts-check

import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from "globals";
import pluginImportX from 'eslint-plugin-import-x'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { globalIgnores } from "eslint/config";

const nosFutursTsConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      // We add all the globals because this config is used for both backend and frontend
      globals: {
        ...globals.node, // Use the globals package to additionally enable all globals for the node.
        ...globals.browser, // Use the globals package to additionally enable all globals for the browser.
        ...globals.jest, // Use the globals package to additionally enable all globals for Jest.
      },
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    import: pluginImportX,
    'import-sort': pluginSimpleImportSort,
  },
  settings: {
    // https://github.com/alexgorbatchev/eslint-import-resolver-typescript#configuration
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        bun: true, // resolve Bun modules https://github.com/import-js/eslint-import-resolver-typescript#bun
      }),
    ],
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn', // Enforce explicit return types for functions
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@stylistic/type-annotation-spacing': 'error', // Enforce consistent spacing before and after type annotations
    "no-unused-vars": ["error", { "destructuredArrayIgnorePattern": "^_" }], // Ignore unused variables that are destructured from arrays
    // INFO: must disable the base rule as it can report incorrect errors. See https://typescript-eslint.io/rules/no-shadow/#how-to-use
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    /* --------------------------------- Fastify -------------------------------- */
    // INFO: no-floating-promises requires all thenable to be handled, even when they are not real promises. Using the void qualifier  evaluates the expression then returns undefined. See https://github.com/fastify/fastify/discussions/3849 and https://github.com/typescript-eslint/typescript-eslint/issues/2640
    'no-void': 'warn',
    /* --------------------------------- NestJS --------------------------------- */
    // INFO: Nest injects services in the empty constructors
    'class-methods-use-this': 'off', // Enforce that class methods utilize 'this'.
    'no-empty-function': 'warn', // Disallow empty functions.
    'no-useless-constructor': 'warn', // Disallow unnecessary constructors.
    /* ------------------------------ Import rules ------------------------------ */
    'import/extensions': ['error', 'ignorePackages', { ts: 'never', '': 'never', }], // Prevent errors when importing TS packages. See https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*spec.ts', '**/*test.ts'], }], // Packages in test files should be in devDependencies, not normal dependencies
    'import/prefer-default-export': 'warn', // Prefer default export over named exports when the file has a single export.
    /* -------------------------- Import sorting rules -------------------------- */
    'import/order': 'off', // Turn off ImportX order rule to use simple-import-sort plugin
    'import-sort/exports': 'error',
    'import-sort/imports': 'error',
  },
};

export default tseslint.config([
  globalIgnores([
    "**/*.js",
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/*.spec.js",
    "**/*.test.js",
    "**/build/**",
    "**/dist/**",
    "**/node_modules/**",
  ]),
  pluginImportX.flatConfigs.recommended,
  tseslint.configs.recommendedTypeChecked,
  stylistic.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  nosFutursTsConfig,
]);



