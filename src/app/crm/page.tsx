/**
 * CRM Leads Pipeline Dashboard
 * Provides end-to-end management of loan files across statuses (Fresh to Disbursed),
 * batch case assignment (Select 10/25/50/100), RBAC access scoping, and telecaller metrics.
 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Calendar,
  Briefcase,
  Layers,
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
  UserCheck,
  Users,
  ChevronLeft,
  ChevronRight,
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
  assignedTo?: string;
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

interface AgentUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
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

const DEFAULT_PAGE_SIZE = 25;

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
  const [sourceFilter, setSourceFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Assignment Feature States
  const [assignmentTab, setAssignmentTab] = useState<'unassigned' | 'assigned' | 'all'>('all');
  const [assignedAgentFilter, setAssignedAgentFilter] = useState<string>('All');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [agentsList, setAgentsList] = useState<AgentUser[]>([]);
  const [selectedAgentName, setSelectedAgentName] = useState<string>('');
  const [assigningBatch, setAssigningBatch] = useState(false);

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

  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
  const canEdit = currentUser?.role === 'crm_editor' || isAdmin;
  const canEnter = currentUser?.role === 'crm_entry' || isAdmin;

  // Fetch Agents (crm_editor) list for Admin / Super Admin
  const fetchAgents = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch('/api/crm/agents');
      if (res.ok) {
        const data = await res.json();
        const users: AgentUser[] = data.agents || data.users || [];
        const editors = users.filter((u) => u.role === 'crm_editor');
        setAgentsList(editors);
      }
    } catch (err) {
      console.warn('Could not fetch agents directly, fallback can be handled:', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setLeadError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (loanTypeFilter !== 'All') params.set('loanType', loanTypeFilter);
      if (sourceFilter !== 'All') params.set('source', sourceFilter);

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
  }, [search, statusFilter, loanTypeFilter, sourceFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
      setCurrentPage(1);
      setSelectedLeadIds([]);
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  // Computed counts for Assignment tabs
  const unassignedCount = useMemo(() => {
    return leads.filter((l) => !l.assignedTo || l.assignedTo.trim() === '' || l.assignedTo === 'Unassigned').length;
  }, [leads]);

  const assignedCount = useMemo(() => {
    return leads.filter((l) => Boolean(l.assignedTo && l.assignedTo.trim() !== '' && l.assignedTo !== 'Unassigned')).length;
  }, [leads]);

  // Filter leads based on active assignment tab & superadmin agent filter
  const filteredLeads = useMemo(() => {
    if (!isAdmin) return leads;
    return leads.filter((lead) => {
      const isLeadAssigned = Boolean(lead.assignedTo && lead.assignedTo.trim() !== '' && lead.assignedTo !== 'Unassigned');

      if (assignmentTab === 'unassigned') {
        if (isLeadAssigned) return false;
      } else if (assignmentTab === 'assigned') {
        if (!isLeadAssigned) return false;
        if (assignedAgentFilter !== 'All' && lead.assignedTo?.toLowerCase() !== assignedAgentFilter.toLowerCase()) {
          return false;
        }
      } else if (assignmentTab === 'all') {
        if (assignedAgentFilter !== 'All' && lead.assignedTo?.toLowerCase() !== assignedAgentFilter.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [leads, isAdmin, assignmentTab, assignedAgentFilter]);

  // Paginated leads calculation
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Auto-adjust page if current page exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
      } else {
        alert(data.message || 'Failed to update lead');
      }
    } catch (err: any) {
      alert('Error updating lead: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Bulk Selection Handlers
  const handleToggleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectCount = (count: number) => {
    const targetIds = filteredLeads.slice(0, count).map((l) => l._id);
    setSelectedLeadIds(targetIds);
    setStatusMessage(`Selected top ${targetIds.length} case(s) for assignment`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleToggleSelectAllPage = () => {
    const currentPageIds = paginatedLeads.map((l) => l._id);
    const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedLeadIds.includes(id));
    if (allSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleBulkAssign = async () => {
    if (!selectedAgentName) {
      alert('Kripya pehle ek Agent choose karein!');
      return;
    }
    if (selectedLeadIds.length === 0) {
      alert('Kam se kam ek case select karein!');
      return;
    }

    setAssigningBatch(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: selectedLeadIds,
          assignedTo: selectedAgentName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to assign leads. Please check permissions.');
        return;
      }

      setLeads((prev) =>
        prev.map((lead) =>
          selectedLeadIds.includes(lead._id) ? { ...lead, assignedTo: selectedAgentName } : lead
        )
      );

      setStatusMessage(`Successfully assigned ${selectedLeadIds.length} lead(s) to ${selectedAgentName}!`);
      setSelectedLeadIds([]);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert('Error in assigning leads: ' + err.message);
    } finally {
      setAssigningBatch(false);
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
                        ? 'rgba(245, 197, 99, 0.15)'
                        : currentUser.role === 'admin'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : currentUser.role === 'crm_editor'
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(245, 197, 99, 0.12)',
                    color:
                      currentUser.role === 'superadmin'
                        ? '#f5c563'
                        : currentUser.role === 'admin'
                        ? '#ffffff'
                        : currentUser.role === 'crm_editor'
                        ? '#a5b4fc'
                        : '#f5c563',
                    borderColor:
                      currentUser.role === 'superadmin'
                        ? 'rgba(245, 197, 99, 0.4)'
                        : currentUser.role === 'admin'
                        ? 'rgba(255, 255, 255, 0.2)'
                        : currentUser.role === 'crm_editor'
                        ? 'rgba(99, 102, 241, 0.35)'
                        : 'rgba(245, 197, 99, 0.3)',
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

          <div className="crm-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isSuperAdmin && (
              <Link
                href="/dashboard/appointments"
                className="crm-btn"
                style={{
                  fontSize: '0.82rem',
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(245, 197, 99, 0.15)',
                  border: '1px solid rgba(245, 197, 99, 0.4)',
                  color: '#f5c563',
                  fontWeight: 600,
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                <Calendar size={14} /> Expert Appointments
              </Link>
            )}
            {canEnter && (
              <Link
                href="/crm/entry"
                className="crm-btn crm-btn-primary"
                style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <PlusCircle size={14} /> Add Leads / Entry
              </Link>
            )}
            <button onClick={() => fetchLeads()} className="crm-btn crm-btn-icon" title="Refresh Leads">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
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

            <div className="crm-filter">
              <span className="crm-filter-label">Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="crm-select"
              >
                <option value="All">All Sources</option>
                <option value="Form">Form</option>
                <option value="Excel Upload">Excel Upload</option>
              </select>
            </div>
          </div>
        </div>

        {/* ADMIN & SUPER ADMIN: Assignment View Tabs & Filter */}
        {isAdmin && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '6px',
              marginBottom: '0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(14, 53, 36, 0.75)',
              border: '1px solid rgba(245, 197, 99, 0.22)',
            }}
          >
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setAssignmentTab('unassigned');
                  setCurrentPage(1);
                  setSelectedLeadIds([]);
                }}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: '7px',
                  cursor: 'pointer',
                  border: assignmentTab === 'unassigned' ? '1px solid #f5c563' : '1px solid transparent',
                  background: assignmentTab === 'unassigned' ? '#f5c563' : 'transparent',
                  color: assignmentTab === 'unassigned' ? '#081a12' : '#cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>⚡ Pending Assignment</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: assignmentTab === 'unassigned' ? '#081a12' : 'rgba(245, 197, 99, 0.2)',
                    color: assignmentTab === 'unassigned' ? '#f5c563' : '#f5c563',
                  }}
                >
                  {unassignedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAssignmentTab('assigned');
                  setCurrentPage(1);
                  setSelectedLeadIds([]);
                }}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: '7px',
                  cursor: 'pointer',
                  border: assignmentTab === 'assigned' ? '1px solid #f5c563' : '1px solid transparent',
                  background: assignmentTab === 'assigned' ? '#f5c563' : 'transparent',
                  color: assignmentTab === 'assigned' ? '#081a12' : '#cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>👤 Assigned Cases</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: assignmentTab === 'assigned' ? '#081a12' : 'rgba(245, 197, 99, 0.2)',
                    color: assignmentTab === 'assigned' ? '#f5c563' : '#f5c563',
                  }}
                >
                  {assignedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAssignmentTab('all');
                  setCurrentPage(1);
                  setSelectedLeadIds([]);
                }}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: '7px',
                  cursor: 'pointer',
                  border: assignmentTab === 'all' ? '1px solid #f5c563' : '1px solid transparent',
                  background: assignmentTab === 'all' ? '#f5c563' : 'transparent',
                  color: assignmentTab === 'all' ? '#081a12' : '#cbd5e1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>📋 All Cases</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: assignmentTab === 'all' ? '#081a12' : 'rgba(255, 255, 255, 0.12)',
                    color: assignmentTab === 'all' ? '#f5c563' : '#cbd5e1',
                  }}
                >
                  {leads.length}
                </span>
              </button>
            </div>

            {/* Super Admin filter by specific agent */}
            {isSuperAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                  Filter by Agent:
                </span>
                <select
                  value={assignedAgentFilter}
                  onChange={(e) => {
                    setAssignedAgentFilter(e.target.value);
                    setCurrentPage(1);
                    setSelectedLeadIds([]);
                  }}
                  className="crm-select"
                  style={{
                    fontSize: '0.8rem',
                    padding: '5px 10px',
                    background: '#082317',
                    border: '1px solid rgba(245, 197, 99, 0.35)',
                    color: '#ffffff',
                    borderRadius: '6px',
                    minWidth: '160px',
                  }}
                >
                  <option value="All">All Assigned Agents</option>
                  {agentsList.map((agent) => (
                    <option key={agent._id || agent.id || agent.name} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ADMIN & SUPER ADMIN: Batch Assignment Action Toolbar */}
        {isAdmin && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '12px 18px',
              marginBottom: '1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(14, 53, 36, 0.85)',
              border: '1px solid rgba(245, 197, 99, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Left: Quick Select Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="#f5c563" />
                <span>Assignment:</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: selectedLeadIds.length > 0 ? '#f5c563' : 'rgba(255, 255, 255, 0.1)',
                    color: selectedLeadIds.length > 0 ? '#081a12' : '#94a3b8',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                >
                  {selectedLeadIds.length} Selected
                </span>
              </span>

              <span style={{ color: 'rgba(245, 197, 99, 0.3)', margin: '0 4px' }}>|</span>

              {/* Quick Select Count Buttons */}
              <button
                type="button"
                onClick={() => handleSelectCount(10)}
                className="crm-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: 'rgba(245, 197, 99, 0.12)',
                  border: '1px solid rgba(245, 197, 99, 0.3)',
                  color: '#f5c563',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                title="Select top 10 cases"
              >
                Select 10
              </button>

              <button
                type="button"
                onClick={() => handleSelectCount(25)}
                className="crm-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: 'rgba(245, 197, 99, 0.12)',
                  border: '1px solid rgba(245, 197, 99, 0.3)',
                  color: '#f5c563',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                title="Select top 25 cases"
              >
                Select 25
              </button>

              <button
                type="button"
                onClick={() => handleSelectCount(50)}
                className="crm-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: 'rgba(245, 197, 99, 0.12)',
                  border: '1px solid rgba(245, 197, 99, 0.3)',
                  color: '#f5c563',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                title="Select top 50 cases"
              >
                Select 50
              </button>

              <button
                type="button"
                onClick={() => handleSelectCount(100)}
                className="crm-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: 'rgba(245, 197, 99, 0.18)',
                  border: '1px solid rgba(245, 197, 99, 0.45)',
                  color: '#f5c563',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                title="Select top 100 cases"
              >
                Select 100
              </button>

              <button
                type="button"
                onClick={handleToggleSelectAllPage}
                className="crm-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {paginatedLeads.every((l) => selectedLeadIds.includes(l._id)) && paginatedLeads.length > 0
                  ? 'Unselect Page'
                  : 'Select Page'}
              </button>

              {selectedLeadIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedLeadIds([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '4px 8px',
                    textDecoration: 'underline',
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Right: Agent selector + CTA button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={selectedAgentName}
                onChange={(e) => setSelectedAgentName(e.target.value)}
                className="crm-select"
                style={{
                  fontSize: '0.85rem',
                  padding: '7px 12px',
                  minWidth: '200px',
                  background: '#082317',
                  border: '1px solid rgba(245, 197, 99, 0.35)',
                  color: '#ffffff',
                  borderRadius: '7px',
                }}
              >
                <option value="">-- Choose Agent (CRM Editor) --</option>
                {agentsList.map((agent) => (
                  <option key={agent._id || agent.id || agent.email} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleBulkAssign}
                disabled={assigningBatch || selectedLeadIds.length === 0 || !selectedAgentName}
                className="crm-btn"
                style={{
                  fontSize: '0.85rem',
                  padding: '7px 16px',
                  fontWeight: 700,
                  background: selectedLeadIds.length === 0 || !selectedAgentName ? 'rgba(245, 197, 99, 0.25)' : '#f5c563',
                  color: '#081a12',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: selectedLeadIds.length === 0 || !selectedAgentName ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                {assigningBatch ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <UserCheck size={14} />
                )}
                Assign {selectedLeadIds.length > 0 ? `(${selectedLeadIds.length}) Cases` : 'Cases'}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="crm-table-card">
          <div className="crm-table-scroll">
            <table className="crm-table">
              <thead>
                <tr>
                  {isAdmin && (
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l._id))}
                        onChange={handleToggleSelectAllPage}
                        style={{ cursor: 'pointer', accentColor: '#f5c563', width: '16px', height: '16px' }}
                        title="Select / Unselect All on This Page"
                      />
                    </th>
                  )}
                  <th>#</th>
                  <th>Customer</th>
                  <th>Mobile Number</th>
                  <th>Loan Applied</th>
                  <th>Assigned To</th>
                  <th className="is-strong">{canEdit ? 'Status (Click to Update) ⚡' : 'Status (View-Only 🔒)'}</th>
                  <th>Bank / Rejection Details</th>
                  <th>Source</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadError ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} className="crm-table-empty" style={{ color: '#dc2626' }}>
                      <AlertTriangle size={26} style={{ margin: '0 auto 0.5rem', color: '#dc2626' }} />
                      {leadError}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} className="crm-table-loading">
                      <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--brand-green)' }} />
                      Loading leads from database...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} className="crm-table-empty">
                      <Filter size={26} style={{ margin: '0 auto 0.5rem' }} />
                      {!isAdmin && currentUser?.role === 'crm_editor'
                        ? 'No leads currently assigned to you. Once an admin assigns cases, they will appear here.'
                        : 'No leads found matching your criteria.'}
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead, idx) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className={selectedLeadIds.includes(lead._id) ? 'is-selected' : ''}
                    >
                      {/* Checkbox for Admin / Super Admin */}
                      {isAdmin && (
                        <td
                          style={{ textAlign: 'center', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelectOne(lead._id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead._id)}
                            onChange={() => {}}
                            style={{ cursor: 'pointer', accentColor: '#f5c563', pointerEvents: 'none', width: '16px', height: '16px' }}
                          />
                        </td>
                      )}

                      <td className="crm-row-index">{(currentPage - 1) * pageSize + idx + 1}</td>

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

                      {/* Assigned To Column */}
                      <td onClick={(e) => e.stopPropagation()}>
                        {isAdmin ? (
                          <div className="crm-assign-wrap">
                            <select
                              value={lead.assignedTo || ''}
                              onChange={async (e) => {
                                const newAgent = e.target.value;
                                await executeUpdate(lead._id, { assignedTo: newAgent });
                              }}
                              className="crm-select"
                              style={{
                                fontSize: '0.78rem',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                border: lead.assignedTo ? '1px solid #c7d2fe' : '1px dashed #cbd5e1',
                                backgroundColor: lead.assignedTo ? '#eef2ff' : '#fff',
                                color: lead.assignedTo ? '#3730a3' : '#64748b',
                                fontWeight: lead.assignedTo ? 600 : 400,
                                cursor: 'pointer',
                                minWidth: '130px',
                              }}
                            >
                              <option value="">Unassigned</option>
                              {agentsList.map((ag) => (
                                <option key={ag._id || ag.id || ag.name} value={ag.name}>
                                  {ag.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : lead.assignedTo ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              backgroundColor: 'rgba(245, 197, 99, 0.15)',
                              color: '#f5c563',
                              border: '1px solid rgba(245, 197, 99, 0.3)',
                              fontWeight: 600,
                            }}
                          >
                            <Users size={11} /> {lead.assignedTo}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Unassigned</span>
                        )}
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination & Page Size Controls */}
          <div
            className="crm-table-footer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderTop: '1px solid rgba(245, 197, 99, 0.18)',
              background: 'var(--crm-surface-2)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Showing{' '}
                <strong style={{ color: '#ffffff' }}>
                  {filteredLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredLeads.length)}
                </strong>{' '}
                of <strong style={{ color: '#ffffff' }}>{filteredLeads.length}</strong> cases (Page {currentPage} of {totalPages})
              </div>

              {/* Rows Per Page Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                    setSelectedLeadIds([]);
                  }}
                  className="crm-select"
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.8rem',
                    background: '#082317',
                    border: '1px solid rgba(245, 197, 99, 0.25)',
                    color: '#ffffff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>

            {/* Pagination Button Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  setSelectedLeadIds([]);
                }}
                className="crm-btn"
                style={{
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  background: '#0e3524',
                  border: '1px solid rgba(245, 197, 99, 0.25)',
                  color: currentPage <= 1 ? '#64748b' : '#cbd5e1',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ChevronLeft size={14} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((pageNum, idx, arr) => {
                  const showEllipsis = idx > 0 && pageNum - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsis && <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          setSelectedLeadIds([]);
                        }}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.8rem',
                          borderRadius: '5px',
                          border: pageNum === currentPage ? '1px solid #f5c563' : '1px solid rgba(245, 197, 99, 0.2)',
                          backgroundColor: pageNum === currentPage ? '#f5c563' : '#0e3524',
                          color: pageNum === currentPage ? '#081a12' : '#cbd5e1',
                          cursor: 'pointer',
                          fontWeight: pageNum === currentPage ? 700 : 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  setSelectedLeadIds([]);
                }}
                className="crm-btn"
                style={{
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  background: '#0e3524',
                  border: '1px solid rgba(245, 197, 99, 0.25)',
                  color: currentPage >= totalPages ? '#64748b' : '#cbd5e1',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Next <ChevronRight size={14} />
              </button>
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
                      <strong>{selectedLead.approvedBank || selectedLead.bankName || 'Not Set'}</strong>
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

                {/* <div className="crm-detail-box">
                  <div className="crm-detail-box-label">Assigned Agent</div>
                  {isAdmin ? (
                    <select
                      value={selectedLead.assignedTo || ''}
                      onChange={(e) => {
                        const newAgent = e.target.value;
                        executeUpdate(selectedLead._id, { assignedTo: newAgent });
                      }}
                      className="crm-select"
                      style={{ fontSize: '0.8rem', padding: '3px 8px', width: '100%' }}
                    >
                      <option value="">Unassigned</option>
                      {agentsList.map((ag) => (
                        <option key={ag._id || ag.id || ag.name} value={ag.name}>
                          {ag.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                     <div className="crm-detail-box-value" style={{ color: selectedLead.assignedTo ? '#3730a3' : '#94a3b8' }}>
                       {selectedLead.assignedTo || 'Unassigned'}
                     </div>
                  )}
                </div> */}

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}