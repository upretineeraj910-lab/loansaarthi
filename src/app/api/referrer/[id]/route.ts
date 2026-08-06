// app/api/referrer/[id]/route.ts
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectToDatabase();
    // console.log("db connected")

    // Next.js 15+ async params support
    const resolvedParams = await params;
    const userId = resolvedParams?.id;

    console.log("🔍 Fetching referrer for ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
    }

    const user = await User.findById(userId).select('name email');

    if (!user) {
      console.log("❌ Referrer not found in DB");
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    console.log("✅ Referrer found:", user.name);

    return NextResponse.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching referrer:', error);
    return NextResponse.json({ error: 'Invalid User ID or Server Error' }, { status: 500 });
  }
}