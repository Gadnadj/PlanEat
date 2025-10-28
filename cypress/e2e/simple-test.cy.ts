describe('Landing Page', () => {
  it('should load the landing page successfully', () => {
    cy.visit('/')
    cy.contains('PlanEat').should('be.visible')
  })

  it('should display main call-to-action buttons', () => {
    cy.visit('/')
    cy.contains('Create Account').should('be.visible')
    cy.contains('Sign In').should('be.visible')
  })

  it('should display feature sections', () => {
    cy.visit('/')
    cy.contains('AI Meal Planning').should('be.visible')
    cy.contains('Smart Recipes').should('be.visible')
    cy.contains('Shopping Lists').should('be.visible')
  })

  it('should navigate between pages', () => {
    cy.visit('/')
    
    // Test navigation to login
    cy.contains('Sign In').click()
    cy.url().should('include', '/login')
    
    // Go back
    cy.visit('/')
    
    // Test navigation to signup
    cy.contains('Create Account').click()
    cy.url().should('include', '/login?mode=signup')
  })
})
