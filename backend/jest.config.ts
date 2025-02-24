/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'node', // or 'jsdom' if testing browser-related code
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Important!
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
  },
  // If you are using ESM modules in your code, you need to enable it
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map your path aliases if you are using them
  },
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
};
