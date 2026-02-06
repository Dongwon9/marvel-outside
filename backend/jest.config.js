// eslint-disable-next-line no-undef
module.exports = {
  displayName: 'backend',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          esModuleInterop: true,
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(@prisma/adapter-pg)/)', '/generated/prisma/'],
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.integration.spec.ts',
    '!**/*.e2e-spec.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^../generated/prisma/client$': '<rootDir>/__mocks__/prisma-client.ts',
  },
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['/node_modules/', '/.integration.spec.ts$', '/.e2e-spec.ts$'],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
