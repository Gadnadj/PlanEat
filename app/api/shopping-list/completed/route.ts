import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ShoppingItem from '@/models/ShoppingList';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// DELETE - Supprimer tous les articles cochés (completed) de l'utilisateur
export async function DELETE(req: Request) {
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

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Supprimer tous les articles cochés de l'utilisateur
    const result = await ShoppingItem.deleteMany({ 
      userId: user._id,
      isCompleted: true 
    });

    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} article(s) cochés supprimé(s)`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Erreur suppression articles cochés:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

