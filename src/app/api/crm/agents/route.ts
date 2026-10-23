/**
 * CRM Agents API Route
 * Supplies the list of active telecalling agents (crm_editor) for assignment dropdowns.
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Allow CRM roles (superadmin, admin, crm_entry, crm_editor) to fetch agent list for assignments
    const role = authUser.role?.toLowerCase();
    const allowedRoles = ['superadmin', 'admin', 'crm_entry', 'crm_editor', 'crm'];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Access Denied: Only authorized CRM users can view agent lists.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const agents = await User.find(
      { role: 'crm_editor' },
      'name email role'
    ).lean();

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}