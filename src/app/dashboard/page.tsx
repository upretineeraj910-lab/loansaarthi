'use client';

import { useState, useEffect } from 'react';

export default function ShareButton() {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // LocalStorage se logged-in user ki details nikalna
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

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Share Form with Others</h3>
      <p className="text-sm text-gray-600 mb-4">
        Share this unique link. Anyone who fills the form will see your name as referrer.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={shareUrl || 'Loading link...'}
          className="flex-1 p-2 text-sm border rounded bg-gray-50 outline-none"
        />
        <button
          onClick={handleCopy}
          disabled={!shareUrl}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
        >
          {copied ? 'Copied! ✓' : 'Copy Share Link'}
        </button>
      </div>
    </div>
  );
}