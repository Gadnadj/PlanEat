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
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        // Récupérer le planning de l'utilisateur
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/meal-plans', { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.mealPlan) {
            // Extraire l'ID de la recette depuis les paramètres
            // Format attendu: "lundi-matin", "mardi-midi", etc.
            const [day, meal] = (params.id as string).split('-');
            
            if (data.mealPlan[day] && data.mealPlan[day][meal]) {
              const mealData = data.mealPlan[day][meal];
              
              // Fonction pour générer une description basée sur le nom et les ingrédients
              const generateDescription = (name: string, ingredients: string[]) => {
                const descriptions = {
                  'Porridge': 'Porridge crémeux et nutritif, parfait pour bien commencer la journée avec des saveurs douces et réconfortantes.',
                  'Smoothie': 'Smoothie frais et vitaminé, mélange parfait de fruits et nutriments pour un boost d\'énergie naturel.',
                  'Omelette': 'Omelette moelleuse et savoureuse, riche en protéines et parfaitement assaisonnée pour un repas équilibré.',
                  'Salade': 'Salade fraîche et colorée, combinaison harmonieuse d\'ingrédients croquants et de saveurs délicates.',
                  'Poulet': 'Plat de poulet savoureux et tendre, préparé avec soin pour révéler toutes ses saveurs naturelles.',
                  'Pâtes': 'Plat de pâtes réconfortant et délicieux, sauce onctueuse et ingrédients de qualité pour un repas satisfaisant.',
                  'Soupe': 'Soupe chaude et réconfortante, mélange parfait de légumes et d\'épices pour un moment de pure gourmandise.',
                  'Riz': 'Plat de riz parfumé et nutritif, accompagné d\'ingrédients frais pour une expérience culinaire authentique.',
                  'Poisson': 'Plat de poisson frais et délicat, préparation simple qui met en valeur la qualité du produit.',
                  'Légumes': 'Plat de légumes coloré et vitaminé, préparation qui révèle toute la richesse des produits de saison.'
                };
                
                // Trouver une description basée sur le nom
                for (const [keyword, desc] of Object.entries(descriptions)) {
                  if (name.toLowerCase().includes(keyword.toLowerCase())) {
                    return desc;
                  }
                }
                
                // Description générique avec les ingrédients
                const ingredientList = ingredients.slice(0, 3).join(', ');
                return `Délicieuse recette préparée avec ${ingredientList}${ingredients.length > 3 ? ' et d\'autres ingrédients' : ''}. Un plat savoureux et équilibré qui ravira vos papilles.`;
              };

              // Fonction pour générer des instructions basées sur le nom et les ingrédients
              const generateInstructions = (name: string, ingredients: string[], prepTime: number) => {
                const baseInstructions = {
                  'Porridge': [
                    'Dans une casserole, faites chauffer le lait d\'amande à feu moyen.',
                    'Ajoutez les flocons d\'avoine et mélangez bien.',
                    'Laissez cuire en remuant régulièrement pendant 10-15 minutes.',
                    'Ajoutez les fruits et mélangez délicatement.',
                    'Servez chaud et savourez !'
                  ],
                  'Smoothie': [
                    'Lavez et préparez tous les fruits.',
                    'Placez tous les ingrédients dans un blender.',
                    'Mixez pendant 1-2 minutes jusqu\'à obtenir une texture lisse.',
                    'Goûtez et ajustez la consistance si nécessaire.',
                    'Servez immédiatement dans des verres frais.'
                  ],
                  'Omelette': [
                    'Cassez les œufs dans un bol et battez-les vigoureusement.',
                    'Préparez et hachez finement les légumes.',
                    'Chauffez une poêle avec un peu d\'huile à feu moyen.',
                    'Versez les œufs battus et ajoutez les légumes.',
                    'Pliez l\'omelette en deux et servez aussitôt.'
                  ],
                  'Salade': [
                    'Lavez et essorez soigneusement tous les légumes.',
                    'Coupez les légumes en morceaux de taille uniforme.',
                    'Préparez une vinaigrette avec huile, vinaigre et épices.',
                    'Mélangez tous les ingrédients dans un grand saladier.',
                    'Assaisonnez avec la vinaigrette et servez frais.'
                  ]
                };
                
                // Trouver des instructions spécifiques
                for (const [keyword, instructions] of Object.entries(baseInstructions)) {
                  if (name.toLowerCase().includes(keyword.toLowerCase())) {
                    return instructions;
                  }
                }
                
                // Instructions génériques
                return [
                  'Préparez et lavez tous les ingrédients nécessaires.',
                  'Suivez les techniques de cuisson appropriées pour chaque ingrédient.',
                  `Cuisez pendant environ ${prepTime} minutes en surveillant la cuisson.`,
                  'Assaisonnez selon vos goûts et préférences.',
                  'Servez chaud et dégustez ce délicieux plat !'
                ];
              };

              // Base de données nutritionnelle approximative (pour 100g)
              const nutritionDB = {
                // Fruits
                'banane': { calories: 89, protein: 1, carbs: 23, fat: 0.3 },
                'pomme': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
                'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
                'fraise': { calories: 32, protein: 0.7, carbs: 8, fat: 0.3 },
                'fruits rouges': { calories: 35, protein: 0.8, carbs: 8, fat: 0.3 },
                'fruits': { calories: 50, protein: 0.8, carbs: 12, fat: 0.2 },
                
                // Légumes
                'tomate': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
                'carotte': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
                'épinards': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
                'poivron': { calories: 31, protein: 1, carbs: 7, fat: 0.3 },
                'légumes': { calories: 30, protein: 2, carbs: 6, fat: 0.3 },
                
                // Céréales et féculents
                'flocons d\'avoine': { calories: 389, protein: 17, carbs: 66, fat: 7 },
                'riz': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
                'pâtes': { calories: 371, protein: 13, carbs: 75, fat: 1.5 },
                'quinoa': { calories: 368, protein: 14, carbs: 64, fat: 6 },
                'pain': { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
                
                // Protéines
                'œufs': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
                'oeufs': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
                'poulet': { calories: 239, protein: 27, carbs: 0, fat: 14 },
                'poisson': { calories: 206, protein: 22, carbs: 0, fat: 12 },
                'thon': { calories: 144, protein: 30, carbs: 0, fat: 1 },
                'saumon': { calories: 208, protein: 20, carbs: 0, fat: 13 },
                
                // Légumineuses
                'lentilles': { calories: 353, protein: 25, carbs: 60, fat: 1.1 },
                'haricots': { calories: 347, protein: 23, carbs: 63, fat: 1.2 },
                'pois chiches': { calories: 364, protein: 19, carbs: 61, fat: 6 },
                
                // Produits laitiers
                'lait': { calories: 64, protein: 3.2, carbs: 5, fat: 3.6 },
                'lait d\'amande': { calories: 17, protein: 0.6, carbs: 0.3, fat: 1.1 },
                'yaourt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
                'fromage': { calories: 113, protein: 25, carbs: 1, fat: 1 },
                
                // Matières grasses
                'huile d\'olive': { calories: 884, protein: 0, carbs: 0, fat: 100 },
                'beurre': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
                'avocat': { calories: 160, protein: 2, carbs: 9, fat: 15 }
              };

              // Fonction pour calculer les quantités selon le nombre de personnes
              const calculatePortions = (baseAmount: string, basePeople: number, targetPeople: number) => {
                const multiplier = targetPeople / basePeople;
                const numericAmount = parseFloat(baseAmount.replace(/[^\d.,]/g, '').replace(',', '.'));
                
                if (isNaN(numericAmount)) {
                  return baseAmount;
                }
                
                const newAmount = Math.round(numericAmount * multiplier * 10) / 10;
                return baseAmount.replace(/[\d.,]+/, newAmount.toString());
              };

              // Fonction pour estimer la quantité d'un ingrédient
              const estimateIngredientAmount = (ingredient: string, servings: number) => {
                const name = ingredient.toLowerCase();
                
                // Portions standards par personne (en grammes)
                const standardPortions = {
                  'flocons d\'avoine': 50,
                  'riz': 75,
                  'pâtes': 80,
                  'quinoa': 60,
                  'poulet': 120,
                  'poisson': 120,
                  'œufs': 60, // ~1 œuf
                  'oeufs': 60,
                  'légumes': 150,
                  'fruits': 120,
                  'lait': 200,
                  'lait d\'amande': 200,
                  'tomate': 100,
                  'épinards': 80,
                  'carotte': 80,
                  'poivron': 100
                };
                
                for (const [key, portion] of Object.entries(standardPortions)) {
                  if (name.includes(key)) {
                    return portion * servings;
                  }
                }
                
                return 100 * servings; // Quantité par défaut
              };

              // Convertir le format simple des ingrédients vers le format détaillé
              const formatIngredients = (ingredients: string[], servings: number) => {
                return ingredients.map(ingredient => {
                  // Essayer d'extraire quantité, unité et nom
                  const match = ingredient.match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-Zé]*)\s*(.+)$/);
                  if (match) {
                    const [, amount, unit, name] = match;
                    const calculatedAmount = calculatePortions(amount, 1, servings);
                    return {
                      name: name.trim(),
                      amount: calculatedAmount,
                      unit: unit || 'g'
                    };
                  }
                  
                  // Estimer la quantité si pas spécifiée
                  const estimatedAmount = estimateIngredientAmount(ingredient, servings);
                  return {
                    name: ingredient,
                    amount: estimatedAmount.toString(),
                    unit: 'g'
                  };
                });
              };

              // Fonction pour calculer les valeurs nutritionnelles
              const calculateNutrition = (ingredients: any[], servings: number) => {
                let totalCalories = 0;
                let totalProtein = 0;
                let totalCarbs = 0;
                let totalFat = 0;

                ingredients.forEach(ingredient => {
                  const name = ingredient.name.toLowerCase();
                  const amount = parseFloat(ingredient.amount) || 0;
                  
                  // Chercher l'ingrédient dans la base nutritionnelle
                  let nutritionInfo = null;
                  for (const [key, nutrition] of Object.entries(nutritionDB)) {
                    if (name.includes(key) || key.includes(name)) {
                      nutritionInfo = nutrition;
                      break;
                    }
                  }
                  
                  if (nutritionInfo) {
                    // Calculer pour la quantité utilisée (base 100g)
                    const factor = amount / 100;
                    totalCalories += nutritionInfo.calories * factor;
                    totalProtein += nutritionInfo.protein * factor;
                    totalCarbs += nutritionInfo.carbs * factor;
                    totalFat += nutritionInfo.fat * factor;
                  }
                });

                // Diviser par le nombre de portions pour avoir les valeurs par personne
                return {
                  calories: Math.round(totalCalories / servings),
                  protein: Math.round(totalProtein / servings * 10) / 10,
                  carbs: Math.round(totalCarbs / servings * 10) / 10,
                  fat: Math.round(totalFat / servings * 10) / 10
                };
              };

              // Récupérer le nombre de personnes depuis les préférences
              const numberOfPeople = data.preferences?.numberOfPeople || 4;
              const servings = mealData.servings || numberOfPeople;

              // Convertir et calculer les ingrédients avec les bonnes quantités
              const formattedIngredients = Array.isArray(mealData.ingredients) ? 
                formatIngredients(mealData.ingredients, servings) : [];

              // Calculer les valeurs nutritionnelles automatiquement
              const calculatedNutrition = mealData.nutrition || calculateNutrition(formattedIngredients, servings);

              // Convertir le format du planning vers le format de recette
              const recipeData: RecipeData = {
                id: `${day}-${meal}`,
                title: mealData.nom || mealData.name || 'Recette',
                description: mealData.description || generateDescription(mealData.nom || '', mealData.ingredients || []),
                image: `https://images.unsplash.com/photo-1546069901-ba9599e7e5d0?w=400&h=300&fit=crop&crop=center`,
                emoji: mealData.emoji || '🍽️',
                ingredients: formattedIngredients,
                instructions: mealData.instructions || generateInstructions(mealData.nom || '', mealData.ingredients || [], parseInt(mealData.temps?.replace(' min', '') || '30')),
                prepTime: parseInt(mealData.temps?.replace(' min', '') || mealData.time?.replace(' min', '') || '30'),
                cookTime: 0,
                servings: servings,
                difficulty: mealData.difficulty || 'facile',
                category: mealData.category || 'Plat principal',
                tags: mealData.tags || [],
                nutrition: calculatedNutrition
              };
              
              setRecipe(recipeData);
            } else {
              console.error('Recette non trouvée dans le planning');
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
            <p className="text-gray-300 mb-6">Cette recette n'existe pas dans votre planning</p>
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
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Bouton retour */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/planification')}
              className="flex items-center gap-2 text-[#3b82f6] hover:text-white transition-colors"
            >
              <span className="text-xl">←</span>
              <span>Retour au planning</span>
            </button>
          </div>

          {/* Contenu de la recette */}
          <Header recipe={recipe} />
          <div className="mt-8">
            <Ingredients 
              recipe={recipe} 
              onAddIngredient={addIngredientToShoppingList}
            />
          </div>
          <div className="mt-8">
            <Preparation recipe={recipe} />
          </div>
          <div className="mt-8">
            <Nutrition recipe={recipe} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
