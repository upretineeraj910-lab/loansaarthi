// app/home-loan/page.js (or pages/home-loan.js)

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator"; // your existing component
import "../loan-page.css";

export default function HomeLoanPage() {
  return (
    <main className="lp-page">
      <div className="lp-container">

        {/* ================= HERO ================= */}
        <section className="lp-hero">

          <div className="lp-hero-main">
            <div className="lp-breadcrumb" style={{ fontSize: '12px', color: 'var(--lp-desc)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <span>⌂</span>
              {/* <span>Home</span> */}
              <Link href="/"><span>Home</span></Link>
              <span>›</span>
              <span style={{ color: 'var(--lp-title)', fontWeight: '600' }}>Home Loan</span>
            </div>

            <h1>Home Loan</h1>
            <h2 style={{ fontSize: '20px', color: 'var(--lp-desc)', marginBottom: '16px', fontWeight: '500' }}>
              Low Interest. Higher Possibilities.
            </h2>

            <p className="lp-desc-txt">
              HDFC Bank offers home loan rates starting from
              <strong> 8.35% p.a.</strong>. With a CIBIL score of 750+,
              you can get a repayment tenure of up to 30 years and
              financing of up to 90% of the property value.
              <span style={{ display: 'block', marginTop: '6px', fontSize: '13px', color: 'var(--lp-green)' }}>
                <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Women co-applicants get 0.05% additional concession
              </span>
            </p>

            <div className="lp-specs">
              <div className="lp-spec-item">
                <span>Interest Rate</span>
                <strong className="lp-color-green">
                  From 8.35% p.a.
                </strong>
              </div>

              <div className="lp-spec-item">
                <span>Max Amount</span>
                <strong>Up to ₹5 Cr</strong>
              </div>
            </div>

            <div className="home-loan-benefits" style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--lp-text)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} className="lp-color-green" />
                Lowest Interest Rates
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} className="lp-color-green" />
                Up to 90% Financing
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} className="lp-color-green" />
                Flexible Repayment
              </span>
            </div>

            {/* CTA MOVED TO LEFT COLUMN FOR BETTER UX FLOW */}
            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--lp-box)', borderRadius: '12px', border: '1px solid var(--lp-border)' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: 'var(--lp-title)' }}>Apply for Home Loan</h3>
              <p style={{ fontSize: '14px', color: 'var(--lp-desc)', margin: '0 0 16px' }}>
                Quick eligibility check in just 2 minutes.
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
                  <span>Zero upfront fees</span>
                  <span>•</span>
                  <span>100% Secure</span>
                </div>
              </div>
            </div>

          </div>

          {/* CLEAN IMAGE CONTAINER */}
          <div className="lp-hero-side" style={{ padding: '0', overflow: 'hidden', position: 'relative', minHeight: '350px' }}>
            <Image
              src="/home.jpg"
              alt="Modern home for home loan"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

        </section>

        {/* ================= CALCULATOR + BANK ================= */}
        <section className="lp-grid-2">

          {/* USING YOUR EXISTING LoanEmiCalculator COMPONENT */}
          <LoanEmiCalculator
            variant="loan"
            title="Home Loan EMI Calculator"
            amountLabel="Loan Amount"
            amountDefault={3500000}
            amountMin={500000}
            amountMax={50000000}
            amountStep={50000}
            tenureDefault={20}
            tenureMin={1}
            tenureMax={30}
            rateLabel="Interest Rate (% p.a.)"
            rateDefault={8.35}
            rateMin={8.0}
            rateMax={15.0}
            rateStep={0.05}
            emiLabel="Monthly EMI"
          />

          <div className="lp-card-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>₹</span> 
              Top Home Loan Bank
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
                    <td className="lp-color-green font-semibold">8.50% - 9.40%</td>
                    <td>Up to 0.50%</td>
                    <td>30 Yrs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Why Choose HDFC Bank?</h3>
            <ul className="lp-ul">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Attractive interest rates</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Flexible repayment options</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Quick approval & minimal documentation</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Balance transfer facility available</li>
            </ul>

            {/* Live info */}
            <div style={{ marginTop: '16px', background: 'var(--lp-box)', borderRadius: '8px', padding: '10px', fontSize: '13px', borderLeft: '3px solid var(--lp-green)' }}>
              <CheckCircle2 size={16} className="lp-color-green" style={{ display: 'inline', marginRight: '6px' }} />
              <strong>Live offer:</strong> 8.35% p.a. for CIBIL ≥ 750, limited period.
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
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Age: 21 to 65 years</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>CIBIL Score: 750+ for lowest rate slab</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Salaried with minimum 2 years experience or Self-Employed with minimum 3 years ITR</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Minimum Monthly Salary: ₹25,000+</span></li>
            </ul>
          </div>

          <div className="lp-card-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>▤</span> 
              Required Documents
            </h3>
            <ul className="lp-ul" style={{ gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Aadhaar Card & PAN Card (KYC)</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Last 6 Months Bank Statement</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>3 Months Salary Slips / 2 Years ITR with Form 16</span></li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Property Title Deeds & Approved Map Copy</span></li>
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
              <h3 style={{ fontSize: '20px', color: 'var(--lp-title)', margin: '0 0 6px' }}>Confused about which home loan is right for you?</h3>
              <p style={{ margin: '0', color: 'var(--lp-desc)', fontSize: '15px' }}>Our experts will help you choose the best home loan offer.</p>
            </div>
          </div>

          <Link href="/#loan-eligibility-form" className="lp-cta-btn" style={{ background: 'transparent', border: '2px solid var(--lp-title)', color: 'var(--lp-title)' }}>
            Talk to an Expert
            <ArrowRight size={17} />
          </Link>

        </section>

      </div>
    </main>
  );
}