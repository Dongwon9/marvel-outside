import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "eslint.config.js",
      "jest.config.js",
      "vitest.config.ts",
      "vite.config.ts",
      "tailwind.config.js",
      "src/test/mocks.ts",
      "src/test.setup.js",
    ],
  },

  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: config.files || ["**/*.{ts,tsx}"],
  })),

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
      import: importPlugin,
      "unused-imports": unusedImports,
    },

    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,

      /* Prettier */
      "prettier/prettier": "error",

      /* TypeScript - Strict Rules */
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",

      /* Allow some `unknown`/runtime-checked usages without failing CI */
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",

      /* Imports */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
      "import/no-cycle": "warn",
      "import/no-self-import": "error",

      /* Unused imports */
      "unused-imports/no-unused-imports": "error",
    },
  },

  // Test file overrides — jest 패턴에서 불필요한 규칙 비활성화
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      // jest.mock() 호이스팅으로 인해 import 순서 규칙이 맞지 않음
      "import/order": "off",
      // expect(mock.fn).toHaveBeenCalled() 패턴은 jest 표준
      "@typescript-eslint/unbound-method": "off",
      // 모의 응답 타입에 any 사용 허용
      "@typescript-eslint/no-explicit-any": "off",
      // 모의 함수 반환 타입은 any
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      // jest 비동기 테스트 구조 허용
      "@typescript-eslint/no-floating-promises": "off",
    },
  },

  // JS-specific rules
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      prettier,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "prettier/prettier": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
      "import/no-cycle": "warn",
      "import/no-self-import": "error",
      "unused-imports/no-unused-imports": "error",
    },
  },
];
