module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/e2e/**/*.test.js'],
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.js'],
  globalTeardown: '<rootDir>/tests/e2e/teardown.js'
};