// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent hydration errors from failing tests
Cypress.on('uncaught:exception', (err) => {
  // Ignore hydration errors from Next.js
  if (err.message.includes('Hydration failed') || 
      err.message.includes('hydration') ||
      err.message.includes('Minified React error')) {
    return false
  }
  // Let other errors fail the test
  return true
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
    }
  }
}
