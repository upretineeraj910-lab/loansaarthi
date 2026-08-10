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
    // =====================================
    // 1. FORM DATA
    // =====================================

    const formData = await request.formData();

    console.log('🔵 Form data received');

    // =====================================
    // 2. REFERRER
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
    // 3. PERSONAL DETAILS
    // =====================================

    const applicantName = formData.get('applicantName')?.toString();
    const applicantEmail = formData.get('applicantEmail')?.toString();
    const mobile = formData.get('mobile')?.toString();
    const dateOfBirth = formData.get('dateOfBirth')?.toString();
    const gender = formData.get('gender')?.toString();

    // =====================================
    // 4. KYC
    // =====================================

    const panNumber = formData.get('panNumber')?.toString();
    const aadhaarNumber = formData.get('aadhaarNumber')?.toString();

    // =====================================
    // 5. ADDRESS
    // =====================================

    const address = formData.get('address')?.toString();
    const city = formData.get('city')?.toString();
    const state = formData.get('state')?.toString();
    const pincode = formData.get('pincode')?.toString();

    // =====================================
    // 6. LOAN DETAILS
    // =====================================

    const loanType = formData.get('loanType')?.toString();
    const loanPurpose = formData.get('loanPurpose')?.toString();

    const loanAmountValue = formData
      .get('loanAmount')
      ?.toString();

    const loanAmount = loanAmountValue
      ? Number(loanAmountValue)
      : NaN;

    const existingLoanValue = formData
      .get('existingLoan')
      ?.toString();

    const existingLoan = existingLoanValue === 'true';

    const existingEmiValue = formData
      .get('existingEmi')
      ?.toString();

    const existingEmi = existingEmiValue
      ? Number(existingEmiValue)
      : undefined;

    // =====================================
    // 7. EMPLOYMENT
    // =====================================

    const employmentType = formData
      .get('employmentType')
      ?.toString();

    // Salaried
    const companyName = formData
      .get('companyName')
      ?.toString();

    const designation = formData
      .get('designation')
      ?.toString();

    const workExperience = formData
      .get('workExperience')
      ?.toString();

    const monthlyIncomeValue = formData
      .get('monthlyIncome')
      ?.toString();

    const monthlyIncome = monthlyIncomeValue
      ? Number(monthlyIncomeValue)
      : undefined;

    // Self-employed
    const businessName = formData
      .get('businessName')
      ?.toString();

    const businessType = formData
      .get('businessType')
      ?.toString();

    const businessVintage = formData
      .get('businessVintage')
      ?.toString();

    const annualIncomeValue = formData
      .get('annualIncome')
      ?.toString();

    const annualIncome = annualIncomeValue
      ? Number(annualIncomeValue)
      : undefined;

    const businessAddress = formData
      .get('businessAddress')
      ?.toString();

    // =====================================
    // 8. REQUIRED VALIDATION
    // =====================================

    if (
      !applicantName ||
      !applicantEmail ||
      !mobile ||
      !dateOfBirth ||
      !gender ||
      !panNumber ||
      !aadhaarNumber ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !loanType ||
      !loanPurpose ||
      !employmentType ||
      Number.isNaN(loanAmount) ||
      loanAmount <= 0
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
    // 9. EMPLOYMENT VALIDATION
    // =====================================

    if (employmentType === 'salaried') {
      if (
        !companyName ||
        !designation ||
        !workExperience ||
        monthlyIncome === undefined ||
        monthlyIncome <= 0
      ) {
        return NextResponse.json(
          {
            error:
              'Please provide all required salaried employment details',
          },
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
          {
            error:
              'Please provide all required self-employed details',
          },
          { status: 400 }
        );
      }
    }

    // =====================================
    // 10. READ DOCUMENTS
    // =====================================

    console.log('📂 Reading documents...');

    const panFileData = await fileToBuffer(
      formData.get('panDocument')
    );

    const aadhaarFileData = await fileToBuffer(
      formData.get('aadhaarDocument')
    );

    const bankFileData = await fileToBuffer(
      formData.get('bankStatement')
    );

    const itrFileData = await fileToBuffer(
      formData.get('itr')
    );

    const form16FileData = await fileToBuffer(
      formData.get('form16')
    );

    const businessProofFileData = await fileToBuffer(
      formData.get('businessProof')
    );

    // Salary slips
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
    console.log(
      '📄 Aadhaar:',
      aadhaarFileData ? 'YES' : 'NO'
    );
    console.log(
      '📄 Bank:',
      bankFileData ? 'YES' : 'NO'
    );
    console.log(
      '📄 ITR:',
      itrFileData ? 'YES' : 'NO'
    );
    console.log(
      '📄 Form 16:',
      form16FileData ? 'YES' : 'NO'
    );
    console.log(
      '📄 Business Proof:',
      businessProofFileData ? 'YES' : 'NO'
    );
    console.log(
      '📄 Salary Slips:',
      salarySlipDataList.length
    );

    // =====================================
    // 11. GOOGLE CLOUD DOCUMENTS
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

    // -------------------------------------
    // PAN
    // -------------------------------------

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

    // -------------------------------------
    // AADHAAR
    // -------------------------------------

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

    // -------------------------------------
    // BANK STATEMENT
    // -------------------------------------

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

    // -------------------------------------
    // ITR
    // -------------------------------------

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

    // -------------------------------------
    // FORM 16
    // -------------------------------------

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

    // -------------------------------------
    // BUSINESS PROOF
    // -------------------------------------

    if (businessProofFileData) {
      console.log('☁️ Uploading Business Proof...');

      documents.businessProof =
        await uploadToGoogleCloud(
          businessProofFileData.buffer,
          businessProofFileData.name,
          businessProofFileData.type,
          `borrowers/${referrerId}/business-proof`
        );

      console.log('✅ Business Proof uploaded');
    }

    // -------------------------------------
    // SALARY SLIPS
    // -------------------------------------

    if (salarySlipDataList.length > 0) {
      console.log(
        `☁️ Uploading ${salarySlipDataList.length} salary slip(s)...`
      );

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
    // 12. SAVE TO MONGODB
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

      // KYC
      panNumber,
      aadhaarNumber,

      // Address
      address,
      city,
      state,
      pincode,

      // Loan
      loanType,
      loanAmount,
      loanPurpose,
      existingLoan,
      existingEmi,

      // Employment
      employmentType,

      // Salaried
      companyName,
      designation,
      workExperience,
      monthlyIncome,

      // Self-employed
      businessName,
      businessType,
      businessVintage,
      annualIncome,
      businessAddress,

      // Documents
      documents,
    });

    await newSubmission.save();

    console.log(
      '✅ MONGODB SAVED:',
      newSubmission._id.toString()
    );

    // =====================================
    // 13. SUCCESS
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
    console.error(
      '❌ FORM SUBMISSION ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Internal server error',
      },
      { status: 500 }
    );
  }
}