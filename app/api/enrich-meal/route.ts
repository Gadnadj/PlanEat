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

    const prompt = `Generate detailed information for this meal in JSON format:

Meal Name: ${mealName}
Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}
Preparation Time: ${prepTime}

IMPORTANT: Generate ALL content in ENGLISH language only.

Return ONLY valid JSON with this exact structure:
{
  "description": "A detailed, appetizing description of the meal (2-3 sentences)",
  "instructions": [
    "Step-by-step cooking instructions",
    "Each step should be clear and actionable",
    "Include cooking times and temperatures where relevant",
    "End with serving suggestions"
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

Requirements:
- Description must be engaging and highlight key flavors/benefits
- Instructions must be detailed and easy to follow
- Difficulty should be "easy", "medium", or "hard"
- Choose appropriate emoji for the meal type
- Calculate accurate nutrition values based on ingredients and portions:
  * calories: total calories per serving
  * protein: protein in grams
  * carbs: carbohydrates in grams
  * fat: total fat in grams
- Select appropriate category: "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"
- Add relevant tags like "healthy", "quick", "vegetarian", "protein-rich", "low-carb", "high-fiber", etc.`;

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
            content: 'You are an expert chef and certified nutritionist with extensive knowledge of food composition and nutritional analysis. Generate detailed, accurate meal information in JSON format. Calculate precise nutritional values based on actual ingredient composition and serving sizes. Always respond with valid JSON only, no additional text. All content must be in English.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
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
      const jsonMatch = enrichmentContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      let jsonString = jsonMatch[0];
      
      // Clean JSON string
      jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
      jsonString = jsonString.replace(/[""]/g, '"');
      jsonString = jsonString.replace(/['']/g, "'");
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      enrichedData = JSON.parse(jsonString);
      
      // Validate required fields
      if (!enrichedData.description || !enrichedData.instructions || !Array.isArray(enrichedData.instructions)) {
        throw new Error('Invalid enrichment data structure');
      }
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Problematic content:', enrichmentContent);
      
      // Fallback enriched data
      enrichedData = {
        description: `Delicious ${mealName} prepared with ${Array.isArray(ingredients) ? ingredients.slice(0, 3).join(', ') : ingredients}. A flavorful and nutritious meal perfect for any time of day.`,
        instructions: [
          'Gather and prepare all ingredients.',
          'Follow standard cooking techniques for each ingredient.',
          `Cook for approximately ${prepTime}, monitoring for doneness.`,
          'Season to taste and serve hot.',
          'Enjoy your delicious homemade meal!'
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
