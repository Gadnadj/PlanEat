import React, { useEffect } from 'react';
import Header from '@/components/RecipeIdPage/Headers';
import Ingredients from '@/components/RecipeIdPage/Ingredients';
import Nutrition from '@/components/RecipeIdPage/Nutrition';
import Preparation from '@/components/RecipeIdPage/Preparation';

interface Meal {
  nom?: string;
  name?: string;
  description?: string;
  emoji?: string;
  ingredients?: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions?: string[];
  temps?: string;
  time?: string;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  tags?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface PlanningRecipeModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlanningRecipeModal = ({ meal, isOpen, onClose }: PlanningRecipeModalProps) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !meal) return null;

  // Fonction pour convertir la difficulté française vers anglaise
  const convertDifficulty = (difficulty?: string): 'easy' | 'medium' | 'hard' => {
    switch (difficulty) {
      case 'facile':
        return 'easy';
      case 'moyen':
        return 'medium';
      case 'difficile':
        return 'hard';
      case 'easy':
      case 'medium':
      case 'hard':
        return difficulty;
      default:
        return 'medium';
    }
  };

  // Convertir le format du planning vers le format de recette
  const recipeData = {
    id: 'planning-recipe',
    title: meal.name || meal.nom || 'Recette',
    description: meal.description || 'Une délicieuse recette générée par l\'IA',
    image: `https://images.unsplash.com/photo-1546069901-ba9599e7e5d0?w=400&h=300&fit=crop&crop=center`,
    emoji: meal.emoji || '🍽️',
    ingredients: meal.ingredients || [],
    instructions: meal.instructions || ['Instructions détaillées non disponibles'],
    prepTime: parseInt(meal.temps?.replace(' min', '') || meal.time?.replace(' min', '') || '30'),
    servings: meal.servings || 4,
    difficulty: convertDifficulty(meal.difficulty),
    category: meal.category || 'Plat principal',
    tags: meal.tags || [],
    nutrition: meal.nutrition || {
      calories: 350,
      protein: 20,
      carbs: 30,
      fat: 15
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton fermer */}
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-white">Détails de la recette</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenu de la recette */}
        <div className="p-6">
          <Header recipe={recipeData} />
          <div className="mt-6">
            <Ingredients 
              recipe={recipeData} 
              onAddIngredient={() => {}} // Pas d'ajout d'ingrédients depuis le planning
            />
          </div>
          <div className="mt-6">
            <Preparation recipe={recipeData} />
          </div>
          <div className="mt-6">
            <Nutrition recipe={recipeData} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              // TODO: Ajouter fonctionnalité pour remplacer cette recette
              alert('Fonctionnalité de remplacement à venir !');
            }}
            className="px-6 py-2 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#64748b] hover:from-[#3b82f6] hover:to-[#5a6a7a] text-white font-medium transition-colors"
          >
            Remplacer cette recette
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanningRecipeModal;
