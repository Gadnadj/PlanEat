describe('Meal Planning', () => {
  it('should redirect to login when accessing meal plans without authentication', () => {
    cy.visit('/planification')
    
    // Should redirect to login
    cy.url().should('include', '/login')
  })

  it('should show meal planning features on landing page', () => {
    cy.visit('/')
    
    // Should show features
    cy.contains('AI Meal Planning').should('be.visible')
    cy.contains('Plan your meals with artificial intelligence').should('be.visible')
  })

  it('should redirect to login when accessing shopping list without authentication', () => {
    cy.visit('/shopping-list')
    
    // Should redirect to login
    cy.url().should('include', '/login')
  })
})
