import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";

export default function EducationLoanPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">
        <div className="lp-hero">
          <div className="lp-hero-main">
            <span className="lp-tag">LOAN PRODUCT 05</span>
            <h1>Education Loan</h1>
            <p className="lp-desc-txt">
              Union Bank of India and State Bank of India provide education loans at 8.15% for both domestic and overseas higher studies. Loans up to ₹7.5 Lakhs are approved without collateral, and EMIs begin 6–12 months after the course is completed.
            </p>
            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">From 8.15% p.a.</strong>
              </div>
              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹75 L</strong>
              </div>
            </div>
          </div>
          <div className="lp-hero-side">
            <h3>Apply for Education Loan</h3>
            <p>100% tuition & living cost funding.</p>
            <Link href="/#calculator" className="lp-cta-btn">Check Eligibility <ArrowRight size={15} /></Link>
            <span style={{ fontSize: "11px", color: "var(--lp-desc)", marginTop: "8px" }}><ShieldCheck size={13} /> Complete moratorium support</span>
          </div>
        </div>

        <div className="lp-grid-2">
          <LoanEmiCalculator
            title="Education Loan EMI Calculator"
            amountDefault={2000000}
            amountMin={200000}
            amountMax={7500000}
            amountStep={25000}
            tenureDefault={10}
            tenureMin={1}
            tenureMax={15}
            rateDefault={8.15}
            rateMin={8.0}
            rateMax={14.0}
            rateStep={0.05}
          />

          <div className="lp-card-box">
            <h3>Top Education Loan Lenders</h3>
            <table className="lp-table">
              <thead><tr><th>Bank</th><th>Rate</th><th>Processing Fee</th><th>Tenure</th></tr></thead>
              <tbody>
                <tr><td><strong>Union Bank</strong></td><td className="lp-color-green">8.15% - 9.25%</td><td>Nil (India courses)</td><td>15 Yrs</td></tr>
                <tr><td><strong>SBI (Ed-Vantage)</strong></td><td className="lp-color-green">8.30% - 9.50%</td><td>₹10,000 + GST</td><td>15 Yrs</td></tr>
                <tr><td><strong>Canara Bank</strong></td><td className="lp-color-green">8.50% - 9.75%</td><td>Nil up to ₹7.5L</td><td>15 Yrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lp-grid-2">
          <div className="lp-card-box">
            <h3>Eligibility Criteria</h3>
            <ul className="lp-ul">
              <li>Confirmed admission in recognized college/university</li>
              <li>Co-borrower mandatory (Parent / Guardian)</li>
              <li>Academic track record: Consistent 60%+ marks</li>
            </ul>
          </div>
          <div className="lp-card-box">
            <h3>Required Documents</h3>
            <ul className="lp-ul">
              <li>College Admission Offer Letter & Fee Schedule</li>
              <li>Past Academic Records (10th, 12th & Degree Marksheets)</li>
              <li>Co-Applicant KYC & 6 Months Bank Statement</li>
              <li>Property Papers (if the loan amount exceeds ₹7.5 Lakhs)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
