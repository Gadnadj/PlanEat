import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mealPlan } = await req.json();

    if (!mealPlan) {
      return NextResponse.json({ message: 'Missing meal plan' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ message: 'Missing OpenAI API key' }, { status: 500 });
    }

    // Extract all meals from the meal plan
    const allMeals: Array<{
      day: string;
      mealTime: string;
      name: string;
      ingredients: string[];
      time: string;
    }> = [];
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealTimes = ['morning', 'lunch', 'dinner'];

    for (const day of daysOfWeek) {
      if (mealPlan[day]) {
        for (const mealTime of mealTimes) {
          const meal = mealPlan[day][mealTime];
          if (meal && meal.name) {
            allMeals.push({
              day,
              mealTime,
              name: meal.name,
              ingredients: meal.ingredients || [],
              time: meal.time || meal.temps || '30 min'
            });
          }
        }
      }
    }

    if (allMeals.length === 0) {
      return NextResponse.json({ 
        success: true, 
        enrichedPlan: mealPlan 
      });
    }

    const prompt = `You are a professional chef. Create SPECIFIC, detailed cooking instructions for each of these meals. Each meal MUST have unique, tailored instructions that mention the specific ingredients and cooking methods.

Here are the meals to process:
${allMeals.map((meal, index) => `
${index + 1}. ${meal.name}
   Ingredients: ${Array.isArray(meal.ingredients) ? meal.ingredients.join(', ') : meal.ingredients}
   Prep Time: ${meal.time}
`).join('')}

CRITICAL REQUIREMENTS:
- Each meal MUST have completely different, specific instructions
- Instructions MUST mention the actual ingredients for that specific meal
- NO generic or template instructions allowed
- Each recipe should have 4-6 detailed steps
- Include specific cooking times, temperatures, and techniques

Return ONLY valid JSON with this structure:
{
  "enrichedMeals": {
    "Meal Name 1": {
      "description": "Detailed appetizing description specific to this meal",
      "instructions": [
        "Step 1 specific to this meal with actual ingredients",
        "Step 2 with specific cooking method for this meal",
        "Step 3 with timing and technique specific to this meal",
        "Step 4 for seasoning/final touches specific to this meal",
        "Step 5 serving suggestion specific to this meal"
      ],
      "difficulty": "easy",
      "emoji": "🍳",
      "nutrition": {
        "calories": 350,
        "protein": 20,
        "carbs": 45,
        "fat": 12
      },
      "category": "Breakfast",
      "tags": ["healthy", "quick"]
    }
  }
}

EXAMPLE for "Grilled Chicken Caesar Salad":
{
  "enrichedMeals": {
    "Grilled Chicken Caesar Salad": {
      "description": "Classic Caesar salad with perfectly grilled chicken breast, crisp romaine lettuce, and homemade croutons.",
      "instructions": [
        "Season chicken breast with salt, pepper, and garlic powder, then grill over medium-high heat for 6-7 minutes per side until internal temperature reaches 165°F.",
        "While chicken cooks, tear romaine lettuce into bite-sized pieces and rinse in cold water, then pat dry with paper towels.",
        "Toast bread cubes in a skillet with olive oil and garlic for 3-4 minutes until golden brown to make croutons.",
        "Slice the grilled chicken into strips and arrange over the lettuce with croutons and parmesan cheese.",
        "Drizzle with Caesar dressing and serve immediately with lemon wedges on the side."
      ],
      "difficulty": "easy",
      "emoji": "🥗",
      "nutrition": { "calories": 420, "protein": 35, "carbs": 15, "fat": 25 },
      "category": "Lunch",
      "tags": ["healthy", "protein-rich", "classic"]
    }
  }
}

Remember: Each meal must have completely unique, specific instructions that reflect the actual cooking process for that particular dish!`;

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
            content: 'You are an expert chef specializing in creating unique, specific cooking instructions for different meals. You MUST respond with valid JSON only, no additional text. Never provide generic instructions - each meal must have completely different, tailored instructions that mention specific ingredients and cooking methods. All content must be in English.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3500,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const enrichmentContent = data.choices[0]?.message?.content;

    if (!enrichmentContent) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse JSON returned by OpenAI
    let enrichedMeals: { [key: string]: {
      description: string;
      instructions: string[];
      difficulty: string;
      emoji: string;
      nutrition: { calories: number; protein: number; carbs: number; fat: number };
      category: string;
      tags: string[];
    } } = {};
    try {
      // Clean the response to extract JSON
      let jsonString = enrichmentContent.trim();
      
      // If response contains extra text, extract only the JSON part
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      // Enhanced JSON cleaning
      jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
      jsonString = jsonString.replace(/[""]/g, '"'); // Replace smart quotes
      jsonString = jsonString.replace(/['']/g, "'"); // Replace smart apostrophes  
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
      jsonString = jsonString.replace(/([{,]\s*)(\w+):/g, '$1"$2":'); // Quote unquoted keys
      
      // Try to parse
      const parsedData = JSON.parse(jsonString);
      
      // Validate required fields
      if (parsedData.enrichedMeals && typeof parsedData.enrichedMeals === 'object') {
        enrichedMeals = parsedData.enrichedMeals;
      } else {
        throw new Error('Invalid enrichment data structure');
      }
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Problematic content:', enrichmentContent);
      
      // Enhanced fallback - create specific fallback for each meal
      allMeals.forEach(meal => {
        const ingredientsList = Array.isArray(meal.ingredients) ? meal.ingredients : [meal.ingredients];
        const mainIngredients = ingredientsList.slice(0, 3);
        
        enrichedMeals[meal.name] = {
          description: `Delicious ${meal.name} prepared with ${mainIngredients.join(', ')}. A flavorful and nutritious meal perfect for any time of day.`,
          instructions: [
            `Begin by preparing your ingredients for ${meal.name}: ${mainIngredients.join(', ')}.`,
            `Heat your cooking surface and start with the main components of ${meal.name}.`,
            `Cook the ingredients using appropriate techniques for ${meal.name}, taking approximately ${meal.time}.`,
            `Season and combine the elements of ${meal.name} to achieve the desired flavor profile.`,
            `Serve your freshly prepared ${meal.name} while hot and enjoy this delicious meal.`
          ],
          difficulty: 'medium',
          emoji: '🍽️',
          nutrition: {
            calories: 300,
            protein: 15,
            carbs: 35,
            fat: 10
          },
          category: meal.mealTime === 'morning' ? 'Breakfast' : meal.mealTime === 'lunch' ? 'Lunch' : 'Dinner',
          tags: ['homemade', 'nutritious']
        };
      });
    }

    // Merge enriched data back into the original meal plan structure
    const enrichedPlan = JSON.parse(JSON.stringify(mealPlan)); // Deep copy

    for (const day of daysOfWeek) {
      if (enrichedPlan[day]) {
        for (const mealTime of mealTimes) {
          const meal = enrichedPlan[day][mealTime];
          if (meal && meal.name && enrichedMeals[meal.name]) {
            // Merge the enriched data into the meal
            Object.assign(meal, enrichedMeals[meal.name]);
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      enrichedPlan 
    });

  } catch (error) {
    console.error('Meal plan enrichment error:', error);
    return NextResponse.json({ message: 'Server error during meal plan enrichment' }, { status: 500 });
  }
}
