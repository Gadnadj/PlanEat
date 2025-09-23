import connectToDatabase from '../lib/mongodb';
import Recipe from '../models/Recipe';

// Configuration de l'API Spoonacular
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Catégories de recettes populaires
const RECIPE_CATEGORIES = [
  'italian', 'french', 'mexican', 'indian', 'chinese', 'japanese', 
  'mediterranean', 'american', 'thai', 'greek', 'spanish', 'german'
];

// Fonction pour récupérer des recettes depuis Spoonacular
async function fetchRecipesFromSpoonacular(offset: number = 0, number: number = 20) {
  if (!SPOONACULAR_API_KEY) {
    console.error('SPOONACULAR_API_KEY manquante dans les variables d\'environnement');
    return [];
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&offset=${offset}&number=${number}&addRecipeInformation=true&instructionsRequired=true`
    );

    if (!response.ok) {
      throw new Error(`Erreur API Spoonacular: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error);
    return [];
  }
}

// Fonction pour récupérer les détails d'une recette
async function fetchRecipeDetails(recipeId: number) {
  if (!SPOONACULAR_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de la recette ${recipeId}:`, error);
    return null;
  }
}

// Fonction pour transformer les données Spoonacular en format Recipe
function transformSpoonacularRecipe(recipe: any, details?: any) {
  const ingredients = recipe.extendedIngredients?.map((ing: any) => ({
    name: ing.name,
    amount: ing.amount?.toString() || '1',
    unit: ing.unit || ''
  })) || [];

  const instructions = details?.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || 
                     recipe.instructions?.split('\n').filter((inst: string) => inst.trim()) || [];

  const nutrition = details?.nutrition?.nutrients || [];
  const calories = nutrition.find((n: any) => n.name === 'Calories')?.amount || 0;
  const protein = nutrition.find((n: any) => n.name === 'Protein')?.amount || 0;
  const carbs = nutrition.find((n: any) => n.name === 'Carbohydrates')?.amount || 0;
  const fat = nutrition.find((n: any) => n.name === 'Fat')?.amount || 0;

  // Déterminer la difficulté basée sur le temps de préparation
  const totalTime = (recipe.readyInMinutes || 0) + (recipe.preparationMinutes || 0);
  let difficulty: 'facile' | 'moyen' | 'difficile' = 'moyen';
  if (totalTime <= 30) difficulty = 'facile';
  else if (totalTime >= 60) difficulty = 'difficile';

  // Déterminer l'emoji basé sur la catégorie
  const getEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'italian': '🍝',
      'french': '🥐',
      'mexican': '🌮',
      'indian': '🍛',
      'chinese': '🥢',
      'japanese': '🍣',
      'mediterranean': '🫒',
      'american': '🍔',
      'thai': '🌶️',
      'greek': '🧀',
      'spanish': '🥘',
      'german': '🥨'
    };
    return emojiMap[category] || '🍽️';
  };

  return {
    title: recipe.title || 'Recette sans titre',
    description: recipe.summary?.replace(/<[^>]*>/g, '') || 'Délicieuse recette à découvrir',
    image: recipe.image || 'https://via.placeholder.com/400x300',
    emoji: getEmoji(recipe.cuisines?.[0] || 'italian'),
    ingredients,
    instructions,
    prepTime: recipe.preparationMinutes || 15,
    cookTime: recipe.cookingMinutes || 30,
    servings: recipe.servings || 4,
    difficulty,
    category: recipe.cuisines?.[0] || 'international',
    tags: [...(recipe.cuisines || []), ...(recipe.dishTypes || [])],
    nutrition: {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    },
    externalId: recipe.id?.toString(),
    source: 'spoonacular' as const
  };
}

// Fonction pour créer des recettes manuelles si l'API externe n'est pas disponible
function createManualRecipes() {
  return [
    {
      title: 'Salade Méditerranéenne',
      description: 'Une salade fraîche et colorée aux saveurs méditerranéennes',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      emoji: '🥗',
      ingredients: [
        { name: 'Tomates cerises', amount: '250', unit: 'g' },
        { name: 'Concombre', amount: '1', unit: 'pièce' },
        { name: 'Olives noires', amount: '100', unit: 'g' },
        { name: 'Feta', amount: '150', unit: 'g' },
        { name: 'Huile d\'olive', amount: '3', unit: 'c.à.s' },
        { name: 'Basilic frais', amount: '10', unit: 'feuilles' }
      ],
      instructions: [
        'Lavez et coupez les tomates cerises en deux',
        'Épluchez et coupez le concombre en dés',
        'Égouttez les olives et la feta',
        'Mélangez tous les ingrédients dans un saladier',
        'Arrosez d\'huile d\'olive et de basilic ciselé',
        'Salez et poivrez selon vos goûts'
      ],
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: 'facile' as const,
      category: 'méditerranéen',
      tags: ['salade', 'légumes', 'frais', 'santé'],
      nutrition: { calories: 180, protein: 8, carbs: 12, fat: 12 },
      source: 'manual' as const
    },
    {
      title: 'Pâtes au Pesto',
      description: 'Des pâtes parfumées au basilic frais et aux pignons de pin',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
      emoji: '🍝',
      ingredients: [
        { name: 'Pâtes penne', amount: '400', unit: 'g' },
        { name: 'Basilic frais', amount: '50', unit: 'g' },
        { name: 'Pignons de pin', amount: '30', unit: 'g' },
        { name: 'Parmesan râpé', amount: '80', unit: 'g' },
        { name: 'Ail', amount: '2', unit: 'gousses' },
        { name: 'Huile d\'olive', amount: '100', unit: 'ml' }
      ],
      instructions: [
        'Faites cuire les pâtes selon les instructions du paquet',
        'Préparez le pesto en mixant basilic, pignons, ail et parmesan',
        'Ajoutez l\'huile d\'olive progressivement',
        'Égouttez les pâtes et mélangez avec le pesto',
        'Servez chaud avec du parmesan râpé'
      ],
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: 'facile' as const,
      category: 'italien',
      tags: ['pâtes', 'basilic', 'végétarien'],
      nutrition: { calories: 450, protein: 18, carbs: 65, fat: 15 },
      source: 'manual' as const
    },
    {
      title: 'Saumon Grillé aux Herbes',
      description: 'Filet de saumon parfumé aux herbes de Provence',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      emoji: '🐟',
      ingredients: [
        { name: 'Filet de saumon', amount: '600', unit: 'g' },
        { name: 'Citron', amount: '1', unit: 'pièce' },
        { name: 'Herbes de Provence', amount: '2', unit: 'c.à.s' },
        { name: 'Brocolis', amount: '400', unit: 'g' },
        { name: 'Huile d\'olive', amount: '3', unit: 'c.à.s' },
        { name: 'Ail', amount: '2', unit: 'gousses' }
      ],
      instructions: [
        'Préchauffez le four à 200°C',
        'Badigeonnez le saumon d\'huile d\'olive',
        'Salez, poivrez et saupoudrez d\'herbes de Provence',
        'Faites cuire 15-20 minutes au four',
        'Faites cuire les brocolis à la vapeur',
        'Servez avec des quartiers de citron'
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: 'moyen' as const,
      category: 'français',
      tags: ['poisson', 'santé', 'protéines'],
      nutrition: { calories: 320, protein: 35, carbs: 8, fat: 18 },
      source: 'manual' as const
    }
  ];
}

// Fonction principale pour peupler la base de données
async function populateRecipes() {
  try {
    await connectToDatabase();
    
    // Vérifier si des recettes existent déjà
    const existingCount = await Recipe.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} recettes existent déjà. Voulez-vous continuer ?`);
      // Pour l'instant, on continue
    }

    let totalAdded = 0;

    // Essayer de récupérer des recettes depuis Spoonacular
    if (SPOONACULAR_API_KEY) {
      console.log('Récupération des recettes depuis Spoonacular...');
      
      for (let i = 0; i < 5; i++) { // 5 pages de 20 recettes = 100 recettes
        const recipes = await fetchRecipesFromSpoonacular(i * 20, 20);
        
        for (const recipe of recipes) {
          try {
            const details = await fetchRecipeDetails(recipe.id);
            const transformedRecipe = transformSpoonacularRecipe(recipe, details);
            
            // Vérifier si la recette existe déjà
            const existing = await Recipe.findOne({ externalId: recipe.id.toString() });
            if (!existing) {
              const newRecipe = new Recipe(transformedRecipe);
              await newRecipe.save();
              totalAdded++;
              console.log(`Recette ajoutée: ${transformedRecipe.title}`);
            }
          } catch (error) {
            console.error(`Erreur lors de l'ajout de la recette ${recipe.id}:`, error);
          }
        }
        
        // Pause entre les requêtes pour éviter de dépasser les limites de l'API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      console.log('Clé API Spoonacular manquante, création de recettes manuelles...');
    }

    // Ajouter des recettes manuelles pour compléter
    const manualRecipes = createManualRecipes();
    for (const recipeData of manualRecipes) {
      const existing = await Recipe.findOne({ title: recipeData.title });
      if (!existing) {
        const newRecipe = new Recipe(recipeData);
        await newRecipe.save();
        totalAdded++;
        console.log(`Recette manuelle ajoutée: ${recipeData.title}`);
      }
    }

    console.log(`\n✅ Population terminée ! ${totalAdded} nouvelles recettes ajoutées.`);
    console.log(`Total de recettes dans la base: ${await Recipe.countDocuments()}`);

  } catch (error) {
    console.error('Erreur lors de la population des recettes:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  populateRecipes().then(() => {
    console.log('Script terminé');
    process.exit(0);
  }).catch((error) => {
    console.error('Erreur:', error);
    process.exit(1);
  });
}

export default populateRecipes;
