"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import LedgerRow from "@/components/LedgerRow";

type LoanEmiCalculatorProps = {
  /** "loan" (default) = simple table-row UI, lp-* classes, loan-page.css.
   *  "home" = fancy breakdown-bar UI, calc-* classes, main.css. */
  variant?: "loan" | "home";
  /** Heading shown only in "loan" variant. */
  title?: string;
  amountLabel?: string;
  amountDefault?: number;
  amountMin?: number;
  amountMax?: number;
  amountStep?: number;
  tenureDefault?: number;
  tenureMin?: number;
  tenureMax?: number;
  rateLabel?: string;
  rateDefault?: number;
  rateMin?: number;
  rateMax?: number;
  rateStep?: number;
  emiLabel?: string;
};

export default function LoanEmiCalculator({
  variant = "loan",
  title,
  amountLabel = "Amount (₹)",
  amountDefault = 2500000,
  amountMin = 100000,
  amountMax = 10000000,
  amountStep = 50000,
  tenureDefault = 20,
  tenureMin = 1,
  tenureMax = 30,
  rateLabel,
  rateDefault = 8.6,
  rateMin = 7,
  rateMax = 16,
  rateStep = 0.05,
  emiLabel,
}: LoanEmiCalculatorProps) {
  const [amount, setAmount] = useState(amountDefault);
  const [tenure, setTenure] = useState(tenureDefault);
  const [rate, setRate] = useState(rateDefault);

  // Sensible label defaults per variant, unless the caller overrides them.
  const resolvedRateLabel =
    rateLabel ?? (variant === "loan" ? "Rate (% p.a.)" : "Interest rate");
  const resolvedEmiLabel =
    emiLabel ?? (variant === "loan" ? "Monthly EMI" : "Monthly instalment");

  const r = rate / 12 / 100;
  const n = tenure * 12;
  const emi =
    r === 0
      ? amount / n
      : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPay = emi * n;
  const totalInterest = totalPay - amount;
  const principalShare = Math.round((amount / totalPay) * 100);

  const fmt = (v: number) => "₹" + Math.round(v).toLocaleString("en-IN");

  // ---------------- LOAN variant (simple, table-style, lp-* classes) ----------------
  if (variant === "loan") {
    return (
      <div className="lp-card-box">
        {title && <h3>{title}</h3>}
        <div className="lp-input-row">
          <div className="lp-input-label">
            <label>{amountLabel}</label>
            <span>{fmt(amount)}</span>
          </div>
          <input
            type="range"
            min={amountMin}
            max={amountMax}
            step={amountStep}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="lp-range"
          />
        </div>
        <div className="lp-input-row">
          <div className="lp-input-label">
            <label>Tenure (Years)</label>
            <span>{tenure} Yrs</span>
          </div>
          <input
            type="range"
            min={tenureMin}
            max={tenureMax}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="lp-range"
          />
        </div>
        <div className="lp-input-row">
          <div className="lp-input-label">
            <label>{resolvedRateLabel}</label>
            <span>{rate}%</span>
          </div>
          <input
            type="range"
            min={rateMin}
            max={rateMax}
            step={rateStep}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="lp-range"
          />
        </div>
        <div className="lp-calc-res">
          <div className="lp-res-row highlight">
            <span>{resolvedEmiLabel}</span>
            <strong>{fmt(emi)}</strong>
          </div>
          <div className="lp-res-row">
            <span>Total Interest</span>
            <span>{fmt(totalInterest)}</span>
          </div>
          <div className="lp-res-row">
            <span>Total Payable</span>
            <span>{fmt(totalPay)}</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- HOME variant (fancy breakdown bar, calc-* classes) ----------------
  return (
    <div className="calculator-wrapper">
      <div className="calc-slider-group">
        <div>
          <div className="calc-slider-header">
            <span>Loan amount</span>
            <span className="calc-slider-value">{fmt(amount)}</span>
          </div>
          <input
            type="range"
            aria-label="Loan amount"
            min={amountMin}
            max={amountMax}
            step={amountStep}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
        <div>
          <div className="calc-slider-header">
            <span>{resolvedRateLabel}</span>
            <span className="calc-slider-value">{rate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            aria-label="Interest rate"
            min={rateMin}
            max={rateMax}
            step={rateStep}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
        <div>
          <div className="calc-slider-header">
            <span>Tenure</span>
            <span className="calc-slider-value">{tenure} yrs</span>
          </div>
          <input
            type="range"
            aria-label="Loan tenure in years"
            min={tenureMin}
            max={tenureMax}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
      </div>

      <div className="calc-divider">
        <div className="calc-emi-label">{resolvedEmiLabel}</div>
        <div className="calc-emi-value">{fmt(emi)}</div>

        <div className="calc-breakdown">
          <div
            className="calc-breakdown-principal"
            style={{ width: `${principalShare}%` }}
          />
          <div
            className="calc-breakdown-interest"
            style={{ width: `${100 - principalShare}%` }}
          />
        </div>
        <div className="calc-breakdown-labels">
          <span>Principal {principalShare}%</span>
          <span>Interest {100 - principalShare}%</span>
        </div>

        <LedgerRow label="Principal" value={fmt(amount)} />
        <LedgerRow label="Total interest" value={fmt(totalInterest)} />
        <LedgerRow label="Total payable" value={fmt(totalPay)} />

        <a href="#contact" className="btn-get-rate">
          Get this rate reviewed <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
