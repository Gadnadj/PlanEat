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
    
    const prompt = `Create a weekly meal plan in JSON with these preferences:

Diet: ${preferences.dietType}
People: ${preferences.numberOfPeople}
Budget: ${preferences.budget}
Time: ${preferences.cookingTime}
Allergies: ${allergiesText}
To avoid: ${dislikesText}

IMPORTANT RULES:
- Generate ALL content in ENGLISH language only
- Meal names, descriptions, instructions must be in English
- Avoid allergenic foods completely
- Respect chosen diet strictly
- Return valid JSON only
- No French content allowed

JSON Structure (example for 2 days):
{
  "monday": {
    "morning": {
      "name": "Green Smoothie",
      "description": "Vitamin-rich smoothie",
      "emoji": "🥤",
      "ingredients": [{"name": "spinach", "amount": "100", "unit": "g"}],
      "instructions": ["Blend ingredients"],
      "time": "5 min",
      "servings": 1,
      "difficulty": "easy",
      "category": "Beverage",
      "tags": ["vegan"],
      "nutrition": {"calories": 150, "protein": 5, "carbs": 20, "fat": 2}
    },
    "noon": {
      "name": "Quinoa Salad",
      "description": "Complete and nutritious salad",
      "emoji": "🥗",
      "ingredients": [{"name": "quinoa", "amount": "200", "unit": "g"}],
      "instructions": ["Cook quinoa", "Add vegetables"],
      "time": "20 min",
      "servings": 2,
      "difficulty": "easy",
      "category": "Main Course",
      "tags": ["vegan"],
      "nutrition": {"calories": 300, "protein": 12, "carbs": 45, "fat": 8}
    },
    "evening": {
      "name": "Vegetable Curry",
      "description": "Comforting vegetable curry",
      "emoji": "🍛",
      "ingredients": [{"name": "vegetables", "amount": "500", "unit": "g"}],
      "instructions": ["Sauté vegetables", "Add spices"],
      "time": "30 min",
      "servings": 2,
      "difficulty": "medium",
      "category": "Main Course",
      "tags": ["vegan"],
      "nutrition": {"calories": 250, "protein": 8, "carbs": 35, "fat": 10}
    }
  },
  "tuesday": {
    "morning": {
      "name": "Oat Porridge",
      "description": "Creamy porridge with fruits",
      "emoji": "🥣",
      "ingredients": [{"name": "oat flakes", "amount": "80", "unit": "g"}],
      "instructions": ["Cook oats", "Add fruits"],
      "time": "10 min",
      "servings": 1,
      "difficulty": "easy",
      "category": "Breakfast",
      "tags": ["vegan"],
      "nutrition": {"calories": 200, "protein": 8, "carbs": 35, "fat": 4}
    },
    "noon": {
      "name": "Vegetarian Wrap",
      "description": "Fresh and colorful wrap",
      "emoji": "🌯",
      "ingredients": [{"name": "tortilla", "amount": "2", "unit": "pieces"}],
      "instructions": ["Fill tortilla", "Roll and serve"],
      "time": "15 min",
      "servings": 2,
      "difficulty": "easy",
      "category": "Main Course",
      "tags": ["vegan"],
      "nutrition": {"calories": 400, "protein": 15, "carbs": 50, "fat": 12}
    },
    "evening": {
      "name": "Vegetable Pasta",
      "description": "Creamy pasta with vegetables",
      "emoji": "🍝",
      "ingredients": [{"name": "pasta", "amount": "300", "unit": "g"}],
      "instructions": ["Cook pasta", "Prepare sauce"],
      "time": "25 min",
      "servings": 2,
      "difficulty": "easy",
      "category": "Main Course",
      "tags": ["vegan"],
      "nutrition": {"calories": 450, "protein": 18, "carbs": 70, "fat": 8}
    }
  }
}

Generate complete JSON for all 7 days of the week.`;

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
            content: 'You are a nutrition and meal planning expert. You generate detailed and personalized meal plans in JSON format. IMPORTANT: Generate ALL content exclusively in ENGLISH language. All meal names, descriptions, ingredients, and instructions must be written in English only. Never use French or any other language.'
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
      console.error('OpenAI error:', errorData);
      return NextResponse.json({ message: 'Error generating meal plan' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean content to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', content);
      return NextResponse.json({ message: 'Invalid response format' }, { status: 500 });
    }

    try {
      // Clean JSON before parsing
      let jsonString = jsonMatch[0];
      
      // Try to parse JSON as-is first
      let mealPlan;
      try {
        mealPlan = JSON.parse(jsonString);
      } catch (initialParseError) {
        console.log('Initial parse failed, trying to clean JSON...');
        
        // Remove control characters and problematic non-ASCII characters
        jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Replace smart quotes with normal quotes
        jsonString = jsonString.replace(/[""]/g, '"');
        jsonString = jsonString.replace(/['']/g, "'");
        
        // Fix trailing commas
        jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
        
        // Check and fix missing braces
        const openBraces = (jsonString.match(/\{/g) || []).length;
        const closeBraces = (jsonString.match(/\}/g) || []).length;
        
        if (openBraces > closeBraces) {
          // Add missing closing braces
          const missingBraces = openBraces - closeBraces;
          jsonString += '}'.repeat(missingBraces);
        }
        
        // Check that JSON ends correctly
        if (!jsonString.trim().endsWith('}')) {
          jsonString = jsonString.trim() + '}';
        }
        
        // Clean trailing commas in objects
        jsonString = jsonString.replace(/,(\s*})/g, '$1');
        
        // Parse the cleaned JSON
        mealPlan = JSON.parse(jsonString);
      }
      
      // Validate that it's an object with days
      if (!mealPlan || typeof mealPlan !== 'object' || !mealPlan.monday) {
        throw new Error('Invalid planning structure');
      }
      
    // Enrich the meal plan with detailed descriptions and instructions
    try {
      // Fix baseUrl - use correct port for Next.js dev server
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : (process.env.NEXTAUTH_URL || 'http://localhost:3000');
      
      console.log('Attempting to enrich meal plan at:', `${baseUrl}/api/enrich-meal-plan`);
      
      const enrichResponse = await fetch(`${baseUrl}/api/enrich-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealPlan }),
      });

      if (enrichResponse.ok) {
        const enrichData = await enrichResponse.json();
        console.log('Enrichment successful');
        if (enrichData.success && enrichData.enrichedPlan) {
          return NextResponse.json({ 
            success: true, 
            mealPlan: enrichData.enrichedPlan 
          });
        }
      } else {
        console.warn('Enrichment response not ok:', enrichResponse.status, enrichResponse.statusText);
      }
    } catch (enrichError) {
      console.warn('Failed to enrich meal plan, returning basic plan:', enrichError);
    }

    // Return basic plan if enrichment fails
    return NextResponse.json({ 
      success: true, 
      mealPlan 
    });
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Problematic JSON:', jsonMatch[0]);
      
      // Fallback: use simple API if parsing fails
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
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
          message: 'Plan generated with simplified format'
        });
      }
      
      return NextResponse.json({ message: 'Meal plan generation error' }, { status: 500 });
    }

  } catch (error) {
    console.error('Detailed meal plan generation error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
