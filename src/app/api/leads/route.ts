import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

// GET: Fetch leads with search and filter + stats
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const loanType = searchParams.get('loanType')?.trim() || '';

    // Build query
    const query: Record<string, any> = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (loanType && loanType !== 'All') {
      query.loanType = loanType;
    }

    if (search) {
      // Fast search targeting phone, PAN, or name
      query.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { panNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch matching leads sorted by newest first
    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

    // Fetch status metrics for top overview cards
    const [total, login, underwriting, approved, rejected, disbursed] =
      await Promise.all([
        Lead.countDocuments({}),
        Lead.countDocuments({ status: 'Login' }),
        Lead.countDocuments({ status: 'Underwriting' }),
        Lead.countDocuments({ status: 'Approved' }),
        Lead.countDocuments({ status: 'Rejected' }),
        Lead.countDocuments({ status: 'Disbursed' }),
      ]);

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
      stats: {
        total,
        login,
        underwriting,
        approved,
        rejected,
        disbursed,
      },
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST: Add a single lead (Form submission)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, phone, panNumber, email, loanType, loanAmount, city, bankName, notes } = body;

    // Basic Validations
    if (!name || !phone || !panNumber || !loanAmount) {
      return NextResponse.json(
        { success: false, message: 'Name, Phone, PAN Number and Loan Amount are required.' },
        { status: 400 }
      );
    }

    const cleanPan = panNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    // Validate PAN Format (ABCDE1234F)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPan)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid PAN format. PAN must be 10 characters (e.g. ABCDE1234F).',
        },
        { status: 400 }
      );
    }

    // Validate Phone Number
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Phone number must be at least 10 digits.' },
        { status: 400 }
      );
    }

    // Duplicate Check: Check if PAN already exists in MongoDB
    const existingLead = await Lead.findOne({ panNumber: cleanPan });
    if (existingLead) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: `PAN Card "${cleanPan}" already exists in database (Customer: ${existingLead.name}, Phone: ${existingLead.phone}, Status: ${existingLead.status}). Duplicate entry is not allowed.`,
        },
        { status: 409 }
      );
    }

    // Create and save lead
    const newLead = await Lead.create({
      name: name.trim(),
      phone: cleanPhone,
      panNumber: cleanPan,
      email: email?.trim() || '',
      loanType: loanType || 'Personal Loan',
      loanAmount: Number(loanAmount),
      city: city?.trim() || '',
      bankName: bankName?.trim() || '',
      status: 'Login', // Initial state
      source: 'Form',
      notes: notes?.trim() || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lead registered successfully in Login stage.',
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating lead:', error);
    // MongoDB duplicate key error code 11000
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: 'A lead with this PAN number already exists in the database.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Server error creating lead' },
      { status: 500 }
    );
  }
}

