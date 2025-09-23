"use client"
import Header from '@/components/RecipeIdPage/Headers';
import Ingredients from '@/components/RecipeIdPage/Ingredients';
import Nutrition from '@/components/RecipeIdPage/Nutrition';
import Preparation from '@/components/RecipeIdPage/Preparation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getIngredientCategory } from '@/lib/ingredientCategories';

interface RecipeData {
  id: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions: string[];
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const Page = () => {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalServings, setOriginalServings] = useState<number>(2);
  const [currentServings, setCurrentServings] = useState<number>(2);
  const [originalIngredients, setOriginalIngredients] = useState<RecipeData['ingredients']>([]);

  // Function to scale ingredient quantities
  const scaleIngredients = (ingredients: RecipeData['ingredients'], originalServings: number, newServings: number) => {
    if (originalServings === 0) return ingredients;
    
    const multiplier = newServings / originalServings;
    
    return ingredients.map(ingredient => {
      const amount = parseFloat(ingredient.amount);
      if (isNaN(amount)) return ingredient;
      
      const scaledAmount = (amount * multiplier).toFixed(1);
      // Remove .0 if it's a whole number
      const finalAmount = scaledAmount.endsWith('.0') ? scaledAmount.slice(0, -2) : scaledAmount;
      
      return {
        ...ingredient,
        amount: finalAmount
      };
    });
  };

  // Update current recipe when servings change
  const updateServings = (newServings: number) => {
    if (!recipe || newServings < 1) return;
    
    setCurrentServings(newServings);
    
    const scaledIngredients = scaleIngredients(originalIngredients, originalServings, newServings);
    
    setRecipe(prev => prev ? {
      ...prev,
      servings: newServings,
      ingredients: scaledIngredients
    } : null);
  };

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        // Get user's meal plan
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/meal-plans', { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.mealPlan) {
            // Extraire l'ID de la recette depuis les paramètres
            // Format attendu: "monday-morning", "tuesday-lunch", etc.
            const [day, meal] = (params.id as string).split('-');
            
            // Map meal times to handle different API formats
            const getMealData = (dayData: unknown, mealTime: string) => {
              // Direct lookup first
              if (dayData && typeof dayData === 'object' && mealTime in dayData) {
                return (dayData as Record<string, unknown>)[mealTime];
              }
              
              // Map different meal time formats
              const mealMapping: { [key: string]: string[] } = {
                'morning': ['morning', 'matin'],
                'lunch': ['lunch', 'midi', 'noon'],
                'dinner': ['dinner', 'soir', 'evening']
              };
              
              // Try all possible variations
              const possibleKeys = mealMapping[mealTime] || [mealTime];
              if (dayData && typeof dayData === 'object') {
                const dayRecord = dayData as Record<string, unknown>;
                for (const key of possibleKeys) {
                  if (key in dayRecord) return dayRecord[key];
                }
              }
              
              return null;
            };
            
            const dayData = data.mealPlan[day];
            const mealData = dayData ? getMealData(dayData, meal) : null;
            
