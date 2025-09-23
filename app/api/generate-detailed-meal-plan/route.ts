import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { preferences } = await req.json();

    if (!preferences) {
      return NextResponse.json({ message: 'Préférences manquantes' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ message: 'Clé API OpenAI manquante' }, { status: 500 });
    }

    // Construire le prompt pour ChatGPT
    const allergiesText = preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'Aucune';
    const dislikesText = preferences.dislikes.length > 0 ? preferences.dislikes.join(', ') : 'Aucun';
    
    const prompt = `Crée un plan de repas hebdomadaire en JSON avec ces préférences :

Régime : ${preferences.dietType}
Personnes : ${preferences.numberOfPeople}
Budget : ${preferences.budget}
Temps : ${preferences.cookingTime}
Allergies : ${allergiesText}
À éviter : ${dislikesText}

RÈGLES :
- Évite les aliments allergènes
- Respecte le régime choisi
- JSON valide uniquement

Structure JSON (exemple pour 2 jours) :
{
  "lundi": {
    "matin": {
      "nom": "Smoothie vert",
      "description": "Smoothie riche en vitamines",
      "emoji": "🥤",
      "ingredients": [{"name": "épinards", "amount": "100", "unit": "g"}],
      "instructions": ["Mixer les ingrédients"],
      "temps": "5 min",
      "servings": 1,
      "difficulty": "facile",
      "category": "Boisson",
      "tags": ["vegan"],
      "nutrition": {"calories": 150, "protein": 5, "carbs": 20, "fat": 2}
    },
    "midi": {
      "nom": "Salade quinoa",
      "description": "Salade complète et nutritive",
      "emoji": "🥗",
      "ingredients": [{"name": "quinoa", "amount": "200", "unit": "g"}],
      "instructions": ["Cuire le quinoa", "Ajouter les légumes"],
      "temps": "20 min",
      "servings": 2,
      "difficulty": "facile",
      "category": "Plat principal",
      "tags": ["vegan"],
      "nutrition": {"calories": 300, "protein": 12, "carbs": 45, "fat": 8}
    },
    "soir": {
      "nom": "Curry légumes",
      "description": "Curry réconfortant aux légumes",
      "emoji": "🍛",
      "ingredients": [{"name": "légumes", "amount": "500", "unit": "g"}],
      "instructions": ["Faire revenir les légumes", "Ajouter les épices"],
      "temps": "30 min",
      "servings": 2,
      "difficulty": "moyen",
      "category": "Plat principal",
      "tags": ["vegan"],
      "nutrition": {"calories": 250, "protein": 8, "carbs": 35, "fat": 10}
    }
  },
  "mardi": {
    "matin": {
      "nom": "Porridge avoine",
      "description": "Porridge crémeux aux fruits",
      "emoji": "🥣",
      "ingredients": [{"name": "flocons avoine", "amount": "80", "unit": "g"}],
      "instructions": ["Cuire les flocons", "Ajouter les fruits"],
      "temps": "10 min",
      "servings": 1,
      "difficulty": "facile",
      "category": "Petit déjeuner",
      "tags": ["vegan"],
      "nutrition": {"calories": 200, "protein": 8, "carbs": 35, "fat": 4}
    },
    "midi": {
      "nom": "Wrap végétarien",
      "description": "Wrap frais et coloré",
      "emoji": "🌯",
      "ingredients": [{"name": "tortilla", "amount": "2", "unit": "pièces"}],
      "instructions": ["Garnir la tortilla", "Rouler et servir"],
      "temps": "15 min",
      "servings": 2,
      "difficulty": "facile",
      "category": "Plat principal",
      "tags": ["vegan"],
      "nutrition": {"calories": 400, "protein": 15, "carbs": 50, "fat": 12}
    },
    "soir": {
      "nom": "Pâtes aux légumes",
      "description": "Pâtes crémeuses aux légumes",
      "emoji": "🍝",
      "ingredients": [{"name": "pâtes", "amount": "300", "unit": "g"}],
      "instructions": ["Cuire les pâtes", "Préparer la sauce"],
      "temps": "25 min",
      "servings": 2,
      "difficulty": "facile",
      "category": "Plat principal",
      "tags": ["vegan"],
      "nutrition": {"calories": 450, "protein": 18, "carbs": 70, "fat": 8}
    }
  }
}

Génère un JSON complet pour les 7 jours de la semaine.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en nutrition et planification de repas. Tu génères des plans de repas détaillés et personnalisés en JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur OpenAI:', errorData);
      return NextResponse.json({ message: 'Erreur lors de la génération du plan' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Nettoyer le contenu pour extraire le JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Aucun JSON trouvé dans la réponse:', content);
      return NextResponse.json({ message: 'Format de réponse invalide' }, { status: 500 });
    }

    try {
      // Nettoyer le JSON avant de le parser
      let jsonString = jsonMatch[0];
      
      // Supprimer les caractères de contrôle et les caractères non-ASCII problématiques
      jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
      
      // Remplacer les guillemets intelligents par des guillemets normaux
      jsonString = jsonString.replace(/[""]/g, '"');
      jsonString = jsonString.replace(/['']/g, "'");
      
      // Corriger les virgules en fin de ligne
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      // Vérifier et corriger les accolades manquantes
      const openBraces = (jsonString.match(/\{/g) || []).length;
      const closeBraces = (jsonString.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        // Ajouter les accolades fermantes manquantes
        const missingBraces = openBraces - closeBraces;
        jsonString += '}'.repeat(missingBraces);
      }
      
      // Vérifier que le JSON se termine correctement
      if (!jsonString.trim().endsWith('}')) {
        jsonString = jsonString.trim() + '}';
      }
      
      // Nettoyer les virgules en fin de ligne dans les objets
      jsonString = jsonString.replace(/,(\s*})/g, '$1');
      
      // Corriger les virgules manquantes entre les propriétés
      jsonString = jsonString.replace(/"(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*":/g, ',"$2":');
      jsonString = jsonString.replace(/{\s*"([a-zA-Z_][a-zA-Z0-9_]*)\s*":/g, '{"$1":');
      
      // Supprimer les virgules en début de ligne
      jsonString = jsonString.replace(/,\s*{/g, '{');
      
      const mealPlan = JSON.parse(jsonString);
      
      // Valider que c'est bien un objet avec des jours
      if (!mealPlan || typeof mealPlan !== 'object' || !mealPlan.lundi) {
        throw new Error('Structure de planning invalide');
      }
      
      return NextResponse.json({
        success: true,
        mealPlan
      });
      
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError);
      console.error('JSON problématique:', jsonMatch[0]);
      
      // Fallback: utiliser l'API simple si le parsing échoue
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
      const fallbackResponse = await fetch(`${baseUrl}/api/generate-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return NextResponse.json({
          success: true,
          mealPlan: fallbackData.mealPlan,
          message: 'Planning généré avec format simplifié'
        });
      }
      
      return NextResponse.json({ message: 'Erreur de génération du planning' }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur génération plan détaillé:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
