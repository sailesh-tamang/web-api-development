const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/app/__tests__/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^js-cookie$': '<rootDir>/__mocks__/js-cookie.ts',
  },
  testMatch: [
    '<rootDir>/app/__tests__/**/*.test.ts',
    '<rootDir>/app/__tests__/**/*.test.tsx',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/page.tsx',
    '!app/__tests__/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
