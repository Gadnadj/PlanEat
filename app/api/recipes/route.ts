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
    const prepTime = searchParams.get('prepTime');
    const tags = searchParams.get('tags');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Vérifier l'authentification pour filtrer les recettes
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
        console.log('Token invalide, affichage des recettes publiques uniquement');
      }
    }

    await connectToDatabase();

    // Construire les filtres
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    
    // Filtre principal : recettes publiques (sans userId) OU recettes de l'utilisateur connecté
    console.log('Building filter for userId:', userId, 'type:', typeof userId);
    const userFilter = userId ? [
      { userId: { $exists: false } }, // Recettes publiques (développeur)
      { userId: null }, // Recettes publiques (développeur)  
      { userId: { $eq: userId } } // Recettes de l'utilisateur connecté
    ] : [
      { userId: { $exists: false } },
      { userId: null }
    ];
    
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    
    // SOLUTION ALTERNATIVE: Appliquer le filtre différemment
    if (userId) {
      // Construire l'objet de tri
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortObj: any = {};
      if (sortBy === 'createdAt') {
        sortObj.createdAt = sortOrder === 'desc' ? -1 : 1;
      } else if (sortBy === 'title') {
        sortObj.title = sortOrder === 'desc' ? -1 : 1;
      } else if (sortBy === 'prepTime') {
        sortObj.prepTime = sortOrder === 'desc' ? -1 : 1;
      } else {
        sortObj.createdAt = -1; // Par défaut
      }
      
      // Construire le filtre prepTime
      let prepTimeFilter = {};
      if (prepTime) {
        switch (prepTime) {
          case 'Moins de 15 min':
            prepTimeFilter = { prepTime: { $lt: 15 } };
            break;
          case '15-30 min':
            prepTimeFilter = { prepTime: { $gte: 15, $lte: 30 } };
            break;
          case '30-60 min':
            prepTimeFilter = { prepTime: { $gte: 30, $lte: 60 } };
            break;
          case 'Plus de 1 heure':
            prepTimeFilter = { prepTime: { $gt: 60 } };
            break;
        }
      }

      // Pour utilisateur connecté: récupérer recettes publiques ET recettes utilisateur séparément
      const publicRecipes = await Recipe.find({
        $or: [
          { userId: { $exists: false } },
          { userId: null }
        ],
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(search && {
          title: { $regex: search, $options: 'i' }
        }),
        ...prepTimeFilter
      }).sort(sortObj);
      
      const userRecipes = await Recipe.find({
        userId: userId,
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(search && {
          title: { $regex: search, $options: 'i' }
        }),
        ...prepTimeFilter
      }).sort(sortObj);
      
      // Combiner et trier - mettre les recettes utilisateur en premier
      let allRecipes = [...userRecipes, ...publicRecipes];
      if (sortBy === 'difficulty') {
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        allRecipes = allRecipes.sort((a, b) => {
          const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
          const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
          return sortOrder === 'desc' ? orderB - orderA : orderA - orderB;
        });
      }
      
      // Appliquer pagination
      const total = allRecipes.length;
      const skip = (page - 1) * limit;
      const recipes = allRecipes.slice(skip, skip + limit);
      
      
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
    } else {
      // Pour utilisateur non connecté: filtre simple
      filters.$or = [
        { userId: { $exists: false } },
        { userId: null }
      ];
    }
    
    // Gérer la recherche avec les filtres utilisateur (pour utilisateur non connecté)
    if (search && !userId) {
      // Recherche uniquement dans le titre
      filters.title = { $regex: search, $options: 'i' };
      filters.$or = userFilter;
    } else if (!userId) {
      filters.$or = userFilter;
    }
    
    // Filtre par temps de préparation
    if (prepTime) {
      switch (prepTime) {
        case 'Moins de 15 min':
          filters.prepTime = { $lt: 15 };
          break;
        case '15-30 min':
          filters.prepTime = { $gte: 15, $lte: 30 };
          break;
        case '30-60 min':
          filters.prepTime = { $gte: 30, $lte: 60 };
          break;
        case 'Plus de 1 heure':
          filters.prepTime = { $gt: 60 };
          break;
      }
    }
    
    // Filtre par tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filters.tags = { $in: tagArray };
    }

    // Construire l'ordre de tri
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    
    // Gérer le tri par calories (qui est dans nutrition.calories)
    if (sortBy === 'calories') {
      sort['nutrition.calories'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'difficulty') {
      // Tri personnalisé pour la difficulté : easy < medium < hard
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
      sort.difficulty = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Calculer la pagination
    const skip = (page - 1) * limit;
    
    console.log('Final MongoDB filters:', JSON.stringify(filters, null, 2));

    // Récupérer les recettes
    let recipes = await Recipe.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    console.log('MongoDB found recipes:', recipes.map(r => ({ title: r.title, userId: r.userId })));
    
    // Test direct: chercher toutes les recettes avec cet userId spécifique
    if (userId) {
      const directTest = await Recipe.find({ userId: userId }).limit(5);
      console.log('Direct search for userId:', userId, 'found:', directTest.map(r => ({ title: r.title, userId: r.userId })));
      
      // Test du filtre $or en isolation
      const orTest = await Recipe.find({ $or: userFilter }).limit(20);
      console.log('OR filter test found:', orTest.length, 'recipes');
      console.log('OR filter user recipes:', orTest.filter(r => r.userId === userId).map(r => ({ title: r.title, userId: r.userId })));
    }

    // Tri personnalisé pour la difficulté si nécessaire
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
      recipes = recipes.sort((a, b) => {
        const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
        const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
        return sortOrder === 'desc' ? orderB - orderA : orderA - orderB;
      });
    }

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

    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token d\'authentification requis' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    

    await connectToDatabase();

    // Vérifier que l'userId est valide
    if (!userId) {
      console.error('userId est undefined ou null:', { decoded, userId });
      return NextResponse.json({ message: 'Erreur d\'authentification: userId manquant' }, { status: 401 });
    }

    // Créer la recette avec l'userId
    const newRecipe = new Recipe({
      ...recipeData,
      userId: userId
    });
    await newRecipe.save();

    // Convertir manuellement l'_id en id et s'assurer que userId est inclus
    const recipeResponse = {
      ...newRecipe.toObject(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (newRecipe._id as any).toString()
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (recipeResponse as any)._id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (recipeResponse as any).__v;

    return NextResponse.json({
      success: true,
      message: 'Recette créée avec succès',
      recipe: recipeResponse
    });

  } catch (error) {
    console.error('Erreur création recette:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour une recette
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token d\'authentification requis' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectToDatabase();

    // Vérifier que la recette existe et appartient à l'utilisateur
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ message: 'Recette non trouvée' }, { status: 404 });
    }

    if (recipe.userId !== userId) {
      return NextResponse.json({ message: 'Vous ne pouvez pas modifier cette recette' }, { status: 403 });
    }

    // Mettre à jour la recette
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, { new: true });

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
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID de recette requis' }, { status: 400 });
    }

    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token d\'authentification requis' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectToDatabase();

    // Vérifier que la recette existe et appartient à l'utilisateur
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ message: 'Recette non trouvée' }, { status: 404 });
    }

    if (recipe.userId !== userId) {
      return NextResponse.json({ message: 'Vous ne pouvez pas supprimer cette recette' }, { status: 403 });
    }

    // Supprimer la recette
    await Recipe.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Recette supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression recette:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
