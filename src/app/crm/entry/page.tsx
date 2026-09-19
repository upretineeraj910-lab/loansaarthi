'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  FileCheck,
  Building2,
  Phone,
  CreditCard,
  Mail,
  IndianRupee,
  MapPin,
  FileText,
  RefreshCw,
  LayoutDashboard,
  Landmark,
} from 'lucide-react';
import '@/app/crm/crm-theme.css';

const POPULAR_BANKS = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India (SBI)',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Bajaj Finance',
  'Tata Capital',
  'Piramal Finance',
  'Poonawalla Fincorp',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Open Market / Any',
  'Other',
];

export default function LeadEntryPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'excel'>('form');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    panNumber: '',
    email: '',
    loanType: 'Personal Loan',
    loanAmount: '',
    city: '',
    bankName: 'HDFC Bank',
    notes: '',
  });

  const [customBank, setCustomBank] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelResult, setExcelResult] = useState<{
    success: boolean;
    insertedCount?: number;
    skippedCount?: number;
    message?: string;
    dbDuplicates?: any[];
    batchDuplicates?: any[];
    invalidRows?: any[];
  } | null>(null);
  const [excelError, setExcelError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isPanValid = formData.panNumber.length === 10 && panRegex.test(formData.panNumber);
  const isPhoneValid = formData.phone.replace(/\D/g, '').length >= 10;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'panNumber') {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(null);
    setFormError(null);

    if (!isPanValid) {
      setFormError('Invalid PAN Card format. PAN must be 10 characters (e.g. ABCDE1234F).');
      setFormLoading(false);
      return;
    }

    if (!isPhoneValid) {
      setFormError('Mobile number must be at least 10 digits.');
      setFormLoading(false);
      return;
    }

    try {
      const finalBankName =
        formData.bankName === 'Other'
          ? customBank.trim() || 'Other Bank'
          : formData.bankName;

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bankName: finalBankName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || 'Failed to submit lead.');
      } else {
        setFormSuccess(`Lead for "${data.lead.name}" added successfully in "Login" stage!`);
        setFormData({
          name: '',
          phone: '',
          panNumber: '',
          email: '',
          loanType: 'Personal Loan',
          loanAmount: '',
          city: '',
          bankName: 'HDFC Bank',
          notes: '',
        });
        setCustomBank('');
      }
    } catch (err: any) {
      setFormError(err.message || 'Network error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setExcelError(null);
    setExcelResult(null);
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonRows.length === 0) {
          setExcelError('The selected file is empty. Please upload an Excel sheet with data.');
          setParsedRows([]);
          return;
        }

        setParsedRows(jsonRows);
      } catch (err: any) {
        setExcelError('Failed to read Excel file: ' + err.message);
        setParsedRows([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkUploadSubmit = async () => {
    if (parsedRows.length === 0) return;
    setExcelLoading(true);
    setExcelError(null);
    setExcelResult(null);

    try {
      const res = await fetch('/api/leads/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const data = await res.json();
      if (!res.ok) {
        setExcelError(data.message || 'Failed to bulk import leads.');
        if (data.invalidRows || data.batchDuplicates) {
          setExcelResult({
            success: false,
            invalidRows: data.invalidRows,
            batchDuplicates: data.batchDuplicates,
          });
        }
      } else {
        setExcelResult(data);
        setParsedRows([]);
        setExcelFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setExcelError(err.message || 'Network error occurred during bulk upload.');
    } finally {
      setExcelLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        'Customer Name': 'Rahul Sharma',
        'Mobile Number': '9876543210',
        'PAN Number': 'ABCDE1234F',
        Email: 'rahul.sharma@example.com',
        'Loan Type': 'Personal Loan',
        'Loan Amount': 500000,
        'Bank Name': 'HDFC Bank',
        City: 'Delhi',
        Notes: 'Salaried in MNC, looking for quick disbursement',
      },
      {
        'Customer Name': 'Pooja Verma',
        'Mobile Number': '9811223344',
        'PAN Number': 'XYZAB5678C',
        Email: 'pooja.verma@example.com',
        'Loan Type': 'Home Loan',
        'Loan Amount': 3500000,
        'Bank Name': 'State Bank of India (SBI)',
        City: 'Noida',
        Notes: 'Self-employed, ITR available for 3 years',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample_Leads');
    XLSX.writeFile(workbook, 'LoanSaarthi_Leads_Template.xlsx');
  };

  return (
    <div className="crm-page">
      {/* Header */}
      <div className="crm-shell crm-shell--narrow" style={{ marginBottom: '1.5rem' }}>
        <div className="crm-header-card">
          <div>
            <div className="crm-badge">
              <Building2 size={13} /> LoanSaarthi Intake Portal
            </div>
            <h1 className="crm-title">Lead Data Entry Portal</h1>
            <p className="crm-subtitle">
              Capture leads directly via manual form entry or bulk Excel sheet upload.
            </p>
          </div>
          <Link href="/crm" className="crm-btn crm-btn-ghost">
            <LayoutDashboard size={15} className="text-green" />
            Go to Leads Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="crm-tabs">
          <button
            onClick={() => setActiveTab('form')}
            className={`crm-tab${activeTab === 'form' ? ' is-active' : ''}`}
          >
            <UserPlus size={15} />
            Single Form Entry
          </button>
          <button
            onClick={() => setActiveTab('excel')}
            className={`crm-tab${activeTab === 'excel' ? ' is-active' : ''}`}
          >
            <FileSpreadsheet size={15} />
            Bulk Excel Sheet Upload
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="crm-shell crm-shell--narrow">
        {/* TAB 1: FORM ENTRY */}
        {activeTab === 'form' && (
          <div className="crm-panel">
            <div className="crm-panel-head">
              <h2 className="crm-panel-title">Manual Lead Information</h2>
              <p className="crm-panel-sub">
                New submissions are automatically saved under the <span className="crm-tag-login">"Login"</span> stage.
              </p>
            </div>

            {formSuccess && (
              <div className="crm-alert crm-alert--success">
                <CheckCircle2 size={18} />
                <div>
                  <p className="crm-alert-title">{formSuccess}</p>
                  <div className="crm-alert-actions">
                    <button onClick={() => setFormSuccess(null)} className="crm-alert-link">
                      Add Another Lead
                    </button>
                    <Link href="/crm" className="crm-alert-btn">
                      View in Dashboard →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <div className="crm-alert crm-alert--error">
                <AlertCircle size={18} />
                <div>
                  <h4 className="crm-alert-title">Submission Blocked</h4>
                  <p className="crm-alert-text">{formError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="crm-form-grid">
                <div className="crm-field">
                  <label className="crm-field-label">
                    Customer Full Name <span className="crm-required">*</span>
                  </label>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <UserPlus size={15} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="crm-input-with-icon"
                    />
                  </div>
                </div>

                <div className="crm-field">
                  <div className="crm-field-label-row">
                    <label className="crm-field-label">
                      Mobile Number <span className="crm-required">*</span>
                    </label>
                    {formData.phone && (
                      <span className={`crm-valid-hint ${isPhoneValid ? 'is-valid' : 'is-invalid'}`}>
                        {isPhoneValid ? '✓ 10 Digits Valid' : '10 Digits Required'}
                      </span>
                    )}
                  </div>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="crm-input-with-icon"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                </div>

                <div className="crm-field">
                  <div className="crm-field-label-row">
                    <label className="crm-field-label">
                      PAN Number (Unique Identity) <span className="crm-required">*</span>
                    </label>
                    {formData.panNumber && (
                      <span
                        className={`crm-valid-hint ${isPanValid ? 'is-valid' : 'is-invalid'}`}
                        style={{ fontFamily: 'monospace' }}
                      >
                        {isPanValid ? '✓ Valid PAN Format' : 'Format: ABCDE1234F'}
                      </span>
                    )}
                  </div>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <CreditCard size={15} />
                    </span>
                    <input
                      type="text"
                      name="panNumber"
                      required
                      maxLength={10}
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="ABCDE1234F"
                      className={`crm-input-with-icon${
                        formData.panNumber && !isPanValid ? ' is-warning' : ''
                      }`}
                      style={{ fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase' }}
                    />
                  </div>
                  <p className="crm-field-hint">
                    Duplicate protection: Duplicate PAN entries are automatically prevented.
                  </p>
                </div>

                <div className="crm-field">
                  <label className="crm-field-label">Email Address (Optional)</label>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className="crm-input-with-icon"
                    />
                  </div>
                </div>

                <div className="crm-field">
                  <label className="crm-field-label">
                    Loan Type <span className="crm-required">*</span>
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    className="crm-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Loan Against Property">Loan Against Property (LAP)</option>
                    <option value="Professional Loan">Professional Loan (Doctor/CA)</option>
                    <option value="Car Loan">Car Loan / Auto Loan</option>
                    <option value="Overdraft / CC Limit">Overdraft / CC Limit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="crm-field">
                  <label className="crm-field-label">
                    Loan Amount (₹) <span className="crm-required">*</span>
                  </label>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <IndianRupee size={15} />
                    </span>
                    <input
                      type="number"
                      name="loanAmount"
                      required
                      min={10000}
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      placeholder="e.g. 500000"
                      className="crm-input-with-icon"
                      style={{ fontFamily: 'monospace', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div className="crm-field">
                  <label className="crm-field-label">City / Location</label>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <MapPin size={15} />
                    </span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Delhi, Noida, Gurgaon"
                      className="crm-input-with-icon"
                    />
                  </div>
                </div>

                <div className="crm-field">
                  <label className="crm-field-label">
                    Bank Name / Preferred Bank <span className="crm-required">*</span>
                  </label>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon">
                      <Landmark size={15} />
                    </span>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="crm-select crm-input-with-icon"
                      style={{ width: '100%' }}
                    >
                      {POPULAR_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.bankName === 'Other' && (
                  <div className="crm-field">
                    <label className="crm-field-label">
                      Specify Bank Name <span className="crm-required">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customBank}
                      onChange={(e) => setCustomBank(e.target.value)}
                      placeholder="e.g. Hero Fincorp, InCred, etc."
                      className="crm-input"
                    />
                  </div>
                )}

                <div className="crm-field crm-field--wide">
                  <label className="crm-field-label">Remarks / Requirement Notes</label>
                  <div className="crm-input-icon-wrap">
                    <span className="crm-input-icon crm-input-icon--top">
                      <FileText size={15} />
                    </span>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific bank, CIBIL score details, or customer requirements..."
                      className="crm-input-with-icon"
                    />
                  </div>
                </div>
              </div>

              <div className="crm-form-footer">
                <button
                  type="submit"
                  disabled={formLoading || !isPanValid || !isPhoneValid}
                  className="crm-btn crm-btn-primary"
                  style={{ padding: '0.85rem 1.5rem' }}
                >
                  {formLoading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Saving to Database...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} /> Submit Lead (Login Stage)
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: EXCEL UPLOAD */}
        {activeTab === 'excel' && (
          <div className="crm-panel">
            <div className="crm-panel-head-row">
              <div>
                <h2 className="crm-panel-title">Bulk Excel / CSV Upload</h2>
                <p className="crm-panel-sub">
                  Upload an Excel or CSV file. The system will validate records and filter duplicate PANs.
                </p>
              </div>

              <button type="button" onClick={handleDownloadSample} className="crm-btn crm-btn-ghost">
                <Download size={14} className="text-green" />
                Download Sample Excel (.xlsx)
              </button>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className="crm-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="crm-dropzone-icon">
                <Upload size={24} />
              </div>
              <h3 className="crm-dropzone-title">
                {excelFile ? excelFile.name : 'Click to select or drag and drop Excel sheet here'}
              </h3>
              <p className="crm-dropzone-hint">
                Supports .XLSX, .XLS, or .CSV (Columns: Customer Name, Mobile Number, PAN Number, Loan Amount, etc.)
              </p>
            </div>

            {excelError && (
              <div className="crm-alert crm-alert--error" style={{ marginTop: '1.5rem' }}>
                <AlertCircle size={18} />
                <div>
                  <h4 className="crm-alert-title">Upload Error</h4>
                  <p className="crm-alert-text">{excelError}</p>
                </div>
              </div>
            )}

            {excelResult && (
              <div className="crm-result-card">
                <div className="crm-result-head">
                  <CheckCircle2 size={18} />
                  {excelResult.message || 'Excel upload processed.'}
                </div>

                <div className="crm-result-grid">
                  <div className="crm-result-box">
                    <div className="crm-result-box-label">Total Rows</div>
                    <div className="crm-result-box-value">
                      {excelResult.insertedCount! + (excelResult.skippedCount || 0)}
                    </div>
                  </div>
                  <div className="crm-result-box crm-result-box--good">
                    <div className="crm-result-box-label">Inserted (Login)</div>
                    <div className="crm-result-box-value">+{excelResult.insertedCount || 0}</div>
                  </div>
                  <div className="crm-result-box crm-result-box--warn">
                    <div className="crm-result-box-label">Skipped Duplicates</div>
                    <div className="crm-result-box-value">{excelResult.skippedCount || 0}</div>
                  </div>
                  <div className="crm-result-box crm-result-box--link">
                    <Link href="/crm" className="crm-result-link">
                      Open Dashboard <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                {excelResult.dbDuplicates && excelResult.dbDuplicates.length > 0 && (
                  <div className="crm-dup-list">
                    <div className="crm-dup-list-title">
                      Already in MongoDB (Skipped {excelResult.dbDuplicates.length} duplicate PANs):
                    </div>
                    <div className="crm-dup-list-items">
                      {excelResult.dbDuplicates.map((dup, i) => (
                        <div key={i}>
                          • PAN: <strong>{dup.pan}</strong> (Customer: {dup.existingName})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {parsedRows.length > 0 && (
              <div className="crm-preview">
                <div className="crm-preview-head">
                  <div className="crm-preview-title">
                    <FileCheck size={18} className="text-green" />
                    File Preview: {parsedRows.length} rows detected
                  </div>
                  <button
                    onClick={handleBulkUploadSubmit}
                    disabled={excelLoading}
                    className="crm-btn crm-btn-primary"
                  >
                    {excelLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Inserting to MongoDB...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} /> Import All {parsedRows.length} Leads to MongoDB
                      </>
                    )}
                  </button>
                </div>

                <div className="crm-preview-table-wrap">
                  <table className="crm-preview-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>PAN Card</th>
                        <th>Bank Name</th>
                        <th>Loan Type</th>
                        <th>Amount</th>
                        <th>City</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 10).map((row, idx) => {
                        const pan =
                          row.panNumber || row.pan || row.PAN || row['PAN Number'] || row['Pan Number'] || '--';
                        const phone =
                          row.phone || row.Phone || row.mobile || row.Mobile || row['Mobile Number'] || '--';
                        const name = row.name || row.Name || row['Customer Name'] || row['Client Name'] || '--';
                        const bank =
                          row.bankName || row.bank || row.Bank || row['Bank Name'] || row['Bank'] || '--';
                        const loanType = row.loanType || row['Loan Type'] || 'Personal Loan';
                        const amount = row.loanAmount || row.amount || row.Amount || row['Loan Amount'] || 0;
                        const city = row.city || row.City || '--';

                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{name}</td>
                            <td>{phone}</td>
                            <td>
                              <span className="crm-pan-chip">{pan}</span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{bank}</td>
                            <td>{loanType}</td>
                            <td style={{ color: 'var(--color-brass-deep)', fontWeight: 700 }}>
                              ₹{Number(amount).toLocaleString('en-IN')}
                            </td>
                            <td>{city}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {parsedRows.length > 10 && (
                  <p className="crm-preview-note">Showing first 10 rows of {parsedRows.length} total rows.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}