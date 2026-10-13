/** @type {import('jest').Config} */
module.exports = {
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }] },
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/helpers/env.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/data/**'],
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  silent: true
};
