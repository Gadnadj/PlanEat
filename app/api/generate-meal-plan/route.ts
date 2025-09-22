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
    const prompt = `Tu es un expert en nutrition et planification de repas. Crée un plan de repas hebdomadaire personnalisé en JSON avec ces préférences :

Régime alimentaire : ${preferences.dietType}
Nombre de personnes : ${preferences.numberOfPeople}
Budget : ${preferences.budget}
Temps de cuisine : ${preferences.cookingTime}
Allergies : ${preferences.allergies.join(', ') || 'Aucune'}
Aliments à éviter : ${preferences.dislikes.join(', ') || 'Aucun'}

Retourne UNIQUEMENT un JSON valide avec cette structure :
{
  "lundi": {
    "matin": { "nom": "Nom du repas", "ingredients": ["ingredient1", "ingredient2"], "temps": "X min" },
    "midi": { "nom": "Nom du repas", "ingredients": ["ingredient1", "ingredient2"], "temps": "X min" },
    "soir": { "nom": "Nom du repas", "ingredients": ["ingredient1", "ingredient2"], "temps": "X min" }
  },
  "mardi": { ... },
  "mercredi": { ... },
  "jeudi": { ... },
  "vendredi": { ... },
  "samedi": { ... },
  "dimanche": { ... }
}

Assure-toi que les repas sont variés, équilibrés et respectent les préférences alimentaires.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant nutritionniste expert. Tu réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const mealPlanContent = data.choices[0]?.message?.content;

    if (!mealPlanContent) {
      throw new Error('Réponse vide de ChatGPT');
    }

    // Parser le JSON retourné par ChatGPT
    let mealPlan;
    try {
      mealPlan = JSON.parse(mealPlanContent);
    } catch (parseError) {
      // Si le parsing échoue, créer un plan de fallback
      console.error('Erreur de parsing JSON:', parseError);
      mealPlan = generateFallbackMealPlan(preferences);
    }

    return NextResponse.json({ 
      success: true, 
      mealPlan 
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erreur génération plan repas:', error);
    
    // En cas d'erreur, retourner un plan de fallback avec des préférences par défaut
    const fallbackPlan = generateFallbackMealPlan({
      dietType: 'omnivore',
      numberOfPeople: 2,
      budget: 'moyen',
      cookingTime: 'moyen',
      allergies: [],
      dislikes: []
    });
    
    return NextResponse.json({ 
      success: true, 
      mealPlan: fallbackPlan,
      message: 'Plan généré avec des suggestions par défaut'
    });
  }
}

// Plan de fallback en cas d'erreur API
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function generateFallbackMealPlan(preferences: any) {
  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const meals = ['matin', 'midi', 'soir'];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mealPlan: any = {};
  
  days.forEach(day => {
    mealPlan[day] = {};
    meals.forEach(meal => {
      mealPlan[day][meal] = {
        nom: `Repas ${meal} - ${day}`,
        ingredients: ['Ingrédient 1', 'Ingrédient 2', 'Ingrédient 3'],
        temps: '30 min'
      };
    });
  });
  
  return mealPlan;
}
