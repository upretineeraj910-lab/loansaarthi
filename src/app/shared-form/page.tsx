'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export const runtime = 'nodejs';

type EmploymentType = 'salaried' | 'self-employed';

interface FormDataState {
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
  loanAmount: string;
  loanPurpose: string;
  tenure: string;
  existingLoan: string;
  existingEmi: string;

  // Employment
  employmentType: EmploymentType;
  companyName: string;
  officeAddress: string;
  officeContact: string;
  officialEmail: string;
  personalEmail: string;
  yearsAtJob: string;
  designation: string;
  previousOrganisation: string;
  totalJobExp: string;
  monthlyIncome: string;

  // Self Employed
  businessName: string;
  businessType: string;
  businessVintage: string;
  annualIncome: string;
  businessAddress: string;

  // References
  ref1Name: string;
  ref1Address: string;
  ref1Contact: string;
  ref1Relation: string;
  ref2Name: string;
  ref2Address: string;
  ref2Contact: string;
  ref2Relation: string;
}

const initialFormData: FormDataState = {
  applicantName: '',
  applicantEmail: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',
  fatherName: '',
  motherName: '',
  educationDetails: '',
  panNumber: '',
  aadhaarNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  residenceOwnership: '',
  yearsAtResidence: '',
  permanentAddress: '',
  paContactNumber: '',
  loanType: '',
  loanAmount: '',
  loanPurpose: '',
  tenure: '',
  existingLoan: '',
  existingEmi: '',
  employmentType: 'salaried',
  companyName: '',
  officeAddress: '',
  officeContact: '',
  officialEmail: '',
  personalEmail: '',
  yearsAtJob: '',
  designation: '',
  previousOrganisation: '',
  totalJobExp: '',
  monthlyIncome: '',
  businessName: '',
  businessType: '',
  businessVintage: '',
  annualIncome: '',
  businessAddress: '',
  ref1Name: '',
  ref1Address: '',
  ref1Contact: '',
  ref1Relation: '',
  ref2Name: '',
  ref2Address: '',
  ref2Contact: '',
  ref2Relation: '',
};

function SharedFormContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get('ref');

  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  const [panDocument, setPanDocument] = useState<File | null>(null);
  const [aadhaarDocument, setAadhaarDocument] = useState<File | null>(null);
  const [bankStatement, setBankStatement] = useState<File | null>(null);
  const [salarySlips, setSalarySlips] = useState<File[]>([]);
  const [itr, setItr] = useState<File | null>(null);
  const [form16, setForm16] = useState<File | null>(null);
  const [businessProof, setBusinessProof] = useState<File | null>(null);

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

  const updateField = (field: keyof FormDataState, value: string) => {
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

  const handleSalarySlips = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      setStatus({
        type: 'error',
        msg: 'Each salary slip must be smaller than 10 MB.',
      });
    }

    setSalarySlips(validFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      data.append('referrerId', refId);
      data.append('applicantName', formData.applicantName);
      data.append('applicantEmail', formData.applicantEmail);
      data.append('mobile', formData.mobile);
      data.append('dateOfBirth', formData.dateOfBirth);
      data.append('gender', formData.gender);
      data.append('fatherName', formData.fatherName);
      data.append('motherName', formData.motherName);
      data.append('educationDetails', formData.educationDetails);
      data.append('panNumber', formData.panNumber);
      data.append('aadhaarNumber', formData.aadhaarNumber);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pincode', formData.pincode);
      data.append('residenceOwnership', formData.residenceOwnership);
      data.append('yearsAtResidence', formData.yearsAtResidence);
      data.append('permanentAddress', formData.permanentAddress);
      data.append('paContactNumber', formData.paContactNumber);
      data.append('loanType', formData.loanType);
      data.append('loanAmount', formData.loanAmount);
      data.append('loanPurpose', formData.loanPurpose);
      data.append('tenure', formData.tenure);
      data.append('existingLoan', formData.existingLoan);

      if (formData.existingLoan === 'true') {
        data.append('existingEmi', formData.existingEmi);
      }

      data.append('employmentType', formData.employmentType);
      data.append('companyName', formData.companyName);
      data.append('officeAddress', formData.officeAddress);
      data.append('officeContact', formData.officeContact);
      data.append('officialEmail', formData.officialEmail);
      data.append('personalEmail', formData.personalEmail);
      data.append('yearsAtJob', formData.yearsAtJob);
      data.append('designation', formData.designation);
      data.append('previousOrganisation', formData.previousOrganisation);
      data.append('totalJobExp', formData.totalJobExp);

      if (formData.employmentType === 'salaried') {
        data.append('monthlyIncome', formData.monthlyIncome);
      }

      if (formData.employmentType === 'self-employed') {
        data.append('businessName', formData.businessName);
        data.append('businessType', formData.businessType);
        data.append('businessVintage', formData.businessVintage);
        data.append('annualIncome', formData.annualIncome);
        data.append('businessAddress', formData.businessAddress);
      }

      data.append('ref1Name', formData.ref1Name);
      data.append('ref1Address', formData.ref1Address);
      data.append('ref1Contact', formData.ref1Contact);
      data.append('ref1Relation', formData.ref1Relation);
      data.append('ref2Name', formData.ref2Name);
      data.append('ref2Address', formData.ref2Address);
      data.append('ref2Contact', formData.ref2Contact);
      data.append('ref2Relation', formData.ref2Relation);

      if (panDocument) data.append('panDocument', panDocument);
      if (aadhaarDocument) data.append('aadhaarDocument', aadhaarDocument);
      if (bankStatement) data.append('bankStatement', bankStatement);
      if (itr) data.append('itr', itr);
      if (form16) data.append('form16', form16);
      if (businessProof) data.append('businessProof', businessProof);

      salarySlips.forEach((file) => {
        data.append('salarySlips', file);
      });

      const res = await fetch('/api/shared-form/submit', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Submission failed');
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

      const fileInputs = document.querySelectorAll<HTMLInputElement>(
        'input[type="file"]'
      );
      fileInputs.forEach((input) => {
        input.value = '';
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: 'error',
        msg: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className={styles.loadingContainer}>
        <div>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading form details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.logo}>LoansAarthi</h1>
          <p className={styles.logoSub}>Your Trusted Loan Partner</p>
        </div>

        {/* REFERRER */}
        <div className={referrerName ? styles.referrerBadge : styles.referrerBadgeError}>
          <span>{referrerName ? '🤝' : '⚠️'}</span>
          <span>
            {referrerName ? (
              <>Form shared by: <strong>{referrerName}</strong></>
            ) : (
              'Invalid referral link'
            )}
          </span>
        </div>

        <div className={styles.formDivider}>
          <h2 className={styles.sectionTitle} style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            Loan Application Form
          </h2>
          <p className="text-gray-500 mt-1">Please provide your details and required documents.</p>
        </div>

        {/* STATUS */}
        {status.msg && (
          <div className={status.type === 'success' ? styles.statusSuccess : styles.statusError}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PERSONAL DETAILS */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>1</span>
              Personal Details
            </h3>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Applicant Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.applicantName}
                  onChange={(e) => updateField('applicantName', e.target.value)}
                  className={styles.input}
                  placeholder="Enter full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.applicantEmail}
                  onChange={(e) => updateField('applicantEmail', e.target.value)}
                  className={styles.input}
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Contact No.
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    updateField('mobile', e.target.value.replace(/\D/g, ''))
                  }
                  className={styles.input}
                  placeholder="10 digit mobile number"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Father's Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => updateField('fatherName', e.target.value)}
                  className={styles.input}
                  placeholder="Enter father's name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Mother's Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.motherName}
                  onChange={(e) => updateField('motherName', e.target.value)}
                  className={styles.input}
                  placeholder="Enter mother's name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Education Details
                </label>
                <input
                  type="text"
                  required
                  value={formData.educationDetails}
                  onChange={(e) => updateField('educationDetails', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., Graduate, Post Graduate, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Gender
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Customer Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    updateField('mobile', e.target.value.replace(/\D/g, ''))
                  }
                  className={styles.input}
                  placeholder="10 digit mobile number"
                />
              </div>
            </div>
          </section>

          {/* KYC DETAILS */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>2</span>
              KYC Details
            </h3>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  PAN Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) =>
                    updateField(
                      'panNumber',
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    )
                  }
                  className={styles.input}
                  placeholder="ABCDE1234F"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    updateField('aadhaarNumber', e.target.value.replace(/\D/g, ''))
                  }
                  className={styles.input}
                  placeholder="12 digit Aadhaar number"
                />
              </div>
            </div>
          </section>

          {/* ADDRESS DETAILS */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>3</span>
              Address Details
            </h3>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Current Residence Address
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={styles.textarea}
                placeholder="Enter complete current address"
              />
            </div>

            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={styles.input}
                  placeholder="City"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={styles.input}
                  placeholder="State"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    updateField('pincode', e.target.value.replace(/\D/g, ''))
                  }
                  className={styles.input}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Residence Ownership
                </label>
                <select
                  required
                  value={formData.residenceOwnership}
                  onChange={(e) => updateField('residenceOwnership', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select</option>
                  <option value="rented">Rented</option>
                  <option value="owned">Owned</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  No. of years at above residence
                </label>
                <input
                  type="text"
                  required
                  value={formData.yearsAtResidence}
                  onChange={(e) => updateField('yearsAtResidence', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Permanent Address
              </label>
              <textarea
                required
                rows={3}
                value={formData.permanentAddress}
                onChange={(e) => updateField('permanentAddress', e.target.value)}
                className={styles.textarea}
                placeholder="Enter permanent address"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                PA Contact Number
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.paContactNumber}
                onChange={(e) =>
                  updateField('paContactNumber', e.target.value.replace(/\D/g, ''))
                }
                className={styles.input}
                placeholder="10 digit contact number"
              />
            </div>
          </section>

          {/* EMPLOYMENT DETAILS */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>4</span>
              Employment Details
            </h3>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Employment Type
              </label>
              <select
                required
                value={formData.employmentType}
                onChange={(e) =>
                  updateField('employmentType', e.target.value as EmploymentType)
                }
                className={styles.select}
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
              </select>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Present Employer / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className={styles.input}
                  placeholder="Company name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Office Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.officeAddress}
                  onChange={(e) => updateField('officeAddress', e.target.value)}
                  className={styles.input}
                  placeholder="Office address"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Office Contact Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.officeContact}
                  onChange={(e) =>
                    updateField('officeContact', e.target.value.replace(/\D/g, ''))
                  }
                  className={styles.input}
                  placeholder="Office contact number"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Official Email ID
                </label>
                <input
                  type="email"
                  required
                  value={formData.officialEmail}
                  onChange={(e) => updateField('officialEmail', e.target.value)}
                  className={styles.input}
                  placeholder="official@company.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Personal Email ID
                </label>
                <input
                  type="email"
                  required
                  value={formData.personalEmail}
                  onChange={(e) => updateField('personalEmail', e.target.value)}
                  className={styles.input}
                  placeholder="personal@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  No. of years at current job
                </label>
                <input
                  type="text"
                  required
                  value={formData.yearsAtJob}
                  onChange={(e) => updateField('yearsAtJob', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., 3 years"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Designation
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => updateField('designation', e.target.value)}
                  className={styles.input}
                  placeholder="Your designation"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Name of Previous Organisation
                </label>
                <input
                  type="text"
                  required
                  value={formData.previousOrganisation}
                  onChange={(e) => updateField('previousOrganisation', e.target.value)}
                  className={styles.input}
                  placeholder="Previous company name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Total Job Experience
                </label>
                <input
                  type="text"
                  required
                  value={formData.totalJobExp}
                  onChange={(e) => updateField('totalJobExp', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., 5 years"
                />
              </div>

              {formData.employmentType === 'salaried' && (
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.monthlyIncome}
                    onChange={(e) => updateField('monthlyIncome', e.target.value)}
                    className={styles.input}
                    placeholder="Monthly income"
                  />
                </div>
              )}
            </div>

            {/* Self Employed */}
            {formData.employmentType === 'self-employed' && (
              <div className={styles.grid2} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className={styles.input}
                    placeholder="Business name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Business Type
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessType}
                    onChange={(e) => updateField('businessType', e.target.value)}
                    className={styles.input}
                    placeholder="Business type"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Business Vintage
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessVintage}
                    onChange={(e) => updateField('businessVintage', e.target.value)}
                    className={styles.input}
                    placeholder="e.g., 10 years"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Annual Income
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.annualIncome}
                    onChange={(e) => updateField('annualIncome', e.target.value)}
                    className={styles.input}
                    placeholder="Annual income"
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Business Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.businessAddress}
                    onChange={(e) => updateField('businessAddress', e.target.value)}
                    className={styles.textarea}
                    placeholder="Business address"
                  />
                </div>
              </div>
            )}
          </section>

          {/* REFERENCES */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>5</span>
              References
            </h3>

            {/* Reference 1 */}
            <div className={styles.refBox} style={{ marginBottom: '1rem' }}>
              <h4 className={styles.refBoxTitle}>Reference 1 *</h4>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref1Name}
                    onChange={(e) => updateField('ref1Name', e.target.value)}
                    className={styles.input}
                    placeholder="Reference name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref1Address}
                    onChange={(e) => updateField('ref1Address', e.target.value)}
                    className={styles.input}
                    placeholder="Reference address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Contact No.
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.ref1Contact}
                    onChange={(e) =>
                      updateField('ref1Contact', e.target.value.replace(/\D/g, ''))
                    }
                    className={styles.input}
                    placeholder="10 digit mobile number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Relation
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref1Relation}
                    onChange={(e) => updateField('ref1Relation', e.target.value)}
                    className={styles.input}
                    placeholder="e.g., Friend, Colleague, etc."
                  />
                </div>
              </div>
            </div>

            {/* Reference 2 */}
            <div className={styles.refBox}>
              <h4 className={styles.refBoxTitle}>Reference 2 *</h4>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref2Name}
                    onChange={(e) => updateField('ref2Name', e.target.value)}
                    className={styles.input}
                    placeholder="Reference name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref2Address}
                    onChange={(e) => updateField('ref2Address', e.target.value)}
                    className={styles.input}
                    placeholder="Reference address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Contact No.
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.ref2Contact}
                    onChange={(e) =>
                      updateField('ref2Contact', e.target.value.replace(/\D/g, ''))
                    }
                    className={styles.input}
                    placeholder="10 digit mobile number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Relation
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref2Relation}
                    onChange={(e) => updateField('ref2Relation', e.target.value)}
                    className={styles.input}
                    placeholder="e.g., Friend, Colleague, etc."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* LOAN DETAILS */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>6</span>
              Loan Details
            </h3>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Loan Type
                </label>
                <select
                  required
                  value={formData.loanType}
                  onChange={(e) => updateField('loanType', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select loan type</option>
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="education">Education Loan</option>
                  <option value="vehicle">Vehicle Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Loan Amount Requested Rs.
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.loanAmount}
                  onChange={(e) => updateField('loanAmount', e.target.value)}
                  className={styles.input}
                  placeholder="Enter loan amount"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Loan Purpose
                </label>
                <input
                  type="text"
                  required
                  value={formData.loanPurpose}
                  onChange={(e) => updateField('loanPurpose', e.target.value)}
                  className={styles.input}
                  placeholder="Why do you need the loan?"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Tenure
                </label>
                <input
                  type="text"
                  required
                  value={formData.tenure}
                  onChange={(e) => updateField('tenure', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., 5 years, 60 months"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Existing Loan?
                </label>
                <select
                  required
                  value={formData.existingLoan}
                  onChange={(e) => updateField('existingLoan', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select</option>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {formData.existingLoan === 'true' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current EMI</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.existingEmi}
                    onChange={(e) => updateField('existingEmi', e.target.value)}
                    className={styles.input}
                    placeholder="Current monthly EMI"
                  />
                </div>
              )}
            </div>
          </section>

          {/* DOCUMENTS */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>7</span>
              Documents
            </h3>

            <p className={styles.helperText} style={{ marginBottom: '1.25rem' }}>
              Upload clear PDF, JPG or PNG documents. Maximum size: 10 MB per file.
            </p>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>PAN Document</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null, setPanDocument)
                }
                className={styles.fileInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Aadhaar Document</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null, setAadhaarDocument)
                }
                className={styles.fileInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bank Statement</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null, setBankStatement)
                }
                className={styles.fileInput}
              />
            </div>

            {formData.employmentType === 'salaried' && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Salary Slips</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleSalarySlips}
                  className={styles.fileInput}
                />
                <p className={styles.fileInfo}>You can select multiple salary slips.</p>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ITR Document</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null, setItr)
                }
                className={styles.fileInput}
              />
            </div>

            {formData.employmentType === 'salaried' && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Form 16</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null, setForm16)
                  }
                  className={styles.fileInput}
                />
              </div>
            )}

            {formData.employmentType === 'self-employed' && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business Proof</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null, setBusinessProof)
                  }
                  className={styles.fileInput}
                />
              </div>
            )}
          </section>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting || !refId}
            className={styles.submitBtn}
          >
            {submitting ? 'Submitting Application...' : 'Submit Loan Application'}
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
        <div className={styles.loadingContainer}>
          <div>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading...</p>
          </div>
        </div>
      }
    >
      <SharedFormContent />
    </Suspense>
  );
}