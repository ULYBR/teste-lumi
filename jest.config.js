module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true, 
      },
    ],
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/tests/**/*.test.ts"],
  transformIgnorePatterns: ["/node_modules/"],
}
