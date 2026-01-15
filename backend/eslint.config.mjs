import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import jest from 'eslint-plugin-jest';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.spec.json'],
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

      /* Imports */
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],

      /* Unused imports */
      'unused-imports/no-unused-imports': 'error',

      /* NestJS 스타일 */
      'class-methods-use-this': 'off',
    },
  },

  /* Jest 전용 */
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
];
