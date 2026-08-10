'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
export const runtime = 'nodejs';

type EmploymentType = 'salaried' | 'self-employed';

interface FormDataState {
  applicantName: string;
  applicantEmail: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;

  panNumber: string;
  aadhaarNumber: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  loanType: string;
  loanAmount: string;
  loanPurpose: string;
  existingLoan: string;
  existingEmi: string;

  employmentType: EmploymentType;

  companyName: string;
  designation: string;
  workExperience: string;
  monthlyIncome: string;

  businessName: string;
  businessType: string;
  businessVintage: string;
  annualIncome: string;
  businessAddress: string;
}

const initialFormData: FormDataState = {
  applicantName: '',
  applicantEmail: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',

  panNumber: '',
  aadhaarNumber: '',

  address: '',
  city: '',
  state: '',
  pincode: '',

  loanType: '',
  loanAmount: '',
  loanPurpose: '',
  existingLoan: '',
  existingEmi: '',

  employmentType: 'salaried',

  companyName: '',
  designation: '',
  workExperience: '',
  monthlyIncome: '',

  businessName: '',
  businessType: '',
  businessVintage: '',
  annualIncome: '',
  businessAddress: '',
};

function SharedFormContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get('ref');

  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [formData, setFormData] =
    useState<FormDataState>(initialFormData);

  const [panDocument, setPanDocument] = useState<File | null>(null);
  const [aadhaarDocument, setAadhaarDocument] =
    useState<File | null>(null);
  const [bankStatement, setBankStatement] =
    useState<File | null>(null);
  const [salarySlips, setSalarySlips] = useState<File[]>([]);
  const [itr, setItr] = useState<File | null>(null);
  const [form16, setForm16] = useState<File | null>(null);
  const [businessProof, setBusinessProof] =
    useState<File | null>(null);

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | '';
    msg: string;
  }>({
    type: '',
    msg: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!refId) {
      setLoadingUser(false);
      setStatus({
        type: 'error',
        msg: 'Invalid referral link. Referral code is required.',
      });
      return;
    }

    async function fetchReferrer() {
      try {
        const res = await fetch(`/api/referrer/${refId}`);
        const data = await res.json();

        if (res.ok) {
          setReferrerName(data.name);
        } else {
          setStatus({
            type: 'error',
            msg: 'Invalid referral link',
          });
        }
      } catch {
        setStatus({
          type: 'error',
          msg: 'Failed to load referrer details',
        });
      } finally {
        setLoadingUser(false);
      }
    }

    fetchReferrer();
  }, [refId]);

  const updateField = (
    field: keyof FormDataState,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    file: File | null,
    setter: (file: File | null) => void
  ) => {
    if (!file) {
      setter(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setStatus({
        type: 'error',
        msg: 'Each document must be smaller than 10 MB.',
      });
      setter(null);
      return;
    }

    setter(file);
  };

  const handleSalarySlips = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    const maxSize = 10 * 1024 * 1024;

    const validFiles = files.filter(
      (file) => file.size <= maxSize
    );

    if (validFiles.length !== files.length) {
      setStatus({
        type: 'error',
        msg: 'Each salary slip must be smaller than 10 MB.',
      });
    }

    setSalarySlips(validFiles);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!refId) {
      setStatus({
        type: 'error',
        msg: 'Missing referral code in URL.',
      });
      return;
    }

    setSubmitting(true);
    setStatus({
      type: '',
      msg: '',
    });

    try {
      const data = new FormData();

      // Referral
      data.append('referrerId', refId);

      // Personal
      data.append('applicantName', formData.applicantName);
      data.append('applicantEmail', formData.applicantEmail);
      data.append('mobile', formData.mobile);
      data.append('dateOfBirth', formData.dateOfBirth);
      data.append('gender', formData.gender);

      // KYC
      data.append('panNumber', formData.panNumber);
      data.append('aadhaarNumber', formData.aadhaarNumber);

      // Address
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pincode', formData.pincode);

      // Loan
      data.append('loanType', formData.loanType);
      data.append('loanAmount', formData.loanAmount);
      data.append('loanPurpose', formData.loanPurpose);
      data.append('existingLoan', formData.existingLoan);

      if (formData.existingLoan === 'true') {
        data.append('existingEmi', formData.existingEmi);
      }

      // Employment
      data.append(
        'employmentType',
        formData.employmentType
      );

      if (formData.employmentType === 'salaried') {
        data.append('companyName', formData.companyName);
        data.append('designation', formData.designation);
        data.append(
          'workExperience',
          formData.workExperience
        );
        data.append(
          'monthlyIncome',
          formData.monthlyIncome
        );
      }

      if (formData.employmentType === 'self-employed') {
        data.append(
          'businessName',
          formData.businessName
        );
        data.append(
          'businessType',
          formData.businessType
        );
        data.append(
          'businessVintage',
          formData.businessVintage
        );
        data.append(
          'annualIncome',
          formData.annualIncome
        );
        data.append(
          'businessAddress',
          formData.businessAddress
        );
      }

      // Documents
      if (panDocument) {
        data.append('panDocument', panDocument);
      }

      if (aadhaarDocument) {
        data.append(
          'aadhaarDocument',
          aadhaarDocument
        );
      }

      if (bankStatement) {
        data.append(
          'bankStatement',
          bankStatement
        );
      }

      if (itr) {
        data.append('itr', itr);
      }

      if (form16) {
        data.append('form16', form16);
      }

      if (businessProof) {
        data.append(
          'businessProof',
          businessProof
        );
      }

      salarySlips.forEach((file) => {
        data.append('salarySlips', file);
      });

      const res = await fetch(
        '/api/shared-form/submit',
        {
          method: 'POST',
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.error || 'Submission failed'
        );
      }

      setStatus({
        type: 'success',
        msg: 'Application submitted successfully!',
      });

      setFormData(initialFormData);

      setPanDocument(null);
      setAadhaarDocument(null);
      setBankStatement(null);
      setSalarySlips([]);
      setItr(null);
      setForm16(null);
      setBusinessProof(null);

      const fileInputs =
        document.querySelectorAll<HTMLInputElement>(
          'input[type="file"]'
        );

      fileInputs.forEach((input) => {
        input.value = '';
      });
    } catch (error) {
      console.error(error);

      setStatus({
        type: 'error',
        msg:
          error instanceof Error
            ? error.message
            : 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading form details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">

        {/* REFERRER */}
        <div className="mb-6">
          {referrerName ? (
            <div className="p-4 rounded-lg bg-green-50 text-green-800">
              🤝 Form shared by:{' '}
              <strong>{referrerName}</strong>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-50 text-red-800">
              ⚠️ Invalid referral link
            </div>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Loan Application Form
          </h1>

          <p className="text-gray-500 mt-2">
            Please provide your details and required documents.
          </p>
        </div>

        {/* STATUS */}
        {status.msg && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              status.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status.msg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* PERSONAL DETAILS */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Personal Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  value={formData.applicantName}
                  onChange={(e) =>
                    updateField(
                      'applicantName',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>

                <input
                  type="email"
                  required
                  value={formData.applicantEmail}
                  onChange={(e) =>
                    updateField(
                      'applicantEmail',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    updateField(
                      'mobile',
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="10 digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth *
                </label>

                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    updateField(
                      'dateOfBirth',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender *
                </label>

                <select
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    updateField(
                      'gender',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

            </div>
          </section>

          {/* KYC */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. KYC Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  PAN Number *
                </label>

                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) =>
                    updateField(
                      'panNumber',
                      e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '')
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="ABCDE1234F"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Aadhaar Number *
                </label>

                <input
                  type="text"
                  required
                  maxLength={12}
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    updateField(
                      'aadhaarNumber',
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="12 digit Aadhaar number"
                />
              </div>

            </div>
          </section>

          {/* ADDRESS */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Address
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Address *
                </label>

                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) =>
                    updateField(
                      'address',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">

                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    updateField(
                      'city',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="City *"
                />

                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) =>
                    updateField(
                      'state',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="State *"
                />

                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    updateField(
                      'pincode',
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Pincode *"
                />

              </div>
            </div>
          </section>

          {/* LOAN */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Loan Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Loan Type *
                </label>

                <select
                  required
                  value={formData.loanType}
                  onChange={(e) =>
                    updateField(
                      'loanType',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">
                    Select loan type
                  </option>
                  <option value="personal">
                    Personal Loan
                  </option>
                  <option value="business">
                    Business Loan
                  </option>
                  <option value="home">
                    Home Loan
                  </option>
                  <option value="education">
                    Education Loan
                  </option>
                  <option value="vehicle">
                    Vehicle Loan
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Required Loan Amount *
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  value={formData.loanAmount}
                  onChange={(e) =>
                    updateField(
                      'loanAmount',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Loan Purpose *
                </label>

                <input
                  type="text"
                  required
                  value={formData.loanPurpose}
                  onChange={(e) =>
                    updateField(
                      'loanPurpose',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Why do you need the loan?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Existing Loan? *
                </label>

                <select
                  required
                  value={formData.existingLoan}
                  onChange={(e) =>
                    updateField(
                      'existingLoan',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">
                    Select
                  </option>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {formData.existingLoan === 'true' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current EMI
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.existingEmi}
                    onChange={(e) =>
                      updateField(
                        'existingEmi',
                        e.target.value
                      )
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="Current monthly EMI"
                  />
                </div>
              )}

            </div>
          </section>

          {/* EMPLOYMENT */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              5. Employment Details
            </h2>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-1">
                Employment Type *
              </label>

              <select
                required
                value={formData.employmentType}
                onChange={(e) =>
                  updateField(
                    'employmentType',
                    e.target.value
                  )
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="salaried">
                  Salaried
                </option>
                <option value="self-employed">
                  Self Employed
                </option>
              </select>
            </div>

            {/* SALARIED */}
            {formData.employmentType === 'salaried' && (
              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    updateField(
                      'companyName',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Company / Employer Name *"
                />

                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) =>
                    updateField(
                      'designation',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Designation *"
                />

                <input
                  type="text"
                  required
                  value={formData.workExperience}
                  onChange={(e) =>
                    updateField(
                      'workExperience',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Work experience *"
                />

                <input
                  type="number"
                  required
                  min="0"
                  value={formData.monthlyIncome}
                  onChange={(e) =>
                    updateField(
                      'monthlyIncome',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Monthly income *"
                />

              </div>
            )}

            {/* SELF EMPLOYED */}
            {formData.employmentType ===
              'self-employed' && (
              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) =>
                    updateField(
                      'businessName',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Business Name *"
                />

                <input
                  type="text"
                  required
                  value={formData.businessType}
                  onChange={(e) =>
                    updateField(
                      'businessType',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Business Type *"
                />

                <input
                  type="text"
                  required
                  value={formData.businessVintage}
                  onChange={(e) =>
                    updateField(
                      'businessVintage',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Business Vintage *"
                />

                <input
                  type="number"
                  required
                  min="0"
                  value={formData.annualIncome}
                  onChange={(e) =>
                    updateField(
                      'annualIncome',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Annual income *"
                />

                <textarea
                  required
                  rows={3}
                  value={formData.businessAddress}
                  onChange={(e) =>
                    updateField(
                      'businessAddress',
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg md:col-span-2"
                  placeholder="Business Address *"
                />

              </div>
            )}
          </section>

          {/* DOCUMENTS */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              6. Documents
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Upload clear PDF, JPG or PNG documents.
              Maximum size: 10 MB per file.
            </p>

            <div className="space-y-5">

              {/* PAN */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  PAN Document
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files?.[0] || null,
                      setPanDocument
                    )
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* AADHAAR */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aadhaar Document
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files?.[0] || null,
                      setAadhaarDocument
                    )
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* BANK */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Statement
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files?.[0] || null,
                      setBankStatement
                    )
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* SALARY SLIPS */}
              {formData.employmentType === 'salaried' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Salary Slips
                  </label>

                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleSalarySlips}
                    className="w-full p-2 border rounded-lg"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    You can select multiple salary slips.
                  </p>
                </div>
              )}

              {/* ITR */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  ITR Document
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files?.[0] || null,
                      setItr
                    )
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* FORM 16 */}
              {formData.employmentType === 'salaried' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Form 16
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        e.target.files?.[0] || null,
                        setForm16
                      )
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}

              {/* BUSINESS PROOF */}
              {formData.employmentType ===
                'self-employed' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business Proof
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        e.target.files?.[0] || null,
                        setBusinessProof
                      )
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}

            </div>
          </section>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={
              submitting || !refId
            }
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Submitting Application...'
              : 'Submit Loan Application'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default function SharedFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SharedFormContent />
    </Suspense>
  );
}