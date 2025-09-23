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
    
    const prompt = `Tu es un expert en nutrition et planification de repas. Crée un plan de repas hebdomadaire personnalisé en JSON avec ces préférences :

Régime alimentaire : ${preferences.dietType}
Nombre de personnes : ${preferences.numberOfPeople}
Budget : ${preferences.budget}
Temps de cuisine : ${preferences.cookingTime}
Allergies : ${allergiesText}
Aliments à éviter : ${dislikesText}

IMPORTANT - RÈGLES STRICTES À RESPECTER :
- INTERDICTION ABSOLUE d'inclure des aliments mentionnés dans les allergies
- INTERDICTION ABSOLUE d'inclure des aliments mentionnés dans les aliments à éviter
- Vérifie chaque ingrédient pour éviter les allergènes
- Si une allergie est "fruits", n'inclure AUCUN fruit dans les repas
- Si une allergie est "noix", n'inclure AUCUNE noix, amande, noisette, etc.
- Si une allergie est "lactose", n'inclure AUCUN produit laitier
- Respecte strictement le régime alimentaire choisi

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

Assure-toi que les repas sont variés, équilibrés et respectent ABSOLUMENT les allergies et préférences alimentaires.`;

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
            content: 'Tu es un assistant nutritionniste expert spécialisé dans la gestion des allergies alimentaires. Tu dois ABSOLUMENT respecter les allergies et aliments à éviter mentionnés. Tu réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire. JAMAIS d\'ingrédients allergènes dans les repas.'
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
      
      // Valider que les allergies sont respectées
      const validationResult = validateMealPlan(mealPlan, preferences);
      if (!validationResult.isValid) {
        console.warn('Plan généré ne respecte pas les allergies:', validationResult.violations);
        // Régénérer avec un prompt plus strict
        mealPlan = await regenerateWithStricterPrompt(preferences, OPENAI_API_KEY);
      }
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

// Fonction de validation des allergies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateMealPlan(mealPlan: any, preferences: any) {
  const violations: string[] = [];
  const allergies = preferences.allergies.map((a: string) => a.toLowerCase());
  const dislikes = preferences.dislikes.map((d: string) => d.toLowerCase());
  
  // Vérifier chaque repas
  Object.keys(mealPlan).forEach(day => {
    Object.keys(mealPlan[day]).forEach(meal => {
      const ingredients = mealPlan[day][meal].ingredients || [];
      ingredients.forEach((ingredient: string) => {
        const ingredientLower = ingredient.toLowerCase();
        
        // Vérifier les allergies
        allergies.forEach((allergy: string) => {
          if (ingredientLower.includes(allergy)) {
            violations.push(`${day} ${meal}: "${ingredient}" contient l'allergène "${allergy}"`);
          }
        });
        
        // Vérifier les aliments à éviter
        dislikes.forEach((dislike: string) => {
          if (ingredientLower.includes(dislike)) {
            violations.push(`${day} ${meal}: "${ingredient}" contient l'aliment à éviter "${dislike}"`);
          }
        });
      });
    });
  });
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

// Fonction pour régénérer avec un prompt plus strict
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function regenerateWithStricterPrompt(preferences: any, apiKey: string) {
  const allergiesText = preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'Aucune';
  const dislikesText = preferences.dislikes.length > 0 ? preferences.dislikes.join(', ') : 'Aucun';
  
  const strictPrompt = `ATTENTION : Le plan précédent contenait des allergènes. Tu DOIS créer un nouveau plan en respectant ABSOLUMENT ces contraintes :

Régime alimentaire : ${preferences.dietType}
Nombre de personnes : ${preferences.numberOfPeople}
Budget : ${preferences.budget}
Temps de cuisine : ${preferences.cookingTime}
Allergies STRICTES : ${allergiesText}
Aliments à éviter STRICTS : ${dislikesText}

RÈGLES ABSOLUES :
- INTERDICTION TOTALE des aliments allergènes
- INTERDICTION TOTALE des aliments à éviter
- Vérifie chaque ingrédient individuellement
- Si allergie "fruits" → AUCUN fruit, baie, agrume, etc.
- Si allergie "noix" → AUCUNE noix, amande, noisette, pistache, etc.
- Si allergie "lactose" → AUCUN lait, fromage, yaourt, beurre, etc.

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
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant nutritionniste expert spécialisé dans la gestion des allergies alimentaires. Tu dois ABSOLUMENT respecter les allergies et aliments à éviter mentionnés. Tu réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire. JAMAIS d\'ingrédients allergènes dans les repas.'
          },
          {
            role: 'user',
            content: strictPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3, // Température plus basse pour plus de cohérence
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const mealPlanContent = data.choices[0]?.message?.content;
      if (mealPlanContent) {
        return JSON.parse(mealPlanContent);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la régénération stricte:', error);
  }
  
  // Fallback si la régénération échoue
  return generateFallbackMealPlan(preferences);
}
