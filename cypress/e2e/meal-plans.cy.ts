describe('Meal Planning', () => {
  it('should redirect to login when accessing meal plans without authentication', () => {
    cy.visit('/planification')
    
    // Should redirect to login
    cy.url().should('include', '/login')
  })

  describe('Meal Planning - Authenticated User', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      cy.login('test@example.com', 'testpassword123')
    })
  
    it('should display meal plan calendar', () => {
      cy.visit('/planification')
      
      // Vérifier que la page se charge
      cy.contains('Meal Plan').should('be.visible')
      // Tester les fonctionnalités réelles
    })
  
    it('should add a meal to calendar', () => {
      cy.visit('/planification')
      // Tester l'ajout de repas
    })
  })

  it('should redirect to login when accessing shopping list without authentication', () => {
    cy.visit('/shopping-list')
    
    // Should redirect to login
    cy.url().should('include', '/login')
  })
})
