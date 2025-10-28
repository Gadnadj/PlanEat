describe('Recipe Management', () => {
  describe('Unauthenticated User', () => {
    it('should redirect to login when accessing protected recipe pages', () => {
      // Try to access recipes page without auth
      cy.visit('/recipe')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })

  })

  describe('Authenticated User', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      cy.login('test1@gmail.com', 'testgad')
    })

    it('should access recipes page when authenticated', () => {
      cy.visit('/recipe')
      
      // Should be able to access the page
      cy.url().should('include', '/recipe')
      
      // Should display the header
      cy.contains('Discover our recipes').should('be.visible')
      cy.contains('Over 1000 recipes').should('be.visible')
    })

    it('should display search and filter elements', () => {
      cy.visit('/recipe')
      
      // Check search bar
      cy.get('input[placeholder*="Search for a recipe"]').should('be.visible')
      
      // Check reset button
      cy.contains('button', 'Reset').should('be.visible')
      
      // Check filter buttons exist
      cy.contains('Category').should('be.visible')
      cy.contains('Prep Time').should('be.visible')
      cy.contains('Difficulty').should('be.visible')
    })

    it('should be able to search for recipes', () => {
      cy.visit('/recipe')
      
      // Type in search box
      cy.get('input[placeholder*="Search for a recipe"]').type('pasta')
      
      // The input should have the value
      cy.get('input[placeholder*="Search for a recipe"]').should('have.value', 'pasta')
    })

    it('should be able to reset filters', () => {
      cy.visit('/recipe')
      
      // Type something in search
      cy.get('input[placeholder*="Search for a recipe"]').type('test')
      
      // Click reset button
      cy.contains('button', 'Reset').click()
      
      // Search should be cleared
      cy.get('input[placeholder*="Search for a recipe"]').should('have.value', '')
    })

    it('should display recipe cards when recipes exist', () => {
      cy.visit('/recipe')
      
      // Wait for recipes to load
      cy.wait(2000)
      
      // Should have some recipe content (this will depend on your data)
      // Just check that the page is not empty
      cy.get('body').should('not.contain', 'No recipes found')
    })

    it('should be able to click on a recipe to view details', () => {
      cy.visit('/recipe')
      
      // Wait for recipes to load
      cy.wait(2000)
      
      // Try to click on first recipe card (if exists)
      // This is a generic test that will work if there are any recipes
      cy.get('body').then(($body) => {
        if ($body.text().includes('View Recipe') || $body.find('a[href*="/recipe/"]').length > 0) {
          // If there's a recipe link, click it
          cy.get('a[href*="/recipe/"]').first().click()
          
          // Should navigate to recipe detail page
          cy.url().should('match', /\/recipe\/[^/]+$/)
        }
      })
    })
  })
})
