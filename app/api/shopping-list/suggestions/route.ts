import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import IngredientHistory from '@/models/IngredientHistory';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

interface IngredientHistoryItem {
  name: string;
  category: string;
  usageCount?: number;
  lastUsedAt?: Date | string;
}

// GET - Récupérer les suggestions d'ingrédients basées sur l'historique permanent de l'utilisateur
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

    // Récupérer le paramètre de recherche
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Si pas de requête, retourner les ingrédients les plus utilisés récemment
    if (!query.trim()) {
      const recentItems = await IngredientHistory.find({ 
        userId: user._id
      })
      .select('name category')
      .sort({ lastUsedAt: -1, usageCount: -1 })
      .limit(10)
      .lean();

      return NextResponse.json({ 
        success: true, 
        suggestions: (recentItems as unknown as IngredientHistoryItem[]).map((item: IngredientHistoryItem) => ({
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1), // Capitaliser le premier caractère
          category: item.category
        }))
      });
    }

    // Recherche d'abord par nom qui commence par la requête (priorité)
    let items: IngredientHistoryItem[] = (await IngredientHistory.find({ 
      userId: user._id,
      name: { $regex: new RegExp(`^${query}`, 'i') } // Case-insensitive search
    })
    .select('name category lastUsedAt usageCount')
    .sort({ usageCount: -1, lastUsedAt: -1 }) // Trier par usage fréquent puis récent
    .limit(10)
    .lean()) as unknown as IngredientHistoryItem[];

    // Si pas assez de résultats, rechercher dans tous les noms qui contiennent la requête
    if (items.length < 10 && query.length > 0) {
      const moreItems: IngredientHistoryItem[] = (await IngredientHistory.find({ 
        userId: user._id,
        name: { $regex: new RegExp(query, 'i') }
      })
      .select('name category lastUsedAt usageCount')
      .sort({ usageCount: -1, lastUsedAt: -1 })
      .limit(10)
      .lean()) as unknown as IngredientHistoryItem[];

      // Combiner et dédupliquer par nom (garder ceux avec le plus d'usage)
      const uniqueNames = new Map<string, { name: string; category: string; usageCount: number; lastUsedAt: Date }>();
      
      [...items, ...moreItems].forEach((item: IngredientHistoryItem) => {
        const nameLower = item.name.toLowerCase();
        const existing = uniqueNames.get(nameLower);
        const itemLastUsed = new Date(item.lastUsedAt || new Date());
        const itemUsageCount = item.usageCount || 1;
        if (!existing || itemUsageCount > existing.usageCount || 
            (itemUsageCount === existing.usageCount && itemLastUsed > existing.lastUsedAt)) {
          uniqueNames.set(nameLower, {
            name: item.name,
            category: item.category,
            usageCount: itemUsageCount,
            lastUsedAt: itemLastUsed
          });
        }
      });

      items = Array.from(uniqueNames.values())
        .sort((a, b) => b.usageCount - a.usageCount || b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
        .slice(0, 10).map(item => ({ name: item.name, category: item.category }));
    }

    return NextResponse.json({ 
      success: true, 
      suggestions: items.map((item: IngredientHistoryItem) => ({
        name: item.name.charAt(0).toUpperCase() + item.name.slice(1), // Capitaliser le premier caractère
        category: item.category
      }))
    });

  } catch (error) {
    console.error('Erreur récupération suggestions:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

