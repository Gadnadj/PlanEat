// Charger les variables d'environnement
require('dotenv').config({ path: '.env.test' });

module.exports = {
  // Environnement de test
  testEnvironment: 'node',
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Dossiers à tester
  testMatch: [
    '<rootDir>/lib/__tests__/**/*.test.ts',
    '<rootDir>/__tests__/integration/**/*.test.ts',
  ],
  
  // Ignorer les patterns
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/.next/', 
    '/dist/',
  ],
  
  // Transformer pour TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },

  // Configuration spécifique pour les tests d'intégration
  testTimeout: 30000, // 30 secondes par défaut
  
  // Transformer pour TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  
  // Extensions de fichiers
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Mapper les imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/models/(.*)$': '<rootDir>/models/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  
  // Coverage
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'models/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
  // Ignorer les patterns
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/dist/'],
  
  // Configuration pour TypeScript
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
}
