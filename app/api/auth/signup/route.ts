import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, isValidEmail, isValidPassword, isValidName, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Parse des données de la requête
    const { email, password, name } = await request.json();

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
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

    // Validation du mot de passe
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }

    // Validation du nom
    const nameValidation = isValidName(name);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false, message: nameValidation.message },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer le nouvel utilisateur
    const user = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim()
    });

    await user.save();

    // Générer un token JWT
    const token = generateToken(user._id.toString());

    // Retourner la réponse sans le mot de passe
    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        },
        token
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Gestion des erreurs de validation Mongoose
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
