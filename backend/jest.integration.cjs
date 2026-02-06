module.exports = {
  displayName: 'backend-integration',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.integration\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(@prisma/adapter-pg)/)'],
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.ts', '!**/*.e2e-spec.ts', '!**/node_modules/**'],
  coverageDirectory: '../coverage/integration',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../test'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  globalSetup: '<rootDir>/../test/global-setup.js',
  globalTeardown: '<rootDir>/../test/global-teardown.js',
  testTimeout: 30000,
  forceExit: true,
  testPathIgnorePatterns: ['/node_modules/', '/.spec.ts$', '/.e2e-spec.ts$'],
};
