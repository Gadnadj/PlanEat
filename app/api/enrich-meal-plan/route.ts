import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mealPlan } = await req.json();

    if (!mealPlan) {
      return NextResponse.json({ message: 'Missing meal plan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Function to enrich a single meal
    const enrichMeal = async (mealName: string, ingredients: string[] | string, prepTime: string) => {
      try {
        const response = await fetch(`${baseUrl}/api/enrich-meal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mealName,
            ingredients,
            prepTime
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.enrichedData;
        } else {
          console.warn(`Failed to enrich meal: ${mealName}`);
          return null;
        }
      } catch (error) {
        console.error(`Error enriching meal ${mealName}:`, error);
        return null;
      }
    };

    // Enrich all meals in the plan
    const enrichedPlan: any = {};
    
    for (const day of Object.keys(mealPlan)) {
      enrichedPlan[day] = {};
      
      for (const mealTime of Object.keys(mealPlan[day])) {
        const meal = mealPlan[day][mealTime];
        
        if (meal && meal.name) {
          console.log(`Enriching ${day} ${mealTime}: ${meal.name}`);
          
          const enrichedData = await enrichMeal(
            meal.name,
            meal.ingredients || [],
            meal.time || '30 min'
          );

          // Combine original meal data with enriched data
          enrichedPlan[day][mealTime] = {
            name: meal.name,
            ingredients: meal.ingredients || [],
            time: meal.time || '30 min',
            // Add enriched data if available
            description: enrichedData?.description || `Delicious ${meal.name} prepared with fresh ingredients.`,
            instructions: enrichedData?.instructions || [
              'Prepare all ingredients.',
              'Follow standard cooking techniques.',
              'Cook until done and serve hot.'
            ],
            difficulty: enrichedData?.difficulty || 'medium',
            emoji: enrichedData?.emoji || '🍽️',
            nutrition: enrichedData?.nutrition || {
              calories: 300,
              protein: 15,
              carbs: 35,
              fat: 10
            },
            category: enrichedData?.category || 'Main Course',
            tags: enrichedData?.tags || ['homemade'],
            servings: meal.servings || 2
          };
        } else {
          // Keep original meal if no name is provided
          enrichedPlan[day][mealTime] = meal;
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
