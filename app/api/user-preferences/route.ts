import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Récupérer les préférences de l'utilisateur
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

    return NextResponse.json({ 
      success: true, 
      preferences: user.preferences || {
        dietType: 'omnivore',
        allergies: [],
        dislikes: [],
        numberOfPeople: 2,
        budget: 'moyen',
        cookingTime: 'moyen'
      }
    });

  } catch (error) {
    console.error('Erreur récupération préférences:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Mettre à jour les préférences de l'utilisateur
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

    const { preferences } = await req.json();

    if (!preferences) {
      return NextResponse.json({ message: 'Préférences requises' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { preferences },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Préférences mises à jour avec succès',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Erreur mise à jour préférences:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
