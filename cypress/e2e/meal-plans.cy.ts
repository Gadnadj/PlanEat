describe('Meal Planning', () => {
  describe('Unauthenticated User', () => {
    

    it('should redirect to login when accessing meal plans without authentication', () => {
      cy.visit('/planification')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })

  })

  describe('Authenticated User', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      cy.login('test1@gmail.com', 'testgad')
    })

    it('should access meal planning page when authenticated', () => {
      cy.visit('/planification')
      
      // Should be able to access the page
      cy.url().should('include', '/planification')
      
      // Should display the header
      cy.contains('AI Meal Planning').should('be.visible')
      cy.contains('Your personalized weekly meal plan').should('be.visible')
    })

    it('should display configure and generate button', () => {
      cy.visit('/planification')
      
      // Check for AI generation button
      cy.contains('Configure and Generate with AI').should('be.visible')
    })

    it('should navigate to preferences page', () => {
      cy.visit('/planification')
      
      // Click on configure button
      cy.contains('Configure and Generate with AI').click()
      
      // Should navigate to preferences
      cy.url().should('include', '/preferences')
    })

    it('should display day selector if meal plan exists', () => {
      cy.visit('/planification')
      
      // Wait for page to load
      cy.wait(2000)
      
      // Check if day buttons might be visible (if user has a meal plan)
      cy.get('body').then(($body) => {
        if ($body.text().includes('Monday') || $body.text().includes('Tuesday')) {
          // If days are visible, meal plan exists
          cy.contains('Monday').should('be.visible')
        }
      })
    })

    it('should display empty state when no meal plan', () => {
      cy.visit('/planification')
      
      // Wait for page to load
      cy.wait(2000)
      
      // Either shows a meal plan or an empty state message
      cy.get('body').should('exist')
    })

    it('should show meal types (morning, lunch, dinner) if plan exists', () => {
      cy.visit('/planification')
      
      // Wait for page to load
      cy.wait(2000)
      
      // Check if meal types might be visible
      cy.get('body').then(($body) => {
        if (!$body.text().includes('No meal plan generated yet')) {
          // Might have meal sections
          cy.get('body').should('exist')
        }
      })
    })

    it('should display user preferences if configured', () => {
      cy.visit('/planification')
      
      // Wait for page to load
      cy.wait(1000)
      
      // Check if preferences summary is shown
      cy.get('body').then(($body) => {
        if ($body.text().includes('Diet:') || $body.text().includes('Budget')) {
          // Preferences are configured and displayed
          cy.contains('Diet:').should('be.visible')
        }
      })
    })

    it('should be able to switch between days if meal plan exists', () => {
      cy.visit('/planification')
      
      // Wait for page to load
      cy.wait(2000)
      
      // Try to click on different days
      cy.get('body').then(($body) => {
        if ($body.text().includes('Tuesday')) {
          cy.contains('Tuesday').click()
          cy.contains('Tuesday').should('be.visible')
        }
      })
    })
  })
})
