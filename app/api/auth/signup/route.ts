import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, isValidEmail, isValidPassword, isValidName, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request data
    const { email, password, name } = await request.json();

    // Validate data
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
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

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }

    // Validate name
    const nameValidation = isValidName(name);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false, message: nameValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim()
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return response without password
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        },
        token
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
