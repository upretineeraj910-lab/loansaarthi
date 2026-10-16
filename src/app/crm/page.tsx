'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft,
  Search,
  PlusCircle,
  RefreshCw,
  Phone,
  Building2,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Layers,
  FileSpreadsheet,
  ChevronDown,
  Trash2,
  Check,
  Landmark,
  IndianRupee,
  AlertTriangle,
  Shield,
  Lock,
  Sparkles,
  Ban,
  BellRing,
  PhoneForwarded,
  Voicemail,
} from 'lucide-react';
import './crm-theme.css';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  loanType: string;
  loanAmount: number;
  city?: string;
  bankName?: string;
  status:
    | 'Fresh'
    | 'Not Eligible'
    | 'Ringing'
    | 'Call Back'
    | 'Voice Mail'
    | 'Login'
    | 'Underwriting'
    | 'Approved'
    | 'Rejected'
    | 'Disbursed';
  source: 'Form' | 'Excel Upload';
  rejectionReason?: string;
  approvedBank?: string;
  approvedAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  fresh: number;
  notEligible: number;
  ringing: number;
  callBack: number;
  voiceMail: number;
  login: number;
  underwriting: number;
  approved: number;
  rejected: number;
  disbursed: number;
}

const COMMON_BANKS = [
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
  'Aditya Birla Capital',
  'L&T Finance',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Other',
];

const COMMON_REJECTION_REASONS = [
  'Low CIBIL / Credit Score (< 650)',
  'Over-leveraged (High existing loan EMIs)',
  'Incomplete / Mismatched KYC Documents',
  'Negative Area / Pincode not serviceable',
  'Income Inadequate / Banking Criteria not met',
  'Age Criteria not met (< 21 or > 60)',
  'Write-off / Settlement history in bureau report',
  'Customer Backed Out / Not Interested',
  'Other',
];

const STATUS_OPTIONS: {
  value: Lead['status'];
  label: string;
  className: string;
}[] = [
  { value: 'Fresh', label: 'Fresh', className: 'crm-status--fresh' },
  { value: 'Not Eligible', label: 'Not Eligible', className: 'crm-status--not-eligible' },
  { value: 'Ringing', label: 'Ringing', className: 'crm-status--ringing' },
  { value: 'Call Back', label: 'Call Back', className: 'crm-status--call-back' },
  { value: 'Voice Mail', label: 'Voice Mail', className: 'crm-status--voice-mail' },
  { value: 'Login', label: 'Login', className: 'crm-status--login' },
  { value: 'Underwriting', label: 'Underwriting', className: 'crm-status--underwriting' },
  { value: 'Approved', label: 'Approved', className: 'crm-status--approved' },
  { value: 'Rejected', label: 'Rejected', className: 'crm-status--rejected' },
  { value: 'Disbursed', label: 'Disbursed', className: 'crm-status--disbursed' },
];

