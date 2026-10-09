import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    const usersToSeed = [
      {
        email: 'entry@loansaarthi.com',
        name: 'Data Entry Operator',
        rawPassword: 'Entry@12345',
        role: 'crm_entry',
      },
      {
        email: 'editor@loansaarthi.com',
        name: 'CRM Manager Editor',
        rawPassword: 'Editor@12345',
        role: 'crm_editor',
      },
      {
        email: 'admin@loansaarthi.com',
        name: 'CRM Super Admin',
        rawPassword: 'Admin@12345',
        role: 'admin',
      },
    ];

    const results = [];

    for (const u of usersToSeed) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.rawPassword, salt);

      const updated = await User.findOneAndUpdate(
        { email: u.email.toLowerCase() },
        {
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: u.role,
          isActive: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      results.push({
        email: u.email,
        role: u.role,
        password: u.rawPassword,
        status: 'Ready',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Demo CRM users created / updated successfully!',
      credentials: results,
    });
  } catch (err: any) {
    console.error('Failed to seed CRM users:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to seed users' },
      { status: 500 }
    );
  }
}

