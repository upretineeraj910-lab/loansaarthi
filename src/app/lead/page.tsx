"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Phone,
  Mail,
  AlertCircle,
  X,
  FileSpreadsheet,
} from "lucide-react";
import "./lead.css";

interface Lead {
  _id: string;
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  loanType?: string;
  income?: string;
  loanAmount?: number | string;
  isVerified?: boolean;
  createdAt?: string;
}

const formatIndianCurrency = (value?: string | number) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  const str = String(value).replace(/,/g, "").trim();
  const number = Number(str);

  if (isNaN(number)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(number);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "--";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "--";
  }
};

export default function LeadPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Actions
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch leads
  const fetchLeads = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        const res = await fetch(`/api/lead?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load leads");
        }

        setLeads(data.leads || []);
        const totalCount = typeof data.total === "number" ? data.total : 0;
        setTotal(totalCount);
        setTotalPages(
          typeof data.totalPages === "number"
            ? data.totalPages
            : Math.max(1, Math.ceil(totalCount / limit))
        );
      } catch (err: any) {
        console.error("Fetch leads error:", err);
        setError(err.message || "Failed to connect to server. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, debouncedSearch]
  );

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle page changes
  const handlePrevious = () => {
    if (page > 1 && !loading) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // Delete a lead
  const handleDeleteLead = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete lead "${name || "Unknown"}"?`
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/lead?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete lead");
      }

      if (leads.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchLeads();
      }
    } catch (err: any) {
      alert(err.message || "Could not delete lead");
    } finally {
      setDeletingId(null);
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("No leads available to export.");
      return;
    }

    const headers = [
      "Full Name",
      "Phone",
      "Email",
      "Occupation",
      "Loan Type",
      "Annual Income (INR)",
      "Created At",
    ];

    const rows = leads.map((lead) => [
      `"${(lead.fullName || lead.name || "N/A").replace(/"/g, '""')}"`,
      `"${(lead.phone || "").replace(/"/g, '""')}"`,
      `"${(lead.email || "").replace(/"/g, '""')}"`,
      `"${(lead.occupation || "N/A").replace(/"/g, '""')}"`,
      `"${(lead.loanType || "--").replace(/"/g, '""')}"`,
      `"${formatIndianCurrency(lead.income || lead.loanAmount)}"`,
      `"${formatDate(lead.createdAt)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `loansaarthi_leads_page_${page}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="lead-page">
      {/* HEADER SECTION */}
      <header className="lead-header">
        <div className="lead-header-info">
          <div className="lead-title-row">
            <h1>Customer Leads</h1>
            <span className="lead-badge">{total} Total Leads</span>
          </div>
          <p className="lead-subtitle">
            Real-time applications submitted through loan eligibility check & forms
          </p>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="lead-toolbar">
          {/* SEARCH BOX */}
          <div className="lead-search-wrapper">
            <Search className="lead-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone, email, or loan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="lead-search-input"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="lead-search-clear"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="lead-actions-group">
            {/* LIMIT SELECTOR */}
            <div className="lead-limit-wrapper">
              <label htmlFor="lead-limit" className="lead-limit-label">
                Show:
              </label>
              <select
                id="lead-limit"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="lead-limit-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* REFRESH BUTTON */}
            <button
              onClick={() => fetchLeads(true)}
              disabled={loading || refreshing}
              className="lead-btn lead-btn-secondary"
              title="Refresh leads"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "spin-animation" : ""}
              />
              <span>Refresh</span>
            </button>

            {/* EXPORT BUTTON */}
            <button
              onClick={handleExportCSV}
              disabled={loading || leads.length === 0}
              className="lead-btn lead-btn-primary"
              title="Export current view to CSV"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* COPIED TOAST */}
      {copiedText && (
        <div className="lead-toast">Copied {copiedText} to clipboard!</div>
      )}

      {/* ERROR STATE */}
      {error ? (
        <div className="lead-alert-box error">
          <AlertCircle size={22} />
          <div className="lead-alert-content">
            <h4>Something went wrong</h4>
            <p>{error}</p>
          </div>
          <button
            onClick={() => fetchLeads()}
            className="lead-btn lead-btn-secondary"
          >
            Try Again
          </button>
        </div>
      ) : loading && leads.length === 0 ? (
        /* LOADING SKELETON */
        <div className="lead-loading-box">
          <div className="lead-spinner" />
          <p>Loading customer leads...</p>
        </div>
      ) : leads.length === 0 ? (
        /* EMPTY STATE */
        <div className="lead-empty-box">
          <FileSpreadsheet size={48} className="lead-empty-icon" />
          <h3>No leads found</h3>
          <p>
            {debouncedSearch
              ? `No results matching "${debouncedSearch}". Try checking for spelling errors or clear your search filter.`
              : "No customer leads have been captured yet. New submissions will appear here automatically."}
          </p>
          {debouncedSearch && (
            <button
              onClick={() => setSearchInput("")}
              className="lead-btn lead-btn-secondary"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : (
        /* LEADS TABLE */
        <>
          <div className="lead-table-wrapper">
            <table className="lead-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Occupation</th>
                  <th>Loan Type</th>
                  <th>Annual Income</th>
                  <th>Created At</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => {
                  const displayName = lead.fullName || lead.name || "N/A";
                  const displayPhone = lead.phone || "";
                  const displayEmail = lead.email || "";
                  const displayOccupation = lead.occupation || "N/A";
                  const displayLoan = lead.loanType || "Home Loan";
                  const displayIncome = formatIndianCurrency(
                    lead.income || lead.loanAmount
                  );
                  const displayDate = formatDate(lead.createdAt);

                  return (
                    <tr key={lead._id}>
                      {/* FULL NAME */}
                      <td data-label="Full Name">
                        <div className="lead-user-cell">
                          <span className="lead-user-avatar">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                          <span className="lead-user-name" title={displayName}>
                            {displayName}
                          </span>
                        </div>
                      </td>

                      {/* PHONE */}
                      <td data-label="Phone">
                        {displayPhone ? (
                          <div className="lead-contact-item">
                            <a
                              href={`tel:${displayPhone}`}
                              className="lead-link"
                              title="Click to call"
                            >
                              <Phone size={13} />
                              <span>{displayPhone}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(displayPhone, "phone")}
                              className="lead-copy-btn"
                              title="Copy phone"
                            >
                              Copy
                            </button>
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>

                      {/* EMAIL */}
                      <td data-label="Email">
                        {displayEmail ? (
                          <div className="lead-contact-item">
                            <a
                              href={`mailto:${displayEmail}`}
                              className="lead-link"
                              title="Click to send email"
                            >
                              <Mail size={13} />
                              <span className="lead-email-text" title={displayEmail}>
                                {displayEmail}
                              </span>
                            </a>
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>

                      {/* OCCUPATION */}
                      <td data-label="Occupation">
                        <span className="lead-occupation-text">
                          {displayOccupation}
                        </span>
                      </td>

                      {/* LOAN TYPE */}
                      <td data-label="Loan Type">
                        <span
                          className={`lead-loan-tag tag-${displayLoan
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {displayLoan}
                        </span>
                      </td>

                      {/* INCOME */}
                      <td data-label="Annual Income" className="lead-income-cell">
                        ₹{displayIncome}
                      </td>

                      {/* CREATED AT */}
                      <td data-label="Created At" className="lead-date-cell">
                        {displayDate}
                      </td>

                      {/* ACTIONS */}
                      <td data-label="Action" style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDeleteLead(lead._id, displayName)}
                          disabled={deletingId === lead._id}
                          className="lead-action-btn delete"
                          title="Delete lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="lead-pagination-container">
            {/* RANGE INFO */}
            <div className="lead-pagination-info">
              Showing{" "}
              <strong>
                {total === 0 ? 0 : (page - 1) * limit + 1}
              </strong>{" "}
              to{" "}
              <strong>{Math.min(page * limit, total)}</strong> of{" "}
              <strong>{total}</strong> leads
            </div>

            {/* BUTTONS */}
            <div className="lead-pagination-controls">
              <button
                onClick={handlePrevious}
                disabled={page <= 1 || loading}
                className="lead-page-btn"
                title="Previous page"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="lead-page-indicator">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </div>

              <button
                onClick={handleNext}
                disabled={page >= totalPages || loading}
                className="lead-page-btn"
                title="Next page"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}