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
  cookTime: number;
  servings: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
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
        const response = await fetch(`/api/recipes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data.recipe);
        } else {
          console.error('Erreur lors du chargement de la recette');
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
  }, [params.id]);


  const addIngredientToShoppingList = async (ingredient: { name: string; amount: string; unit?: string }) => {
    if (!token) {
      alert('Veuillez vous connecter pour ajouter des articles à votre liste de courses');
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
        alert(`${ingredient.name} ajouté à votre liste de courses (${category}) !`);
      } else {
        console.error(`Erreur lors de l'ajout de ${ingredient.name}`);
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
        <div className='max-w-[1400px] mx-auto px-8 py-12 flex justify-center items-center'>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
            <p className="text-[#b0b0b0]">Chargement de la recette...</p>
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
            <p className="text-[#b0b0b0] text-lg">Recette non trouvée</p>
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
