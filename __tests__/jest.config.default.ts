import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  testPathIgnorePatterns: ['build'],
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(mongodb-memory-server/index.d.ts))'],
  testEnvironment: 'node',
  forceExit: true,
  clearMocks: true,
  testTimeout: 10000,
  passWithNoTests: true,
};

export default config;
