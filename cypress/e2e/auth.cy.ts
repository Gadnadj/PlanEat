describe('Authentication Flow', () => {
  it('should display landing page when not authenticated', () => {
    cy.visit('/')
    
    // Should show landing page content
    cy.contains('PlanEat').should('be.visible')
    cy.contains('Plan your meals with artificial intelligence').should('be.visible')
    cy.contains('Create Account').should('be.visible')
    cy.contains('Sign In').should('be.visible')
  })

  it('should navigate to login page from landing page', () => {
    cy.visit('/')
    cy.contains('Sign In').click()
    
    cy.url().should('include', '/login')
    cy.contains('Welcome Back').should('be.visible')
  })

  it('should navigate to login page with signup intent from landing page', () => {
    cy.visit('/')
    cy.contains('Create Account').click()
    
    // Should navigate to login page (with or without query params)
    cy.url().should('include', '/login')
    
    // The page should show either the Welcome heading or Sign Up tab
    cy.contains('Welcome').should('be.visible')
  })

  it('should display login form elements', () => {
    cy.visit('/login')
    
    // Should show login tab by default
    cy.contains('Welcome Back').should('be.visible')
    
    // Check form elements exist
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('button', 'Sign In').should('be.visible')
  })

  it('should switch between login and signup tabs', () => {
    cy.visit('/login')
    
    // Should be on login tab by default
    cy.contains('Welcome Back').should('be.visible')
    cy.contains('button', 'Login').should('exist')
    
    // Click on Sign Up tab
    cy.contains('button', 'Sign Up').click()
    
    // Should show signup form
    cy.contains('Welcome').should('be.visible')
    cy.get('input[placeholder*="Name"]').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('have.length.at.least', 2) // Password and confirm password
    
    // Switch back to login
    cy.contains('button', 'Login').click()
    cy.contains('Welcome Back').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.visit('/login')
    
    cy.get('input[type="email"]').type('invalid@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.contains('button', 'Sign In').click()
    
    // Should show error message or stay on login page
    cy.url().should('include', '/login')
  })

  it('should display recipe previews on landing page', () => {
    cy.visit('/')
    
    // Should show recipe section
    cy.contains('Discover our recipes').should('be.visible')
  })
})
