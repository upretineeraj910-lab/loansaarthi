import mongoose, { Schema, Document, Model } from 'mongoose';

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface IAppointmentDocument extends Document {
  name: string;
  phone: string;
  monthlySalary: number;
  loanType: string;
  loanAmount: number;
  appointmentDate: string; // ISO Date String YYYY-MM-DD
  appointmentTime: string; // e.g. "03:00 PM - 03:30 PM"
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    monthlySalary: {
      type: Number,
      required: [true, 'Monthly salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    loanType: {
      type: String,
      required: [true, 'Loan type is required'],
      trim: true,
      default: 'Personal Loan',
    },
    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [10000, 'Minimum loan amount is 10,000'],
    },
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required'],
      trim: true,
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

AppointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
AppointmentSchema.index({ phone: 1 });
AppointmentSchema.index({ status: 1 });

const Appointment: Model<IAppointmentDocument> =
  mongoose.models.Appointment || mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);

export default Appointment;
