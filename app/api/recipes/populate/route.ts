import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

// Configuration de l'API Spoonacular
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Fonction pour créer des recettes manuelles
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

// POST - Peupler la base de données avec des recettes
export async function POST(req: Request) {
  try {
    console.log('Début de la population des recettes...');
    
    await connectToDatabase();
    
    // Vérifier si des recettes existent déjà
    const existingCount = await Recipe.countDocuments();
    console.log(`${existingCount} recettes existent déjà.`);
    
    let totalAdded = 0;

    // Ajouter des recettes manuelles
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

    return NextResponse.json({
      success: true,
      message: `Population des recettes terminée avec succès. ${totalAdded} nouvelles recettes ajoutées.`,
      totalRecipes: await Recipe.countDocuments()
    });

  } catch (error) {
    console.error('Erreur lors de la population des recettes:', error);
    return NextResponse.json({ 
      message: 'Erreur lors de la population des recettes',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
