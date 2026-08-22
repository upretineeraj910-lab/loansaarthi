import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";

export default function HomeLoanPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">
        <div className="lp-hero">
          <div className="lp-hero-main">
            <span className="lp-tag">LOAN PRODUCT 01</span>
            <h1>Home Loan</h1>
            <p className="lp-desc-txt">
              State Bank of India (SBI) and Bank of Baroda offer the lowest home loan rates, starting from 8.35% p.a. With a CIBIL score of 750+, you get a repayment tenure of up to 30 years and financing of up to 90% of the property value. Women co-applicants receive an additional 0.05% rate concession.
            </p>
            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">From 8.35% p.a.</strong>
              </div>
              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹5 Cr</strong>
              </div>
            </div>
          </div>
          <div className="lp-hero-side">
            <h3>Apply for Home Loan</h3>
            <p>Compare SBI, HDFC & BoB in one click.</p>
            <Link href="/#calculator" className="lp-cta-btn">Check Eligibility <ArrowRight size={15} /></Link>
            <span style={{ fontSize: "11px", color: "var(--lp-desc)", marginTop: "8px" }}><ShieldCheck size={13} /> Zero upfront fees</span>
          </div>
        </div>

        <div className="lp-grid-2">
          <LoanEmiCalculator
            title="Home Loan EMI Calculator"
            amountDefault={3500000}
            amountMin={500000}
            amountMax={50000000}
            amountStep={50000}
            tenureDefault={20}
            tenureMin={1}
            tenureMax={30}
            rateDefault={8.35}
            rateMin={8.0}
            rateMax={15.0}
            rateStep={0.05}
          />

          <div className="lp-card-box">
            <h3>Top Home Loan Banks</h3>
            <table className="lp-table">
              <thead><tr><th>Bank</th><th>Rate</th><th>Processing Fee</th><th>Tenure</th></tr></thead>
              <tbody>
                <tr><td><strong>SBI</strong></td><td className="lp-color-green">8.35% - 9.15%</td><td>0.35% (Max ₹10k)</td><td>30 Yrs</td></tr>
                <tr><td><strong>Bank of Baroda</strong></td><td className="lp-color-green">8.40% - 9.30%</td><td>0.25% - 0.50%</td><td>30 Yrs</td></tr>
                <tr><td><strong>HDFC Bank</strong></td><td className="lp-color-green">8.50% - 9.40%</td><td>Up to 0.50%</td><td>30 Yrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lp-grid-2">
          <div className="lp-card-box">
            <h3>Eligibility Criteria</h3>
            <ul className="lp-ul">
              <li>Age: 21 to 65 years</li>
              <li>CIBIL Score: 750+ for lowest rate slab</li>
              <li>Salaried (Min 2 yrs experience) or Self-Employed (Min 3 yrs ITR)</li>
              <li>Minimum Monthly Salary: ₹25,000+</li>
            </ul>
          </div>
          <div className="lp-card-box">
            <h3>Required Documents</h3>
            <ul className="lp-ul">
              <li>Aadhaar Card & PAN Card (KYC)</li>
              <li>Last 6 Months Bank Statement</li>
              <li>3 Months Salary Slips / 2 Years ITR with Form 16</li>
              <li>Property Title Deeds & Approved Map Copy</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
