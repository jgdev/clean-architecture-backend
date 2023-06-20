/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // reporters: [
  //   [
  //     "jest-nyancat-reporter",
  //     {
  //       suppressErrorReporter: false,
  //     },
  //   ],
  // ],
};
