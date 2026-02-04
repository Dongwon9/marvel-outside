module.exports = {
  displayName: 'backend-integration',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.integration\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage/integration',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../test'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  globalSetup: '<rootDir>/../test/global-setup.js',
  globalTeardown: '<rootDir>/../test/global-teardown.js',
  // 테스트 타임아웃 (30초)
  testTimeout: 30000,
  // 강제 종료 (모든 열린 핸들 정리)
  forceExit: true,
};
