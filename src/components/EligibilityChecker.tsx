"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Phone,
  User,
  Building2,
  Sparkles,
  Lock,
} from "lucide-react";
import styles from "./EligibilityChecker.module.css";

export type LoanType = "personal" | "home" | "business" | "car" | "lap";
export type Employment = "salaried" | "self";
export type Cibil = "750+" | "700-749" | "650-699" | "below650" | "unknown";

// Standard indicative lending benchmarks across 42+ partner banks.
export const LOAN_CONFIG: Record<
  LoanType,
  { label: string; rate: number; years: number; iconText: string }
> = {
  personal: {
    label: "Personal Loan",
    rate: 10.75,
    years: 5,
    iconText: "Instant Sanction",
  },
  home: {
    label: "Home Loan",
    rate: 8.5,
    years: 20,
    iconText: "Lowest Interest Rate",
  },
  business: {
    label: "Business Loan",
    rate: 14.5,
    years: 5,
    iconText: "Collateral Free Options",
  },
  car: {
    label: "Car Loan",
    rate: 8.95,
    years: 7,
    iconText: "Quick Disbursal",
  },
  lap: {
    label: "Loan Against Property",
    rate: 9.75,
    years: 15,
    iconText: "High Value Sanction",
  },
};

const CIBIL_FACTOR: Record<Cibil, number> = {
  "750+": 1.0,
  "700-749": 0.9,
  "650-699": 0.72,
  below650: 0.48,
  unknown: 0.82,
};

export type Result = {
  status: "good" | "moderate" | "low";
  maxLoan: number;
  emi: number;
  foirPercent: number;
  tips: string[];
};

