import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Récupérer le planning de l'utilisateur
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

    // Récupérer le planning le plus récent de l'utilisateur
    const mealPlan = await MealPlan.findOne({ userId: user._id })
      .sort({ createdAt: -1 });

    if (!mealPlan) {
      return NextResponse.json({ message: 'Aucun planning trouvé' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      mealPlan: mealPlan.mealPlan,
      preferences: mealPlan.preferences
    });

  } catch (error) {
    console.error('Erreur récupération planning:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Sauvegarder un nouveau planning
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

    const { preferences, mealPlan } = await req.json();

    if (!preferences || !mealPlan) {
      return NextResponse.json({ message: 'Préférences et plan de repas requis' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour les préférences de l'utilisateur
    await User.findByIdAndUpdate(user._id, { preferences });

    // Vérifier s'il existe déjà un planning pour cet utilisateur
    const existingMealPlan = await MealPlan.findOne({ userId: user._id });

    if (existingMealPlan) {
      // Mettre à jour le planning existant
      await MealPlan.findByIdAndUpdate(existingMealPlan._id, {
        preferences,
        mealPlan,
        updatedAt: new Date()
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Planning mis à jour avec succès',
        mealPlan
      });
    } else {
      // Créer un nouveau planning si aucun n'existe
      const newMealPlan = new MealPlan({
        userId: user._id,
        preferences,
        mealPlan
      });

      await newMealPlan.save();

      return NextResponse.json({ 
        success: true, 
        message: 'Planning créé avec succès',
        mealPlan: newMealPlan.mealPlan
      });
    }

  } catch (error) {
    console.error('Erreur sauvegarde planning:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
