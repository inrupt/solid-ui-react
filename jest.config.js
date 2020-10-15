module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The test environment that will be used for testing
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  testPathIgnorePatterns: [
    '/node_modules/',
    '/__testUtils/',
  ],

  collectCoverage: true,

  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],

  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 94,
      statements: 94,
    },
  },
};
