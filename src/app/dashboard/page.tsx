/**
 * LoanSaarthi Executive Partner Dashboard
 * Central command center for loan pipelines, verified lead vaults,
 * pre-qualification inquiries, and partner performance metrics.
 */
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  TrendingUp,
  CheckCircle2,
  Calculator,
  Calendar,
  Search,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Layers,
  Building2,
  FileText,
} from 'lucide-react';
import styles from './Dashboard.module.css';

interface DashboardStats {
  totalLeads: number;
  fresh: number;
  inPipeline: number;
  approved: number;
  disbursed: number;
  disbursedVolume: number;
  eligibilityChecks: number;
  appointments: number;
}

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  loanType: string;
  loanAmount: number;
  status: string;
  assignedTo: string;
  createdAt: string;
}

interface EligibilityItem {
  id: string;
  fullName: string;
  phone: string;
  loanType: string;
  monthlyIncome: number;
  maxLoanEligible: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  name?: string;
}

const formatINR = (val?: number | string): string => {
  if (val === undefined || val === null || val === '') return '₹0';
  const num = Number(val);
  if (isNaN(num)) return `₹${val}`;
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

const formatVolumeCr = (val: number): string => {
  if (!val || val === 0) return '₹0';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  }
  return formatINR(val);
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '--';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '--';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '--';
  }
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    fresh: 0,
    inPipeline: 0,
    approved: 0,
    disbursed: 0,
    disbursedVolume: 0,
    eligibilityChecks: 0,
    appointments: 0,
  });

  const [recentLeads, setRecentLeads] = useState<LeadItem[]>([]);
  const [recentEligibility, setRecentEligibility] = useState<EligibilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Active view tab in the data table
  const [activeTab, setActiveTab] = useState<'pipeline' | 'eligibility'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/dashboard/overview');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.status === 403) {
        const errData = await res.json();
        if (errData.redirectTo) {
          router.push(errData.redirectTo);
          return;
        }
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.user) {
            setUser(data.user);
            if (data.user.role?.toLowerCase() === 'admin') {
              router.push('/lead');
              return;
            }
          }
          if (data.stats) setStats(data.stats);
          if (data.recentLeads) setRecentLeads(data.recentLeads);
          if (data.recentEligibility) setRecentEligibility(data.recentEligibility);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    // Read cached user info from localStorage if available
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (parsed?.role?.toLowerCase() === 'admin') {
          router.push('/lead');
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    fetchDashboardData();
  }, [fetchDashboardData, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const userRole = user?.role?.toLowerCase() || '';
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin';
  const isEntry = userRole === 'crm_entry';
  const isEditor = userRole === 'crm_editor';
  const canEnter = isSuperAdmin || isEntry;
  const canEdit = isSuperAdmin || isEditor;

  // Filtered lists for the active tab
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return recentLeads;
    const q = searchQuery.toLowerCase().trim();
    return recentLeads.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.loanType?.toLowerCase().includes(q) ||
        l.status?.toLowerCase().includes(q)
    );
  }, [recentLeads, searchQuery]);

  const filteredEligibility = useMemo(() => {
    if (!searchQuery.trim()) return recentEligibility;
    const q = searchQuery.toLowerCase().trim();
    return recentEligibility.filter(
      (e) =>
        e.fullName?.toLowerCase().includes(q) ||
        e.phone?.includes(q) ||
        e.loanType?.toLowerCase().includes(q)
    );
  }, [recentEligibility, searchQuery]);

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'fresh':
        return styles.badgeFresh;
      case 'approved':
        return styles.badgeApproved;
      case 'disbursed':
        return styles.badgeDisbursed;
      case 'rejected':
      case 'not eligible':
        return styles.badgeRejected;
      default:
        return styles.badgePipeline;
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoText}>
            Loan<span>Saarthi</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <span className={styles.navSectionLabel}>Core Modules</span>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${styles.navItemActive}`}
          >
            <Layers size={17} />
            <span>Dashboard</span>
          </Link>

          <Link href="/crm" className={styles.navItem}>
            <TrendingUp size={17} />
            <span>{isEntry ? 'CRM Pipeline (View Only)' : isEditor ? 'My Calling Queue' : 'CRM Pipeline'}</span>
          </Link>

          <Link href="/lead" className={styles.navItem}>
            <Users size={17} />
            <span>Leads Vault (OTP)</span>
          </Link>

          {canEnter && (
            <Link href="/crm/entry" className={styles.navItem}>
              <PlusCircle size={17} />
              <span>Fast Lead Entry</span>
            </Link>
          )}

          <span className={styles.navSectionLabel}>Client Tools</span>
          <Link href="/check-eligibility" className={styles.navItem}>
            <Calculator size={17} />
            <span>Eligibility Engine</span>
          </Link>

          {isSuperAdmin && (
            <Link
              href="/dashboard/appointments"
              className={`${styles.navItem} ${styles.navItemGold}`}
            >
              <Calendar size={17} />
              <span>Consultations</span>
            </Link>
          )}
        </nav>

        {/* Sidebar Footer with User Card */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.name || user?.email || 'Partner Account'}
              </span>
              <span className={styles.userRole}>
                {user?.role || 'Partner'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className={styles.mainContent}>
        {/* Executive Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.roleBadge}>
              <ShieldCheck size={12} />
              <span>{user?.role || 'Partner'} Workspace</span>
            </span>
            <h1 className={styles.title}>
              Executive Command Hub
            </h1>
            <p className={styles.subtitle}>
              Real-time portfolio management, CRM pipeline velocity, and customer loan requests.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              className={styles.actionBtnSecondary}
              disabled={refreshing}
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Updating...' : 'Sync Data'}</span>
            </button>

            {canEnter ? (
              <Link href="/crm/entry" className={styles.actionBtnPrimary}>
                <PlusCircle size={15} />
                <span>New Lead Intake</span>
              </Link>
            ) : isEditor ? (
              <Link href="/crm" className={styles.actionBtnPrimary}>
                <TrendingUp size={15} />
                <span>Open Calling Queue</span>
              </Link>
            ) : null}
          </div>
        </header>

        {/* ---------------- KPI STATS GRID ---------------- */}
        <section className={styles.statsGrid} aria-label="Key Performance Indicators">
          {/* Card 1: Total Leads */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Total Pipeline Leads</span>
              <div className={styles.statIconBox}>
                <Users size={18} />
              </div>
            </div>
            <div className={styles.statValue}>
              {loading ? '...' : stats.totalLeads}
            </div>
            <p className={styles.statSubtitle}>
              <span className={styles.statHighlight}>{stats.fresh}</span> Fresh •{' '}
              <span className={styles.statHighlight}>{stats.inPipeline}</span> in Underwriting
            </p>
          </div>

          {/* Card 2: Sanction Volume */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Sanctioned Portfolio</span>
              <div className={styles.statIconBox}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className={styles.statValue}>
              {loading ? '...' : formatVolumeCr(stats.disbursedVolume)}
            </div>
            <p className={styles.statSubtitle}>
              <span className={styles.statHighlight}>{stats.approved + stats.disbursed}</span> Approved / Disbursed Files
            </p>
          </div>

          {/* Card 3: Pre-Qualification Calculations */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Eligibility Inquiries</span>
              <div className={styles.statIconBox}>
                <Calculator size={18} />
              </div>
            </div>
            <div className={styles.statValue}>
              {loading ? '...' : stats.eligibilityChecks}
            </div>
            <p className={styles.statSubtitle}>
              <span className={styles.statHighlight}>Dedicated</span> Eligibility Leads
            </p>
          </div>

          {/* Card 4: Appointments / Active Pipeline */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Expert Consultations</span>
              <div className={styles.statIconBox}>
                <Calendar size={18} />
              </div>
            </div>
            <div className={styles.statValue}>
              {loading ? '...' : stats.appointments}
            </div>
            <p className={styles.statSubtitle}>
              Scheduled client consultations
            </p>
          </div>
        </section>

        {/* ---------------- SHORTCUT MODULES ---------------- */}
        <section className={styles.shortcutsSection}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionHeading}>Fast Access Workspaces</h2>
          </div>

          <div className={styles.shortcutsGrid}>
            <Link href="/crm" className={styles.shortcutCard}>
              <div className={styles.shortcutIcon}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.shortcutContent}>
                <h3 className={styles.shortcutTitle}>CRM Pipeline</h3>
                <p className={styles.shortcutDesc}>Visual underwriting & disbursal tracking</p>
              </div>
              <ArrowRight size={16} className={styles.shortcutArrow} />
            </Link>

            <Link href="/lead" className={styles.shortcutCard}>
              <div className={styles.shortcutIcon}>
                <Users size={20} />
              </div>
              <div className={styles.shortcutContent}>
                <h3 className={styles.shortcutTitle}>Leads Vault</h3>
                <p className={styles.shortcutDesc}>Full database search & Excel download</p>
              </div>
              <ArrowRight size={16} className={styles.shortcutArrow} />
            </Link>

            {canEnter && (
              <Link href="/crm/entry" className={styles.shortcutCard}>
                <div className={styles.shortcutIcon}>
                  <PlusCircle size={20} />
                </div>
                <div className={styles.shortcutContent}>
                  <h3 className={styles.shortcutTitle}>Instant Intake</h3>
                  <p className={styles.shortcutDesc}>Single entry and bulk Excel uploads</p>
                </div>
                <ArrowRight size={16} className={styles.shortcutArrow} />
              </Link>
            )}

            {isEditor && (
              <Link href="/crm" className={styles.shortcutCard}>
                <div className={styles.shortcutIcon}>
                  <TrendingUp size={20} />
                </div>
                <div className={styles.shortcutContent}>
                  <h3 className={styles.shortcutTitle}>My Calling Queue</h3>
                  <p className={styles.shortcutDesc}>Work assigned leads & update stage</p>
                </div>
                <ArrowRight size={16} className={styles.shortcutArrow} />
              </Link>
            )}

            <Link href="/check-eligibility" className={styles.shortcutCard}>
              <div className={styles.shortcutIcon}>
                <Calculator size={20} />
              </div>
              <div className={styles.shortcutContent}>
                <h3 className={styles.shortcutTitle}>Eligibility Engine</h3>
                <p className={styles.shortcutDesc}>Instant pre-qualification check tool</p>
              </div>
              <ArrowRight size={16} className={styles.shortcutArrow} />
            </Link>
          </div>
        </section>

        {/* ---------------- DATA TABLE SECTION ---------------- */}
        <section className={styles.tableCard}>
          <div className={styles.tableToolbar}>
            <div className={styles.tabButtons}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'pipeline' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('pipeline')}
              >
                Recent Pipeline Leads ({filteredLeads.length})
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'eligibility' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('eligibility')}
              >
                Eligibility Engine Leads ({filteredEligibility.length})
              </button>
            </div>

            <div className={styles.searchBox}>
              <Search size={15} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name, phone or loan type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            {activeTab === 'pipeline' ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Contact</th>
                    <th>Loan Type</th>
                    <th>Requested Limit</th>
                    <th>Pipeline Status</th>
                    <th>Assigned Agent</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                        Loading real-time pipeline records...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No leads matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.phone}</td>
                        <td>{item.loanType || 'Personal Loan'}</td>
                        <td>
                          <strong>{formatINR(item.loanAmount)}</strong>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${getStatusBadgeClass(item.status)}`}>
                            {item.status || 'Fresh'}
                          </span>
                        </td>
                        <td>{item.assignedTo}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <Link href="/crm" className={styles.openLink}>
                            <span>View</span>
                            <ArrowRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Contact</th>
                    <th>Loan Category</th>
                    <th>Monthly Income</th>
                    <th>Max Calculated Limit</th>
                    <th>Date</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                        Loading eligibility records...
                      </td>
                    </tr>
                  ) : filteredEligibility.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No eligibility records found.
                      </td>
                    </tr>
                  ) : (
                    filteredEligibility.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.fullName}</strong>
                        </td>
                        <td>{item.phone}</td>
                        <td>{item.loanType}</td>
                        <td>{formatINR(item.monthlyIncome)} / mo</td>
                        <td>
                          <strong style={{ color: '#f5c563' }}>
                            {formatINR(item.maxLoanEligible)}
                          </strong>
                        </td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <span className={`${styles.badge} ${styles.badgeApproved}`}>
                            Pre-Qualified
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
