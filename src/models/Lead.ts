/**
 * Lead Model & Schema
 * Represents customer leads in the CRM pipeline from initial intake through final bank disbursal.
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

export type LeadStatus =
  | 'Fresh'
  | 'Not Eligible'
  | 'Ringing'
  | 'Call Back'
  | 'Voice Mail'
  | 'Login'
  | 'Underwriting'
  | 'Approved'
  | 'Rejected'
  | 'Disbursed';
export type LeadSource = 'Form' | 'Excel Upload';

export interface ILeadDocument extends Document {
  name: string;
  phone: string;
  panNumber?: string;
  email?: string;
  loanType: string;
  loanAmount: number;
  city?: string;
  bankName?: string;
  status: LeadStatus;
  source: LeadSource;
  rejectionReason?: string;
  approvedBank?: string;
  approvedAmount?: number;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    loanType: {
      type: String,
      required: [true, 'Loan type is required'],
      default: 'Personal Loan',
    },
    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    bankName: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Fresh',
        'Not Eligible',
        'Ringing',
        'Call Back',
        'Voice Mail',
        'Login',
        'Underwriting',
        'Approved',
        'Rejected',
        'Disbursed',
      ],
      default: 'Fresh',
      index: true,
    },
    source: {
      type: String,
      enum: ['Form', 'Excel Upload'],
      default: 'Form',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    approvedBank: {
      type: String,
      default: '',
    },
    approvedAmount: {
      type: Number,
      default: 0,
    },
    assignedTo: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

LeadSchema.index({ createdAt: -1 });

const Lead: Model<ILeadDocument> =
  mongoose.models.CrmLead ||
  mongoose.model<ILeadDocument>('CrmLead', LeadSchema, 'crmlead');

export default Lead;