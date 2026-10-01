
"use client";

import React, { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../firebase";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import "./hero-verification.css";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier | null;
  }
}

type Step = 1 | 2 | 3 | 4;

export default function HeroVerificationCard() {
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    occupation: "Salaried",
    loanType: "Home Loan",
    income: "",
  });

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.error(e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // STEP 1: SEND OTP
  const handleSendOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    const cleanNumber = phone.replace(/\D/g, "");

    if (cleanNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    console.time("OTP Send Total");

    try {
      // reCAPTCHA setup
      if (!window.recaptchaVerifier) {
        console.time("reCAPTCHA Initialization");

        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "global-recaptcha-container",
          {
            size: "invisible",
            callback: () => {},
            "expired-callback": () => {
              setError("reCAPTCHA expired. Please try again.");
            },
          }
        );

        console.timeEnd("reCAPTCHA Initialization");
      }

      const formattedPhone = `+91${cleanNumber}`;

      // Firebase OTP request timing
      console.time("Firebase OTP Request");

      let confirmation: ConfirmationResult;

      try {
        confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          window.recaptchaVerifier!
        );
      } finally {
        console.timeEnd("Firebase OTP Request");
      }

      setConfirmationResult(confirmation);
      setStep(2);

      console.log("OTP request successful");
    } catch (err: unknown) {
      console.error("Number verification Error:", err);

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.error("reCAPTCHA clear error:", e);
        }
        window.recaptchaVerifier = null;
      }

      if (err instanceof Error) {
        setError(err.message || "Unable to send OTP.");
      } else {
        setError("Unable to send OTP.");
      }
    } finally {
      console.timeEnd("OTP Send Total");
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter 6-digit OTP.");
      return;
    }

    if (!confirmationResult) {
      setError("Session expired. Please request a new OTP.");
      setStep(1);
      return;
    }

    setLoading(true);
    console.time("OTP Verification Total");

    try {
      console.time("Firebase OTP Confirmation");

      try {
        await confirmationResult.confirm(otp);
      } finally {
        console.timeEnd("Firebase OTP Confirmation");
      }

      setStep(3);
      console.log("OTP verified successfully");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Invalid or expired OTP.");
    } finally {
      console.timeEnd("OTP Verification Total");
      setLoading(false);
    }
  };

  // STEP 3: SAVE DETAILS
  const handleSaveDetails = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    console.time("Save Details Total");

    try {
      console.time("Lead API Request");

      let res: Response;

      try {
        res = await fetch("/api/lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: `+91${phone.replace(/\D/g, "").slice(-10)}`,
            ...profile,
          }),
        });
      } finally {
        console.timeEnd("Lead API Request");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save details");
      }

      setStep(4);
      console.log("Details saved successfully");
    } catch (err: unknown) {
      console.error("Save details error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save details.");
      }
    } finally {
      console.timeEnd("Save Details Total");
      setLoading(false);
    }
  };

  return (
    <div id="loan-eligibility-form" className="hero-card ledger-lines">
      <div id="global-recaptcha-container"></div>

      <div className="hero-card-header">
        <span className="hero-card-title">
          {step === 1 && "Check Loan Eligibility"}
          {step === 2 && "Enter Verification Code"}
          {step === 3 && "Applicant Information"}
          {step === 4 && "Application Received"}
        </span>

        <span className="hero-step-badge">
          {step <= 3 ? `STEP 0${step}/03` : "VERIFIED"}
        </span>
      </div>

      <div className="hero-card-body">
        {error && (
          <div className="hero-error-banner">{error}</div>
        )}

        {/* STEP 1: PHONE */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="hero-form">
            <p className="hero-form-desc">
              Enter mobile number to verify and check instant loan offers.
            </p>

            <div className="hero-phone-group">
              <span className="hero-phone-prefix">+91</span>

              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="hero-input"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hero-submit-btn"
            >
              {loading ? "Sending OTP..." : "Get Verification Code"}
            </button>

            <div className="hero-trust-indicator">
              <ShieldCheck size={15} />
              Soft enquiry · No impact on credit score
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="hero-form">
            <p className="hero-form-desc">
              Enter OTP sent to <strong>+91 {phone.slice(-10)}</strong>
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="hero-input hero-otp-input"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="hero-submit-btn"
            >
              {loading ? "Verifying..." : "Verify & Proceed"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setConfirmationResult(null);
                setError("");
              }}
              className="hero-link-btn"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        {/* STEP 3: APPLICANT DETAILS */}
        {step === 3 && (
          <form onSubmit={handleSaveDetails} className="hero-form">
            <input
              type="text"
              placeholder="Full Name (as per PAN)"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  fullName: e.target.value,
                })
              }
              className="hero-input"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
              className="hero-input"
              required
            />

            <div className="hero-select-row">
              <select
                value={profile.occupation}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    occupation: e.target.value,
                  })
                }
                className="hero-select"
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>

              <div className="income">
                <input
                  type="number"
                  placeholder="Annual Income"
                  name="income"
                  value={profile.income}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      income: e.target.value,
                    })
                  }
                />
              </div>

              <select
                value={profile.loanType}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    loanType: e.target.value,
                  })
                }
                className="hero-select"
              >
                <option value="Home Loan">Home Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="LAP">Loan Against Property</option>
                <option value="Balance Transfer">Balance Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hero-submit-btn"
            >
              {loading ? "Saving Details..." : "Submit Details"}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="hero-success-state">
            <CheckCircle2
              size={44}
              className="hero-success-icon"
            />

            <h4>Application Received</h4>

            <p>
              Thank you, <strong>{profile.fullName}</strong>. Your loan
              requirement has been submitted successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

