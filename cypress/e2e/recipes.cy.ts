describe('Recipe Management', () => {
  it('should display recipes on landing page without authentication', () => {
    cy.visit('/')
    
    // Should show recipe section
    cy.contains('Discover our recipes').should('be.visible')
  })

  it('should redirect to login when accessing protected recipe pages', () => {
    // Try to access recipes page without auth
    cy.visit('/recipes')
    
    // Should redirect to login
    cy.url().should('include', '/login')
  })

  it('should show recipe features on landing page', () => {
    cy.visit('/')
    
    // Should show features section
    cy.contains('AI Meal Planning').should('be.visible')
    cy.contains('Smart Recipes').should('be.visible')
    cy.contains('Shopping Lists').should('be.visible')
  })
})
