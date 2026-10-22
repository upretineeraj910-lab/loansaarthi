"use client";

import React, { useState, useEffect } from "react";
import styles from "./CreditCardModal.module.css";

export default function CreditCardConsolidationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // 2 second timer
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApplyNow = () => {
    setIsOpen(false);
    // Page ke existing form par smooth scroll karega
    const formElement = document.querySelector("form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>

        {/* Top Tag */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Debt Relief Plan
        </div>

        {/* Headline */}
        <h2 className={styles.title}>
          Trapped in Multiple Credit Card, App Loan &amp; Personal Loan EMIs?
        </h2>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Consolidate all card, app &amp; personal loans{" "}
          <strong className={styles.highlightRate}>up to ₹75 Lakh</strong> into a single
          affordable EMI starting at{" "}
          <strong className={styles.highlightRate}>
            9.99
            <sup
              style={{
                color: "#facc15",
                fontSize: "0.6em",
                verticalAlign: "super",
                marginLeft: "2px",
                fontWeight: "700",
                lineHeight: 0,
              }}
            >
              *
            </sup>
            {" "}reducing rate
          </strong>.
        </p>

        {/* 2 Clean Stat Boxes */}
        <div className={styles.metricsGrid}>
          {/* Box 1: Lower Monthly EMI (Top) -> Up to 45% (Bottom) */}
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Lower Monthly EMI</span>
            <span className={styles.metricValueGreen}>Up to 45%</span>
          </div>

          <div className={styles.divider} />

          {/* Box 2: Reducing Rate (Top) -> 9.99%* (Bottom) */}
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Reducing Rate</span>
            <span
              className={styles.metricValueDark}
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                justifyContent: "center",
              }}
            >
              9.99%
              {/* Tooltip trigger wrapper */}
              <span
                style={{
                  position: "relative",
                  display: "inline-flex",
                  cursor: "pointer",
                  marginLeft: "2px",
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    lineHeight: 1,
                    display: "inline-block",
                    transform: "translateY(-4px)",
                  }}
                >
                  *
                </span>

                {/* Floating Conditions Box */}
                {showTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "140%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#0d1b14",
                      color: "#e2e8f0",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "400",
                      lineHeight: "1.5",
                      width: "235px",
                      textAlign: "left",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      zIndex: 50,
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ fontWeight: "600", color: "#facc15", marginBottom: "4px" }}>
                      *Eligibility &amp; Terms:
                    </div>
                    <div>• Salary: <strong>₹50,000+ / month</strong></div>
                    <div>• CIBIL Score: <strong>750+</strong></div>
                    <div>• Loan Amount: <strong>₹15 Lakh+ (up to ₹75L)</strong></div>
                    <div>• Depending on partner bank conditions &amp; prevailing interest rates.</div>
                  </div>
                )}
              </span>
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button onClick={handleApplyNow} className={styles.ctaBtn}>
          <span>Calculate &amp; Reduce My EMI</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Bottom micro disclaimer */}
        <p
          style={{
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.45)",
            textAlign: "center",
            margin: "8px 0 2px 0",
            letterSpacing: "0.2px",
            fontWeight: "400",
          }}
        >
          *9.99% rate valid on CIBIL 750+, salary ₹50k+ &amp; loans ₹15L–₹75L. Subject to bank policies.
        </p>

        {/* Footer with Bottom-Right Close */}
        <div className={styles.footerRow}>
          <button onClick={handleApplyNow} className={styles.dismissBtn}>
            <span>Free eligibility check</span>
          </button>
          <button onClick={handleClose} className={styles.dismissBtn}>
            Dismiss &times;
          </button>
        </div>

      </div>
    </div>
  );
}