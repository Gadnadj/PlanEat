// Fonctions utilitaires pour les recettes

import { getRecipeImageUrl } from './recipeImages';

// Interface pour créer une nouvelle recette facilement
export interface NewRecipeData {
  title: string;
  description: string;
  emoji: string;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
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

// Fonction pour créer une recette avec image automatique
export function createRecipeWithImage(recipeData: NewRecipeData) {
  return {
    ...recipeData,
    image: getRecipeImageUrl(recipeData.title),
    source: 'manual' as const
  };
}

// Fonction pour générer un slug à partir du titre
export function generateRecipeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Enlever les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Éviter les doubles tirets
    .trim();
}

// Fonction pour valider les données d'une recette
export function validateRecipeData(recipe: NewRecipeData): string[] {
  const errors: string[] = [];

  if (!recipe.title || recipe.title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  }

  if (!recipe.description || recipe.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push('Au moins un ingrédient est requis');
  }

  if (!recipe.instructions || recipe.instructions.length === 0) {
    errors.push('Au moins une instruction est requise');
  }

  if (recipe.prepTime <= 0) {
    errors.push('Le temps de préparation doit être positif');
  }

  if (recipe.servings <= 0) {
    errors.push('Le nombre de portions doit être positif');
  }

  if (!['easy', 'medium', 'hard'].includes(recipe.difficulty)) {
    errors.push('La difficulté doit être easy, medium ou hard');
  }

  if (recipe.nutrition.calories < 0) {
    errors.push('Les calories ne peuvent pas être négatives');
  }

  return errors;
}

// Exemple d'utilisation pour créer une nouvelle recette
export function createExampleRecipe(): ReturnType<typeof createRecipeWithImage> {
  const newRecipe: NewRecipeData = {
    title: 'Ma Nouvelle Recette',
    description: 'Description de ma délicieuse recette',
    emoji: '🍽️',
    ingredients: [
      { name: 'Ingrédient 1', amount: '200', unit: 'g' },
      { name: 'Ingrédient 2', amount: '1', unit: 'pièce' }
    ],
    instructions: [
      'Première étape de préparation',
      'Deuxième étape de préparation',
      'Servir chaud'
    ],
    prepTime: 30,
    servings: 4,
    difficulty: 'medium',
    category: 'Plat Principal',
    tags: ['facile', 'rapide'],
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 15
    }
  };

  return createRecipeWithImage(newRecipe);
}
