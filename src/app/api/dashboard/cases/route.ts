/**
 * Partner Dashboard Cases Endpoint
 * Fetches recent application cases associated with the authenticated user.
 */
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login again.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      id: string;
      email: string;
      role: string;
      name?: string;
    };

    const isFullAccess = ['admin', 'superadmin', 'manager', 'crm', 'crm_entry'].includes(
      decoded.role?.toLowerCase()
    );

    const query: Record<string, any> = {};
    if (!isFullAccess && decoded.name) {
      query.assignedTo = { $regex: new RegExp(`^${decoded.name}$`, 'i') };
    }

    const cases = await Lead.find(query)
      .select('name phone loanType loanAmount status createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedCases = cases.map((item) => ({
      _id: item._id,
      applicantName: item.name,
      phone: item.phone,
      loanType: item.loanType,
      loanAmount: item.loanAmount,
      status: item.status,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      success: true,
      count: formattedCases.length,
      data: formattedCases,
    });
  } catch (error) {
    console.error('❌ DASHBOARD CASES ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard cases' },
      { status: 500 }
    );
  }
}
