// Script de test pour vérifier l'API meal-plans
// Utilisation: node test-meal-plan.js

const testMealPlanAPI = async () => {
  try {
    // Données de test
    const testData = {
      preferences: {
        dietType: "vegetarian",
        allergies: [],
        dislikes: [],
        numberOfPeople: 2,
        budget: "medium",
        cookingTime: "medium"
      },
      mealPlan: {
        monday: {
          morning: {
            name: "Test Breakfast",
            ingredients: ["test ingredient"],
            time: "10 min",
            emoji: "🥐"
          },
          noon: {
            name: "Test Lunch", 
            ingredients: ["test ingredient"],
            time: "30 min",
            emoji: "🥗"
          },
          evening: {
            name: "Test Dinner",
            ingredients: ["test ingredient"],
            time: "45 min",
            emoji: "🍝"
          }
        }
      }
    };

    console.log('Testing meal plan API...');
    console.log('Test data:', JSON.stringify(testData, null, 2));

    // Test de l'API
    const response = await fetch('http://localhost:3000/api/meal-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: Il faudra remplacer par un vrai token d'authentification
        'Authorization': 'Bearer your-test-token'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    const result = await response.text();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Exécuter le test
testMealPlanAPI();
