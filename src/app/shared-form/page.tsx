'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SharedFormContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get('ref');

  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    message: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);

  // Referrer User ka Name fetch karna
  useEffect(() => {
    if (!refId) {
      setLoadingUser(false);
      return;
    }

    async function fetchReferrer() {
      try {
        const res = await fetch(`/api/referrer/${refId}`);
        const data = await res.json();
        if (res.ok) {
          setReferrerName(data.name);
        } else {
          setStatus({ type: 'error', msg: 'Invalid referral link' });
        }
      } catch (err) {
        setStatus({ type: 'error', msg: 'Failed to load referrer details' });
      } finally {
        setLoadingUser(false);
      }
    }

    fetchReferrer();
  }, [refId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId) {
      setStatus({ type: 'error', msg: 'Missing referral code in URL' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/shared-form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, referrerId: refId }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Form submitted successfully!' });
        setFormData({ applicantName: '', applicantEmail: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Submission failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Referrer Banner */}
      {loadingUser ? (
        <p className="text-gray-500 text-sm mb-4">Loading form details...</p>
      ) : referrerName ? (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm font-medium">
          🤝 Form shared by: <span className="font-bold">{referrerName}</span>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          ⚠️ Direct form submission (No referrer found)
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Submit Details</h2>

      {status.msg && (
        <div
          className={`p-3 mb-4 rounded text-sm ${
            status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            required
            value={formData.applicantName}
            onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
          <input
            type="email"
            required
            value={formData.applicantEmail}
            onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            required
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write your message..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
}

export default function SharedFormPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <SharedFormContent />
    </Suspense>
  );
}