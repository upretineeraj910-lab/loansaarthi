import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { role } = await req.json();

    const allowedRoles = ['crm_entry', 'crm_editor', 'admin'];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
    }

    const emailMap: Record<string, { email: string; name: string; pass: string }> = {
      crm_entry: { email: 'entry@loansaarthi.com', name: 'Data Entry Operator', pass: 'Entry@12345' },
      crm_editor: { email: 'editor@loansaarthi.com', name: 'CRM Manager Editor', pass: 'Editor@12345' },
      admin: { email: 'admin@loansaarthi.com', name: 'CRM Super Admin', pass: 'Admin@12345' },
    };

    const target = emailMap[role];
    let user = await User.findOne({ email: target.email });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(target.pass, salt);
      user = await User.create({
        name: target.name,
        email: target.email,
        password: hashedPassword,
        role,
        isActive: true,
      });
    } else if (user.role !== role) {
      user.role = role as any;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Quick login error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

