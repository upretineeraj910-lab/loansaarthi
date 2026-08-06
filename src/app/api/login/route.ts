// app/api/login/route.ts
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { ILoginInput, ILoginResponse, IErrorResponse } from '@/lib/types';

export async function POST(request: Request): Promise<NextResponse<ILoginResponse | IErrorResponse>> {
  try {
    // Connect to MongoDB
    await connectToDatabase();
console.log("mongodb connected")
    // Get request body
    const body: ILoginInput = await request.json();
    const { email, password } = body;

    // Validate fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
        console.log('👤 User found:', user ? 'Yes' : 'No'); // Log add karo

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    // if (!user.isActive) {
    //   return NextResponse.json(
    //     { error: 'Account is deactivated' },
    //     { status: 401 }
    //   );
    // }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('🔑 Password valid:', isValidPassword); // Log add karo

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    console.log(token);
    

    // Return success response
    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}