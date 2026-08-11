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
  fatherName: string;
  motherName: string;
  educationDetails: string;

  // KYC
  panNumber: string;
  aadhaarNumber: string;

  // Address
  address: string;
  city: string;
  state: string;
  pincode: string;
  residenceOwnership: string;
  yearsAtResidence: string;
  permanentAddress: string;
  paContactNumber: string;

  // Loan Details
  loanType: string;
  loanAmount: number;
  loanPurpose: string;
  tenure: string;
  existingLoan: boolean;
  existingEmi?: number;

  // Employment
  employmentType: 'salaried' | 'self-employed';

  // Common Employment Fields
  companyName: string;
  officeAddress: string;
  officeContact: string;
  officialEmail: string;
  personalEmail: string;
  yearsAtJob: string;
  designation: string;
  previousOrganisation: string;
  totalJobExp: string;
  monthlyIncome?: number;

  // Self Employed
  businessName?: string;
  businessType?: string;
  businessVintage?: string;
  annualIncome?: number;
  businessAddress?: string;

  // References
  references: {
    ref1: {
      name: string;
      address: string;
      contact: string;
      relation: string;
    };
    ref2: {
      name: string;
      address: string;
      contact: string;
      relation: string;
    };
  };

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

    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },

    motherName: {
      type: String,
      required: [true, "Mother's name is required"],
      trim: true,
    },

    educationDetails: {
      type: String,
      required: [true, 'Education details are required'],
      trim: true,
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

    residenceOwnership: {
      type: String,
      required: [true, 'Residence ownership is required'],
      trim: true,
    },

    yearsAtResidence: {
      type: String,
      required: [true, 'Years at residence is required'],
      trim: true,
    },

    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
      trim: true,
    },

    paContactNumber: {
      type: String,
      required: [true, 'PA contact number is required'],
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

    tenure: {
      type: String,
      required: [true, 'Tenure is required'],
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

    // Common Employment Fields
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    officeAddress: {
      type: String,
      required: [true, 'Office address is required'],
      trim: true,
    },

    officeContact: {
      type: String,
      required: [true, 'Office contact is required'],
      trim: true,
    },

    officialEmail: {
      type: String,
      required: [true, 'Official email is required'],
      lowercase: true,
      trim: true,
    },

    personalEmail: {
      type: String,
      required: [true, 'Personal email is required'],
      lowercase: true,
      trim: true,
    },

    yearsAtJob: {
      type: String,
      required: [true, 'Years at job is required'],
      trim: true,
    },

    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },

    previousOrganisation: {
      type: String,
      required: [true, 'Previous organisation is required'],
      trim: true,
    },

    totalJobExp: {
      type: String,
      required: [true, 'Total job experience is required'],
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

    // References
    references: {
      ref1: {
        name: {
          type: String,
          required: [true, 'Reference 1 name is required'],
          trim: true,
        },
        address: {
          type: String,
          required: [true, 'Reference 1 address is required'],
          trim: true,
        },
        contact: {
          type: String,
          required: [true, 'Reference 1 contact is required'],
          trim: true,
        },
        relation: {
          type: String,
          required: [true, 'Reference 1 relation is required'],
          trim: true,
        },
      },
      ref2: {
        name: {
          type: String,
          required: [true, 'Reference 2 name is required'],
          trim: true,
        },
        address: {
          type: String,
          required: [true, 'Reference 2 address is required'],
          trim: true,
        },
        contact: {
          type: String,
          required: [true, 'Reference 2 contact is required'],
          trim: true,
        },
        relation: {
          type: String,
          required: [true, 'Reference 2 relation is required'],
          trim: true,
        },
      },
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