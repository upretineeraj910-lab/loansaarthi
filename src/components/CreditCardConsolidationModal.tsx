"use client";

import React, { useState, useEffect } from "react";
import styles from "./CreditCardModal.module.css";

/**
 * CreditCardConsolidationModal Component
 * Promotional popup informing high-interest card/personal loan borrowers
 * about debt consolidation with reduced rates and single EMI structuring.
 */
export default function CreditCardConsolidationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Timed modal popup activation
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
    // Smoothly scroll down to the inquiry application form on the page
    const formElement = document.querySelector("form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Close Icon Button */}
        <button onClick={handleClose} className={styles.closeBtn} aria-label="Close modal">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Eyebrow Tag */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Limited Period Benefit
        </div>

        {/* Title */}
        <h3 className={styles.title}>
          Trap of Multiple Credit Cards?
        </h3>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Consolidate all card, app &amp; personal loans{" "}
          <strong className={styles.highlightRate}>up to ₹75 Lakh</strong> into a single
          affordable EMI starting at{" "}
          <strong className={styles.highlightRate}>
            9.99
            <sup className={styles.rateAsterisk}>*</sup>
            {" "}reducing rate
          </strong>.
        </p>

        {/* 2 Clean Stat Boxes */}
        <div className={styles.metricsGrid}>
          {/* Box 1: Lower Monthly EMI */}
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Save your Monthly EMI</span>
            <span className={styles.metricValueGreen}>Up to 45%</span>
          </div>

          <div className={styles.divider} />

          {/* Box 2: Reducing Rate */}
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Reducing Rate</span>
            <span className={styles.metricValueDark}>
              9.99%
              {/* Tooltip trigger wrapper */}
              <span
                className={styles.tooltipTrigger}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <span className={styles.tooltipAsterisk}>
                  *
                </span>

                {/* Floating Conditions Box */}
                {showTooltip && (
                  <div className={styles.tooltipPopup}>
                    <div className={styles.tooltipHeader}>
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
        <p className={styles.microDisclaimer}>
          *9.99% rate valid on CIBIL 750+, salary ₹50k+ &amp; loans ₹15L–₹75L. Subject to bank policies.
        </p>
      </div>
    </div>
  );
}
