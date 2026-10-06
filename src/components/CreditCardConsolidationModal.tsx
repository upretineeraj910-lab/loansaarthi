"use client";

import React, { useState, useEffect } from "react";
import styles from "./CreditCardModal.module.css";

export default function CreditCardConsolidationModal() {
  const [isOpen, setIsOpen] = useState(false);

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
          Trapped in Multiple Credit Card EMIs?
        </h2>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Consolidate all cards into a single affordable EMI starting at{" "}
          <strong className={styles.highlightRate}>9.99% reducing rate</strong>.
        </p>

        {/* 2 Clean Stat Boxes */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span className={styles.metricValueGreen}>45%</span>
            <span className={styles.metricLabel}>Lower Monthly EMI</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.metricItem}>
            <span className={styles.metricValueDark}>1 Single</span>
            <span className={styles.metricLabel}>Payment Date</span>
          </div>
        </div>

        {/* CTA Button */}
        <button onClick={handleApplyNow} className={styles.ctaBtn}>
          <span>Calculate & Reduce My EMI</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

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