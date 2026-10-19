import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getAuthUser } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH: Update appointment status or notes (SuperAdmin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const role = authUser.role?.toLowerCase();
    if (role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Access Denied: Only Super Admin can modify appointments.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const allowedUpdates = ['status', 'notes', 'appointmentDate', 'appointmentTime'];
    const updateData: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const updated = await Appointment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updated,
    });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE: Delete appointment (SuperAdmin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const role = authUser.role?.toLowerCase();
    if (role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Access Denied: Only Super Admin can delete appointments.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
