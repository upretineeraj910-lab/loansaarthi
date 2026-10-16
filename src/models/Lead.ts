import mongoose, { Schema, Document, Model } from 'mongoose';

export type LeadStatus = 'Login' | 'Underwriting' | 'Approved' | 'Rejected' | 'Disbursed';
export type LeadSource = 'Form' | 'Excel Upload';

export interface ILeadDocument extends Document {
  name: string;
  phone: string;
  loanType: string;
  loanAmount: number;
  city?: string;
  bankName?: string;
  status: LeadStatus;
  source: LeadSource;
  rejectionReason?: string;
  approvedBank?: string;
  approvedAmount?: number;
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
      unique: true, // Duplicate protection ab mobile number se
      trim: true,
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
      enum: ['Login', 'Underwriting', 'Approved', 'Rejected', 'Disbursed'],
      default: 'Login',
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