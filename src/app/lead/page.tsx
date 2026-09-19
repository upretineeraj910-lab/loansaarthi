"use client";

import { useEffect, useState } from "react";
import "./lead.css";

interface Lead {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  occupation: string;
  loanType: string;
  income: string;
  isVerified: boolean;
  createdAt: string;
}

// Indian currency formatter
const formatIndianCurrency = (value?: string | number) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  const str = String(value).replace(/,/g, "");
  const number = Number(str);

  if (isNaN(number)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(number);
};

export default function LeadPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/lead");
        const data = await res.json();

        if (res.ok) {
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <main className="lead-page">
      <h1>Leads</h1>

      {loading ? (
        <p>Loading leads...</p>
      ) : leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <div className="lead-table-wrapper">
          <table className="lead-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Occupation</th>
                <th>Loan Type</th>
                <th>Annual Income</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.fullName || (lead as any).name || 'N/A'}</td>
                  <td>{lead.phone || '--'}</td>
                  <td>{lead.email || '--'}</td>
                  <td>{lead.occupation || 'N/A'}</td>
                  <td>{lead.loanType || '--'}</td>

                  <td>
                    ₹{formatIndianCurrency(lead.income || (lead as any).loanAmount)}
                  </td>

                  <td>
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN') : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}