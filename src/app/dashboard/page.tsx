'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user?.id) {
          const origin = window.location.origin;
          setShareUrl(`${origin}/shared-form?ref=${user.id}`);
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    } else {
      setShareUrl('https://loansaarthi.com/shared-form?ref=DEMO123');
    }
  }, []);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>LoanSaarthi</div>
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>Dashboard</a>
          <a href="#" className={styles.navItem}>Lead Management</a>
          <a href="#" className={styles.navItem}>Loan Applications</a>
          <a href="#" className={styles.navItem}>Analytics</a>
          <a href="#" className={styles.navItem}>Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Partner Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Overview of your leads and refer links</p>
          </div>
        </header>

        {/* Stats Metrics Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Referrals</div>
            <div className={styles.statValue}>48</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Approved Loans</div>
            <div className={styles.statValue}>12</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Pending Process</div>
            <div className={styles.statValue}>7</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Earnings</div>
            <div className={styles.statValue}>₹34,500</div>
          </div>
        </div>

        {/* Share Link Card */}
        <div className={styles.shareCard}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Your Referral Link</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Share this link with customers. Form entries will automatically be tagged to your partner ID.
          </p>
          <div className={styles.shareInputGroup}>
            <input
              type="text"
              readOnly
              value={shareUrl || 'Generating link...'}
              className={styles.shareInput}
            />
            <button onClick={handleCopy} className={styles.copyBtn}>
              {copied ? 'Copied! ✓' : 'Copy Share Link'}
            </button>
          </div>
        </div>

        {/* Recent Applications Data Table */}
        <div className={styles.tableCard}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Lead Applications</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rahul Sharma</td>
                <td>Personal Loan</td>
                <td>₹2,50,000</td>
                <td><span className={styles.badgeSuccess}>Approved</span></td>
              </tr>
              <tr>
                <td>Priya Patel</td>
                <td>Business Loan</td>
                <td>₹5,00,000</td>
                <td><span className={styles.badgeSuccess}>In Verification</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}