import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mealName, ingredients, prepTime } = await req.json();

    if (!mealName || !ingredients || !prepTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ message: 'Missing OpenAI API key' }, { status: 500 });
    }

    const prompt = `You are a professional chef. Create SPECIFIC step-by-step cooking instructions for this exact meal:

Meal Name: ${mealName}
Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}
Preparation Time: ${prepTime}

CRITICAL: The instructions must be SPECIFIC to "${mealName}" and use the actual ingredients listed above. NO GENERIC instructions allowed.

Return ONLY valid JSON with this exact structure:
{
  "description": "A detailed, appetizing description of the meal (2-3 sentences)",
  "instructions": [
    "Specific step 1 mentioning actual ingredients for ${mealName}",
    "Specific step 2 with cooking method for ${mealName}",
    "Specific step 3 with timing and technique for ${mealName}",
    "Specific step 4 for seasoning/final touches for ${mealName}",
    "Specific serving suggestion for ${mealName}"
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

EXAMPLE for "Turkey Taco Lettuce Wraps":
{
  "description": "Fresh and healthy turkey taco lettuce wraps featuring seasoned ground turkey wrapped in crisp lettuce leaves.",
  "instructions": [
    "Heat a large skillet over medium-high heat and cook the ground turkey, breaking it apart with a spoon, for 5-7 minutes until browned.",
    "Add diced onion and bell pepper to the skillet and cook for 3-4 minutes until softened.",
    "Season the turkey mixture with chili powder, paprika, salt and pepper, cooking for another 2 minutes until fragrant.",
    "Remove from heat and let cool slightly while washing and separating the lettuce leaves.",
    "Spoon the turkey mixture into lettuce cups and serve immediately with desired toppings."
  ],
  "difficulty": "easy",
  "emoji": "🌮",
  "nutrition": { "calories": 250, "protein": 25, "carbs": 8, "fat": 12 },
  "category": "Lunch",
  "tags": ["healthy", "low-carb", "protein-rich"]
}

Requirements for ${mealName}:
- Instructions MUST mention specific ingredients from the list above
- Instructions MUST be tailored to the cooking method for "${mealName}"
- Include specific cooking times and temperatures where relevant
- Each step should build logically on the previous one
- End with appropriate serving suggestion for "${mealName}"`;

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
            content: 'You are an expert chef specializing in creating specific, detailed cooking instructions. You MUST respond with valid JSON only, no additional text. Never provide generic instructions - always tailor them to the specific dish and ingredients provided. All content must be in English.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.5,
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
    let enrichedData;
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
      enrichedData = JSON.parse(jsonString);
      
      // Validate required fields
      if (!enrichedData.description || !enrichedData.instructions || !Array.isArray(enrichedData.instructions)) {
        throw new Error('Invalid enrichment data structure');
      }
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Problematic content:', enrichmentContent);
      
      // Enhanced fallback with specific ingredients
      const ingredientsList = Array.isArray(ingredients) ? ingredients : [ingredients];
      const mainIngredients = ingredientsList.slice(0, 3);
      
      enrichedData = {
        description: `Delicious ${mealName} prepared with ${mainIngredients.join(', ')}. A flavorful and nutritious meal perfect for any time of day.`,
        instructions: [
          `Prepare and organize your ingredients: ${mainIngredients.join(', ')}.`,
          `Heat your cooking surface and begin preparing the main components for ${mealName}.`,
          `Cook the ingredients according to their requirements, approximately ${prepTime} total.`,
          `Combine and season the ${mealName} to taste, adjusting flavors as needed.`,
          `Serve your ${mealName} immediately while fresh and hot for best results.`
        ],
        difficulty: 'medium',
        emoji: '🍽️',
        nutrition: {
          calories: 300,
          protein: 15,
          carbs: 35,
          fat: 10
        },
        category: 'Main Course',
        tags: ['homemade', 'nutritious']
      };
    }

    return NextResponse.json({ 
      success: true, 
      enrichedData 
    });

  } catch (error) {
    console.error('Meal enrichment error:', error);
    return NextResponse.json({ message: 'Server error during meal enrichment' }, { status: 500 });
  }
}
