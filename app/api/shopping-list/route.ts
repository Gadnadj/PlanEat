import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ShoppingItem from '@/models/ShoppingList';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Récupérer tous les articles de l'utilisateur
export async function GET(req: Request) {
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

    // Récupérer tous les articles de l'utilisateur
    const items = await ShoppingItem.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      items
    });

  } catch (error) {
    console.error('Erreur récupération articles:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un nouvel article
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

    const { name, category, quantity } = await req.json();

    if (!name || !category) {
      return NextResponse.json({ message: 'Nom et catégorie requis' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Créer un nouvel article
    const newItem = new ShoppingItem({
      userId: user._id,
      name,
      category,
      quantity
    });

    await newItem.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Article ajouté avec succès',
      item: newItem
    });

  } catch (error) {
    console.error('Erreur création article:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer tous les articles de l'utilisateur
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

    // Supprimer tous les articles de l'utilisateur
    await ShoppingItem.deleteMany({ userId: user._id });

    return NextResponse.json({ 
      success: true, 
      message: 'Tous les articles ont été supprimés'
    });

  } catch (error) {
    console.error('Erreur suppression articles:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
