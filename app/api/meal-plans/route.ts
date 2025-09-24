import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Retrieve user's meal plan or previous meals for diversification
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication token missing' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if we want previous meals for diversification
    const url = new URL(req.url);
    const getPrevious = url.searchParams.get('previous') === 'true';
    
    if (getPrevious) {
      // Get previous meal plans to extract meal names for diversification
      const previousMealPlans = await MealPlan.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(3); // Get last 3 meal plans
      
      const previousMealNames: string[] = [];
      
      previousMealPlans.forEach(plan => {
        if (plan.mealPlan && typeof plan.mealPlan === 'object') {
          Object.values(plan.mealPlan).forEach((dayMeals: any) => {
            if (dayMeals && typeof dayMeals === 'object') {
              Object.values(dayMeals).forEach((meal: any) => {
                if (meal && meal.name && typeof meal.name === 'string') {
                  previousMealNames.push(meal.name);
                }
              });
            }
          });
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        previousMealNames: [...new Set(previousMealNames)] // Remove duplicates
      });
    }

    // Get the user's most recent meal plan
    const mealPlan = await MealPlan.findOne({ userId: user._id })
      .sort({ createdAt: -1 });

    if (!mealPlan) {
      return NextResponse.json({ message: 'No meal plan found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      mealPlan: mealPlan.mealPlan,
      preferences: mealPlan.preferences
    });

  } catch (error) {
    console.error('Error retrieving meal plan:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST - Save a new meal plan
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication token missing' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { preferences, mealPlan } = await req.json();

    if (!preferences || !mealPlan) {
      return NextResponse.json({ message: 'Preferences and meal plan required' }, { status: 400 });
    }

    // Validation supplémentaire des données
    if (typeof preferences !== 'object' || typeof mealPlan !== 'object') {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    // Vérifier que les champs obligatoires des préférences sont présents
    const requiredPreferenceFields = ['dietType', 'budget', 'cookingTime'];
    for (const field of requiredPreferenceFields) {
      if (!preferences[field]) {
        return NextResponse.json({ message: `Missing required preference: ${field}` }, { status: 400 });
      }
    }
    
    // Ensure numberOfPeople is always set to 1 for consistency
    preferences.numberOfPeople = 1;

    // Vérifier que le meal plan contient des données
    if (Object.keys(mealPlan).length === 0) {
      return NextResponse.json({ message: 'Meal plan cannot be empty' }, { status: 400 });
    }

    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');
    
    console.log('Looking for user with ID:', decoded.userId);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('User not found with ID:', decoded.userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log('User found:', user.email);

    // Update user preferences
    console.log('Updating user preferences...');
    await User.findByIdAndUpdate(user._id, { preferences });
    console.log('User preferences updated successfully');

    // Check if a meal plan already exists for this user
    console.log('Checking for existing meal plan...');
    const existingMealPlan = await MealPlan.findOne({ userId: user._id });

    if (existingMealPlan) {
      console.log('Existing meal plan found, updating...');
      // Update existing meal plan
      await MealPlan.findByIdAndUpdate(existingMealPlan._id, {
        preferences,
        mealPlan,
        updatedAt: new Date()
      });
      console.log('Meal plan updated successfully');

      return NextResponse.json({ 
        success: true, 
        message: 'Meal plan updated successfully',
        mealPlan
      });
    } else {
      console.log('No existing meal plan found, creating new one...');
      // Create new meal plan if none exists
      const newMealPlan = new MealPlan({
        userId: user._id,
        preferences,
        mealPlan
      });

      console.log('Saving new meal plan to database...');
      await newMealPlan.save();
      console.log('New meal plan created successfully');

      return NextResponse.json({ 
        success: true, 
        message: 'Meal plan created successfully',
        mealPlan: newMealPlan.mealPlan
      });
    }

  } catch (error) {
    console.error('Error saving meal plan:', error);
    
    // Déterminer le type d'erreur pour fournir un message plus précis
    let errorMessage = 'Server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        errorMessage = 'Validation error: ' + error.message;
        statusCode = 400;
      } else if (error.message.includes('duplicate') || error.message.includes('E11000')) {
        errorMessage = 'Meal plan already exists for this user';
        statusCode = 409;
      } else if (error.message.includes('connect') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Database connection error';
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
      
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
    }, { status: statusCode });
  }
}