export default function CrmDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    fresh: 0,
    notEligible: 0,
    ringing: 0,
    callBack: 0,
    voiceMail: 0,
    login: 0,
    underwriting: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loanTypeFilter, setLoanTypeFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  const [approvalModalLead, setApprovalModalLead] = useState<Lead | null>(null);
  const [approvalForm, setApprovalForm] = useState({
    bank: 'HDFC Bank',
    customBank: '',
    amount: '',
    status: 'Approved' as 'Approved' | 'Disbursed',
  });

  const [rejectionModalLead, setRejectionModalLead] = useState<Lead | null>(null);
  const [rejectionForm, setRejectionForm] = useState({
    reason: COMMON_REJECTION_REASONS[0],
    customReason: '',
  });

  // User Authentication & Roles
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string; role?: string; name?: string } | null>(null);

  const fetchUserAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch auth info:', err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAuth();
  }, [fetchUserAuth]);

  const canEdit = currentUser?.role === 'crm_editor' || currentUser?.role === 'superadmin';
  const canEnter = currentUser?.role === 'crm_entry' || currentUser?.role === 'superadmin';

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setLeadError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (loanTypeFilter !== 'All') params.set('loanType', loanTypeFilter);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        if (data.stats) setStats(data.stats);
      } else {
        setLeadError(data.message || 'Failed to load leads');
        setLeads([]);
      }
    } catch (err: any) {
      console.error('Failed to load leads:', err);
      setLeadError(err?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, loanTypeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const executeUpdate = async (leadId: string, payload: Record<string, any>) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead._id === leadId ? { ...lead, ...payload } : lead))
        );

        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, ...payload } : null));
        }

        setStatusMessage(`Lead status updated successfully!`);
        setTimeout(() => setStatusMessage(null), 3000);
        fetchLeads();
      } else {
        alert(data.message || 'Failed to update lead');
      }
    } catch (err: any) {
      alert('Error updating lead: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const onSelectStatusChange = (lead: Lead, newStatus: Lead['status']) => {
    if (newStatus === 'Rejected') {
      setRejectionModalLead(lead);
      setRejectionForm({
        reason: lead.rejectionReason || COMMON_REJECTION_REASONS[0],
        customReason: '',
      });
      return;
    }

    if (newStatus === 'Approved' || newStatus === 'Disbursed') {
      setApprovalModalLead(lead);
      setApprovalForm({
        bank: lead.approvedBank || lead.bankName || 'HDFC Bank',
        customBank: '',
        amount: lead.approvedAmount ? String(lead.approvedAmount) : String(lead.loanAmount || ''),
        status: newStatus,
      });
      return;
    }

    executeUpdate(lead._id, { status: newStatus });
  };

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalLead) return;

    const finalBank =
      approvalForm.bank === 'Other'
        ? approvalForm.customBank.trim() || 'Other Bank'
        : approvalForm.bank;

    const finalAmount = Number(approvalForm.amount) || approvalModalLead.loanAmount;

    await executeUpdate(approvalModalLead._id, {
      status: approvalForm.status,
      approvedBank: finalBank,
      approvedAmount: finalAmount,
    });

    setApprovalModalLead(null);
  };

  const handleRejectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalLead) return;

    const finalReason =
      rejectionForm.reason === 'Other'
        ? rejectionForm.customReason.trim() || 'Other'
        : rejectionForm.reason;

    await executeUpdate(rejectionModalLead._id, {
      status: 'Rejected',
      rejectionReason: finalReason,
    });

    setRejectionModalLead(null);
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`Are you sure you want to delete the lead for "${leadName}"?`)) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l._id !== leadId));
        if (selectedLead?._id === leadId) setSelectedLead(null);
        fetchLeads();
      } else {
        alert(data.message || 'Failed to delete lead');
      }
    } catch (err: any) {
      alert('Error deleting lead: ' + err.message);
    }
  };

  const handleExportToExcel = () => {
    if (leads.length === 0) return;

    const exportRows = leads.map((lead, idx) => ({
      '#': idx + 1,
      'Customer Name': lead.name,
      'Phone Number': lead.phone,
      'Loan Type': lead.loanType,
      'Applied Amount (Rs)': lead.loanAmount,
      Status: lead.status,
      'Bank Name': lead.approvedBank || lead.bankName || '--',
      'Approved Amount (Rs)': lead.approvedAmount ? lead.approvedAmount : '--',
      'Rejection Reason': lead.rejectionReason || '--',
      City: lead.city || '',
      Source: lead.source,
      Notes: lead.notes || '',
      'Created Date': new Date(lead.createdAt).toLocaleDateString('en-IN'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered_Leads');
    XLSX.writeFile(
      workbook,
      `LoanSaarthi_Leads_${statusFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const metricClass = (filterVal: string, cssKey: string) =>
    `crm-metric crm-metric--${cssKey}${statusFilter === filterVal ? ' is-active' : ''}`;

  return (
    <div className="crm-page">
      <div className="crm-shell">
        {statusMessage && (
          <div className="crm-toast">
            <Check size={14} className="text-green" />
            {statusMessage}
          </div>
        )}

        {/* Back button */}
        <Link href="/dashboard" className="crm-back-btn">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="crm-header-card">
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div className="crm-badge">
                <Building2 size={13} /> LoanSaarthi Lead CRM Portal
              </div>
              {currentUser && (
                <div
                  className="crm-badge"
                  style={{
                    backgroundColor:
                      currentUser.role === 'superadmin'
                        ? '#dcfce7'
                        : currentUser.role === 'admin'
                        ? '#f1f5f9'
                        : currentUser.role === 'crm_editor'
                        ? '#e0e7ff'
                        : '#fef3c7',
                    color:
                      currentUser.role === 'superadmin'
                        ? '#166534'
                        : currentUser.role === 'admin'
                        ? '#334155'
                        : currentUser.role === 'crm_editor'
                        ? '#3730a3'
                        : '#92400e',
                    borderColor:
                      currentUser.role === 'superadmin'
                        ? '#bbf7d0'
                        : currentUser.role === 'admin'
                        ? '#cbd5e1'
                        : currentUser.role === 'crm_editor'
                        ? '#c7d2fe'
                        : '#fde68a',
                  }}
                >
                  <Shield size={12} />
                  <span>
                    {currentUser.name || currentUser.email?.split('@')[0]} (
                    {currentUser.role === 'superadmin'
                      ? 'Role: Super Admin'
                      : currentUser.role === 'admin'
                      ? 'Role: Admin'
                      : currentUser.role === 'crm_editor'
                      ? 'Role: CRM Editor'
                      : 'Role: Data Entry Operator'}
                    )
                  </span>
                </div>
              )}
            </div>
            <h1 className="crm-title">Leads Pipeline &amp; Dashboard</h1>
            <p className="crm-subtitle">
              Track leads from initial file login to underwriting, approval, and disbursal.
            </p>
          </div>

          <div className="crm-header-actions">
            <button onClick={() => fetchLeads()} className="crm-btn crm-btn-icon" title="Refresh Leads">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleExportToExcel}
              disabled={leads.length === 0}
              className="crm-btn crm-btn-ghost"
            >
              <FileSpreadsheet size={15} className="text-green" />
              Export to Excel
            </button>

            {canEnter && (
              <Link href="/crm/entry" className="crm-btn crm-btn-primary crm-link-ml">
                <PlusCircle size={16} />
                + Add Lead / Excel
              </Link>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="crm-metrics">
          <div
            onClick={() => setStatusFilter('All')}
            className={`crm-metric${statusFilter === 'All' ? ' is-active' : ''}`}
          >
            <div className="crm-metric-label">Total Leads</div>
            <div className="crm-metric-value">{stats.total}</div>
            <div className="crm-metric-hint">All pipelines</div>
          </div>

          <div onClick={() => setStatusFilter('Fresh')} className={metricClass('Fresh', 'fresh')}>
            <div className="crm-metric-label">
              <Sparkles size={12} /> 1. Fresh
            </div>
            <div className="crm-metric-value">{stats.fresh || 0}</div>
            <div className="crm-metric-hint">New incoming</div>
          </div>

          <div onClick={() => setStatusFilter('Not Eligible')} className={metricClass('Not Eligible', 'not-eligible')}>
            <div className="crm-metric-label">
              <Ban size={12} /> 2. Not Eligible
            </div>
            <div className="crm-metric-value">{stats.notEligible || 0}</div>
            <div className="crm-metric-hint">Criteria mismatch</div>
          </div>

          <div onClick={() => setStatusFilter('Ringing')} className={metricClass('Ringing', 'ringing')}>
            <div className="crm-metric-label">
              <BellRing size={12} /> 3. Ringing
            </div>
            <div className="crm-metric-value">{stats.ringing || 0}</div>
            <div className="crm-metric-hint">Call not answered</div>
          </div>

          <div onClick={() => setStatusFilter('Call Back')} className={metricClass('Call Back', 'call-back')}>
            <div className="crm-metric-label">
              <PhoneForwarded size={12} /> 4. Call Back
            </div>
            <div className="crm-metric-value">{stats.callBack || 0}</div>
            <div className="crm-metric-hint">Follow-up requested</div>
          </div>

          <div onClick={() => setStatusFilter('Voice Mail')} className={metricClass('Voice Mail', 'voice-mail')}>
            <div className="crm-metric-label">
              <Voicemail size={12} /> 5. Voice Mail
            </div>
            <div className="crm-metric-value">{stats.voiceMail || 0}</div>
            <div className="crm-metric-hint">Voicemail sent</div>
          </div>

          <div onClick={() => setStatusFilter('Login')} className={metricClass('Login', 'login')}>
            <div className="crm-metric-label">
              <Clock size={12} /> 6. Login
            </div>
            <div className="crm-metric-value">{stats.login || 0}</div>
            <div className="crm-metric-hint">Initial file logged</div>
          </div>

          <div onClick={() => setStatusFilter('Underwriting')} className={metricClass('Underwriting', 'underwriting')}>
            <div className="crm-metric-label">
              <Layers size={12} /> 7. Underwriting
            </div>
            <div className="crm-metric-value">{stats.underwriting || 0}</div>
            <div className="crm-metric-hint">Checks &amp; eligibility</div>
          </div>

          <div onClick={() => setStatusFilter('Approved')} className={metricClass('Approved', 'approved')}>
            <div className="crm-metric-label">
              <CheckCircle2 size={12} /> 8. Approved
            </div>
            <div className="crm-metric-value">{stats.approved || 0}</div>
            <div className="crm-metric-hint">Bank sanctioned</div>
          </div>

          <div onClick={() => setStatusFilter('Rejected')} className={metricClass('Rejected', 'rejected')}>
            <div className="crm-metric-label">
              <XCircle size={12} /> 9. Rejected
            </div>
            <div className="crm-metric-value">{stats.rejected || 0}</div>
            <div className="crm-metric-hint">With reasons</div>
          </div>

          <div onClick={() => setStatusFilter('Disbursed')} className={metricClass('Disbursed', 'disbursed')}>
            <div className="crm-metric-label">
              <Briefcase size={12} /> 10. Disbursed
            </div>
            <div className="crm-metric-value">{stats.disbursed || 0}</div>
            <div className="crm-metric-hint">Loan credited</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="crm-filterbar">
          <div className="crm-search">
            <span className="crm-search-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Mobile Number or Name..."
              className="crm-input"
            />
            {search && (
              <button onClick={() => setSearch('')} className="crm-search-clear">
                ✕
              </button>
            )}
          </div>

          <div className="crm-filter-group">
            <div className="crm-filter">
              <span className="crm-filter-label">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="crm-select"
              >
                <option value="All">All Pipelines</option>
                <option value="Fresh">1. Fresh</option>
                <option value="Not Eligible">2. Not Eligible</option>
                <option value="Ringing">3. Ringing</option>
                <option value="Call Back">4. Call Back</option>
                <option value="Voice Mail">5. Voice Mail</option>
                <option value="Login">6. Login</option>
                <option value="Underwriting">7. Underwriting</option>
                <option value="Approved">8. Approved</option>
                <option value="Rejected">9. Rejected</option>
                <option value="Disbursed">10. Disbursed</option>
              </select>
            </div>

            <div className="crm-filter">
              <span className="crm-filter-label">Loan Type:</span>
              <select
                value={loanTypeFilter}
                onChange={(e) => setLoanTypeFilter(e.target.value)}
                className="crm-select"
              >
                <option value="All">All Loan Types</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Loan Against Property">Loan Against Property (LAP)</option>
                <option value="Professional Loan">Professional Loan</option>
                <option value="Car Loan">Car Loan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="crm-table-card">
          <div className="crm-table-scroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Mobile Number</th>
                  <th>Loan Applied</th>
                  <th className="is-strong">{canEdit ? 'Status (Click to Update) ⚡' : 'Status (View-Only 🔒)'}</th>
                  <th>Bank / Rejection Details</th>
                  <th>Source</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadError ? (
                  <tr>
                    <td colSpan={8} className="crm-table-empty" style={{ color: '#dc2626' }}>
                      <AlertTriangle size={26} style={{ margin: '0 auto 0.5rem', color: '#dc2626' }} />
                      {leadError}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={8} className="crm-table-loading">
                      <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--brand-green)' }} />
                      Loading leads from database...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="crm-table-empty">
                      <Filter size={26} style={{ margin: '0 auto 0.5rem' }} />
                      No leads found matching your criteria.
                      {canEnter && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <Link href="/crm/entry" className="crm-btn crm-btn-primary" style={{ display: 'inline-flex' }}>
                            <PlusCircle size={13} /> Add first lead
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, idx) => (
                    <tr key={lead._id} onClick={() => setSelectedLead(lead)}>
                      <td className="crm-row-index">{idx + 1}</td>

                      <td>
                        <div className="crm-cell-name">{lead.name}</div>
                        <div className="crm-cell-sub">{lead.city || 'City: --'}</div>
                      </td>

                      <td>
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="crm-phone-link"
                        >
                          <Phone size={12} />
                          {lead.phone}
                        </a>
                      </td>

                      <td>
                        <div className="crm-loan-type">{lead.loanType}</div>
                        <div className="crm-loan-amount">₹{lead.loanAmount?.toLocaleString('en-IN')}</div>
                      </td>

                      <td className="crm-status-cell" onClick={(e) => e.stopPropagation()}>
                        {canEdit ? (
                          <div className="crm-status-wrap">
                            <select
                              disabled={updatingId === lead._id}
                              value={lead.status}
                              onChange={(e) => onSelectStatusChange(lead, e.target.value as Lead['status'])}
                              className={`crm-status-select ${
                                STATUS_OPTIONS.find((s) => s.value === lead.status)?.className || ''
                              }${updatingId === lead._id ? ' is-updating' : ''}`}
                            >
                              <option value="Fresh">✨ 1. Fresh</option>
                              <option value="Not Eligible">🚫 2. Not Eligible</option>
                              <option value="Ringing">🔔 3. Ringing</option>
                              <option value="Call Back">📲 4. Call Back</option>
                              <option value="Voice Mail">🎙️ 5. Voice Mail</option>
                              <option value="Login">🟡 6. Login</option>
                              <option value="Underwriting">🔵 7. Underwriting</option>
                              <option value="Approved">🟢 8. Approved</option>
                              <option value="Rejected">🔴 9. Rejected</option>
                              <option value="Disbursed">🟣 10. Disbursed</option>
                            </select>
                            <span className="crm-status-chevron">
                              {updatingId === lead._id ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <ChevronDown size={13} />
                              )}
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`crm-status-select ${
                              STATUS_OPTIONS.find((s) => s.value === lead.status)?.className || ''
                            }`}
                            title="View-Only: Status editing is restricted to CRM Editors"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'default',
                              opacity: 0.95,
                              userSelect: 'none',
                              borderStyle: 'dashed',
                            }}
                          >
                            <span>
                              {lead.status === 'Fresh' && '✨ 1. Fresh'}
                              {lead.status === 'Not Eligible' && '🚫 2. Not Eligible'}
                              {lead.status === 'Ringing' && '🔔 3. Ringing'}
                              {lead.status === 'Call Back' && '📲 4. Call Back'}
                              {lead.status === 'Voice Mail' && '🎙️ 5. Voice Mail'}
                              {lead.status === 'Login' && '🟡 6. Login'}
                              {lead.status === 'Underwriting' && '🔵 7. Underwriting'}
                              {lead.status === 'Approved' && '🟢 8. Approved'}
                              {lead.status === 'Rejected' && '🔴 9. Rejected'}
                              {lead.status === 'Disbursed' && '🟣 10. Disbursed'}
                            </span>
                            <Lock size={11} style={{ opacity: 0.7 }} />
                          </div>
                        )}
                      </td>

                      <td>
                        {lead.status === 'Approved' || lead.status === 'Disbursed' ? (
                          <div>
                            <div className="crm-detail-chip crm-detail-chip--approved">
                              <Landmark size={11} />
                              {lead.approvedBank || lead.bankName || 'Bank Not Set'}
                            </div>
                            {lead.approvedAmount ? (
                              <div className="crm-detail-amount">
                                Approved: ₹{lead.approvedAmount.toLocaleString('en-IN')}
                              </div>
                            ) : null}
                          </div>
                        ) : lead.status === 'Rejected' ? (
                          <div className="crm-detail-chip crm-detail-chip--rejected">
                            <AlertTriangle size={11} />
                            <span>{lead.rejectionReason || 'Reason not set'}</span>
                          </div>
                        ) : lead.bankName ? (
                          <div className="crm-detail-chip" style={{ background: 'var(--color-paper-dark)', border: '1px solid var(--color-paper-line)' }}>
                            <Landmark size={11} />
                            <span>{lead.bankName}</span>
                          </div>
                        ) : (
                          <span className="crm-muted-cell">Pending decision</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`crm-source-pill ${
                            lead.source === 'Excel Upload'
                              ? 'crm-source-pill--excel'
                              : 'crm-source-pill--form'
                          }`}
                        >
                          {lead.source}
                        </span>
                      </td>

                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="crm-row-actions">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="crm-icon-btn crm-icon-btn--view"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleDeleteLead(lead._id, lead.name)}
                              className="crm-icon-btn crm-icon-btn--delete"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="crm-table-footer">
            <div>
              Showing <strong>{leads.length}</strong> records
            </div>
            <div>
              💡 Approving records the bank and sanctioned amount. Rejecting records the rejection reason.
            </div>
          </div>
        </div>

        {/* MODAL 1: Approval / Disbursal */}
        {approvalModalLead && (
          <div className="crm-modal-overlay">
            <div className="crm-modal">
              <div className="crm-modal-head">
                <div>
                  <div className="crm-modal-eyebrow crm-modal-eyebrow--approve">
                    <CheckCircle2 size={12} /> {approvalForm.status} Stage
                  </div>
                  <h3 className="crm-modal-title">{approvalModalLead.name} - Loan Approval</h3>
                </div>
                <button onClick={() => setApprovalModalLead(null)} className="crm-modal-close">
                  ✕
                </button>
              </div>

              <form onSubmit={handleApprovalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="crm-field">
                  <label className="crm-field-label">
                    Sanctioning Bank / NBFC <span className="crm-required">*</span>
                  </label>
                  <select
                    value={approvalForm.bank}
                    onChange={(e) => setApprovalForm((prev) => ({ ...prev, bank: e.target.value }))}
                    className="crm-select"
                    style={{ width: '100%' }}
                  >
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {approvalForm.bank === 'Other' && (
                  <div className="crm-field">
                    <label className="crm-field-label">Specify Other Bank / NBFC Name</label>
                    <input
                      type="text"
                      required
                      value={approvalForm.customBank}
                      onChange={(e) => setApprovalForm((prev) => ({ ...prev, customBank: e.target.value }))}
                      placeholder="e.g. Hero Fincorp, InCred, etc."
                      className="crm-input"
                      style={{ padding: '0.65rem 0.75rem' }}
                    />
                  </div>
                )}

                <div className="crm-field">
                  <label className="crm-field-label">
                    Approved / Sanctioned Amount (₹) <span className="crm-required">*</span>
                  </label>
                  <div className="crm-amount-input-wrap">
                    <span className="crm-amount-icon">
                      <IndianRupee size={15} />
                    </span>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={approvalForm.amount}
                      onChange={(e) => setApprovalForm((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="e.g. 500000"
                      className="crm-input-with-icon"
                    />
                  </div>
                  <p className="crm-field-hint">
                    Applied amount was ₹{approvalModalLead.loanAmount?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="crm-modal-actions">
                  <button type="button" onClick={() => setApprovalModalLead(null)} className="crm-btn-text">
                    Cancel
                  </button>
                  <button type="submit" className="crm-btn crm-btn-primary">
                    Save &amp; Mark {approvalForm.status}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Rejection reason */}
        {rejectionModalLead && (
          <div className="crm-modal-overlay">
            <div className="crm-modal">
              <div className="crm-modal-head">
                <div>
                  <div className="crm-modal-eyebrow crm-modal-eyebrow--reject">
                    <XCircle size={12} /> Mark as Rejected
                  </div>
                  <h3 className="crm-modal-title">{rejectionModalLead.name} - Rejection Reason</h3>
                </div>
                <button onClick={() => setRejectionModalLead(null)} className="crm-modal-close">
                  ✕
                </button>
              </div>

              <form onSubmit={handleRejectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="crm-field">
                  <label className="crm-field-label">
                    Reason for Rejection: <span className="crm-required">*</span>
                  </label>
                  <select
                    value={rejectionForm.reason}
                    onChange={(e) => setRejectionForm((prev) => ({ ...prev, reason: e.target.value }))}
                    className="crm-select"
                    style={{ width: '100%' }}
                  >
                    {COMMON_REJECTION_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {rejectionForm.reason === 'Other' && (
                  <div className="crm-field">
                    <label className="crm-field-label">Specify Rejection Reason</label>
                    <textarea
                      rows={2}
                      required
                      value={rejectionForm.customReason}
                      onChange={(e) => setRejectionForm((prev) => ({ ...prev, customReason: e.target.value }))}
                      placeholder="e.g. Salary credited in cash, negative area, profile mismatch..."
                      className="crm-input"
                      style={{ padding: '0.65rem 0.75rem' }}
                    />
                  </div>
                )}

                <div className="crm-modal-actions">
                  <button type="button" onClick={() => setRejectionModalLead(null)} className="crm-btn-text">
                    Cancel
                  </button>
                  <button type="submit" className="crm-btn crm-btn-danger">
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: View & edit lead */}
        {selectedLead && (
          <div className="crm-modal-overlay" onClick={() => setSelectedLead(null)}>
            <div className="crm-modal crm-modal--wide" onClick={(e) => e.stopPropagation()}>
              <div className="crm-modal-head">
                <div>
                  <h3 className="crm-modal-title">{selectedLead.name}</h3>
                  <p className="crm-modal-id">Lead ID: {selectedLead._id}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="crm-modal-close">
                  ✕
                </button>
              </div>

              <div className="crm-status-picker">
                <div>
                  <div className="crm-field-label">Current Lead Status:</div>
                  <div className="crm-field-hint">
                    {canEdit ? 'Click dropdown to update stage' : 'Status editing restricted to CRM Editors (View Only)'}
                  </div>
                </div>
                {canEdit ? (
                  <div className="crm-status-wrap" style={{ width: 'auto' }}>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => onSelectStatusChange(selectedLead, e.target.value as Lead['status'])}
                      className="crm-status-select"
                      style={{ background: 'var(--brand-white)', borderColor: 'var(--color-paper-line)' }}
                    >
                      <option value="Fresh">✨ 1. Fresh</option>
                      <option value="Not Eligible">🚫 2. Not Eligible</option>
                      <option value="Ringing">🔔 3. Ringing</option>
                      <option value="Call Back">📲 4. Call Back</option>
                      <option value="Voice Mail">🎙️ 5. Voice Mail</option>
                      <option value="Login">🟡 6. Login</option>
                      <option value="Underwriting">🔵 7. Underwriting</option>
                      <option value="Approved">🟢 8. Approved</option>
                      <option value="Rejected">🔴 9. Rejected</option>
                      <option value="Disbursed">🟣 10. Disbursed</option>
                    </select>
                  </div>
                ) : (
                  <div
                    className={`crm-status-select ${
                      STATUS_OPTIONS.find((s) => s.value === selectedLead.status)?.className || ''
                    }`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      cursor: 'default',
                      borderStyle: 'dashed',
                    }}
                  >
                    <span>
                      {selectedLead.status === 'Fresh' && '✨ 1. Fresh'}
                      {selectedLead.status === 'Not Eligible' && '🚫 2. Not Eligible'}
                      {selectedLead.status === 'Ringing' && '🔔 3. Ringing'}
                      {selectedLead.status === 'Call Back' && '📲 4. Call Back'}
                      {selectedLead.status === 'Voice Mail' && '🎙️ 5. Voice Mail'}
                      {selectedLead.status === 'Login' && '🟡 6. Login'}
                      {selectedLead.status === 'Underwriting' && '🔵 7. Underwriting'}
                      {selectedLead.status === 'Approved' && '🟢 8. Approved'}
                      {selectedLead.status === 'Rejected' && '🔴 9. Rejected'}
                      {selectedLead.status === 'Disbursed' && '🟣 10. Disbursed'}
                    </span>
                    <Lock size={12} style={{ opacity: 0.7 }} />
                  </div>
                )}
              </div>

              {(selectedLead.status === 'Approved' || selectedLead.status === 'Disbursed') && (
                <div className="crm-info-banner crm-info-banner--approve">
                  <div className="crm-info-banner-title">
                    <Landmark size={14} />
                    Bank Approval Details:
                  </div>
                  <div className="crm-info-grid">
                    <div>
                      <span className="label">Sanctioned Bank:</span>{' '}
                      <strong>{selectedLead.approvedBank || 'Not Set'}</strong>
                    </div>
                    <div>
                      <span className="label">Approved Amount:</span>{' '}
                      <strong>₹{selectedLead.approvedAmount?.toLocaleString('en-IN') || '--'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedLead.status === 'Rejected' && (
                <div className="crm-info-banner crm-info-banner--reject">
                  <div className="crm-info-banner-title">
                    <AlertTriangle size={14} />
                    Rejection Reason:
                  </div>
                  <div>{selectedLead.rejectionReason || 'No reason specified'}</div>
                </div>
              )}

              <div className="crm-detail-grid">
                <div className="crm-detail-box">
                  <div className="crm-detail-box-label">Mobile Number</div>
                  <a href={`tel:${selectedLead.phone}`} className="crm-phone-link" style={{ fontSize: '0.9rem' }}>
                    <Phone size={12} /> {selectedLead.phone}
                  </a>
                </div>

                <div className="crm-detail-box">
                  <div className="crm-detail-box-label">Loan Type</div>
                  <div className="crm-detail-box-value">{selectedLead.loanType}</div>
                </div>

                <div className="crm-detail-box">
                  <div className="crm-detail-box-label">Applied Amount</div>
                  <div className="crm-detail-box-value">₹{selectedLead.loanAmount?.toLocaleString('en-IN')}</div>
                </div>

                <div className="crm-detail-box">
                  <div className="crm-detail-box-label">Preferred / Applied Bank</div>
                  <div className="crm-detail-box-value">{selectedLead.bankName || 'Not Specified'}</div>
                </div>

                <div className="crm-detail-box">
                  <div className="crm-detail-box-label">City / Location</div>
                  <div className="crm-detail-box-value">{selectedLead.city || 'Not Specified'}</div>
                </div>

                <div className="crm-detail-box">
                  <div className="crm-detail-box-label">Intake Source</div>
                  <div className="crm-detail-box-value">{selectedLead.source}</div>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="crm-modal-note">
                  <div className="crm-field-hint" style={{ marginBottom: '0.25rem' }}>Remarks / Client Notes:</div>
                  <div>{selectedLead.notes}</div>
                </div>
              )}

              <div className="crm-modal-footer">
                <span>Added: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}</span>
                {canEdit && (
                  <button onClick={() => handleDeleteLead(selectedLead._id, selectedLead.name)} className="crm-delete-link">
                    <Trash2 size={12} /> Delete Lead
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}