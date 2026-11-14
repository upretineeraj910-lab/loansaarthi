import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getAuthUser, canEditLeads, canDeleteLeads, isSuperAdmin } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH: Update lead status or details
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    // Role verification:
    // Only 'superadmin' and 'crm_editor' can modify leads.
    // 'crm_entry' is strictly VIEW-ONLY on CRM Pipeline.
    // 'admin' is restricted exclusively to OTP Leads on /lead.
    if (!canEditLeads(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Access Denied: You do not have permission to modify leads. Data Entry Operators have view-only pipeline access, and Admins are restricted to the OTP Customer Leads Vault.',
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const allowedUpdates = [
      'status',
      'notes',
      'loanAmount',
      'loanType',
      'city',
      'rejectionReason',
      'approvedBank',
      'approvedAmount',
    ];

    // Only Super Admin can reassign leads to another agent
    if (isSuperAdmin(authUser.role) && body.assignedTo !== undefined) {
      allowedUpdates.push('assignedTo');
    }

    const updateData: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Lead updated successfully`,
      lead: updatedLead,
    });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE: Delete lead (Super Admin ONLY)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    if (!canDeleteLeads(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access Denied: Only Super Admin has permission to delete leads permanently.',
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

