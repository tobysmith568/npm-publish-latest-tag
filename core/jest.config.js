/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"]
};

process.env = Object.assign(process.env, {
  DISABLE_MOCKED_WARNING: true
});