            if (mealData && typeof mealData === 'object') {
              const typedMealData = mealData as {
                description?: string;
                name?: string;
                nom?: string;
                ingredients?: unknown[];
                instructions?: string[];
                time?: string;
                temps?: string;
                servings?: number;
                difficulty?: string;
                emoji?: string;
                category?: string;
                tags?: string[];
                nutrition?: {
                  calories: number;
                  protein: number;
                  carbs: number;
                  fat: number;
                };
              };
              
              console.log('Found meal data for', day, meal, ':', typedMealData);
              
              // Use AI-enriched description if available, otherwise generate fallback
              const getDescription = (mealData: { description?: string; name?: string; nom?: string; ingredients?: unknown[] }) => {
                if (mealData.description) {
                  return mealData.description;
                }
                
                // Fallback description if AI enrichment wasn't available
                const ingredientsList = mealData.ingredients && mealData.ingredients.length > 0 
                  ? ` featuring ${mealData.ingredients.slice(0, 3).join(', ')}` 
                  : '';
                return `Delicious ${mealData.name} prepared with care${ingredientsList}. A nutritious and flavorful dish perfect for any meal.`;
              };

              // Use AI-enriched instructions if available, otherwise generate fallback
              const getInstructions = (mealData: { instructions?: string[]; time?: string; temps?: string }) => {
                if (mealData.instructions && Array.isArray(mealData.instructions) && mealData.instructions.length > 0) {
                  return mealData.instructions;
                }
                
                // Fallback instructions if AI enrichment wasn't available
                const prepTime = parseInt(mealData.time?.replace(/\D/g, '') || '30');
                return prepTime > 30 ? [
                  'Gather and prepare all ingredients by washing, chopping, and measuring.',
                  'Preheat your cooking equipment (oven, pan, or grill) to the appropriate temperature.',
                  'Begin with ingredients that take the longest to cook.',
                  `Cook for approximately ${prepTime} minutes, monitoring progress and adjusting heat as needed.`,
                  'Season throughout the cooking process, tasting and adjusting flavors.',
                  'Allow to rest briefly before serving to let flavors settle and temperature equalize.'
                ] : [
                  'Prepare and organize all ingredients for quick cooking.',
                  'Heat your cooking surface or equipment to the right temperature.',
                  `Cook for about ${prepTime} minutes, working efficiently to maintain quality.`,
                  'Season to taste and adjust consistency if needed.',
                  'Serve immediately while hot and fresh for best results.'
                ];
              };

              // Enhanced ingredient formatter for both simple and complex data formats
              const formatIngredients = (ingredients: unknown[]) => {
                if (!Array.isArray(ingredients)) return [];
                
                return ingredients.map(ingredient => {
                  // If ingredient is already an object with name, amount, unit (from detailed API)
                  if (typeof ingredient === 'object' && ingredient !== null && 'name' in ingredient) {
                    const ing = ingredient as { name: string; amount?: string; unit?: string };
                    return {
                      name: ing.name.trim(),
                      amount: ing.amount || '1',
                      unit: ing.unit || ''
                    };
                  }
                  
                  // If ingredient is a string (from simple API)
                  if (typeof ingredient === 'string') {
                    // Try to extract quantity, unit and name from the ingredient string
                    const match = ingredient.match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-Zé]*)\s*(.+)$/);
                    if (match) {
                      const [, amount, unit, name] = match;
                      return {
                        name: name.trim(),
                        amount: amount.replace(',', '.'),
                        unit: unit || ''
                      };
                    }
                    
                    // If no quantity specified, use ingredient as-is
                    return {
                      name: ingredient.trim(),
                      amount: '1',
                      unit: ''
                    };
                  }
                  
                  // Fallback for unexpected format
                  return {
                    name: String(ingredient).trim(),
                    amount: '1',
                    unit: ''
                  };
                });
              };

              // Récupérer le nombre de personnes depuis les préférences
              const numberOfPeople = data.preferences?.numberOfPeople || 2;
              // Toujours utiliser le nombre de personnes des préférences
              const servings = numberOfPeople;

              // Format ingredients for display
              const formattedIngredients = Array.isArray(typedMealData.ingredients) ? 
                formatIngredients(typedMealData.ingredients) : [];

              // Use AI-enriched nutrition data if available

              // Convertir le format du planning vers le format de recette
              const recipeData: RecipeData = {
                id: `${day}-${meal}`,
                title: typedMealData.nom || typedMealData.name || 'Recette',
                description: getDescription(typedMealData),
                image: `https://images.unsplash.com/photo-1546069901-ba9599e7e5d0?w=400&h=300&fit=crop&crop=center`,
                emoji: typedMealData.emoji || '🍽️',
                ingredients: formattedIngredients,
                instructions: getInstructions(typedMealData),
                prepTime: parseInt(typedMealData.temps?.replace(' min', '') || typedMealData.time?.replace(' min', '') || '30'),
                servings: servings,
                difficulty: (typedMealData.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
                category: typedMealData.category || 'Plat principal',
                tags: typedMealData.tags || [],
                nutrition: typedMealData.nutrition || {
                  calories: 300,
                  protein: 15,
                  carbs: 35,
                  fat: 10
                }
              };
              
              // Save original data for scaling
              setOriginalServings(servings);
              setCurrentServings(servings);
              setOriginalIngredients(formattedIngredients);
              
              setRecipe(recipeData);
            } else {
              console.error('Meal not found in planning for', day, meal);
              console.error('Available day data:', dayData);
              console.error('Full meal plan:', data.mealPlan);
              console.error('Looking for:', `${day}-${meal}`);
            }
          }
        } else {
          console.error('Erreur lors du chargement du planning');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la recette:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadRecipe();
    }
  }, [params.id, token]);

  const addIngredientToShoppingList = async (ingredient: { name: string; amount: string; unit?: string }) => {
    if (!token) {
      alert('Veuillez vous connecter pour ajouter des ingrédients à votre liste de courses');
      return;
    }

    try {
      const category = getIngredientCategory(ingredient.name);
      const ingredientText = `${ingredient.amount} ${ingredient.unit || ''} ${ingredient.name}`.trim();

      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: ingredientText,
          category: category,
          quantity: 1
        })
      });

      if (response.ok) {
        alert(`${ingredientText} ajouté à votre liste de courses !`);
      } else {
        alert('Erreur lors de l\'ajout à la liste de courses');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la liste de courses:', error);
      alert('Erreur lors de l\'ajout à la liste de courses');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
            <p className="text-[#b0b0b0] text-lg">Chargement de la recette...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!recipe) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h1 className="text-3xl font-bold text-white mb-4">Recette non trouvée</h1>
            <p className="text-gray-300 mb-6">Cette recette n&apos;existe pas dans votre planning</p>
            <button
              onClick={() => router.push('/planification')}
              className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              ← Retour au planning
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {/* Bouton retour avec fond gradient comme avant */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-6">
        <div className="max-w-[1400px] mx-auto px-8">
            <button
              onClick={() => router.push('/planification')}
              className="flex items-center gap-2 text-[#3b82f6] hover:text-white transition-colors"
            >
              <span className="text-xl">←</span>
              <span>Retour au planning</span>
            </button>
        </div>
          </div>

      {/* Layout en grille identique à la page recipe normale */}
      <div className="max-w-[1400px] mx-auto px-8 py-12 grid [grid-template-columns:1fr_350px] gap-12 max-lg:grid max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8">
        <main>
          <Header 
            recipe={recipe} 
            currentServings={currentServings}
            onServingsChange={updateServings}
          />

          <div className="flex flex-col gap-8 max-sm:p-6">
            <Ingredients 
              recipe={recipe} 
              onAddIngredient={addIngredientToShoppingList}
            />

            <Preparation recipe={recipe} />
          </div>
        </main>

        <aside className="flex flex-col gap-6 max-sm:p-4">
            <Nutrition recipe={recipe} />
        </aside>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
