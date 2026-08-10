import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUploadedDocument {
  fileName: string;
  storagePath: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface IFormSubmissionDocument extends Document {
  // Referral
  referrerId: mongoose.Types.ObjectId;
  referrerName: string;

  // Personal Details
  applicantName: string;
  applicantEmail: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;

  // KYC
  panNumber: string;
  aadhaarNumber: string;

  // Address
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Loan Details
  loanType: string;
  loanAmount: number;
  loanPurpose: string;
  existingLoan: boolean;
  existingEmi?: number;

  // Employment
  employmentType: 'salaried' | 'self-employed';

  // Salaried
  companyName?: string;
  designation?: string;
  workExperience?: string;
  monthlyIncome?: number;

  // Self Employed
  businessName?: string;
  businessType?: string;
  businessVintage?: string;
  annualIncome?: number;
  businessAddress?: string;

  // Documents
  documents: {
    pan?: IUploadedDocument;
    aadhaar?: IUploadedDocument;
    salarySlips?: IUploadedDocument[];
    bankStatement?: IUploadedDocument;
    itr?: IUploadedDocument;
    form16?: IUploadedDocument;
    businessProof?: IUploadedDocument;
  };

  createdAt: Date;
  updatedAt: Date;
}

const UploadedDocumentSchema = new Schema<IUploadedDocument>(
  {
    fileName: {
      type: String,
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const FormSubmissionSchema = new Schema<IFormSubmissionDocument>(
  {
    // Referral
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    referrerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Personal Details
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },

    applicantEmail: {
      type: String,
      required: [true, 'Applicant email is required'],
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },

    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
    },

    // KYC
    panNumber: {
      type: String,
      required: [true, 'PAN number is required'],
      uppercase: true,
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      trim: true,
    },

    // Address
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },

    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },

    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },

    // Loan Details
    loanType: {
      type: String,
      required: [true, 'Loan type is required'],
    },

    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: 1,
    },

    loanPurpose: {
      type: String,
      required: [true, 'Loan purpose is required'],
      trim: true,
    },

    existingLoan: {
      type: Boolean,
      required: true,
    },

    existingEmi: {
      type: Number,
      min: 0,
    },

    // Employment
    employmentType: {
      type: String,
      enum: ['salaried', 'self-employed'],
      required: [true, 'Employment type is required'],
    },

    // Salaried
    companyName: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    workExperience: {
      type: String,
      trim: true,
    },

    monthlyIncome: {
      type: Number,
      min: 0,
    },

    // Self Employed
    businessName: {
      type: String,
      trim: true,
    },

    businessType: {
      type: String,
      trim: true,
    },

    businessVintage: {
      type: String,
      trim: true,
    },

    annualIncome: {
      type: Number,
      min: 0,
    },

    businessAddress: {
      type: String,
      trim: true,
    },

    // Documents
    documents: {
      pan: UploadedDocumentSchema,
      aadhaar: UploadedDocumentSchema,
      salarySlips: [UploadedDocumentSchema],
      bankStatement: UploadedDocumentSchema,
      itr: UploadedDocumentSchema,
      form16: UploadedDocumentSchema,
      businessProof: UploadedDocumentSchema,
    },
  },
  {
    timestamps: true,
  }
);

const FormSubmission: Model<IFormSubmissionDocument> =
  mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmissionDocument>(
    'FormSubmission',
    FormSubmissionSchema
  );

export default FormSubmission;