export function calculateEligibility(
  loanType: LoanType,
  employment: Employment,
  income: number,
  existingEmi: number,
  cibil: Cibil
): Result {
  const { rate, years } = LOAN_CONFIG[loanType];

  // FOIR: Percentage of net monthly income allowed towards total debt obligations
  const foir = income < 30000 ? 0.4 : income < 60000 ? 0.45 : 0.5;
  const employmentFactor = employment === "salaried" ? 1.0 : 0.92;

  const availableEmi = Math.max(income * foir - existingEmi, 0);
  const r = rate / 12 / 100;
  const n = years * 12;

  const rawLoan =
    r > 0 ? (availableEmi * (1 - Math.pow(1 + r, -n))) / r : availableEmi * n;

  // Round down to nearest ₹10,000 for realistic banking eligibility
  const maxLoan =
    Math.floor((rawLoan * CIBIL_FACTOR[cibil] * employmentFactor) / 10000) *
    10000;

  const emi =
    maxLoan > 0
      ? Math.round(
          (maxLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        )
      : 0;

  const tips: string[] = [];

  if (existingEmi > income * 0.3) {
    tips.push(
      "Your existing monthly debt obligations exceed 30% of your take-home pay. Closing 1–2 smaller loans or credit card balances will boost your eligible amount by up to 25%."
    );
  }

  if (cibil === "below650" || cibil === "650-699") {
    tips.push(
      "A credit score above 750 qualifies you for prime tier-1 bank interest rates and higher FOIR allowance. We can help you identify lenders flexible with your score."
    );
  } else if (cibil === "750+") {
    tips.push(
      "Your 750+ CIBIL score places you in the prime borrower tier, qualifying you for preferential interest discounts and zero-processing-fee offers."
    );
  } else {
    tips.push(
      "Our loan specialists can fetch your bureau profile securely without impacting your credit score to match pre-approved bank programs."
    );
  }

  if (employment === "self") {
    tips.push(
      "For self-employed applicants, having 2 consecutive years of filed ITRs and the last 6–12 months of active bank statements ready ensures fast track approval."
    );
  }

  let status: Result["status"] = "good";
  if (maxLoan < 100000 || cibil === "below650" || availableEmi <= 0) {
    status = "low";
  } else if (cibil === "650-699" || existingEmi > income * 0.35) {
    status = "moderate";
  }

  return {
    status,
    maxLoan,
    emi,
    foirPercent: Math.round(foir * 100),
    tips,
  };
}

export const formatINR = (val: number): string => {
  return "₹" + Math.round(val).toLocaleString("en-IN");
};

type Props = {
  endpoint?: string;
  className?: string;
};

export default function EligibilityChecker({
  endpoint = "/api/lead",
  className = "",
}: Props) {
  const [loanType, setLoanType] = useState<LoanType>("personal");
  const [employment, setEmployment] = useState<Employment>("salaried");
  const [income, setIncome] = useState("50000");
  const [existingEmi, setExistingEmi] = useState("");
  const [cibil, setCibil] = useState<Cibil>("750+");

  const [step, setStep] = useState<"form" | "contact" | "result">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const incomeNum = Number(income.replace(/\D/g, "")) || 0;
  const emiNum = Number(existingEmi.replace(/\D/g, "")) || 0;

  const result = useMemo(
    () => calculateEligibility(loanType, employment, incomeNum, emiNum, cibil),
    [loanType, employment, incomeNum, emiNum, cibil]
  );

  function handleIncomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setIncome(raw);
    if (error) setError("");
  }

  function handleEmiChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setExistingEmi(raw);
    if (error) setError("");
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, "");
    // If pasted with country code 91
    if (raw.startsWith("91") && raw.length > 10) {
      raw = raw.slice(2);
    }
    setPhone(raw.slice(0, 10));
    if (error) setError("");
  }

  function goToContact(e: React.FormEvent) {
    e.preventDefault();
    if (incomeNum < 10000) {
      setError("Please enter a monthly net income of at least ₹10,000.");
      return;
    }
    setError("");
    setStep("contact");
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your full name as per PAN card.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name.trim(),
          name: name.trim(),
          phone: `+91${phone}`,
          number: phone,
          income: String(incomeNum),
          salary: incomeNum,
          loanType: LOAN_CONFIG[loanType].label,
          occupation: employment === "salaried" ? "Salaried" : "Self-Employed",
          loanAmount: result.maxLoan,
        }),
      });

      if (!res.ok) {
        console.warn("Lead save response code:", res.status);
      }
    } catch (err) {
      console.error("Lead submission error:", err);
    } finally {
      setLoading(false);
      setStep("result");
    }
  }

  function reset() {
    setStep("form");
    setError("");
  }

  const statusBadge = {
    good: {
      text: "High Approval Likelihood",
      desc: "Prime lender rates & fastest disbursal",
      class: styles.good,
    },
    moderate: {
      text: "Moderate Eligibility",
      desc: "Good options available across NBFCs & Banks",
      class: styles.moderate,
    },
    low: {
      text: "Limited Standard Eligibility",
      desc: "Add a co-applicant or opt for secured loan",
      class: styles.low,
    },
  }[result.status];

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <section className={styles.card} aria-live="polite">
        {/* Card Top Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>
              <Calculator size={18} aria-hidden="true" />
            </span>
            <span className={styles.headerTitle}>
              {step === "form" && "Loan & EMI Eligibility Assessment"}
              {step === "contact" && "Unlock Pre-Approved Bank Offers"}
              {step === "result" && "Your Loan Eligibility Breakdown"}
            </span>
          </div>
          <span className={styles.stepBadge}>
            {step === "form" && "Step 01 / 02"}
            {step === "contact" && "Step 02 / 02"}
            {step === "result" && "Verified Result"}
          </span>
        </div>

        <div className={styles.cardBody}>
          {/* ---------------- STEP 1: FINANCIAL INPUTS ---------------- */}
          {step === "form" && (
            <form onSubmit={goToContact} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Left Column */}
                <div className={styles.formCol}>
                  {/* Loan Type */}
                  <div className={styles.field}>
                    <label htmlFor="ec-loan-type" className={styles.fieldLabel}>
                      Select Loan Category
                    </label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="ec-loan-type"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value as LoanType)}
                        className={styles.select}
                      >
                        {Object.entries(LOAN_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.label} (Benchmark {v.rate}% p.a. • Up to {v.years} Yrs)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Monthly Income */}
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor="ec-income" className={styles.fieldLabel}>
                        Net Monthly Take-Home Income
                      </label>
                      {incomeNum > 0 && (
                        <span className={styles.previewAmount}>
                          {formatINR(incomeNum)} / mo
                        </span>
                      )}
                    </div>
                    <div className={styles.inputPrefixWrapper}>
                      <span className={styles.inputPrefix}>₹</span>
                      <input
                        id="ec-income"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 50000"
                        value={income}
                        onChange={handleIncomeChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.quickPresets}>
                      {[30000, 50000, 75000, 100000, 150000].map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          className={
                            incomeNum === amt
                              ? styles.presetChipActive
                              : styles.presetChip
                          }
                          onClick={() => setIncome(String(amt))}
                        >
                          ₹{amt >= 100000 ? `${amt / 100000} Lakh` : `${amt / 1000}k`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CIBIL Score */}
                  <div className={styles.field}>
                    <label htmlFor="ec-cibil" className={styles.fieldLabel}>
                      Estimated Credit / CIBIL Score
                    </label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="ec-cibil"
                        value={cibil}
                        onChange={(e) => setCibil(e.target.value as Cibil)}
                        className={styles.select}
                      >
                        <option value="750+">Excellent (750 & above) – Best Rates</option>
                        <option value="700-749">Good (700 to 749)</option>
                        <option value="650-699">Average (650 to 699)</option>
                        <option value="below650">Below 650 (Credit rebuild program)</option>
                        <option value="unknown">I don&apos;t know / Not sure</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.formCol}>
                  {/* Employment Type */}
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Employment Profile</span>
                    <div className={styles.chipsRow} role="radiogroup">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={employment === "salaried"}
                        className={
                          employment === "salaried"
                            ? styles.chipActive
                            : styles.chip
                        }
                        onClick={() => setEmployment("salaried")}
                      >
                        <User size={15} />
                        <span>Salaried Employee</span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={employment === "self"}
                        className={
                          employment === "self" ? styles.chipActive : styles.chip
                        }
                        onClick={() => setEmployment("self")}
                      >
                        <Building2 size={15} />
                        <span>Self-Employed / Business</span>
                      </button>
                    </div>
                  </div>

                  {/* Existing EMIs */}
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor="ec-emi" className={styles.fieldLabel}>
                        Current Monthly Ongoing EMIs
                      </label>
                      {emiNum > 0 ? (
                        <span className={styles.previewAmount}>
                          {formatINR(emiNum)} / mo
                        </span>
                      ) : (
                        <span className={styles.previewAmountMuted}>₹0 (No active EMIs)</span>
                      )}
                    </div>
                    <div className={styles.inputPrefixWrapper}>
                      <span className={styles.inputPrefix}>₹</span>
                      <input
                        id="ec-emi"
                        type="text"
                        inputMode="numeric"
                        placeholder="0 if you have no active loans"
                        value={existingEmi}
                        onChange={handleEmiChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.quickPresets}>
                      {[0, 10000, 20000, 35000, 50000].map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          className={
                            emiNum === amt
                              ? styles.presetChipActive
                              : styles.presetChip
                          }
                          onClick={() => setExistingEmi(String(amt))}
                        >
                          {amt === 0
                            ? "None (₹0)"
                            : `₹${amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Callout Box */}
                  <div className={styles.highlightsBox}>
                    <div className={styles.highlightItem}>
                      <ShieldCheck size={18} className={styles.highlightIcon} />
                      <div>
                        <strong>0% Impact on CIBIL Score</strong>
                        <p>Soft pre-qualification check with bank-grade encryption</p>
                      </div>
                    </div>
                    <div className={styles.highlightItem}>
                      <Sparkles size={18} className={styles.highlightIcon} />
                      <div>
                        <strong>Compare 42+ Partner Lenders</strong>
                        <p>Instant access to prime bank rates and high FOIR programs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className={styles.errorBox} role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formBottom}>
                <button type="submit" className={styles.primaryBtn}>
                  <span>Calculate Eligibility</span>
                  <ArrowRight size={17} />
                </button>

                <div className={styles.trustBadge}>
                  <Lock size={13} className={styles.trustIcon} />
                  <span>100% Free Instant Pre-Qualification • Bank Grade Data Security</span>
                </div>
              </div>
            </form>
          )}

          {/* ---------------- STEP 2: CONTACT DETAILS ---------------- */}
          {step === "contact" && (
            <form onSubmit={submitLead} className={styles.form}>
              <div className={styles.introBlock}>
                <div className={styles.successPill}>
                  <Sparkles size={14} />
                  <span>Calculation Ready</span>
                </div>
                <h3 className={styles.formHeading}>
                  Unlock Your Personalized Report & Bank Offers
                </h3>
                <p className={styles.formSub}>
                  Enter your details to view your maximum approved amount,
                  eligible partner banks, and exclusive interest rate discounts.
                </p>
              </div>

              <div className={styles.contactInputsRow}>
                {/* Full Name */}
                <div className={styles.field}>
                  <label htmlFor="ec-name" className={styles.fieldLabel}>
                    Full Name (as per PAN Card)
                  </label>
                  <div className={styles.inputPrefixWrapper}>
                    <span className={styles.inputPrefix}>
                      <User size={16} />
                    </span>
                    <input
                      id="ec-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError("");
                      }}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className={styles.field}>
                  <label htmlFor="ec-phone" className={styles.fieldLabel}>
                    Mobile Number
                  </label>
                  <div className={styles.inputPrefixWrapper}>
                    <span className={styles.inputPrefix}>
                      <Phone size={15} />
                      <span className={styles.countryCode}>+91</span>
                    </span>
                    <input
                      id="ec-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <span className={styles.fieldHint}>
                    We will share bank sanction quotes via SMS / WhatsApp. No spam ever.
                  </span>
                </div>
              </div>

              {error && (
                <div className={styles.errorBox} role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formBottom}>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <span>Checking Eligible Banks...</span>
                  ) : (
                    <>
                      <span>View My Loan Limit</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={reset}
                  disabled={loading}
                >
                  <RotateCcw size={14} />
                  <span>Modify Financial Details</span>
                </button>
              </div>
            </form>
          )}

          {/* ---------------- STEP 3: RESULT DASHBOARD ---------------- */}
          {step === "result" && (
            <div className={styles.resultContainer}>
              <div className={styles.resultGrid}>
                {/* Left Column: Loan Summary & Metrics */}
                <div className={styles.resultCol}>
                  {/* Status Header */}
                  <div className={`${styles.statusCard} ${statusBadge.class}`}>
                    <div className={styles.statusRow}>
                      <CheckCircle2 size={20} className={styles.statusIcon} />
                      <div>
                        <h4 className={styles.statusTitle}>{statusBadge.text}</h4>
                        <p className={styles.statusDesc}>{statusBadge.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Number Callout */}
                  {result.maxLoan > 0 ? (
                    <div className={styles.amountShowcase}>
                      <span className={styles.amountEyebrow}>
                        Maximum Estimated Loan Eligibility
                      </span>
                      <div className={styles.amountDisplay}>
                        {formatINR(result.maxLoan)}
                      </div>
                      <span className={styles.amountSubtext}>
                        For {LOAN_CONFIG[loanType].label} across top partner lenders
                      </span>
                    </div>
                  ) : (
                    <div className={styles.amountShowcase}>
                      <span className={styles.amountEyebrow}>
                        Standard Eligibility Review
                      </span>
                      <div className={styles.amountDisplayMuted}>
                        Review Needed
                      </div>
                      <p className={styles.amountSubtext}>
                        Your current monthly obligations exceed standard FOIR ratios.
                        Contact our specialists for co-applicant or balance transfer options.
                      </p>
                    </div>
                  )}

                  {/* Metrics Grid */}
                  <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Estimated Monthly EMI</span>
                      <span className={styles.metricValue}>
                        {result.emi > 0 ? formatINR(result.emi) : "Custom Plan"}
                      </span>
                      <span className={styles.metricNote}>per month</span>
                    </div>

                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Benchmark Rate</span>
                      <span className={styles.metricValue}>
                        From {LOAN_CONFIG[loanType].rate}%
                      </span>
                      <span className={styles.metricNote}>per annum</span>
                    </div>

                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Indicative Tenure</span>
                      <span className={styles.metricValue}>
                        Up to {LOAN_CONFIG[loanType].years} Yrs
                      </span>
                      <span className={styles.metricNote}>Flexible repayment</span>
                    </div>

                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Allowable Debt (FOIR)</span>
                      <span className={styles.metricValue}>
                        {result.foirPercent}%
                      </span>
                      <span className={styles.metricNote}>of monthly take-home</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Tips, Disclaimer & Action */}
                <div className={styles.resultCol}>
                  {result.tips.length > 0 && (
                    <div className={styles.tipsBox}>
                      <div className={styles.tipsHeader}>
                        <TrendingUp size={16} />
                        <span>How to Maximize Your Loan Approval</span>
                      </div>
                      <ul className={styles.tipsList}>
                        {result.tips.map((tip, idx) => (
                          <li key={idx} className={styles.tipItem}>
                            <CheckCircle2 size={15} className={styles.tipCheck} />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className={styles.disclaimer}>
                    * Disclaimer: Calculations are indicative estimates based on standard bank
                    Fixed Obligation to Income Ratio (FOIR) guidelines. Final sanctioned loan
                    amount, processing fees, and interest rates depend on formal lender credit
                    appraisal, internal underwriting, and documentation verification.
                  </p>

                  <div className={styles.actionButtons}>
                    <a href="#HeroVerification" className={styles.applyNowBtn}>
                      <span>Apply with 42+ Partner Banks</span>
                      <ArrowRight size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className={styles.recalculateBtn}
                    >
                      <RotateCcw size={15} />
                      <span>Check Another Loan or Income</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
