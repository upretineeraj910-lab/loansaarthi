import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";

export default function LoanBalanceTransferPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">
        <div className="lp-hero">
          <div className="lp-hero-main">
            <span className="lp-tag">LOAN PRODUCT 06</span>
            <h1>Loan Balance Transfer</h1>
            <p className="lp-desc-txt">
              Bank of Baroda and LIC Housing Finance accept balance transfers starting at 8.25%. Once you've cleared 12 continuous, on-time EMIs on your existing loan, the interest rate drops, and you also become eligible for an additional Top-Up loan of up to ₹50 Lakhs at the lowest available rate.
            </p>
            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">From 8.25% p.a.</strong>
              </div>
              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Any Existing Amount</strong>
              </div>
            </div>
          </div>
          <div className="lp-hero-side">
            <h3>Apply for Balance Transfer</h3>
            <p>Reduce existing EMIs & claim Top-up funds.</p>
            <Link href="/#calculator" className="lp-cta-btn">Check Eligibility <ArrowRight size={15} /></Link>
            <span style={{ fontSize: "11px", color: "var(--lp-desc)", marginTop: "8px" }}><ShieldCheck size={13} /> Complete bank paperwork handled</span>
          </div>
        </div>

        <div className="lp-grid-2">
          <LoanEmiCalculator
            title="Transfer EMI Savings Calculator"
            amountLabel="Outstanding Balance (₹)"
            amountDefault={4000000}
            amountMin={500000}
            amountMax={50000000}
            amountStep={50000}
            tenureDefault={18}
            tenureMin={1}
            tenureMax={30}
            rateLabel="New Rate (% p.a.)"
            rateDefault={8.25}
            rateMin={8.0}
            rateMax={14.0}
            rateStep={0.05}
            emiLabel="New Monthly EMI"
          />

          <div className="lp-card-box">
            <h3>Top Balance Transfer Banks</h3>
            <table className="lp-table">
              <thead><tr><th>Bank</th><th>Rate</th><th>Processing Fee</th><th>Tenure</th></tr></thead>
              <tbody>
                <tr><td><strong>Bank of Baroda</strong></td><td className="lp-color-green">8.25% - 9.10%</td><td>Nil to 0.25%</td><td>30 Yrs</td></tr>
                <tr><td><strong>HDFC Bank</strong></td><td className="lp-color-green">8.40% - 9.20%</td><td>0.25%</td><td>30 Yrs</td></tr>
                <tr><td><strong>LIC HFL</strong></td><td className="lp-color-green">8.45% - 9.35%</td><td>₹5,000 - ₹10,000</td><td>30 Yrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lp-grid-2">
          <div className="lp-card-box">
            <h3>Eligibility Criteria</h3>
            <ul className="lp-ul">
              <li>Existing Loan Vintage: Minimum 12 on-time monthly EMI repayments</li>
              <li>Clean Track Record: Zero EMI bounces in past 12 months</li>
              <li>Clear title and approved property map</li>
              <li>CIBIL Score: 750+</li>
            </ul>
          </div>
          <div className="lp-card-box">
            <h3>Required Documents</h3>
            <ul className="lp-ul">
              <li>Foreclosure Letter & List of Documents (LOD) from existing bank</li>
              <li>Last 12 Months Existing Loan Statement of Account (SOA)</li>
              <li>Latest 6 Months Salary Bank Statement / 2 Yrs ITR</li>
              <li>Property Title & KYC Documents</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
