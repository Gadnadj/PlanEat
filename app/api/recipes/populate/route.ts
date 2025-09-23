import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getRecipeImageUrl } from '@/lib/recipeImages';

// // Configuration de l'API Spoonacular
// const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
// const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Fonction pour créer des recettes manuelles
function createManualRecipes() {
  return [
    {
      title: 'Salade Méditerranéenne',
      description: 'Une salade fraîche et colorée aux saveurs méditerranéennes',
      image: getRecipeImageUrl('Salade Méditerranéenne'),
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
      image: getRecipeImageUrl('Pâtes au Pesto'),
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
      servings: 4,
      difficulty: 'facile' as const,
      category: 'italien',
      tags: ['pâtes', 'basilic', 'végétarien'],
      nutrition: { calories: 450, protein: 18, carbs: 65, fat: 15 },
      source: 'manual' as const
    },
    {
      title: 'Honey Garlic Salmon',
      description: 'Perfectly glazed salmon with a sweet and savory honey garlic sauce, served with steamed broccoli',
      image: getRecipeImageUrl('Honey Garlic Salmon'),
      emoji: '🐟',
      ingredients: [
        { name: 'Salmon fillets', amount: '600', unit: 'g' },
        { name: 'Honey', amount: '3', unit: 'tbsp' },
        { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
        { name: 'Garlic', amount: '4', unit: 'cloves' },
        { name: 'Lemon', amount: '1', unit: 'piece' },
        { name: 'Broccoli', amount: '400', unit: 'g' },
        { name: 'Olive oil', amount: '2', unit: 'tbsp' },
        { name: 'Ginger', amount: '1', unit: 'inch' }
      ],
      instructions: [
        'Preheat oven to 200°C and line baking sheet with parchment',
        'Mix honey, soy sauce, minced garlic, and grated ginger for glaze',
        'Place salmon fillets on baking sheet and brush with glaze',
        'Bake for 12-15 minutes until salmon flakes easily',
        'Steam broccoli until tender-crisp, about 5 minutes',
        'Serve salmon with steamed broccoli and lemon wedges',
        'Drizzle any remaining glaze over the fish before serving'
      ],
      prepTime: 20,
      servings: 4,
      difficulty: 'easy' as const,
      category: 'Healthy',
      tags: ['protein-rich', 'omega-3', 'quick', 'glazed'],
      nutrition: { calories: 320, protein: 35, carbs: 12, fat: 16 },
      source: 'manual' as const
    },
    {
      title: 'Avocado Toast Supreme',
      description: 'Creamy smashed avocado on sourdough with cherry tomatoes, feta cheese, and everything bagel seasoning',
      image: getRecipeImageUrl('Avocado Toast Supreme'),
      emoji: '🥑',
      ingredients: [
        { name: 'Sourdough bread', amount: '4', unit: 'slices' },
        { name: 'Ripe avocados', amount: '2', unit: 'pieces' },
        { name: 'Cherry tomatoes', amount: '200', unit: 'g' },
        { name: 'Feta cheese', amount: '100', unit: 'g' },
        { name: 'Lime juice', amount: '2', unit: 'tbsp' },
        { name: 'Everything bagel seasoning', amount: '2', unit: 'tsp' },
        { name: 'Red pepper flakes', amount: '1/4', unit: 'tsp' },
        { name: 'Sea salt', amount: '1/2', unit: 'tsp' }
      ],
      instructions: [
        'Toast sourdough bread until golden brown and crispy',
        'Mash avocados with lime juice and sea salt until creamy',
        'Spread avocado mixture generously on each toast slice',
        'Top with halved cherry tomatoes and crumbled feta cheese',
        'Sprinkle with everything bagel seasoning and red pepper flakes',
        'Serve immediately while toast is still warm',
        'Garnish with microgreens if desired'
      ],
      prepTime: 10,
      servings: 2,
      difficulty: 'easy' as const,
      category: 'Breakfast',
      tags: ['healthy', 'vegetarian', 'quick', 'trendy'],
      nutrition: { calories: 350, protein: 12, carbs: 32, fat: 22 },
      source: 'manual' as const
    },
    {
      title: 'Chicken Teriyaki Bowl',
      description: 'Tender grilled chicken with homemade teriyaki sauce over fluffy rice with steamed vegetables',
      image: getRecipeImageUrl('Chicken Teriyaki Bowl'),
      emoji: '🍗',
      ingredients: [
        { name: 'Chicken thighs', amount: '500', unit: 'g' },
        { name: 'Jasmine rice', amount: '200', unit: 'g' },
        { name: 'Soy sauce', amount: '4', unit: 'tbsp' },
        { name: 'Mirin', amount: '3', unit: 'tbsp' },
        { name: 'Brown sugar', amount: '2', unit: 'tbsp' },
        { name: 'Broccoli', amount: '200', unit: 'g' },
        { name: 'Carrots', amount: '2', unit: 'pieces' },
        { name: 'Sesame seeds', amount: '1', unit: 'tbsp' },
        { name: 'Green onions', amount: '3', unit: 'pieces' }
      ],
      instructions: [
        'Cook jasmine rice according to package instructions',
        'Mix soy sauce, mirin, and brown sugar to make teriyaki sauce',
        'Marinate chicken thighs in half the sauce for 15 minutes',
        'Grill chicken for 6-7 minutes per side until cooked through',
        'Steam broccoli and sliced carrots until tender',
        'Slice cooked chicken and arrange over rice in bowls',
        'Top with steamed vegetables and drizzle with remaining sauce',
        'Garnish with sesame seeds and sliced green onions'
      ],
      prepTime: 35,
      servings: 4,
      difficulty: 'medium' as const,
      category: 'Asian',
      tags: ['protein-rich', 'balanced', 'comfort food', 'gluten-free'],
      nutrition: { calories: 420, protein: 28, carbs: 48, fat: 12 },
      source: 'manual' as const
    },
    {
      title: 'Mediterranean Quinoa Salad',
      description: 'Fresh quinoa salad with cucumber, tomatoes, olives, feta, and lemon herb dressing',
      image: getRecipeImageUrl('Mediterranean Quinoa Salad'),
      emoji: '🥗',
      ingredients: [
        { name: 'Quinoa', amount: '200', unit: 'g' },
        { name: 'Cucumber', amount: '2', unit: 'pieces' },
        { name: 'Cherry tomatoes', amount: '300', unit: 'g' },
        { name: 'Kalamata olives', amount: '100', unit: 'g' },
        { name: 'Feta cheese', amount: '150', unit: 'g' },
        { name: 'Red onion', amount: '1/2', unit: 'piece' },
        { name: 'Fresh parsley', amount: '30', unit: 'g' },
        { name: 'Lemon juice', amount: '3', unit: 'tbsp' },
        { name: 'Olive oil', amount: '4', unit: 'tbsp' }
      ],
      instructions: [
        'Rinse quinoa and cook according to package directions, let cool',
        'Dice cucumber and red onion, halve cherry tomatoes',
        'Crumble feta cheese and chop fresh parsley',
        'Whisk together lemon juice, olive oil, salt, and pepper',
        'Combine cooled quinoa with all vegetables in large bowl',
        'Add olives, feta cheese, and chopped parsley',
        'Toss with lemon dressing until well combined',
        'Chill for 30 minutes before serving for best flavor'
      ],
      prepTime: 25,
      servings: 4,
      difficulty: 'easy' as const,
      category: 'Mediterranean',
      tags: ['vegetarian', 'protein-rich', 'fresh', 'make-ahead'],
      nutrition: { calories: 380, protein: 14, carbs: 42, fat: 18 },
      source: 'manual' as const
    },
    {
      title: 'Beef Tacos with Lime Crema',
      description: 'Seasoned ground beef tacos with fresh toppings, avocado, and zesty lime crema',
      image: getRecipeImageUrl('Beef Tacos with Lime Crema'),
      emoji: '🌮',
      ingredients: [
        { name: 'Ground beef', amount: '500', unit: 'g' },
        { name: 'Corn tortillas', amount: '8', unit: 'pieces' },
        { name: 'White onion', amount: '1', unit: 'piece' },
        { name: 'Roma tomatoes', amount: '2', unit: 'pieces' },
        { name: 'Lettuce', amount: '1', unit: 'head' },
        { name: 'Avocado', amount: '2', unit: 'pieces' },
        { name: 'Sour cream', amount: '150', unit: 'ml' },
        { name: 'Lime', amount: '2', unit: 'pieces' },
        { name: 'Cumin', amount: '2', unit: 'tsp' },
        { name: 'Chili powder', amount: '2', unit: 'tsp' }
      ],
      instructions: [
        'Brown ground beef in large skillet over medium-high heat',
        'Add diced onion and cook until soft and translucent',
        'Season with cumin, chili powder, salt, and pepper',
        'Warm corn tortillas in dry pan or microwave',
        'Mix sour cream with lime juice and zest for crema',
        'Dice tomatoes, shred lettuce, and slice avocado',
        'Assemble tacos with beef, fresh toppings, and lime crema',
        'Serve with lime wedges and hot sauce on the side'
      ],
      prepTime: 25,
      servings: 4,
      difficulty: 'easy' as const,
      category: 'Mexican',
      tags: ['protein-rich', 'family-friendly', 'customizable', 'quick'],
      nutrition: { calories: 420, protein: 26, carbs: 28, fat: 24 },
      source: 'manual' as const
    },
    {
      title: 'Creamy Mushroom Risotto',
      description: 'Rich and creamy Arborio rice with wild mushrooms, Parmesan, and fresh herbs',
      image: getRecipeImageUrl('Creamy Mushroom Risotto'),
      emoji: '🍄',
      ingredients: [
        { name: 'Arborio rice', amount: '300', unit: 'g' },
        { name: 'Mixed mushrooms', amount: '400', unit: 'g' },
        { name: 'Vegetable broth', amount: '1', unit: 'liter' },
        { name: 'White wine', amount: '150', unit: 'ml' },
        { name: 'Onion', amount: '1', unit: 'piece' },
        { name: 'Parmesan cheese', amount: '100', unit: 'g' },
        { name: 'Butter', amount: '50', unit: 'g' },
        { name: 'Olive oil', amount: '3', unit: 'tbsp' },
        { name: 'Fresh thyme', amount: '2', unit: 'tbsp' }
      ],
      instructions: [
        'Heat vegetable broth in saucepan and keep warm throughout cooking',
        'Sauté sliced mushrooms in olive oil until golden, set aside',
        'Cook finely diced onion in butter until translucent',
        'Add Arborio rice and stir for 2 minutes until coated',
        'Pour in white wine and stir until completely absorbed',
        'Add warm broth one ladle at a time, stirring constantly',
        'Continue for 18-20 minutes until rice is creamy but al dente',
        'Stir in mushrooms, Parmesan, thyme, and season before serving'
      ],
      prepTime: 45,
      servings: 4,
      difficulty: 'hard' as const,
      category: 'Italian',
      tags: ['vegetarian', 'creamy', 'comfort food', 'elegant'],
      nutrition: { calories: 420, protein: 12, carbs: 65, fat: 12 },
      source: 'manual' as const
    },
    {
      title: 'Greek Yogurt Parfait',
      description: 'Layers of creamy Greek yogurt, fresh berries, honey, and crunchy granola',
      image: getRecipeImageUrl('Greek Yogurt Parfait'),
      emoji: '🥛',
      ingredients: [
        { name: 'Greek yogurt', amount: '500', unit: 'g' },
        { name: 'Mixed berries', amount: '300', unit: 'g' },
        { name: 'Granola', amount: '100', unit: 'g' },
        { name: 'Honey', amount: '4', unit: 'tbsp' },
        { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
        { name: 'Sliced almonds', amount: '50', unit: 'g' },
        { name: 'Chia seeds', amount: '2', unit: 'tbsp' }
      ],
      instructions: [
        'Mix Greek yogurt with honey and vanilla extract until smooth',
        'Wash and prepare mixed berries (strawberries, blueberries, raspberries)',
        'Lightly toast sliced almonds in dry pan until golden',
        'Layer yogurt mixture and berries in clear glasses or bowls',
        'Add granola between layers for crunch',
        'Repeat layers until glasses are filled',
        'Top with toasted almonds and chia seeds before serving'
      ],
      prepTime: 15,
      servings: 4,
      difficulty: 'easy' as const,
      category: 'Breakfast',
      tags: ['healthy', 'protein-rich', 'probiotic', 'no-cook'],
      nutrition: { calories: 280, protein: 18, carbs: 32, fat: 8 },
      source: 'manual' as const
    },
    {
      title: 'Thai Basil Chicken',
      description: 'Spicy stir-fried chicken with Thai basil, chilies, and aromatic garlic served over jasmine rice',
      image: getRecipeImageUrl('Thai Basil Chicken'),
      emoji: '🌶️',
      ingredients: [
        { name: 'Chicken thighs', amount: '500', unit: 'g' },
        { name: 'Thai basil', amount: '50', unit: 'g' },
        { name: 'Thai chilies', amount: '4', unit: 'pieces' },
        { name: 'Garlic', amount: '6', unit: 'cloves' },
        { name: 'Fish sauce', amount: '3', unit: 'tbsp' },
        { name: 'Oyster sauce', amount: '2', unit: 'tbsp' },
        { name: 'Brown sugar', amount: '1', unit: 'tbsp' },
        { name: 'Jasmine rice', amount: '200', unit: 'g' },
        { name: 'Vegetable oil', amount: '3', unit: 'tbsp' }
      ],
      instructions: [
        'Cook jasmine rice according to package instructions',
        'Cut chicken into small bite-sized pieces',
        'Mince garlic and slice Thai chilies (adjust to taste)',
        'Heat oil in wok over high heat until smoking',
        'Add garlic and chilies, stir-fry for 30 seconds',
        'Add chicken and cook until no longer pink',
        'Mix fish sauce, oyster sauce, and brown sugar',
        'Add sauce and Thai basil, toss until basil wilts, serve over rice'
      ],
      prepTime: 20,
      servings: 4,
      difficulty: 'medium' as const,
      category: 'Thai',
      tags: ['spicy', 'authentic', 'quick', 'aromatic'],
      nutrition: { calories: 380, protein: 28, carbs: 42, fat: 14 },
      source: 'manual' as const
    },
    {
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade cookies with chocolate chips, crispy edges and chewy centers',
      image: getRecipeImageUrl('Chocolate Chip Cookies'),
      emoji: '🍪',
      ingredients: [
        { name: 'All-purpose flour', amount: '280', unit: 'g' },
        { name: 'Butter', amount: '150', unit: 'g' },
        { name: 'Brown sugar', amount: '120', unit: 'g' },
        { name: 'White sugar', amount: '80', unit: 'g' },
        { name: 'Large eggs', amount: '2', unit: 'pieces' },
        { name: 'Vanilla extract', amount: '2', unit: 'tsp' },
        { name: 'Chocolate chips', amount: '200', unit: 'g' },
        { name: 'Baking soda', amount: '1', unit: 'tsp' },
        { name: 'Salt', amount: '1/2', unit: 'tsp' }
      ],
      instructions: [
        'Preheat oven to 190°C and line baking sheets with parchment',
        'Cream softened butter with brown and white sugars until fluffy',
        'Beat in eggs one at a time, then add vanilla extract',
        'Mix flour, baking soda, and salt in separate bowl',
        'Gradually add dry ingredients to wet ingredients',
        'Fold in chocolate chips until evenly distributed',
        'Drop rounded spoonfuls onto prepared baking sheets',
        'Bake 9-11 minutes until edges are golden but centers still soft'
      ],
      prepTime: 30,
      servings: 8,
      difficulty: 'easy' as const,
      category: 'Dessert',
      tags: ['sweet', 'baking', 'classic', 'family-friendly'],
      nutrition: { calories: 320, protein: 4, carbs: 45, fat: 14 },
      source: 'manual' as const
    },
    {
      title: 'Caesar Salad with Grilled Chicken',
      description: 'Crisp romaine lettuce with homemade Caesar dressing, parmesan, croutons, and grilled chicken',
      image: getRecipeImageUrl('Caesar Salad with Grilled Chicken'),
      emoji: '🥬',
      ingredients: [
        { name: 'Romaine lettuce', amount: '2', unit: 'heads' },
        { name: 'Chicken breasts', amount: '400', unit: 'g' },
        { name: 'Parmesan cheese', amount: '100', unit: 'g' },
        { name: 'Bread cubes', amount: '150', unit: 'g' },
        { name: 'Mayonnaise', amount: '80', unit: 'ml' },
        { name: 'Lemon juice', amount: '3', unit: 'tbsp' },
        { name: 'Garlic', amount: '3', unit: 'cloves' },
        { name: 'Worcestershire sauce', amount: '1', unit: 'tsp' },
        { name: 'Anchovy paste', amount: '1', unit: 'tsp' }
      ],
      instructions: [
        'Season and grill chicken breasts until cooked through, let rest',
        'Make croutons by toasting bread cubes with olive oil until golden',
        'Wash and chop romaine lettuce into bite-sized pieces',
        'Whisk mayonnaise, lemon juice, minced garlic, and anchovy paste',
        'Add Worcestershire sauce to dressing and mix well',
        'Slice grilled chicken into strips',
        'Toss lettuce with dressing until well coated',
        'Top with chicken, Parmesan shavings, and croutons before serving'
      ],
      prepTime: 25,
      servings: 4,
      difficulty: 'medium' as const,
      category: 'Salad',
      tags: ['protein-rich', 'classic', 'fresh', 'complete-meal'],
      nutrition: { calories: 380, protein: 32, carbs: 18, fat: 22 },
      source: 'manual' as const
    }
  ];
}

// POST - Peupler la base de données avec des recettes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  try {
    console.log('Début de la population des recettes...');
    
    await connectToDatabase();
    
    // Vérifier si des recettes existent déjà
    const existingCount = await Recipe.countDocuments();
    console.log(`${existingCount} recettes existent déjà.`);
    
    let totalAdded = 0;

        // Ajouter des recettes manuelles (sans userId = recettes du développeur)
        const manualRecipes = createManualRecipes();
        for (const recipeData of manualRecipes) {
          const existing = await Recipe.findOne({ title: recipeData.title });
          if (!existing) {
            const newRecipe = new Recipe({
              ...recipeData,
              userId: undefined // Recettes du développeur
            });
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
