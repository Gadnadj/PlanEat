import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Retrieve user's meal plan
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

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user preferences
    await User.findByIdAndUpdate(user._id, { preferences });

    // Check if a meal plan already exists for this user
    const existingMealPlan = await MealPlan.findOne({ userId: user._id });

    if (existingMealPlan) {
      // Update existing meal plan
      await MealPlan.findByIdAndUpdate(existingMealPlan._id, {
        preferences,
        mealPlan,
        updatedAt: new Date()
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Meal plan updated successfully',
        mealPlan
      });
    } else {
      // Create new meal plan if none exists
      const newMealPlan = new MealPlan({
        userId: user._id,
        preferences,
        mealPlan
      });

      await newMealPlan.save();

      return NextResponse.json({ 
        success: true, 
        message: 'Meal plan created successfully',
        mealPlan: newMealPlan.mealPlan
      });
    }

  } catch (error) {
    console.error('Error saving meal plan:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
