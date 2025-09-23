import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { preferences } = await req.json();

    if (!preferences) {
      return NextResponse.json({ message: 'Missing preferences' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ message: 'Missing OpenAI API key' }, { status: 500 });
    }

    // Build prompt for ChatGPT
    const allergiesText = preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None';
    const dislikesText = preferences.dislikes.length > 0 ? preferences.dislikes.join(', ') : 'None';
    
    const prompt = `You are a nutrition and meal planning expert. Create a personalized weekly meal plan in JSON with these preferences:

Diet type: ${preferences.dietType}
Number of people: ${preferences.numberOfPeople}
Budget: ${preferences.budget}
Cooking time: ${preferences.cookingTime}
Allergies: ${allergiesText}
Foods to avoid: ${dislikesText}

IMPORTANT - STRICT RULES TO FOLLOW:
- ABSOLUTE PROHIBITION of including foods mentioned in allergies
- ABSOLUTE PROHIBITION of including foods mentioned in foods to avoid
- Check each ingredient to avoid allergens
- If allergy is "fruits", include NO fruits in meals
- If allergy is "nuts", include NO nuts, almonds, hazelnuts, etc.
- If allergy is "lactose", include NO dairy products
- Strictly respect the chosen diet type

Return ONLY valid JSON with this structure, INCLUDING PRECISE QUANTITIES for ${preferences.numberOfPeople} person(s):
{
  "monday": {
    "morning": { "name": "Meal name", "ingredients": ["200g oats", "1 banana", "2 tbsp honey"], "time": "X min" },
    "lunch": { "name": "Meal name", "ingredients": ["300g chicken breast", "150g lettuce", "2 tbsp olive oil"], "time": "X min" },
    "dinner": { "name": "Meal name", "ingredients": ["400g salmon", "200g asparagus", "1 lemon"], "time": "X min" }
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}

IMPORTANT RULES FOR QUANTITIES:
- Always include precise quantities (grams, ml, pieces, tbsp, tsp, cups)
- Scale quantities for exactly ${preferences.numberOfPeople} person(s)
- Use appropriate units: solids in grams (g), liquids in ml, spices in tsp/tbsp
- Examples: "300g chicken", "200ml milk", "2 tbsp olive oil", "1 tsp salt", "2 eggs"
Make sure meals are varied, balanced and ABSOLUTELY respect allergies and dietary preferences.`;

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
            content: 'You are an expert nutritionist assistant specialized in food allergy management. You MUST ABSOLUTELY respect the allergies and foods to avoid mentioned. You respond ONLY with valid JSON, without additional text. NEVER allergenic ingredients in meals. IMPORTANT: Generate ALL content exclusively in ENGLISH language. All meal names and ingredients must be written in English only.'
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
      throw new Error('Empty response from ChatGPT');
    }

    // Parse JSON returned by ChatGPT
    let mealPlan;
    try {
      mealPlan = JSON.parse(mealPlanContent);
      
      // Validate that allergies are respected
      const validationResult = validateMealPlan(mealPlan, preferences);
      if (!validationResult.isValid) {
        console.warn('Generated plan does not respect allergies:', validationResult.violations);
        // Regenerate with stricter prompt
        mealPlan = await regenerateWithStricterPrompt(preferences, OPENAI_API_KEY);
      }
    } catch (parseError) {
      // If parsing fails, create fallback plan
      console.error('JSON parsing error:', parseError);
      mealPlan = generateFallbackMealPlan(preferences);
    }

    // Enrich the meal plan with detailed descriptions and instructions
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const enrichResponse = await fetch(`${baseUrl}/api/enrich-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealPlan }),
      });

      if (enrichResponse.ok) {
        const enrichData = await enrichResponse.json();
        if (enrichData.success && enrichData.enrichedPlan) {
          return NextResponse.json({ 
            success: true, 
            mealPlan: enrichData.enrichedPlan 
          });
        }
      }
    } catch (enrichError) {
      console.warn('Failed to enrich meal plan, returning basic plan:', enrichError);
    }

    // Return basic plan if enrichment fails
    return NextResponse.json({ 
      success: true, 
      mealPlan 
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Meal plan generation error:', error);
    
    // In case of error, return fallback plan with default preferences
    const fallbackPlan = generateFallbackMealPlan({
      dietType: 'omnivore',
      numberOfPeople: 2,
      budget: 'medium',
      cookingTime: 'medium',
      allergies: [],
      dislikes: []
    });
    
    return NextResponse.json({ 
      success: true, 
      mealPlan: fallbackPlan,
      message: 'Plan generated with default suggestions'
    });
  }
}

// Fallback plan in case of API error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateFallbackMealPlan(preferences: any) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['morning', 'lunch', 'dinner'];
  const numberOfPeople = preferences.numberOfPeople || 2;
  
  // Scale quantities based on number of people
  const scale = (base: number) => Math.round(base * numberOfPeople);
  
  const fallbackMeals = {
    morning: [
      { name: "Oatmeal with Banana", ingredients: [`${scale(80)}g oats`, `${numberOfPeople} banana(s)`, `${scale(2)} tbsp honey`] },
      { name: "Scrambled Eggs", ingredients: [`${scale(2)} eggs`, `${scale(1)} tbsp butter`, `${scale(1)} tsp herbs`] },
      { name: "Yogurt with Granola", ingredients: [`${scale(200)}ml yogurt`, `${scale(50)}g granola`, `${scale(100)}g berries`] }
    ],
    lunch: [
      { name: "Chicken Salad", ingredients: [`${scale(150)}g chicken breast`, `${scale(100)}g lettuce`, `${scale(2)} tbsp olive oil`] },
      { name: "Vegetable Sandwich", ingredients: [`${scale(2)} slices bread`, `${numberOfPeople} avocado(s)`, `${scale(100)}g vegetables`] },
      { name: "Quinoa Bowl", ingredients: [`${scale(100)}g quinoa`, `${scale(150)}g mixed vegetables`, `${scale(2)} tbsp dressing`] }
    ],
    dinner: [
      { name: "Grilled Salmon", ingredients: [`${scale(200)}g salmon`, `${scale(150)}g asparagus`, `${numberOfPeople} lemon(s)`] },
      { name: "Pasta with Vegetables", ingredients: [`${scale(100)}g pasta`, `${scale(200)}g vegetables`, `${scale(2)} tbsp olive oil`] },
      { name: "Chicken Stir Fry", ingredients: [`${scale(150)}g chicken`, `${scale(200)}g mixed vegetables`, `${scale(100)}g rice`] }
    ]
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mealPlan: any = {};
  
  days.forEach(day => {
    mealPlan[day] = {};
    meals.forEach((meal, mealIndex) => {
      const mealOptions = fallbackMeals[meal as keyof typeof fallbackMeals];
      const selectedMeal = mealOptions[mealIndex % mealOptions.length];
      
      mealPlan[day][meal] = {
        name: selectedMeal.name,
        ingredients: selectedMeal.ingredients,
        time: meal === 'morning' ? '15 min' : meal === 'lunch' ? '25 min' : '35 min'
      };
    });
  });
  
  return mealPlan;
}

// Allergy validation function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateMealPlan(mealPlan: any, preferences: any) {
  const violations: string[] = [];
  const allergies = preferences.allergies.map((a: string) => a.toLowerCase());
  const dislikes = preferences.dislikes.map((d: string) => d.toLowerCase());
  
  // Check each meal
  Object.keys(mealPlan).forEach(day => {
    Object.keys(mealPlan[day]).forEach(meal => {
      const ingredients = mealPlan[day][meal].ingredients || [];
      ingredients.forEach((ingredient: string) => {
        const ingredientLower = ingredient.toLowerCase();
        
        // Check allergies
        allergies.forEach((allergy: string) => {
          if (ingredientLower.includes(allergy)) {
            violations.push(`${day} ${meal}: "${ingredient}" contains allergen "${allergy}"`);
          }
        });
        
        // Check foods to avoid
        dislikes.forEach((dislike: string) => {
          if (ingredientLower.includes(dislike)) {
            violations.push(`${day} ${meal}: "${ingredient}" contains food to avoid "${dislike}"`);
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

// Function to regenerate with stricter prompt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function regenerateWithStricterPrompt(preferences: any, apiKey: string) {
  const allergiesText = preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None';
  const dislikesText = preferences.dislikes.length > 0 ? preferences.dislikes.join(', ') : 'None';
  
  const strictPrompt = `WARNING: The previous plan contained allergens. You MUST create a new plan ABSOLUTELY respecting these constraints:

Diet type: ${preferences.dietType}
Number of people: ${preferences.numberOfPeople}
Budget: ${preferences.budget}
Cooking time: ${preferences.cookingTime}
STRICT Allergies: ${allergiesText}
STRICT Foods to avoid: ${dislikesText}

ABSOLUTE RULES:
- TOTAL PROHIBITION of allergenic foods
- TOTAL PROHIBITION of foods to avoid
- Check each ingredient individually
- If allergy "fruits" → NO fruits, berries, citrus, etc.
- If allergy "nuts" → NO nuts, almonds, hazelnuts, pistachios, etc.
- If allergy "lactose" → NO milk, cheese, yogurt, butter, etc.

Return ONLY valid JSON with this structure, INCLUDING PRECISE QUANTITIES for ${preferences.numberOfPeople} person(s):
{
  "monday": {
    "morning": { "name": "Meal name", "ingredients": ["200g oats", "1 banana", "2 tbsp honey"], "time": "X min" },
    "lunch": { "name": "Meal name", "ingredients": ["300g chicken breast", "150g lettuce", "2 tbsp olive oil"], "time": "X min" },
    "dinner": { "name": "Meal name", "ingredients": ["400g salmon", "200g asparagus", "1 lemon"], "time": "X min" }
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}

IMPORTANT: Always include precise quantities (grams, ml, pieces, tbsp, tsp) scaled for ${preferences.numberOfPeople} person(s).`;

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
            content: 'You are an expert nutritionist assistant specialized in food allergy management. You MUST ABSOLUTELY respect the allergies and foods to avoid mentioned. You respond ONLY with valid JSON, without additional text. NEVER allergenic ingredients in meals. IMPORTANT: Generate ALL content exclusively in ENGLISH language. All meal names and ingredients must be written in English only.'
          },
          {
            role: 'user',
            content: strictPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistency
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
    console.error('Error during strict regeneration:', error);
  }
  
  // Fallback if regeneration fails
  return generateFallbackMealPlan(preferences);
}
