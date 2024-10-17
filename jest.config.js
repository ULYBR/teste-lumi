module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/tests/**/*.test.ts"],
  transformIgnorePatterns: ["/node_modules/"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
}
