import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

// GET - Récupérer toutes les recettes avec filtres
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    await connectToDatabase();

    // Construire les filtres
    const filters: any = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (search) {
      filters.$text = { $search: search };
    }

    // Construire l'ordre de tri
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculer la pagination
    const skip = (page - 1) * limit;

    // Récupérer les recettes
    const recipes = await Recipe.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Compter le total pour la pagination
    const total = await Recipe.countDocuments(filters);

    return NextResponse.json({
      success: true,
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération recettes:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer une nouvelle recette
export async function POST(req: Request) {
  try {
    const recipeData = await req.json();

    await connectToDatabase();

    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();

    return NextResponse.json({
      success: true,
      message: 'Recette créée avec succès',
      recipe: newRecipe
    });

  } catch (error) {
    console.error('Erreur création recette:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
