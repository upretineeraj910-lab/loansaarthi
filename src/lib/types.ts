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