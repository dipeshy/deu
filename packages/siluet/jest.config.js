module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ["json", "text", "html"],
  testEnvironment: 'node',
  preset: 'ts-jest',
}