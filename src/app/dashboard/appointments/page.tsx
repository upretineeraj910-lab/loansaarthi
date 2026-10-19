'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Phone,
  User,
  IndianRupee,
  Search,
  RefreshCw,
  ArrowLeft,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import styles from './appointments.module.css';

interface AppointmentItem {
  _id: string;
  name: string;
  phone: string;
  monthlySalary: number;
  loanType: string;
  loanAmount: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

interface StatsData {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export default function SuperAdminAppointmentsPage() {
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string; role?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check superadmin authentication
  useEffect(() => {
    const verifySuperAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setCurrentUser(data);
          }
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    verifySuperAdmin();
  }, []);

  const isSuperAdmin = currentUser?.role?.toLowerCase() === 'superadmin';

  // Fetch appointments list
  const fetchAppointments = useCallback(async () => {
    if (!isSuperAdmin) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/appointments?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load appointments');
      }

      const data = await res.json();
      setAppointments(data.appointments || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, statusFilter, search]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAppointments();
    }
  }, [isSuperAdmin, fetchAppointments]);

  // Handle inline status update
  const handleStatusChange = async (id: string, newStatus: AppointmentItem['status']) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setAppointments((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );

      // Re-fetch stats
      fetchAppointments();
    } catch (err) {
      alert('Could not update status. Please try again.');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle appointment deletion
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete appointment for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete appointment');
      }

      setAppointments((prev) => prev.filter((item) => item._id !== id));
      fetchAppointments();
    } catch (err) {
      alert('Could not delete appointment.');
      console.error(err);
    }
  };

  // Format date readable
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={32} className="crm-spin" style={{ marginBottom: '1rem', color: '#f5c563' }} />
          <p>Verifying Super Admin Credentials...</p>
        </div>
      </div>
    );
  }

  // Access Restricted Screen (If not Super Admin)
  if (!isSuperAdmin) {
    return (
      <main className={styles.page}>
        <div className={styles.restrictedCard}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
            Access Restricted: Super Admin Only
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '2rem' }}>
            This appointments directory contains confidential customer consultation bookings and is strictly reserved for the <strong>Super Administrator</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/crm" className={styles.backBtn} style={{ color: '#f5c563', borderColor: 'rgba(245, 197, 99, 0.4)' }}>
              Back to CRM
            </Link>
            <Link href="/dashboard" className={styles.backBtn}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 className={styles.heading}>Expert Consultation Appointments</h1>
              <span className={styles.superBadge}>Super Admin</span>
            </div>
            <p className={styles.subheading}>
              Direct video & telephonic consultation bookings scheduled via the 3:00 PM – 5:00 PM portal
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/crm" className={styles.backBtn}>
            <ArrowLeft size={16} />
            <span>CRM Console</span>
          </Link>
          <Link href="/dashboard" className={styles.backBtn}>
            <span>Borrower Dashboard</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Bookings</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 197, 99, 0.15)', color: '#f5c563' }}>
            <Calendar size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Scheduled / Pending</span>
            <span className={styles.statValue} style={{ color: '#93c5fd' }}>
              {stats.scheduled}
            </span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Completed Calls</span>
            <span className={styles.statValue} style={{ color: '#6ee7b7' }}>
              {stats.completed}
            </span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Cancelled</span>
            <span className={styles.statValue} style={{ color: '#fca5a5' }}>
              {stats.cancelled}
            </span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by customer name, phone, or loan type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterTabs}>
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        <button onClick={fetchAppointments} disabled={loading} className={styles.refreshBtn}>
          <RefreshCw size={14} className={loading ? 'crm-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Appointments Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Requirement</th>
                <th>Monthly Salary</th>
                <th>Appointment Date & Time</th>
                <th>Status</th>
                <th>Notes / Specifics</th>
                <th>Booked At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.emptyState}>
                      <Calendar size={48} className={styles.emptyIcon} />
                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0', margin: '0 0 0.5rem' }}>
                        No appointments found
                      </p>
                      <p style={{ fontSize: '0.88rem', margin: 0 }}>
                        {search || statusFilter !== 'All'
                          ? 'Try adjusting your search query or status filter.'
                          : 'Bookings scheduled through the /talk-to-expert page will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className={styles.customerName}>
                        <User size={14} color="#f5c563" />
                        <span>{item.name}</span>
                      </div>
                      <div className={styles.customerPhone}>
                        <a href={`tel:+91${item.phone}`} className={styles.callLink}>
                          <Phone size={13} />
                          <span>+91 {item.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/91${item.phone}?text=Hello%20${encodeURIComponent(
                            item.name
                          )},%20this%20is%20from%20LoanSaarthi%20regarding%20your%20expert%20consultation%20appointment%20on%20${encodeURIComponent(
                            item.appointmentDate
                          )}%20at%20${encodeURIComponent(item.appointmentTime)}.`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.whatsappLink}
                          title="WhatsApp Chat"
                        >
                          <MessageSquare size={13} />
                        </a>
                      </div>
                    </td>

                    <td>
                      <span className={styles.loanBadge}>{item.loanType}</span>
                      <div className={styles.loanAmount}>
                        ₹{item.loanAmount.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td>
                      <div className={styles.salaryText}>
                        ₹{item.monthlySalary?.toLocaleString('en-IN') || '0'} / mo
                      </div>
                    </td>

                    <td>
                      <div className={styles.slotBox}>
                        <div className={styles.slotDate}>
                          <Calendar size={13} color="#94a3b8" />
                          <span>{formatDate(item.appointmentDate)}</span>
                        </div>
                        <div className={styles.slotTime}>
                          <Clock size={12} />
                          <span>{item.appointmentTime}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <select
                        value={item.status}
                        disabled={updatingId === item._id}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value as AppointmentItem['status'])
                        }
                        className={`${styles.statusSelect} ${
                          item.status === 'Scheduled'
                            ? styles.statusScheduled
                            : item.status === 'Completed'
                            ? styles.statusCompleted
                            : styles.statusCancelled
                        }`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <div className={styles.notesText} title={item.notes || 'None'}>
                        {item.notes || '—'}
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>

                    <td>
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className={styles.deleteBtn}
                        title="Delete Appointment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
