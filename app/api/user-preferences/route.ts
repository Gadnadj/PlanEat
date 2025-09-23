import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Retrieve user preferences
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

    return NextResponse.json({ 
      success: true, 
      preferences: user.preferences || {
        dietType: 'omnivore',
        allergies: [],
        dislikes: [],
        numberOfPeople: 2,
        budget: 'medium',
        cookingTime: 'medium'
      }
    });

  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST - Update user preferences
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

    const { preferences } = await req.json();

    if (!preferences) {
      return NextResponse.json({ message: 'Preferences required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { preferences },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
