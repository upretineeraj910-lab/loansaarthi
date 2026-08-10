// lib/types.ts

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'borrower' | 'lender' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'borrower' | 'lender' | 'admin';
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: Date;
  };
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IErrorResponse {
  error: string;
}

export interface IPasswordStrength {
  length: boolean;
  capital: boolean;
  special: boolean;
}

export interface IFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}


// 6 aug


// export interface IFormSubmissionInput {
//   applicantName: string;
//   applicantEmail: string;
//   message: string;
//   referrerId: string;
// }

// export interface IFormSubmission {
//   _id?: string;
//   applicantName: string;
//   applicantEmail: string;
//   message: string;
//   referrerId: string;
//   referrerName: string;
//   createdAt?: Date;
// }



// lib/types.ts

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'borrower' | 'lender' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'borrower' | 'lender' | 'admin';
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: Date;
  };
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IErrorResponse {
  error: string;
}

export interface IPasswordStrength {
  length: boolean;
  capital: boolean;
  special: boolean;
}

export interface IFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}


// =====================================
// LOAN FORM TYPES
// =====================================

export type EmploymentType =
  | 'salaried'
  | 'self-employed';


// =====================================
// UPLOADED DOCUMENT
// =====================================

export interface IUploadedDocument {
  fileName: string;
  storagePath: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}


// =====================================
// FORM SUBMISSION INPUT
// =====================================

export interface IFormSubmissionInput {
  // Referral
  referrerId: string;

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
  employmentType: EmploymentType;

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
}


// =====================================
// FORM SUBMISSION RESPONSE / DATABASE
// =====================================

export interface IFormSubmission {
  _id?: string;

  // Referral
  referrerId: string;
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
  employmentType: EmploymentType;

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
  documents?: {
    pan?: IUploadedDocument;
    aadhaar?: IUploadedDocument;
    salarySlips?: IUploadedDocument[];
    bankStatement?: IUploadedDocument;
    itr?: IUploadedDocument;
    form16?: IUploadedDocument;
    businessProof?: IUploadedDocument;
  };

  createdAt?: Date;
  updatedAt?: Date;
}