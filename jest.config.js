const { defaultTransformerOptions } = require('jest-preset-angular/presets');

const esModules = [
  'd3-scale', 
  'd3-selection', 
  'd3-transition',
  'd3-array', 
  'd3-ease',   
  'd3-interpolate', 
  'd3-color', 
  'd3-format', 
  'd3-time',
  'internmap',
  'random'
];

// eslint-disable-next-line no-undef
globalThis.ngJest = {
  skipNgcc: false,
  tsconfig: 'tsconfig.spec.json',
};

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'], 
  collectCoverage: false,
  coverageReporters: ['lcov', 'text'],
  coverageProvider: 'v8', 
  coveragePathIgnorePatterns: [
    '<rootDir>/.angular/',
    '<rootDir>/.github/',    
    '<rootDir>/.jest-cache/',
    '<rootDir>/.git/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/'
  ], 
  cache: false,
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  transformIgnorePatterns: [`node_modules/(?!.*\\.mjs$|${esModules.join('|')})`],
  roots: [
    '<rootDir>/projects/angular-d3-cloud/src/'
  ],
  moduleNameMapper: {
    '^@talentia/angular-d3-cloud$': '<rootDir>/dist/angular-d3-cloud'
  },
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        ...defaultTransformerOptions,
        isolatedModules: true,
      }
    ]
  },
  verbose: true,
  watchman: false,
  resetModules: true,
  restoreMocks: true
};