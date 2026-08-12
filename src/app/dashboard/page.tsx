'use client';

import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

interface DocumentUrl {
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface CaseDocuments {
  pan?: DocumentUrl;
  aadhaar?: DocumentUrl;
  bankStatement?: DocumentUrl;
  itr?: DocumentUrl;
  form16?: DocumentUrl;
  businessProof?: DocumentUrl;
  salarySlips?: DocumentUrl[];
}

interface CaseData {
  _id: string;
  applicantName: string;
  loanType: string;
  loanAmount: number;
  createdAt: string;
}

interface DocumentsResponse {
  success: boolean;
  caseId: string;
  documents: CaseDocuments;
}

export default function Dashboard() {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [documents, setDocuments] = useState<CaseDocuments | null>(null);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState('');

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
    }
  }, []);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/dashboard/cases');

        if (!response.ok) {
          throw new Error('Failed to fetch cases');
        }

        const result = await response.json();

        setCases(result.data || []);
      } catch (err) {
        console.error('Failed to load cases:', err);
        setError('Unable to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleViewDocuments = async (caseItem: CaseData) => {
    try {
      setSelectedCase(caseItem);
      setDocuments(null);
      setDocumentsError('');
      setDocumentsLoading(true);

      const response = await fetch(
        `/api/dashboard/cases/${caseItem._id}/documents`
      );

      const result: DocumentsResponse | { error: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          'error' in result
            ? result.error
            : 'Failed to fetch documents'
        );
      }

      setDocuments((result as DocumentsResponse).documents);
    } catch (err) {
      console.error('Failed to load documents:', err);

      setDocumentsError(
        err instanceof Error
          ? err.message
          : 'Unable to load documents.'
      );
    } finally {
      setDocumentsLoading(false);
    }
  };

  const closeDocumentsModal = () => {
    setSelectedCase(null);
    setDocuments(null);
    setDocumentsError('');
  };

  const documentItems: {
    key: keyof Omit<CaseDocuments, 'salarySlips'>;
    label: string;
  }[] = [
    { key: 'pan', label: 'PAN Card' },
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'bankStatement', label: 'Bank Statement' },
    { key: 'itr', label: 'ITR' },
    { key: 'form16', label: 'Form 16' },
    { key: 'businessProof', label: 'Business Proof' },
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>LoanSaarthi</div>

        <nav className={styles.nav}>
          <a
            href="#"
            className={`${styles.navItem} ${styles.navItemActive}`}
          >
            Dashboard
          </a>

          <a href="#" className={styles.navItem}>
            Lead Management
          </a>

          <a href="#" className={styles.navItem}>
            Loan Applications
          </a>

          <a href="#" className={styles.navItem}>
            Analytics
          </a>

          <a href="#" className={styles.navItem}>
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Partner Dashboard</h1>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}
            >
              Overview of your leads and referral links
            </p>
          </div>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              Total Referrals
            </div>

            <div className={styles.statValue}>
              {loading ? '...' : cases.length}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              Approved Loans
            </div>

            <div className={styles.statValue}>—</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              Pending Process
            </div>

            <div className={styles.statValue}>—</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              Total Earnings
            </div>

            <div className={styles.statValue}>—</div>
          </div>
        </div>

        {/* Referral Link */}
        <div className={styles.shareCard}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
          >
            Your Referral Link
          </h3>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Share this link with customers. Form entries will
            automatically be tagged to your partner ID.
          </p>

          <div className={styles.shareInputGroup}>
            <input
              type="text"
              readOnly
              value={shareUrl || 'Generating link...'}
              className={styles.shareInput}
            />

            <button
              onClick={handleCopy}
              className={styles.copyBtn}
            >
              {copied ? 'Copied! ✓' : 'Copy Share Link'}
            </button>
          </div>
        </div>

        {/* Cases Table */}
        <div className={styles.tableCard}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Recent Lead Applications
          </h3>

          {error && (
            <p
              style={{
                color: 'red',
                marginBottom: '1rem',
              }}
            >
              {error}
            </p>
          )}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Documents</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>
                      Loading applications...
                    </td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  cases.map((item) => (
                    <tr key={item._id}>
                      <td>{item.applicantName}</td>

                      <td>{item.loanType}</td>

                      <td>
                        ₹
                        {Number(item.loanAmount).toLocaleString(
                          'en-IN'
                        )}
                      </td>

                      <td>
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString('en-IN')}
                      </td>

                      <td>
                        <button
                          type="button"
                          className={styles.documentBtn}
                          onClick={() =>
                            handleViewDocuments(item)
                          }
                        >
                          View Documents
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

      {/* Documents Modal */}
      {selectedCase && (
        <div
          className={styles.modalOverlay}
          onClick={closeDocumentsModal}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>
                  Documents
                </h2>

                <p className={styles.modalSubtitle}>
                  {selectedCase.applicantName} •{' '}
                  {selectedCase.loanType}
                </p>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={closeDocumentsModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              {documentsLoading && (
                <div className={styles.documentsLoading}>
                  Loading documents...
                </div>
              )}

              {documentsError && (
                <div className={styles.documentsError}>
                  {documentsError}
                </div>
              )}

              {!documentsLoading &&
                !documentsError &&
                documents && (
                  <div className={styles.documentsGrid}>
                    {documentItems.map(({ key, label }) => {
                      const document = documents[key];

                      if (!document) {
                        return null;
                      }

                      return (
                        <div
                          key={key}
                          className={styles.documentCard}
                        >
                          <div>
                            <div
                              className={
                                styles.documentName
                              }
                            >
                              {label}
                            </div>

                            <div
                              className={
                                styles.documentFileName
                              }
                            >
                              {document.fileName}
                            </div>
                          </div>

                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewDocumentBtn}
                          >
                            View
                          </a>
                        </div>
                      );
                    })}

                    {documents.salarySlips &&
                      documents.salarySlips.length > 0 && (
                        <div
                          className={styles.documentCard}
                        >
                          <div>
                            <div
                              className={
                                styles.documentName
                              }
                            >
                              Salary Slips
                            </div>

                            <div
                              className={
                                styles.documentFileName
                              }
                            >
                              {documents.salarySlips.length}{' '}
                              file(s)
                            </div>
                          </div>

                          <div
                            className={
                              styles.salarySlipButtons
                            }
                          >
                            {documents.salarySlips.map(
                              (slip, index) => (
                                <a
                                  key={index}
                                  href={slip.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={
                                    styles.viewDocumentBtn
                                  }
                                >
                                  View {index + 1}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {!Object.keys(documents).length && (
                      <div
                        className={styles.noDocuments}
                      >
                        No documents available for this case.
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}