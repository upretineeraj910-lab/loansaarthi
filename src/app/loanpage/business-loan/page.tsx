import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";

export default function BusinessLoanPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">
        <div className="lp-hero">
          <div className="lp-hero-main">
            <span className="lp-tag">LOAN PRODUCT 03</span>
            <h1>Business Loan</h1>
            <p className="lp-desc-txt">
              HDFC Bank and Kotak Mahindra provide collateral-free business loans starting at 10.50%. Approval comes through in 48–72 hours for businesses with at least 2 years of operating history and an annual turnover of ₹40 Lakhs or more.
            </p>
            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">From 10.50% p.a.</strong>
              </div>
              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹1 Cr</strong>
              </div>
            </div>
          </div>
          <div className="lp-hero-side">
            <h3>Apply for Business Loan</h3>
            <p>Collateral-free working capital funding.</p>
            <Link href="/#home" className="lp-cta-btn">Check Eligibility <ArrowRight size={15} /></Link>
            <span style={{ fontSize: "11px", color: "var(--lp-desc)", marginTop: "8px" }}><ShieldCheck size={13} /> GST based evaluation</span>
          </div>
        </div>

        <div className="lp-grid-2">
          <LoanEmiCalculator
            title="Business Loan EMI Calculator"
            amountDefault={1500000}
            amountMin={100000}
            amountMax={10000000}
            amountStep={25000}
            tenureDefault={5}
            tenureMin={1}
            tenureMax={5}
            rateDefault={10.5}
            rateMin={10.0}
            rateMax={20.0}
            rateStep={0.1}
          />

          <div className="lp-card-box">
            <h3>Top Business Loan Lenders</h3>
            <table className="lp-table">
              <thead><tr><th>Bank</th><th>Rate</th><th>Processing Fee</th><th>Tenure</th></tr></thead>
              <tbody>
                <tr><td><strong>HDFC Bank</strong></td><td className="lp-color-green">10.50% - 14.50%</td><td>1.50% - 2.50%</td><td>5 Yrs</td></tr>
                <tr><td><strong>Kotak Mahindra</strong></td><td className="lp-color-green">11.00% - 15.00%</td><td>1.00% - 2.00%</td><td>5 Yrs</td></tr>
                <tr><td><strong>Bajaj Finserv</strong></td><td className="lp-color-green">11.50% - 16.00%</td><td>2.00%</td><td>5 Yrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lp-grid-2">
          <div className="lp-card-box">
            <h3>Eligibility Criteria</h3>
            <ul className="lp-ul">
              <li>Business Vintage: Minimum 2 to 3 years operational history</li>
              <li>Annual Turnover: Minimum ₹40 Lakhs with profitable balance sheet</li>
              <li>Clean banking transactions (no frequent cheque returns)</li>
              <li>CIBIL Score: 700+</li>
            </ul>
          </div>
          <div className="lp-card-box">
            <h3>Required Documents</h3>
            <ul className="lp-ul">
              <li>GST Registration Certificate & 12 Months GSTR-3B</li>
              <li>Last 12 Months Current Account Statement</li>
              <li>2-3 Years Audited Financials & CA certified Balance Sheet</li>
              <li>Business PAN & Incorporation Certificate</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
