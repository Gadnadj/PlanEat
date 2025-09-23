import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';
import Recipe from '@/models/Recipe';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// POST - Ajouter une recette au planning
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Token d\'authentification manquant' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }

    const { recipeId, day, meal } = await req.json();

    if (!recipeId || !day || !meal) {
      return NextResponse.json({ message: 'recipeId, day et meal sont requis' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier que la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ message: 'Recette non trouvée' }, { status: 404 });
    }

    // Récupérer le planning de l'utilisateur
    let mealPlan = await MealPlan.findOne({ userId: user._id });
    
    if (!mealPlan) {
      // Si aucun planning n'existe, retourner une erreur
      return NextResponse.json({ 
        message: 'Aucun planning trouvé. Veuillez d\'abord générer un planning avec l\'IA.' 
      }, { status: 404 });
    }

    // Vérifier que le jour et le moment sont valides
    const validDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const validMeals = ['matin', 'midi', 'soir'];

    if (!validDays.includes(day) || !validMeals.includes(meal)) {
      return NextResponse.json({ message: 'Jour ou moment invalide' }, { status: 400 });
    }

    // Modifier la recette dans le planning
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mealPlan.mealPlan as any)[day][meal] = {
      nom: recipe.title,
      ingredients: recipe.ingredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`),
      temps: `${recipe.prepTime}min`,
      emoji: recipe.emoji
    };

    // Marquer le champ comme modifié pour forcer la sauvegarde
    mealPlan.markModified('mealPlan');
    await mealPlan.save();

    return NextResponse.json({
      success: true,
      message: 'Recette ajoutée au planning avec succès',
      mealPlan
    });

  } catch (error) {
    console.error('Erreur ajout recette au planning:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
