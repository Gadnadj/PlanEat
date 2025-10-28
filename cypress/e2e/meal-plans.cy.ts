describe('Meal Planning', () => {
  describe('Unauthenticated User', () => {
    it('should show meal planning features on landing page', () => {
      cy.visit('/')
      
      // Should show features
      cy.contains('AI Meal Planning').should('be.visible')
      cy.contains('Plan your meals with artificial intelligence').should('be.visible')
    })

    it('should redirect to login when accessing meal plans without authentication', () => {
      cy.visit('/planification')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })

    it('should redirect to login when accessing shopping list without authentication', () => {
      cy.visit('/shopping-list')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })

  describe('Authenticated User', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      cy.login('test1@gmail.com', 'testgad')
    })
  
    it('should display meal plan calendar', () => {
      cy.visit('/planification')
      
      // Vérifier que la page se charge
      cy.contains('Meal Plan').should('be.visible')
    })
  
    it('should add a meal to calendar', () => {
      cy.visit('/planification')
      // Tester l'ajout de repas
      // TODO: Ajouter les interactions quand les data-cy seront présents
    })

    it('should access shopping list page', () => {
      cy.visit('/shopping-list')
      
      // Should be able to access the page when authenticated
      cy.url().should('include', '/shopping-list')
      cy.contains('Shopping List').should('be.visible')
    })
  })
})
