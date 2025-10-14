"use client"
import Header from '@/components/RecipeIdPage/Headers';
import Ingredients from '@/components/RecipeIdPage/Ingredients';
import Nutrition from '@/components/RecipeIdPage/Nutrition';
import Preparation from '@/components/RecipeIdPage/Preparation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalServings, setOriginalServings] = useState<number>(1);
  const [currentServings, setCurrentServings] = useState<number>(1);
  const [originalIngredients, setOriginalIngredients] = useState<RecipeData['ingredients']>([]);

  console.log(params);
  console.log('fskjdnfbkjsdbjkfhdsjkfkjsfdsjgfhjgsdfhgsdhgjfghsdgfkjghhhghfsdghjfghjsdfghjsdfhgfgjh');


  // Function to convert fractions to decimal
  const fractionToDecimal = (fraction: string): number => {
    // Check if it's already a decimal number
    const decimal = parseFloat(fraction);
    if (!isNaN(decimal)) return decimal;
    
    // Check if it's a fraction like "1/2", "3/4", etc.
    if (fraction.includes('/')) {
      const parts = fraction.split('/');
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return numerator / denominator;
        }
      }
    }
    
    return NaN;
  };

  // Function to scale ingredient quantities
  const scaleIngredients = (ingredients: RecipeData['ingredients'], originalServings: number, newServings: number) => {
    if (originalServings === 0) return ingredients;
    
    const multiplier = newServings / originalServings;
    
    return ingredients.map(ingredient => {
      const amount = fractionToDecimal(ingredient.amount);
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
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/recipes/${params.id}`, { headers });
        if (response.ok) {
          const data = await response.json();
          const recipeData = data.recipe;
          
          // Save original data for scaling
          setOriginalServings(recipeData.servings);
          setCurrentServings(recipeData.servings);
          setOriginalIngredients(recipeData.ingredients);
          
          setRecipe(recipeData);
        } else {
          console.error('Error loading recipe');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
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
      alert('Please log in to add items to your shopping list');
      return;
    }

    try {
      const category = getIngredientCategory(ingredient.name);
      
      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: ingredient.name,
          category: category,
          quantity: ingredient.amount + (ingredient.unit ? ` ${ingredient.unit}` : '')
        })
      });

      if (response.ok) {
        alert(`${ingredient.name} added to your shopping list (${category})!`);
      } else {
        console.error(`Error adding ${ingredient.name}`);
        alert('Error adding to shopping list');
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      alert('Error adding to shopping list');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className='max-w-[1400px] mx-auto px-8 py-12 flex justify-center items-center'>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
            <p className="text-[#b0b0b0]">Loading recipe...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!recipe) {
    return (
      <ProtectedRoute>
        <div className='max-w-[1400px] mx-auto px-8 py-12 flex justify-center items-center'>
          <div className="text-center">
            <p className="text-[#b0b0b0] text-lg">Recipe not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='max-w-[1400px] mx-auto px-8 py-12 grid [grid-template-columns:1fr_350px] gap-12 max-lg:grid max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8'>
        <main>
          <Header 
            recipe={recipe} 
            currentServings={currentServings}
            onServingsChange={updateServings}
          />

          <div className='flex flex-col gap-8 max-sm:p-6'>
            <Ingredients 
              recipe={recipe} 
              onAddIngredient={addIngredientToShoppingList}
            />

            <Preparation recipe={recipe} />
          </div>
        </main>

        <aside className='flex flex-col gap-6 max-sm:p-4'>
          <Nutrition recipe={recipe} />
        </aside>
      </div>
    </ProtectedRoute>
  )
}
export default Page
