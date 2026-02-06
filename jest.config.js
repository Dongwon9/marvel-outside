/* eslint-disable no-undef */
module.exports = {
  displayName: "marvel-outside",
  projects: [
    "<rootDir>/backend/jest.config.js",
    "<rootDir>/frontend/jest.config.js",
  ],
  collectCoverageFrom: [
    "backend/src/**/*.{ts,js}",
    "frontend/src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!**/*.d.ts",
  ],
  coverageReporters: ["text", "text-summary", "html", "lcov", "clover"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/migration/",
    "/generated/",
  ],

  // Watch mode settings
  watchPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/.git/",
    "/coverage/",
    "/.next/",
    "/build/",
  ],

  // Test timeout for all projects (30 seconds)
  testTimeout: 30000,
};
