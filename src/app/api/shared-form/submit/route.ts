import connectToDatabase from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { applicantName, applicantEmail, message, referrerId } = body;

    if (!applicantName || !applicantEmail || !message || !referrerId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Share karne wale user ka naam MongoDB se fetch karo
    const referrer = await User.findById(referrerId);
    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referrer user' },
        { status: 400 }
      );
    }

    // DB me save karo with referrer info
    const newSubmission = new FormSubmission({
      applicantName,
      applicantEmail,
      message,
      referrerId: referrer._id,
      referrerName: referrer.name,
    });

    await newSubmission.save();

    return NextResponse.json(
      { message: 'Form submitted successfully!', data: newSubmission },
      { status: 201 }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}