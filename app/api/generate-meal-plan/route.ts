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

Return ONLY valid JSON with this structure:
{
  "monday": {
    "morning": { "name": "Meal name", "ingredients": ["ingredient1", "ingredient2"], "time": "X min" },
    "noon": { "name": "Meal name", "ingredients": ["ingredient1", "ingredient2"], "time": "X min" },
    "evening": { "name": "Meal name", "ingredients": ["ingredient1", "ingredient2"], "time": "X min" }
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}

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
            content: 'You are an expert nutritionist assistant specialized in food allergy management. You MUST ABSOLUTELY respect the allergies and foods to avoid mentioned. You respond ONLY with valid JSON, without additional text. NEVER allergenic ingredients in meals.'
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
      budget: 'moyen',
      cookingTime: 'moyen',
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function generateFallbackMealPlan(preferences: any) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['morning', 'noon', 'evening'];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mealPlan: any = {};
  
  days.forEach(day => {
    mealPlan[day] = {};
    meals.forEach(meal => {
      mealPlan[day][meal] = {
        name: `${meal} meal - ${day}`,
        ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
        time: '30 min'
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

Return ONLY valid JSON with this structure:
{
  "monday": {
    "morning": { "name": "Meal name", "ingredients": ["ingredient1", "ingredient2"], "time": "X min" },
    "noon": { "name": "Meal name", "ingredients": ["ingredient1", "ingredient2"], "time": "X min" },
    "evening": { "name": "Meal name", "ingredients": ["ingredient1", "ingredient2"], "time": "X min" }
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
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
            content: 'You are an expert nutritionist assistant specialized in food allergy management. You MUST ABSOLUTELY respect the allergies and foods to avoid mentioned. You respond ONLY with valid JSON, without additional text. NEVER allergenic ingredients in meals.'
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
