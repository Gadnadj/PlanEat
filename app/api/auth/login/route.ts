import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, isValidEmail, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Parse des données de la requête
    const { email, password } = await request.json();

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Générer un token JWT
    const token = generateToken(user._id.toString());

    // Retourner la réponse avec les informations utilisateur
    return NextResponse.json(
      {
        success: true,
        message: 'Connexion réussie',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        },
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
