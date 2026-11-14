import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEligibilityLead extends Document {
  fullName: string;
  name: string;
  phone: string;
  loanType: string;
  occupation: string;
  monthlyIncome: number;
  existingEmi?: number;
  cibil?: string;
  maxLoanEligible?: number;
  estimatedEmi?: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const EligibilityLeadSchema = new Schema<IEligibilityLead>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    loanType: {
      type: String,
      default: "Personal Loan",
    },
    occupation: {
      type: String,
      default: "Salaried",
    },
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    existingEmi: {
      type: Number,
      default: 0,
    },
    cibil: {
      type: String,
      default: "unknown",
    },
    maxLoanEligible: {
      type: Number,
      default: 0,
    },
    estimatedEmi: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: "Eligibility Checker",
    },
  },
  {
    timestamps: true,
    collection: "eligibility_leads", // Dedicated collection separate from OTP leads
  }
);

EligibilityLeadSchema.index({ phone: 1 });
EligibilityLeadSchema.index({ createdAt: -1 });

const EligibilityLead: Model<IEligibilityLead> =
  mongoose.models.EligibilityLead ||
  mongoose.model<IEligibilityLead>(
    "EligibilityLead",
    EligibilityLeadSchema,
    "eligibility_leads"
  );

export default EligibilityLead;
