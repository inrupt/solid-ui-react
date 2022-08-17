module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  injectGlobals: false,

  // The test environment that will be used for testing
  preset: "ts-jest",
  // testEnvironment: 'jsdom',
  testEnvironment: "<rootDir>/tests/environment/customEnvironment.js",

  testPathIgnorePatterns: ["/node_modules/", "/__testUtils/"],

  collectCoverage: true,
  coverageReporters: process.env.CI ? ["text", "lcov"] : ["text"],

  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/dist"],

  coverageThreshold: {
    global: {
      branches: 88,
      functions: 90,
      lines: 94,
      statements: 94,
    },
  },
};
