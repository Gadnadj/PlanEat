import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

// POST - Créer une recette publique (sans userId)
export async function POST(req: Request) {
  try {
    const recipeData = await req.json();

    await connectToDatabase();

    // Créer la recette sans userId (publique)
    const newRecipe = new Recipe({
      ...recipeData,
      userId: undefined // Explicitement undefined pour les recettes publiques
    });
    await newRecipe.save();

    // Convertir manuellement l'_id en id
    const recipeResponse = {
      ...newRecipe.toObject(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (newRecipe._id as any).toString()
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (recipeResponse as any)._id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (recipeResponse as any).__v;

    return NextResponse.json({
      success: true,
      message: 'Recette publique créée avec succès',
      recipe: recipeResponse
    });

  } catch (error) {
    console.error('Erreur création recette publique:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
