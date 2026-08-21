"use client";

import React, { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../firebase";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { log } from "console";

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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    occupation: "Salaried",
    loanType: "Home Loan",
  });

  // Cleanup on unmount
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

  // ----------------------------------------
  // Step 1: Send OTP
  // ----------------------------------------
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const cleanNumber = phone.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "global-recaptcha-container",
          {
            size: "normal",
            callback: () => {},
            "expired-callback": () => {
              setError("reCAPTCHA expired. Please try again.");
            },
          }
        );
      }

      const formattedPhone = `+91${cleanNumber.slice(-10)}`;
      console.log(formattedPhone)
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setStep(2);
    } catch (err: unknown) {
      console.error("OTP Error:", err);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
      if (err instanceof Error) {
        setError(err.message || "Unable to send OTP.");
      } else {
        setError("Unable to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Step 2: Verify OTP
  // ----------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      await confirmationResult.confirm(otp);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Step 3: Save Details to DB
  // ----------------------------------------
  const handleSaveDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+91${phone.slice(-10)}`,
          ...profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save details");

      setStep(4);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-card ledger-lines" style={{ minHeight: "360px", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Container is now fixed outside conditional flows */}
      <div id="global-recaptcha-container"></div>

      <div className="hero-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>
          {step === 1 && "Check Loan Eligibility"}
          {step === 2 && "Enter Verification Code"}
          {step === 3 && "Applicant Information"}
          {step === 4 && "Application Received"}
        </span>
        <span style={{ fontSize: "11px", letterSpacing: "1px", opacity: 0.7 }}>
          {step <= 3 ? `STEP 0${step}/03` : "VERIFIED"}
        </span>
      </div>

      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {error && (
          <div style={{ fontSize: "12px", color: "#A13D2C", background: "#FCEBE8", padding: "8px 10px", borderRadius: "4px", marginBottom: "12px", border: "1px solid #F5C6CB" }}>
            {error}
          </div>
        )}

        {/* STEP 1: Phone */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--charcoal, #2A2720)", opacity: 0.85 }}>
              Enter mobile number to verify and check instant loan offers.
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ padding: "10px 12px", background: "rgba(0,0,0,0.04)", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "14px", fontWeight: 600 }}>+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ flex: 1, padding: "10px", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "14px", background: "transparent", outline: "none" }}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}>
              {loading ? "Sending OTP..." : <>Get Verification Code </>}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", opacity: 0.65, marginTop: "4px" }}>
              <ShieldCheck size={14} /> Soft enquiry · No impact on credit score
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--charcoal, #2A2720)", opacity: 0.85 }}>
              Enter OTP sent to <strong>+91 {phone.slice(-10)}</strong>
            </p>
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "16px", letterSpacing: "4px", textAlign: "center", background: "transparent", boxSizing: "border-box" }}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Verifying..." : "Verify & Proceed"}
            </button>
            <button type="button" onClick={() => { setStep(1); setOtp(""); setError(""); }} style={{ background: "none", border: "none", fontSize: "12px", color: "var(--brass, #B8863E)", cursor: "pointer", textDecoration: "underline" }}>
              Change Number
            </button>
          </form>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <form onSubmit={handleSaveDetails} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Full Name (as per PAN)"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "13px", background: "transparent", boxSizing: "border-box" }}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "13px", background: "transparent", boxSizing: "border-box" }}
              required
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "12px", background: "transparent" }}
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={profile.loanType}
                onChange={(e) => setProfile({ ...profile, loanType: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid var(--paperLine, #D9D0B8)", borderRadius: "4px", fontSize: "12px", background: "transparent" }}
              >
                <option value="Home Loan">Home Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="LAP">Loan Against Property</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}>
              {loading ? "Saving..." : <>Submit Details</>}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <CheckCircle2 size={40} color="var(--emerald, #1F5C4C)" style={{ margin: "0 auto 10px" }} />
            <h4 style={{ margin: "0 0 6px 0", color: "var(--ink, #14213D)" }}>Application Received</h4>
            <p style={{ fontSize: "12px", margin: "0 0 12px 0", opacity: 0.8 }}>
              Thank you, <strong>{profile.fullName}</strong>. Your requirement has been submitted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}