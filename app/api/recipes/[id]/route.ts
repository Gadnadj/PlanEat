import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log('Token invalide, accès aux recettes publiques uniquement');
      }
    }

    await connectToDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolvedParams = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = { _id: resolvedParams.id };
    
    if (userId) {
      filters.$or = [
        { userId: { $exists: false } },
        { userId: null },
        { userId: userId }
      ];
    } else {
      filters.$or = [
        { userId: { $exists: false } },
        { userId: null }
      ];
    }

    const recipe = await Recipe.findOne(filters);

    if (!recipe) {
      return NextResponse.json({ message: 'Recette non trouvée ou accès non autorisé' }, { status: 404 });
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const updateData = await req.json();

    await connectToDatabase();

    const resolvedParams = await params;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      resolvedParams.id,
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const deletedRecipe = await Recipe.findByIdAndDelete(resolvedParams.id);

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
