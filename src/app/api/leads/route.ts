import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getAuthUser, canViewLeads, canEnterLeads, canEditLeads } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

// GET: Fetch leads with search and filter + stats
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in to view CRM leads.' },
        { status: 401 }
      );
    }

    if (!canViewLeads(authUser.role)) {
      return NextResponse.json(
        { success: false, message: 'Access Denied: You do not have permission to view CRM leads.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const loanType = searchParams.get('loanType')?.trim() || '';
    const source = searchParams.get('source')?.trim() || '';

    // Build query
    const query: Record<string, any> = {};

    // Check Role: Admin/Manager/Superadmin ko sabhi leads dikhengi.
    // crm_entry (Data Entry) ko bhi CRM dashboard view karne ki full permission hai.
    // crm_editor (agents) ko sirf unki assigned leads dikhengi.
    const userRole = authUser.role?.toLowerCase();
    const isFullAccessRole = ['admin', 'superadmin', 'manager', 'crm', 'crm_entry'].includes(
      userRole
    );

    if (!isFullAccessRole) {
      if (authUser.name) {
        const safeName = authUser.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
        query.assignedTo = { $regex: new RegExp(`^${safeName}$`, 'i') };
      } else {
        query.assignedTo = '__none__';
      }
    }

    const assignedToFilter = searchParams.get('assignedTo')?.trim();
    if (isFullAccessRole && assignedToFilter && assignedToFilter !== 'All') {
      if (assignedToFilter === 'Unassigned') {
        query.$or = [
          { assignedTo: { $exists: false } },
          { assignedTo: '' },
          { assignedTo: null },
        ];
      } else {
        const safeAssigned = assignedToFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.assignedTo = { $regex: new RegExp(`^${safeAssigned}$`, 'i') };
      }
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (loanType && loanType !== 'All') {
      query.loanType = loanType;
    }

    if (source && source !== 'All') {
      query.source = source;
    }

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Fast search targeting phone or name
      query.$or = [
        { phone: { $regex: safeSearch, $options: 'i' } },
        { name: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    // Stats ke aggregate ke liye bhi filter
    const statsMatchStage = !isFullAccessRole
      ? {
          assignedTo: authUser.name
            ? { $regex: new RegExp(`^${authUser.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim()}$`, 'i') }
            : '__none__',
        }
      : {};

    // Run leads query and status aggregation concurrently in 1 round-trip
    const [leads, statusCounts] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).lean(),
      Lead.aggregate([
        {
          $match: statsMatchStage,
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const countsMap: Record<string, number> = {};
    let total = 0;
    for (const item of statusCounts) {
      if (item._id) {
        countsMap[item._id] = item.count;
      }
      total += item.count;
    }

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
      stats: {
        total,
        fresh: countsMap['Fresh'] || 0,
        notEligible: countsMap['Not Eligible'] || 0,
        ringing: countsMap['Ringing'] || 0,
        callBack: countsMap['Call Back'] || 0,
        voiceMail: countsMap['Voice Mail'] || 0,
        login: countsMap['Login'] || 0,
        underwriting: countsMap['Underwriting'] || 0,
        approved: countsMap['Approved'] || 0,
        rejected: countsMap['Rejected'] || 0,
        disbursed: countsMap['Disbursed'] || 0,
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
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    if (!canEnterLeads(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Access Denied: Only Data Entry Operators (crm_entry) can submit leads. CRM Editors are not permitted to add leads.',
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { name, phone, loanType, loanAmount, city, bankName, notes, assignedTo } = body;

    // Basic Validations
    if (!name || !phone || !loanAmount) {
      return NextResponse.json(
        { success: false, message: 'Name, Phone and Loan Amount are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.toString().trim().replace(/\D/g, '');

    // Validate Phone Number
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Phone number must be at least 10 digits.' },
        { status: 400 }
      );
    }

    // Duplicate Check: Check if phone already exists in MongoDB
    const existingLead = await Lead.findOne({ phone: cleanPhone });
    if (existingLead) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: `Mobile number "${cleanPhone}" already exists in database (Customer: ${existingLead.name}, Status: ${existingLead.status}). Duplicate entry is not allowed.`,
        },
        { status: 409 }
      );
    }

    // Create and save lead
    const newLead = await Lead.create({
      name: name.trim(),
      phone: cleanPhone,
      loanType: loanType || 'Personal Loan',
      loanAmount: Number(loanAmount),
      city: city?.trim() || '',
      bankName: bankName?.trim() || '',
      status: 'Fresh',
      source: 'Form',
      assignedTo: assignedTo?.trim() || '',
      notes: notes?.trim() || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lead registered successfully in Fresh stage.',
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating lead:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: 'A lead with this mobile number already exists in the database.',
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

// PATCH: Bulk assign leads
export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    if (!canEditLeads(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access Denied: Only Admins and Editors can assign leads.',
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { leadIds, assignedTo } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'leadIds array is required and must not be empty.' },
        { status: 400 }
      );
    }

    const targetAgent = typeof assignedTo === 'string' ? assignedTo.trim() : '';

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      { $set: { assignedTo: targetAgent } }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${result.modifiedCount} lead(s) to ${targetAgent || 'Unassigned'}.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Error in bulk assign:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to bulk assign leads' },
      { status: 500 }
    );
  }
}