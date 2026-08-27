// app/personal-loan/page.js (or pages/personal-loan.js)

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "../loan-page.css";
import { useEffect } from "react";


export default function PersonalLoanPage() {
   useEffect(()=>{
      document.title = "Personal Loan"
    })
  return (
    <main className="lp-page">
      <div className="lp-container">

        {/* ================= HERO ================= */}
        <section className="lp-hero">

          <div className="lp-hero-main">
            <div className="lp-breadcrumb" style={{ fontSize: '12px', color: 'var(--lp-desc)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <span>⌂</span>
              <span>Home</span>
              <span>›</span>
              <span style={{ color: 'var(--lp-title)', fontWeight: '600' }}>Personal Loan</span>
            </div>

            <h1>Personal Loan</h1>
            <h2 style={{ fontSize: '20px', color: 'var(--lp-desc)', marginBottom: '16px', fontWeight: '500' }}>
              Instant Approval. Quick Disbursal.
            </h2>

            <p className="lp-desc-txt">
              HDFC Bank and Tata Capital offer instant personal loans starting at 9.99%. 
              With a monthly salary of ₹25,000+ and a CIBIL score of 750+, the amount is 
              disbursed directly to your account within 24 hours — with no collateral required.
              <span style={{ display: 'block', marginTop: '6px', fontSize: '13px', color: 'var(--lp-green)' }}>
                <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
                100% paperless process with digital KYC
              </span>
            </p>

            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">
                  From 9.99% p.a.
                </strong>
              </div>

              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹25 L</strong>
              </div>
              
              <div className="lp-spec-item">
                <span>Disbursal Time</span>
                <strong>Within 24 hrs</strong>
              </div>
            </div>

            <div className="home-loan-benefits" style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--lp-text)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} className="lp-color-green" />
                No Collateral Required
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} className="lp-color-green" />
                Digital KYC
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} className="lp-color-green" />
                Instant Disbursal
              </span>
            </div>

            {/* CTA MOVED TO LEFT COLUMN FOR BETTER UX FLOW */}
            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--lp-box)', borderRadius: '12px', border: '1px solid var(--lp-border)' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: 'var(--lp-title)' }}>Apply for Personal Loan</h3>
              <p style={{ fontSize: '14px', color: 'var(--lp-desc)', margin: '0 0 16px' }}>
                Get instant approval in just 2 minutes with digital KYC.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <Link
                  href="/#loan-eligibility-form"
                  className="lp-cta-btn"
                  style={{ background: 'var(--lp-green)', color: '#fff' }}
                >
                  Check Eligibility
                  <ArrowRight size={17} />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--lp-desc)', fontWeight: '500' }}>
                  <ShieldCheck size={16} className="lp-color-green" />
                  <span>100% paperless</span>
                  <span>•</span>
                  <span>Secure process</span>
                </div>
              </div>
            </div>

          </div>

          {/* CLEAN IMAGE CONTAINER */}
          <div className="lp-hero-side" style={{ padding: '0', overflow: 'hidden', position: 'relative', minHeight: '350px' }}>
            <Image
              src="/personal_loan.jpg"
              alt="Personal loan - happy family enjoying financial freedom"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

        </section>

        {/* ================= CALCULATOR + BANKS ================= */}
        <section className="lp-grid-2">

          {/* USING YOUR EXISTING LoanEmiCalculator COMPONENT */}
          <LoanEmiCalculator
            variant="loan"
            title="Personal Loan EMI Calculator"
            amountLabel="Loan Amount"
            amountDefault={500000}
            amountMin={50000}
            amountMax={2500000}
            amountStep={10000}
            tenureDefault={3}
            tenureMin={1}
            tenureMax={5}
            rateLabel="Interest Rate (% p.a.)"
            rateDefault={9.99}
            rateMin={9.5}
            rateMax={18.0}
            rateStep={0.1}
            emiLabel="Monthly EMI"
          />

          <div className="lp-card-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>₹</span> 
              Top Personal Loan Banks
            </h3>

            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table className="lp-table">
                <thead>
                  <tr>
                    <th>Bank</th>
                    <th>Interest Rate</th>
                    <th>Processing Fee</th>
                    <th>Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>HDFC Bank</strong></td>
                    <td className="lp-color-green font-semibold">9.99% - 13.50%</td>
                    <td>Up to ₹4,999</td>
                    <td>5 Yrs</td>
                  </tr>
                  <tr>
                    <td><strong>ICICI Bank</strong></td>
                    <td className="lp-color-green font-semibold">10.25% - 14.00%</td>
                    <td>Up to 1.50%</td>
                    <td>5 Yrs</td>
                  </tr>
                  <tr>
                    <td><strong>Tata Capital</strong></td>
                    <td className="lp-color-green font-semibold">10.49% - 15.25%</td>
                    <td>1.00% - 2.00%</td>
                    <td>5 Yrs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Why Choose Personal Loan?</h3>
            <ul className="lp-ul">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> No collateral or guarantor required</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> 100% digital process with video KYC</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Funds disbursed within 24 hours</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Flexible repayment options up to 5 years</li>
            </ul>

            {/* Live info */}
            <div style={{ marginTop: '16px', background: 'var(--lp-box)', borderRadius: '8px', padding: '10px', fontSize: '13px', borderLeft: '3px solid var(--lp-green)' }}>
              <CheckCircle2 size={16} className="lp-color-green" style={{ display: 'inline', marginRight: '6px' }} />
              <strong>Limited period offer:</strong> 9.99% p.a. for salaried professionals with CIBIL ≥ 750.
            </div>
          </div>
        </section>

        {/* ================= ELIGIBILITY + DOCUMENTS ================= */}
        <section className="lp-grid-2">

          <div className="lp-card-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>✓</span> 
              Eligibility Criteria
            </h3>
            <ul className="lp-ul" style={{ gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Age: 21 to 58 years</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Employment: Full-time Salaried in Pvt / Govt / MNC firm</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Net Monthly Salary: Minimum ₹25,000</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>CIBIL Score: 720+ for best rates</span></li>
            </ul>
          </div>

          <div className="lp-card-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>▤</span> 
              Required Documents
            </h3>
            <ul className="lp-ul" style={{ gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Aadhaar Card & PAN Card (KYC)</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Latest 3 Months Salary Slips</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Last 6 Months Salary Account Bank Statement</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Official Company ID Card</span></li>
            </ul>
          </div>

        </section>

        {/* ================= CTA ================= */}
        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--lp-card)', border: '1px solid var(--lp-border)', borderRadius: '14px', padding: '32px', marginTop: '24px', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'var(--lp-box)', padding: '16px', borderRadius: '12px', color: 'var(--lp-green)' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--lp-title)', margin: '0 0 6px' }}>Need a personal loan for your dream project?</h3>
              <p style={{ margin: '0', color: 'var(--lp-desc)', fontSize: '15px' }}>Get personalized offers from top banks in minutes.</p>
            </div>
          </div>

          <Link href="/#loan-eligibility-form" className="lp-cta-btn" style={{ background: 'transparent', border: '2px solid var(--lp-title)', color: 'var(--lp-title)' }}>
            Apply Now
            <ArrowRight size={17} />
          </Link>

        </section>

      </div>
    </main>
  );
}