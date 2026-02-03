import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      "coverage/**",
      ".esli*cache",
      "pnpm-lock.yaml",
      "**/node_modules/**",
    ],
  },
  js.configs.recommended,
];
