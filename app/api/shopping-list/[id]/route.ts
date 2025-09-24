import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ShoppingItem from '@/models/ShoppingList';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// PUT - Mettre à jour un article (toggle completed, modifier, etc.)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { name, category, quantity, isCompleted } = await req.json();

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier que l'article appartient à l'utilisateur
    const resolvedParams = await params;
    const item = await ShoppingItem.findOne({ _id: resolvedParams.id, userId: user._id });
    if (!item) {
      return NextResponse.json({ message: 'Article non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'article
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const updatedItem = await ShoppingItem.findByIdAndUpdate(
      resolvedParams.id, 
      updateData, 
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Article mis à jour avec succès',
      item: updatedItem
    });

  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un article
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Vérifier que l'article appartient à l'utilisateur et le supprimer
    const resolvedParams = await params;
    const deletedItem = await ShoppingItem.findOneAndDelete({ 
      _id: resolvedParams.id, 
      userId: user._id 
    });

    if (!deletedItem) {
      return NextResponse.json({ message: 'Article non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Article supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression article:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
