import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📩 Contact form data received:', body);

    const { fullName, email, phone, service, message } = body;

    // Basic validation
    if (!fullName || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // For now, just return success
    // console.log('✅ Contact saved successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We\'ll get back to you soon.',
        data: { fullName, email, phone, service, message }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}