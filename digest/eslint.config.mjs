// agent-harness default ESLint config, scoped to TypeScript; .astro templates are checked by `astro check`.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'dist/',
      '.astro/',
      '.wrangler/',
      'node_modules/',
      '**/*.astro',
      'worker-configuration.d.ts',
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      'max-depth': ['error', 3],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-param-reassign': ['error', { props: true }],
      'prefer-const': 'error',
      // node:test's describe/it return promises the runner itself awaits.
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          allowForKnownSafeCalls: [
            { from: 'package', name: ['describe', 'it', 'test'], package: 'node:test' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettier,
);
