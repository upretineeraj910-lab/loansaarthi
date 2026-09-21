import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | LoanSaarthi",
  description:
    "Read the Privacy Policy of LoanSaarthi. Understand how we collect, protect, and use your personal information when providing loan assistance.",
  alternates: {
    canonical: "https://www.loansaarthi.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-sm text-slate-500">Last updated: September 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base">
          <p>
            Welcome to <strong>LoanSaarthi</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website{" "}
            <strong>loansaarthi.com</strong> and use our loan advisory and comparison services.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">1. Information We Collect</h2>
          <p>
            When you inquire about or apply for loans (Personal Loan, Business Loan, Home Loan, Loan Against Property, Dropline Overdraft, etc.) through LoanSaarthi, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity &amp; Contact Details:</strong> Full Name, Phone Number, Email Address, Residential Address, Date of Birth.</li>
            <li><strong>Financial &amp; Employment Details:</strong> Employment type (Salaried, Self-Employed, Professional), Monthly/Annual Income, Bank Statements, ITR details, existing EMIs.</li>
            <li><strong>KYC Documents:</strong> PAN Card, Aadhaar Card, Passport, Voter ID (shared securely for lender verification).</li>
            <li><strong>Technical Data:</strong> IP address, browser type, operating system, and analytics data collected via cookies to enhance user experience.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">2. How We Use Your Information</h2>
          <p>We use your information strictly for legitimate business and financial advisory purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Evaluating loan eligibility across our 42+ partner Banks and NBFCs.</li>
            <li>Connecting you with suitable lenders and facilitating loan documentation.</li>
            <li>Contacting you via Phone, SMS, Email, or WhatsApp regarding your loan application status.</li>
            <li>Complying with regulatory compliance, KYC verification, and anti-fraud guidelines.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">3. Data Sharing &amp; Disclosure</h2>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal data to third parties for commercial marketing. Your information is shared only with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Partner Banks &amp; NBFCs:</strong> Authorized lending partners whom you explicitly choose to apply to for loan evaluation and sanction.</li>
            <li><strong>Service Providers:</strong> Verified technical infrastructure partners (e.g., OTP verification, secure cloud storage).</li>
            <li><strong>Legal Authorities:</strong> When required by applicable Indian laws, courts, or government regulations.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">4. Data Security</h2>
          <p>
            We implement strict technical and organizational measures, including SSL encryption, secure servers, and restricted employee access, to safeguard your personal and financial data against unauthorized access, alteration, or disclosure.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">5. Contact Us</h2>
          <p>
            If you have questions, feedback, or concerns about this Privacy Policy, please reach out to us:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2">
            <p className="font-medium text-slate-900">LoanSaarthi Privacy Team</p>
            <p className="text-sm text-slate-600">Address: 2151/9B Goswami Girdhari Lal Marg, New Patel Nagar, Shadipur, Delhi - 110008</p>
            <p className="text-sm text-slate-600">Email: <a href="mailto:contactus@loansaarthi.com" className="text-emerald-600 underline">contactus@loansaarthi.com</a></p>
            <p className="text-sm text-slate-600">Phone: +91-9810168635 / 011-25792874</p>
          </div>
        </div>
      </div>
    </main>
  );
}

