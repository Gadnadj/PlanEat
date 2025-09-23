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
          setRecipe(data.recipe);
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
          <Header recipe={recipe} />

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
