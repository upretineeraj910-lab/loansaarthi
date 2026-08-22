import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";

export default function PersonalLoanPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">
        <div className="lp-hero">
          <div className="lp-hero-main">
            <span className="lp-tag">LOAN PRODUCT 04</span>
            <h1>Personal Loan</h1>
            <p className="lp-desc-txt">
              HDFC Bank and Tata Capital offer instant personal loans starting at 9.99%. With a monthly salary of ₹25,000+ and a CIBIL score of 750+, the amount is disbursed directly to your account within 24 hours — with no collateral required.
            </p>
            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">From 9.99% p.a.</strong>
              </div>
              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹25 L</strong>
              </div>
            </div>
          </div>
          <div className="lp-hero-side">
            <h3>Apply for Personal Loan</h3>
            <p>Disbursal in 24 hours with digital KYC.</p>
            <Link href="/#calculator" className="lp-cta-btn">Check Eligibility <ArrowRight size={15} /></Link>
            <span style={{ fontSize: "11px", color: "var(--lp-desc)", marginTop: "8px" }}><ShieldCheck size={13} /> 100% paperless process</span>
          </div>
        </div>

        <div className="lp-grid-2">
          <LoanEmiCalculator
            title="Personal Loan EMI Calculator"
            amountDefault={500000}
            amountMin={50000}
            amountMax={2500000}
            amountStep={10000}
            tenureDefault={3}
            tenureMin={1}
            tenureMax={5}
            rateDefault={9.99}
            rateMin={9.5}
            rateMax={18.0}
            rateStep={0.1}
          />

          <div className="lp-card-box">
            <h3>Top Personal Loan Banks</h3>
            <table className="lp-table">
              <thead><tr><th>Bank</th><th>Rate</th><th>Processing Fee</th><th>Tenure</th></tr></thead>
              <tbody>
                <tr><td><strong>HDFC Bank</strong></td><td className="lp-color-green">9.99% - 13.50%</td><td>Up to ₹4,999</td><td>5 Yrs</td></tr>
                <tr><td><strong>ICICI Bank</strong></td><td className="lp-color-green">10.25% - 14.00%</td><td>Up to 1.50%</td><td>5 Yrs</td></tr>
                <tr><td><strong>Tata Capital</strong></td><td className="lp-color-green">10.49% - 15.25%</td><td>1.00% - 2.00%</td><td>5 Yrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lp-grid-2">
          <div className="lp-card-box">
            <h3>Eligibility Criteria</h3>
            <ul className="lp-ul">
              <li>Age: 21 to 58 years</li>
              <li>Employment: Full-time Salaried in Pvt / Govt / MNC firm</li>
              <li>Net Monthly Salary: Minimum ₹25,000</li>
              <li>CIBIL Score: 720+</li>
            </ul>
          </div>
          <div className="lp-card-box">
            <h3>Required Documents</h3>
            <ul className="lp-ul">
              <li>Aadhaar Card & PAN Card</li>
              <li>Latest 3 Months Salary Slips</li>
              <li>Last 6 Months Salary Account Bank Statement</li>
              <li>Official Company ID Card</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
