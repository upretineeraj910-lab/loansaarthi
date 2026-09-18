// app/not-found.js
// Next.js App Router auto-detects this special filename.
// It renders automatically whenever a route doesn't exist, OR
// whenever you manually call notFound() from next/navigation in a page.
// You do NOT add this as a <Route> anywhere — Next.js wires it up for you.

import Link from "next/link";
import { Phone, MessageCircle, Home } from "lucide-react";
import "./not-found.css";

export const metadata = {
  title: "404 — Page Not Found | LoanSaarthi",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="nf-wrapper">
      <div className="nf-inner">
        <div className="nf-code">404</div>
        <h1 className="nf-title">This page took a wrong turn.</h1>
        <p className="nf-text">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or
          the link is broken. Let&apos;s get you back on track.
        </p>

        <div className="nf-actions">
          <Link href="/" className="nf-btn-primary">
            <Home size={16} aria-hidden="true" /> Back to Home
          </Link>
          <a href="tel:917669486600" className="nf-btn-secondary">
            <Phone size={16} aria-hidden="true" /> Call Us
          </a>
        </div>

        <div className="nf-links">
          Try instead:
          <Link href="/#Loan">Loans</Link>·
          <Link href="/#calculator">EMI Calculator</Link>·
          <Link href="/about-us">About Us</Link>
        </div>
      </div>
    </div>
  );
}
