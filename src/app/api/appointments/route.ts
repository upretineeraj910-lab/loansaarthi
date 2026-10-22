import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getAuthUser } from '@/lib/crmAuth';

export const dynamic = 'force-dynamic';

const VALID_TIME_SLOTS = [
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
];

// Helper to validate that date is at least 1 day in the future and NOT Saturday (6) or Sunday (0)
function validateAppointmentDate(dateStr: string): { valid: boolean; message?: string } {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return { valid: false, message: 'Invalid date format (YYYY-MM-DD required)' };
  }

  const selectedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(selectedDate.getTime())) {
    return { valid: false, message: 'Invalid date' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (selectedDate < tomorrow) {
    return { valid: false, message: 'Appointments must be booked at least 1 day in advance.' };
  }

  const dayOfWeek = selectedDate.getDay(); // 0 is Sunday, 6 is Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      valid: false,
      message: 'Consultations are only available Monday through Friday. Please select a weekday.',
    };
  }

  return { valid: true };
}

// POST: Book an expert appointment (Public)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      name,
      phone,
      monthlySalary,
      loanType,
      loanAmount,
      appointmentDate,
      appointmentTime,
      notes,
    } = body;

    // Basic Validations
    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    }

    const cleanPhone = phone?.toString().trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ success: false, message: 'Valid 10-digit mobile number is required.' }, { status: 400 });
    }

    const numSalary = Number(monthlySalary);
    if (isNaN(numSalary) || numSalary <= 0) {
      return NextResponse.json({ success: false, message: 'Valid monthly salary is required.' }, { status: 400 });
    }

    const numAmount = Number(loanAmount);
    if (isNaN(numAmount) || numAmount < 10000) {
      return NextResponse.json({ success: false, message: 'Loan amount must be at least ₹10,000.' }, { status: 400 });
    }

    if (!appointmentDate) {
      return NextResponse.json({ success: false, message: 'Appointment date is required.' }, { status: 400 });
    }

    // Date validation: Next day or later, Monday to Friday only
    const dateCheck = validateAppointmentDate(appointmentDate);
    if (!dateCheck.valid) {
      return NextResponse.json({ success: false, message: dateCheck.message }, { status: 400 });
    }

    // Time validation: 3 PM to 5 PM slots only
    if (!appointmentTime || !VALID_TIME_SLOTS.includes(appointmentTime)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Consultation slots are only available between 3:00 PM and 5:00 PM (Monday to Friday).',
        },
        { status: 400 }
      );
    }

    // Save Appointment in database
    const newAppointment = await Appointment.create({
      name: name.trim(),
      phone: cleanPhone,
      monthlySalary: numSalary,
      loanType: loanType || 'Personal Loan',
      loanAmount: numAmount,
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      status: 'Scheduled',
      notes: notes?.trim() || '',
    });

    
    return NextResponse.json(
      {
        success: true,
        message: 'Your expert consultation appointment has been scheduled successfully!',
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to schedule appointment.' },
      { status: 500 }
    );
  }
}

// GET: Fetch appointments (SuperAdmin only)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const role = authUser.role?.toLowerCase();
    if (role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Access Denied: Only Super Admin can view expert appointments.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.trim();
    const search = searchParams.get('search')?.trim();

    const query: Record<string, any> = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { phone: { $regex: safe, $options: 'i' } },
        { loanType: { $regex: safe, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query).sort({ appointmentDate: -1, createdAt: -1 }).lean();

    // Stats calculation
    const [total, scheduled, completed, cancelled] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Scheduled' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
    ]);

    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments,
      stats: {
        total,
        scheduled,
        completed,
        cancelled,
      },
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch appointments.' },
      { status: 500 }
    );
  }
}
