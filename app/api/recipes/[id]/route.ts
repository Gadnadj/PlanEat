import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

// GET - Récupérer une recette par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const recipe = await Recipe.findById(params.id);

    if (!recipe) {
      return NextResponse.json({ message: 'Recette non trouvée' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      recipe
    });

  } catch (error) {
    console.error('Erreur récupération recette:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour une recette
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updateData = await req.json();

    await connectToDatabase();

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!updatedRecipe) {
      return NextResponse.json({ message: 'Recette non trouvée' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Recette mise à jour avec succès',
      recipe: updatedRecipe
    });

  } catch (error) {
    console.error('Erreur mise à jour recette:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une recette
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const deletedRecipe = await Recipe.findByIdAndDelete(params.id);

    if (!deletedRecipe) {
      return NextResponse.json({ message: 'Recette non trouvée' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Recette supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression recette:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
