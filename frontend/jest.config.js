export default {
  displayName: "frontend",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/src/test.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$":
      "<rootDir>/src/test/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/index.css",
    "!src/test/**",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  watchPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
