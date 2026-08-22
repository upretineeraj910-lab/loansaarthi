import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";

export default function LAPPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">
        <div className="lp-hero">
          <div className="lp-hero-main">
            <span className="lp-tag">LOAN PRODUCT 02</span>
            <h1>Loan Against Property (LAP)</h1>
            <p className="lp-desc-txt">
              ICICI Bank and Punjab National Bank (PNB) offer mortgage loans starting at 8.95%. You can get a Loan-to-Value (LTV) of 60% to 70% against residential or commercial freehold property, and a repayment tenure of up to 15 years keeps the EMI low.
            </p>
            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">From 8.95% p.a.</strong>
              </div>
              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹3 Cr</strong>
              </div>
            </div>
          </div>
          <div className="lp-hero-side">
            <h3>Apply for LAP</h3>
            <p>Unlock property liquidity at low ROI.</p>
            <Link href="/#calculator" className="lp-cta-btn">Check Eligibility <ArrowRight size={15} /></Link>
            <span style={{ fontSize: "11px", color: "var(--lp-desc)", marginTop: "8px" }}><ShieldCheck size={13} /> Clear title verification</span>
          </div>
        </div>

        <div className="lp-grid-2">
          <LoanEmiCalculator
            title="LAP EMI Calculator"
            amountDefault={2500000}
            amountMin={500000}
            amountMax={30000000}
            amountStep={50000}
            tenureDefault={15}
            tenureMin={1}
            tenureMax={15}
            rateDefault={8.95}
            rateMin={8.0}
            rateMax={16.0}
            rateStep={0.05}
          />

          <div className="lp-card-box">
            <h3>Top Mortgage Banks</h3>
            <table className="lp-table">
              <thead><tr><th>Bank</th><th>Rate</th><th>Processing Fee</th><th>Tenure</th></tr></thead>
              <tbody>
                <tr><td><strong>ICICI Bank</strong></td><td className="lp-color-green">8.95% - 9.90%</td><td>Up to 1.00%</td><td>15 Yrs</td></tr>
                <tr><td><strong>PNB</strong></td><td className="lp-color-green">9.10% - 10.25%</td><td>0.50%</td><td>15 Yrs</td></tr>
                <tr><td><strong>Axis Bank</strong></td><td className="lp-color-green">9.25% - 10.50%</td><td>1.00%</td><td>15 Yrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lp-grid-2">
          <div className="lp-card-box">
            <h3>Eligibility Criteria</h3>
            <ul className="lp-ul">
              <li>Age: 23 to 68 years</li>
              <li>Freehold constructed property (Residential or Commercial)</li>
              <li>Min 3 years business vintage or stable salary</li>
              <li>CIBIL Score: 700+</li>
            </ul>
          </div>
          <div className="lp-card-box">
            <h3>Required Documents</h3>
            <ul className="lp-ul">
              <li>KYC (PAN & Aadhaar)</li>
              <li>12 Months Bank Account Statement</li>
              <li>3 Years Audited Financials & ITR with Balance Sheet</li>
              <li>Property Title Deeds, Chain Documents & Mutation Copy</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
