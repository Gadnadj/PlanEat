// Importe les matchers personnalisés de Jest DOM
// require('@testing-library/jest-dom')

// Configuration du timeout global pour les tests
jest.setTimeout(30000) // 30s pour les tests d'intégration

// Mock pour les modules Node.js
global.console = {
  ...console,
  // Pour désactiver les console.log pendant les tests, décommentez :
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}

// Nettoyer les connexions MongoDB après tous les tests
afterAll(async () => {
  // Attendre 1 seconde pour permettre aux tests de se terminer proprement
  await new Promise(resolve => setTimeout(resolve, 1000));
});
