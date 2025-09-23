import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, isValidEmail, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request data
    const { email, password } = await request.json();

    // Validate data
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return response with user information
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        },
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
