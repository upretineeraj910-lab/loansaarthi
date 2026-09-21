import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | LoanSaarthi",
  description:
    "Review the Terms and Conditions for using LoanSaarthi's loan comparison, consultation, and digital assistance platform.",
  alternates: {
    canonical: "https://www.loansaarthi.com/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
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
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Terms &amp; Conditions</h1>
            <p className="text-sm text-slate-500">Last updated: September 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base">
          <p>
            Please read these Terms and Conditions (&quot;Terms&quot;) carefully before using the <strong>LoanSaarthi</strong> website (<strong>loansaarthi.com</strong>) and our loan advisory, comparison, and referral services.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website, submitting an inquiry, or interacting with our loan advisors, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">2. Nature of Services</h2>
          <p>
            LoanSaarthi is a financial loan assistance, comparison, and Direct Selling Agent (DSA) partner. <strong>LoanSaarthi is not a bank, NBFC, or direct lender.</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We connect loan applicants with authorized lending partners (Banks &amp; NBFCs) across India.</li>
            <li>Final loan sanction, interest rates, tenure, processing fees, and disbursement decisions are made solely at the discretion of the lending partner, subject to their internal credit policies and verification.</li>
            <li>Calculators, interest estimates, and quotes provided on this website are for indicative purposes only.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">3. User Obligations &amp; Information Accuracy</h2>
          <p>When using our website or submitting documents, you represent and warrant that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are at least 18 years of age and legally competent to enter into contracts under Indian law.</li>
            <li>All personal, financial, and KYC details submitted by you are accurate, current, and genuine.</li>
            <li>You authorize LoanSaarthi and its partner lenders to verify your credit score (CIBIL/Experian), income, and KYC information for the purpose of loan processing.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">4. No Upfront / Silent Charges</h2>
          <p>
            LoanSaarthi does not charge hidden or arbitrary upfront fees from customers for basic loan inquiries. Any applicable advisory or handling charges, if mutually agreed upon, will be communicated in writing prior to processing.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">5. Limitation of Liability</h2>
          <p>
            LoanSaarthi shall not be held liable for any rejection of loan applications by lenders, delays caused by third-party verification agencies, or disputes arising between you and the lending institution after disbursement.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">6. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any legal disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 pt-4">7. Contact Information</h2>
          <p>
            For any queries regarding these Terms &amp; Conditions, please contact us:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2">
            <p className="font-medium text-slate-900">LoanSaarthi Support</p>
            <p className="text-sm text-slate-600">Address: 2151/9B Goswami Girdhari Lal Marg, New Patel Nagar, Shadipur, Delhi - 110008</p>
            <p className="text-sm text-slate-600">Email: <a href="mailto:contactus@loansaarthi.com" className="text-emerald-600 underline">contactus@loansaarthi.com</a></p>
            <p className="text-sm text-slate-600">Phone: +91-9810168635 / 011-25792874</p>
          </div>
        </div>
      </div>
    </main>
  );
}

