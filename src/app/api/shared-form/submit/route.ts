import connectToDatabase from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import User from '@/models/User';
import { uploadToGoogleCloud } from '@/lib/googleCloudStorage';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// File ko immediately Buffer me convert karta hai
async function fileToBuffer(file: unknown) {
  if (file instanceof File && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();

    return {
      buffer: Buffer.from(arrayBuffer),
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    console.log('🔵 Form data received');

    // Log all form data
    console.log('📋 All form data received:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // =====================================
    // REFERRER
    // =====================================

    const referrerId = formData.get('referrerId')?.toString();

    if (!referrerId) {
      return NextResponse.json(
        { error: 'Referral information is required' },
        { status: 400 }
      );
    }

    const referrer = await User.findById(referrerId);

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referrer user' },
        { status: 400 }
      );
    }

    console.log('✅ Referrer:', referrer.name);

    // =====================================
    // PERSONAL DETAILS
    // =====================================

    const applicantName = formData.get('applicantName')?.toString();
    const applicantEmail = formData.get('applicantEmail')?.toString();
    const mobile = formData.get('mobile')?.toString();
    const dateOfBirth = formData.get('dateOfBirth')?.toString();
    const gender = formData.get('gender')?.toString();
    const fatherName = formData.get('fatherName')?.toString();
    const motherName = formData.get('motherName')?.toString();
    const educationDetails = formData.get('educationDetails')?.toString();

    // =====================================
    // KYC
    // =====================================

    const panNumber = formData.get('panNumber')?.toString();
    const aadhaarNumber = formData.get('aadhaarNumber')?.toString();

    // =====================================
    // ADDRESS
    // =====================================

    const address = formData.get('address')?.toString();
    const city = formData.get('city')?.toString();
    const state = formData.get('state')?.toString();
    const pincode = formData.get('pincode')?.toString();
    const residenceOwnership = formData.get('residenceOwnership')?.toString();
    const yearsAtResidence = formData.get('yearsAtResidence')?.toString();
    const permanentAddress = formData.get('permanentAddress')?.toString();
    const paContactNumber = formData.get('paContactNumber')?.toString();

    // =====================================
    // LOAN DETAILS
    // =====================================

    const loanType = formData.get('loanType')?.toString();
    const loanPurpose = formData.get('loanPurpose')?.toString();
    const loanAmountValue = formData.get('loanAmount')?.toString();
    const loanAmount = loanAmountValue ? Number(loanAmountValue) : NaN;
    const tenure = formData.get('tenure')?.toString();
    
    const existingLoanValue = formData.get('existingLoan')?.toString();
    const existingLoan = existingLoanValue === 'true';
    const existingEmiValue = formData.get('existingEmi')?.toString();
    const existingEmi = existingEmiValue ? Number(existingEmiValue) : undefined;

    // =====================================
    // EMPLOYMENT DETAILS
    // =====================================

    const employmentType = formData.get('employmentType')?.toString();

    // Common fields
    const companyName = formData.get('companyName')?.toString();
    const officeAddress = formData.get('officeAddress')?.toString();
    const officeContact = formData.get('officeContact')?.toString();
    const officialEmail = formData.get('officialEmail')?.toString();
    const personalEmail = formData.get('personalEmail')?.toString();
    const yearsAtJob = formData.get('yearsAtJob')?.toString();
    const designation = formData.get('designation')?.toString();
    const previousOrganisation = formData.get('previousOrganisation')?.toString();
    const totalJobExp = formData.get('totalJobExp')?.toString();

    // Salaried specific
    const monthlyIncomeValue = formData.get('monthlyIncome')?.toString();
    const monthlyIncome = monthlyIncomeValue ? Number(monthlyIncomeValue) : undefined;

    // Self-employed specific
    const businessName = formData.get('businessName')?.toString();
    const businessType = formData.get('businessType')?.toString();
    const businessVintage = formData.get('businessVintage')?.toString();
    const annualIncomeValue = formData.get('annualIncome')?.toString();
    const annualIncome = annualIncomeValue ? Number(annualIncomeValue) : undefined;
    const businessAddress = formData.get('businessAddress')?.toString();

    // =====================================
    // REFERENCES
    // =====================================

    const ref1Name = formData.get('ref1Name')?.toString();
    const ref1Address = formData.get('ref1Address')?.toString();
    const ref1Contact = formData.get('ref1Contact')?.toString();
    const ref1Relation = formData.get('ref1Relation')?.toString();

    const ref2Name = formData.get('ref2Name')?.toString();
    const ref2Address = formData.get('ref2Address')?.toString();
    const ref2Contact = formData.get('ref2Contact')?.toString();
    const ref2Relation = formData.get('ref2Relation')?.toString();

    // =====================================
    // REQUIRED VALIDATION
    // =====================================

    if (
      !applicantName ||
      !applicantEmail ||
      !mobile ||
      !dateOfBirth ||
      !gender ||
      !fatherName ||
      !motherName ||
      !educationDetails ||
      !panNumber ||
      !aadhaarNumber ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !residenceOwnership ||
      !yearsAtResidence ||
      !permanentAddress ||
      !paContactNumber ||
      !loanType ||
      !loanPurpose ||
      !tenure ||
      !employmentType ||
      Number.isNaN(loanAmount) ||
      loanAmount <= 0 ||
      !companyName ||
      !officeAddress ||
      !officeContact ||
      !officialEmail ||
      !personalEmail ||
      !yearsAtJob ||
      !designation ||
      !previousOrganisation ||
      !totalJobExp ||
      !ref1Name ||
      !ref1Address ||
      !ref1Contact ||
      !ref1Relation ||
      !ref2Name ||
      !ref2Address ||
      !ref2Contact ||
      !ref2Relation
    ) {
      return NextResponse.json(
        { error: 'Please fill all required fields' },
        { status: 400 }
      );
    }

    if (
      employmentType !== 'salaried' &&
      employmentType !== 'self-employed'
    ) {
      return NextResponse.json(
        { error: 'Invalid employment type' },
        { status: 400 }
      );
    }

    // =====================================
    // EMPLOYMENT VALIDATION
    // =====================================

    if (employmentType === 'salaried') {
      if (
        monthlyIncome === undefined ||
        monthlyIncome <= 0
      ) {
        return NextResponse.json(
          { error: 'Please provide monthly income for salaried employee' },
          { status: 400 }
        );
      }
    }

    if (employmentType === 'self-employed') {
      if (
        !businessName ||
        !businessType ||
        !businessVintage ||
        annualIncome === undefined ||
        annualIncome <= 0 ||
        !businessAddress
      ) {
        return NextResponse.json(
          { error: 'Please provide all required self-employed details' },
          { status: 400 }
        );
      }
    }

    // =====================================
    // READ DOCUMENTS
    // =====================================

    console.log('📂 Reading documents...');

    const panFileData = await fileToBuffer(formData.get('panDocument'));
    const aadhaarFileData = await fileToBuffer(formData.get('aadhaarDocument'));
    const bankFileData = await fileToBuffer(formData.get('bankStatement'));
    const itrFileData = await fileToBuffer(formData.get('itr'));
    const form16FileData = await fileToBuffer(formData.get('form16'));
    const businessProofFileData = await fileToBuffer(formData.get('businessProof'));

    const rawSalaryFiles = formData.getAll('salarySlips');
    const salarySlipDataList: {
      buffer: Buffer;
      name: string;
      type: string;
      size: number;
    }[] = [];

    for (const file of rawSalaryFiles) {
      const parsed = await fileToBuffer(file);
      if (parsed) {
        salarySlipDataList.push(parsed);
      }
    }

    console.log('📄 PAN:', panFileData ? 'YES' : 'NO');
    console.log('📄 Aadhaar:', aadhaarFileData ? 'YES' : 'NO');
    console.log('📄 Bank:', bankFileData ? 'YES' : 'NO');
    console.log('📄 ITR:', itrFileData ? 'YES' : 'NO');
    console.log('📄 Form 16:', form16FileData ? 'YES' : 'NO');
    console.log('📄 Business Proof:', businessProofFileData ? 'YES' : 'NO');
    console.log('📄 Salary Slips:', salarySlipDataList.length);

    // =====================================
    // GOOGLE CLOUD DOCUMENTS
    // =====================================

    const documents: {
      pan?: any;
      aadhaar?: any;
      salarySlips?: any[];
      bankStatement?: any;
      itr?: any;
      form16?: any;
      businessProof?: any;
    } = {};

    // PAN
    if (panFileData) {
      console.log('☁️ Uploading PAN...');
      documents.pan = await uploadToGoogleCloud(
        panFileData.buffer,
        panFileData.name,
        panFileData.type,
        `borrowers/${referrerId}/pan`
      );
      console.log('✅ PAN uploaded');
    }

    // AADHAAR
    if (aadhaarFileData) {
      console.log('☁️ Uploading Aadhaar...');
      documents.aadhaar = await uploadToGoogleCloud(
        aadhaarFileData.buffer,
        aadhaarFileData.name,
        aadhaarFileData.type,
        `borrowers/${referrerId}/aadhaar`
      );
      console.log('✅ Aadhaar uploaded');
    }

    // BANK STATEMENT
    if (bankFileData) {
      console.log('☁️ Uploading Bank Statement...');
      documents.bankStatement = await uploadToGoogleCloud(
        bankFileData.buffer,
        bankFileData.name,
        bankFileData.type,
        `borrowers/${referrerId}/bank-statements`
      );
      console.log('✅ Bank Statement uploaded');
    }

    // ITR
    if (itrFileData) {
      console.log('☁️ Uploading ITR...');
      documents.itr = await uploadToGoogleCloud(
        itrFileData.buffer,
        itrFileData.name,
        itrFileData.type,
        `borrowers/${referrerId}/itr`
      );
      console.log('✅ ITR uploaded');
    }

    // FORM 16
    if (form16FileData) {
      console.log('☁️ Uploading Form 16...');
      documents.form16 = await uploadToGoogleCloud(
        form16FileData.buffer,
        form16FileData.name,
        form16FileData.type,
        `borrowers/${referrerId}/form16`
      );
      console.log('✅ Form 16 uploaded');
    }

    // BUSINESS PROOF
    if (businessProofFileData) {
      console.log('☁️ Uploading Business Proof...');
      documents.businessProof = await uploadToGoogleCloud(
        businessProofFileData.buffer,
        businessProofFileData.name,
        businessProofFileData.type,
        `borrowers/${referrerId}/business-proof`
      );
      console.log('✅ Business Proof uploaded');
    }

    // SALARY SLIPS
    if (salarySlipDataList.length > 0) {
      console.log(`☁️ Uploading ${salarySlipDataList.length} salary slip(s)...`);
      const salarySlips = [];
      for (const item of salarySlipDataList) {
        const uploaded = await uploadToGoogleCloud(
          item.buffer,
          item.name,
          item.type,
          `borrowers/${referrerId}/salary-slips`
        );
        salarySlips.push(uploaded);
      }
      documents.salarySlips = salarySlips;
      console.log('✅ Salary slips uploaded');
    }

    // =====================================
    // SAVE TO MONGODB
    // =====================================

    console.log('💾 Connecting to MongoDB...');
    await connectToDatabase();

    console.log('💾 Saving submission...');

    const newSubmission = new FormSubmission({
      // Referral
      referrerId: referrer._id,
      referrerName: referrer.name,

      // Personal
      applicantName,
      applicantEmail,
      mobile,
      dateOfBirth,
      gender,
      fatherName,
      motherName,
      educationDetails,

      // KYC
      panNumber,
      aadhaarNumber,

      // Address
      address,
      city,
      state,
      pincode,
      residenceOwnership,
      yearsAtResidence,
      permanentAddress,
      paContactNumber,

      // Loan
      loanType,
      loanAmount,
      loanPurpose,
      tenure,
      existingLoan,
      existingEmi,

      // Employment
      employmentType,
      companyName,
      officeAddress,
      officeContact,
      officialEmail,
      personalEmail,
      yearsAtJob,
      designation,
      previousOrganisation,
      totalJobExp,
      monthlyIncome,

      // Self-employed
      businessName,
      businessType,
      businessVintage,
      annualIncome,
      businessAddress,

      // References
      references: {
        ref1: {
          name: ref1Name,
          address: ref1Address,
          contact: ref1Contact,
          relation: ref1Relation,
        },
        ref2: {
          name: ref2Name,
          address: ref2Address,
          contact: ref2Contact,
          relation: ref2Relation,
        }
      },

      // Documents
      documents,
    });

    await newSubmission.save();

    console.log('✅ MONGODB SAVED:', newSubmission._id.toString());

    // =====================================
    // SUCCESS
    // =====================================

    return NextResponse.json(
      {
        message: 'Form submitted successfully!',
        data: {
          id: newSubmission._id,
          referrerName: referrer.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ FORM SUBMISSION ERROR:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}