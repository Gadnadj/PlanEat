// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button', 'Sign In').click()
    
    // Wait for redirect after successful login
    cy.url().should('not.include', '/login', { timeout: 10000 })
  })
})

Cypress.Commands.add('logout', () => {
  // Click on user menu then logout
  cy.contains('Logout').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/')
})
