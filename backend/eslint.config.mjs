import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/generated/**',
      'coverage/**',
      '*.config.js',
      '*.config.cjs',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      prettier,
      import: importPlugin,
      'unused-imports': unusedImports,
      jest,
    },

    rules: {
      /* Prettier */
      'prettier/prettier': 'error',

      /* TypeScript */
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/require-await': 'error',

      /* Imports */
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',

      /* Unused imports */
      'unused-imports/no-unused-imports': 'error',

      /* Code quality */
      'no-debugger': 'error',

      /* NestJS 스타일 */
      'class-methods-use-this': 'off',
    },
  },

  /* Jest 전용 */
  {
    files: ['**/*.spec.ts', '**/*.integration.spec.ts', '**/*.e2e-spec.ts', '**/test/**/*.ts'],
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off',
    },
  },
];
