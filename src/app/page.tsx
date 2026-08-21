// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import HeroVerificationCard from "../components/HeroVerificationCard";
// import {
//   Phone,
//   MessageCircle,
//   Check,
//   ChevronDown,
//   ArrowRight,
//   Landmark,
//   ShieldCheck,
//   Clock3,
//   UserCheck,
// } from "lucide-react";
// import "./main.css"; // Import the CSS file

// // ---------------------------------------------------------------
// // Design tokens (kept as JS constants for dynamic styling)
// // ---------------------------------------------------------------
// const COLOR = {
//   ink: "#14213D",
//   paper: "#EFEADD",
//   paperLine: "#D9D0B8",
//   brass: "#B8863E",
//   brassDeep: "#8F6529",
//   emerald: "#1F5C4C",
//   stamp: "#A13D2C",
//   charcoal: "#2A2720",
// };

// // ---------------------------------------------------------------
// // Scroll-reveal helper — small, dependency-free
// // ---------------------------------------------------------------
// function useReveal<T extends HTMLElement>() {
//   const ref = useRef<T | null>(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           obs.disconnect();
//         }
//       },
//       { threshold: 0.15 }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, []);
//   return { ref, visible };
// }

// function Reveal({
//   children,
//   className = "",
//   delay = 0,
// }: {
//   children: React.ReactNode;
//   className?: string;
//   delay?: number;
// }) {
//   const { ref, visible } = useReveal<HTMLDivElement>();
//   const delayClass = delay >= 150 ? "delay-4" : delay >= 100 ? "delay-3" : delay >= 80 ? "delay-2" : delay >= 60 ? "delay-1" : "";

//   return (
//     <div
//       ref={ref}
//       className={`reveal ${visible ? "visible" : ""} ${delayClass} ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// // ---------------------------------------------------------------
// // Small reusable bits
// // ---------------------------------------------------------------
// function Eyebrow({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="eyebrow">
//       <span className="eyebrow-line" />
//       <span className="eyebrow-text">{children}</span>
//     </div>
//   );
// }

// function Stamp({
//   children,
//   rotate = -8,
//   color = COLOR.stamp,
// }: {
//   children: React.ReactNode;
//   rotate?: number;
//   color?: string;
// }) {
//   return (
//     <div
//       className="stamp"
//       style={{
//         color,
//         borderColor: color,
//         transform: `rotate(${rotate}deg)`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function LedgerRow({
//   label,
//   value,
// }: {
//   label: React.ReactNode;
//   value: React.ReactNode;
// }) {
//   return (
//     <div className="ledger-row">
//       <span className="label">{label}</span>
//       <span className="dash" />
//       <span className="value">{value}</span>
//     </div>
//   );
// }

// // ---------------------------------------------------------------
// // Data
// // ---------------------------------------------------------------
// const LOAN_TYPES = [
//   {
//     n: "01",
//     name: "Home Loan",
//     desc: "Purchase, construction or balance transfer, arranged with your repayment capacity in mind, not the bank's target.",
//     rate: "from 8.10%",
//     range: "up to ₹5 Cr",
//   },
//   {
//     n: "02",
//     name: "Loan Against Property",
//     desc: "Unlock funds against residential or commercial property without giving up ownership.",
//     rate: "from 9.25%",
//     range: "up to ₹3 Cr",
//   },
//   {
//     n: "03",
//     name: "Business Loan",
//     desc: "Working capital and expansion funding, matched to your GST filings and cash-flow cycle.",
//     rate: "from 11.50%",
//     range: "up to ₹1 Cr",
//   },
//   {
//     n: "04",
//     name: "Personal Loan",
//     desc: "For the expenses that don't wait — medical, wedding, travel — sanctioned in days.",
//     rate: "from 9.99%",
//     range: "up to ₹25 L",
//   },
//   {
//     n: "05",
//     name: "Education Loan",
//     desc: "Domestic and overseas study, structured around your course start date and moratorium needs.",
//     rate: "from 9.50%",
//     range: "up to ₹75 L",
//   },
//   {
//     n: "06",
//     name: "Loan Balance Transfer",
//     desc: "Move an existing loan to a lower rate. We do the paperwork; you keep the difference.",
//     rate: "from 8.05%",
//     range: "any amount",
//   },
// ];

// const WHY = [
//   {
//     icon: ShieldCheck,
//     title: "Rates worth entering",
//     text: "We compare offers across 30+ lenders so the number that goes in your ledger is the lowest one available to you.",
//   },
//   {
//     icon: UserCheck,
//     title: "Paperwork we carry",
//     text: "Income proof, credit checks, property documents — collected, verified and filed on your behalf.",
//   },
//   {
//     icon: Clock3,
//     title: "Days, not months",
//     text: "Most sanctions come through in 4–7 working days because your file reaches the right desk the first time.",
//   },
//   {
//     icon: Landmark,
//     title: "One advisor, start to finish",
//     text: "The person you speak to on day one is the person who hands you the sanction letter.",
//   },
// ];

// const STEPS = [
//   { label: "Apply", detail: "Share your requirement and documents — in person, on call, or on WhatsApp." },
//   { label: "Verify", detail: "We match you to lenders you actually qualify for and prepare your file." },
//   { label: "Sanction", detail: "Your application is submitted and tracked until approval is confirmed." },
//   { label: "Disburse", detail: "Funds are released to your account, and we stay on for any post-loan queries." },
// ];

// const BANKS = [
//   "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank",
//   "Bajaj Finserv", "LIC Housing Finance", "Kotak Mahindra Bank", "PNB Housing",
// ];

// const TESTIMONIALS = [
//   {
//     quote:
//       "They found us a rate 0.4% lower than what our own bank offered, and handled every follow-up call so we didn't have to.",
//     name: "Ritu & Sanjay Malhotra",
//     tag: "Home Loan, ₹62 L",
//   },
//   {
//     quote:
//       "I run a small workshop and don't have time to sit in bank branches. They took the file end to end and called me only when a signature was needed.",
//     name: "Deepak Verma",
//     tag: "Business Loan, ₹18 L",
//   },
//   {
//     quote:
//       "Transparent about what we'd qualify for from day one — no surprises when the sanction letter arrived.",
//     name: "Ayesha Khan",
//     tag: "Personal Loan, ₹6 L",
//   },
// ];

// const FAQS = [
//   {
//     q: "Is there a fee to consult with Loansaarthi?",
//     a: "The initial consultation and eligibility check are free. Our fee, when applicable, is disclosed in writing before you engage us — never deducted silently from your loan amount.",
//   },
//   {
//     q: "What documents do I need to start?",
//     a: "Typically PAN, Aadhaar, last 6 months' bank statements, income proof (salary slips or ITR), and property documents where relevant. We'll give you an exact checklist for your loan type on the first call.",
//   },
//   {
//     q: "Will checking my eligibility affect my credit score?",
//     a: "No. Our initial eligibility check uses a soft enquiry, which does not impact your credit score. A hard enquiry only happens once you choose to formally apply with a lender.",
//   },
//   {
//     q: "How is Loansaarthi different from applying directly at a bank?",
//     a: "We compare offers across our partner lenders instead of one, handle documentation and follow-ups on your behalf, and flag issues in your file before a bank does — which is usually what causes delays or rejections.",
//   },
// ];

// // ---------------------------------------------------------------
// // EMI calculator
// // ---------------------------------------------------------------
// function EmiCalculator() {
//   const [amount, setAmount] = useState(2500000);
//   const [rate, setRate] = useState(8.6);
//   const [years, setYears] = useState(20);

//   const r = rate / 12 / 100;
//   const n = years * 12;
//   const emi = r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
//   const totalPay = emi * n;
//   const totalInterest = totalPay - amount;
//   const principalShare = Math.round((amount / totalPay) * 100);

//   const fmt = (v: number) =>
//     "₹" + Math.round(v).toLocaleString("en-IN");

//   return (
//     <div className="calculator-wrapper">
//       <div className="calc-slider-group">
//         <div>
//           <div className="calc-slider-header">
//             <span>Loan amount</span>
//             <span className="calc-slider-value">{fmt(amount)}</span>
//           </div>
//           <input
//             type="range"
//             min={100000}
//             max={10000000}
//             step={50000}
//             value={amount}
//             onChange={(e) => setAmount(Number(e.target.value))}
//             className="calc-slider"
//           />
//         </div>
//         <div>
//           <div className="calc-slider-header">
//             <span>Interest rate</span>
//             <span className="calc-slider-value">{rate.toFixed(2)}%</span>
//           </div>
//           <input
//             type="range"
//             min={7}
//             max={16}
//             step={0.05}
//             value={rate}
//             onChange={(e) => setRate(Number(e.target.value))}
//             className="calc-slider"
//           />
//         </div>
//         <div>
//           <div className="calc-slider-header">
//             <span>Tenure</span>
//             <span className="calc-slider-value">{years} yrs</span>
//           </div>
//           <input
//             type="range"
//             min={1}
//             max={30}
//             step={1}
//             value={years}
//             onChange={(e) => setYears(Number(e.target.value))}
//             className="calc-slider"
//           />
//         </div>
//       </div>

//       <div className="calc-divider">
//         <div className="calc-emi-label">Monthly instalment</div>
//         <div className="calc-emi-value">{fmt(emi)}</div>

//         <div className="calc-breakdown">
//           <div className="calc-breakdown-principal" style={{ width: `${principalShare}%` }} />
//           <div className="calc-breakdown-interest" style={{ width: `${100 - principalShare}%` }} />
//         </div>
//         <div className="calc-breakdown-labels">
//           <span>Principal {principalShare}%</span>
//           <span>Interest {100 - principalShare}%</span>
//         </div>

//         <LedgerRow label="Principal" value={fmt(amount)} />
//         <LedgerRow label="Total interest" value={fmt(totalInterest)} />
//         <LedgerRow label="Total payable" value={fmt(totalPay)} />

//         <a href="#contact" className="btn-get-rate">
//           Get this rate reviewed <ArrowRight size={15} />
//         </a>
//       </div>
//     </div>
//   );
// }

// // ---------------------------------------------------------------
// // FAQ accordion
// // ---------------------------------------------------------------
// function Faq() {
//   const [open, setOpen] = useState<number | null>(0);
//   return (
//     <div>
//       {FAQS.map((f, i) => {
//         const isOpen = open === i;
//         return (
//           <div key={f.q} className="faq-item">
//             <button
//               onClick={() => setOpen(isOpen ? null : i)}
//               className="faq-button"
//               aria-expanded={isOpen}
//             >
//               <span className="faq-question">{f.q}</span>
//               <ChevronDown
//                 size={18}
//                 className={`faq-chevron ${isOpen ? "open" : ""}`}
//               />
//             </button>
//             <div className={`faq-answer ${isOpen ? "open" : ""}`}>
//               <p className="faq-answer-text">{f.a}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ---------------------------------------------------------------
// // Page
// // ---------------------------------------------------------------
// export default function Home() {
//   return (
//     <div>
//       {/* ---------------- HERO ---------------- */}
//       <section id="home" className="container hero-section">
//         <div className="hero-grid">
//           <Reveal>
//             {/* <Eyebrow>Delhi · Loan Advisory</Eyebrow> */}
//             <h1 className="hero-title">
//               Get Loans at Lowest Interest Rates –<br />Compare 30+ Banks & NBFCs.
//             </h1>
//             <p className="hero-text">
//               We compare offers across 30+ banks and NBFCs, prepare your file,
//               and follow it through to disbursement — so the only thing you
//               sign is the sanction letter.
//             </p>
//             <div className="hero-actions">
//               <a href="#calculator" className="btn-primary">
//                 Check your EMI
//               </a>
//               <a href="#contact" className="btn-secondary">
//                 Free Consultation<ArrowRight size={15} aria-hidden="true"/>
//               </a>
//             </div>
//             <div className="hero-stats">
//               <div>
//                 <div className="stat-number">1,200+</div>
//                 <div className="stat-label">loans placed</div>
//               </div>
//               <div>
//                 <div className="stat-number">4–7 days</div>
//                 <div className="stat-label">avg. sanction</div>
//               </div>
//               <div>
//                 <div className="stat-number">30+</div>
//                 <div className="stat-label">partner lenders</div>
//               </div>
//             </div>
//           </Reveal>

//           {/* <Reveal delay={150}>
//             <div className="hero-card-wrapper">
//               <div style={{ position: "absolute", top: "-1.25rem", right: "-0.75rem", zIndex: 10 }}>
//                 <Stamp>Est. 2020</Stamp>
//               </div>
//               <div className="hero-card ledger-lines">
//                 <div className="hero-card-header">Recent entries</div>
//                 {[
//                   ["Home Loan", "₹45,00,000", true],
//                   ["Business Loan", "₹12,00,000", true],
//                   ["Personal Loan", "₹6,50,000", true],
//                   ["Education Loan", "₹28,00,000", false],
//                 ].map(([name, amt, done]) => (
//                   <div key={name as string} className="ledger-item">
//                     <span className="ledger-item-name">{name}</span>
//                     <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
//                       <span className="ledger-item-amount">{amt}</span>
//                       <span className={`ledger-item-check ${done ? "done" : "pending"}`}>
//                         {done && <Check className="check-icon" />}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Reveal> */}

//           <Reveal delay={150}>
//   <div className="hero-card-wrapper">
//     <div
//       style={{
//         position: "absolute",
//         top: "-1.25rem",
//         right: "-0.75rem",
//         zIndex: 10,
//       }}
//     >
//       {/* <Stamp>Instant Verify</Stamp> */}
//     </div>

//     {/* Naya TS verification widget */}
//     <HeroVerificationCard />
//   </div>
// </Reveal>
//         </div>
//       </section>

//       <section className="bg-ink" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
//         <div className="container">
//           <div className="bank-partners-label">Who we work with</div>
//           <div className="bank-tags">
//             {BANKS.map((b) => (
//               <span key={b} className="bank-tag">{b}</span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ---------------- LOAN TYPES ---------------- */}
//       <section id="Loan" className="container section-spacing">
//         <Reveal>
//           <Eyebrow>What we arrange</Eyebrow>
//           <h2 className="section-header">
//             Six lines in the ledger, one for every need.
//           </h2>
//         </Reveal>
//         <div className="loan-grid">
//           {LOAN_TYPES.map((l, i) => (
//             <Reveal key={l.name} delay={i * 60}>
//               <a href="#contact" className="loan-item">
//                 <div className="loan-header">
//                   <span className="loan-number">{l.n}</span>
//                   <h3 className="loan-name">{l.name}</h3>
//                   <ArrowRight size={15} className="loan-arrow" />
//                 </div>
//                 <p className="loan-desc">{l.desc}</p>
//                 <LedgerRow label={<span className="loan-rate-label">Rate</span>} value={l.rate} />
//                 <LedgerRow label={<span className="loan-rate-label">Amount</span>} value={l.range} />
//               </a>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- WHY ---------------- */}
//       <section className="bg-paper-dark section-spacing">
//         <div className="container">
//           <Reveal>
//             <Eyebrow>Why clients sign with us</Eyebrow>
//           </Reveal>
//           <div className="why-grid">
//             {WHY.map((w, i) => (
//               <Reveal key={w.title} delay={i * 80}>
//                 <w.icon className="why-icon" aria-hidden="true" />
//                 <h3 className="why-title">{w.title}</h3>
//                 <p className="why-text">{w.text}</p>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ---------------- PROCESS ---------------- */}
//       <section id="process" className="container section-spacing">
//         <Reveal>
//           <Eyebrow>How it works</Eyebrow>
//           <h2 className="section-header">
//             Four entries from first call to funds in hand.
//           </h2>
//         </Reveal>
//         <div className="process-grid">
//           <div className="process-line" />
//           {STEPS.map((s, i) => (
//             <Reveal key={s.label} delay={i * 100}>
//               <div className="process-step">
//                 <div className="process-number">{i + 1}</div>
//                 <h3 className="process-title">{s.label}</h3>
//                 <p className="process-detail">{s.detail}</p>
//               </div>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- CALCULATOR ---------------- */}
//       <section id="calculator" className="container section-spacing">
//         <Reveal>
//           <Eyebrow>Run the numbers</Eyebrow>
//           <h2 className="section-header">
//             See what the monthly entry looks like.
//           </h2>
//         </Reveal>
//         <Reveal delay={100}>
//           <EmiCalculator />
//         </Reveal>
//       </section>

//       {/* ---------------- BANK PARTNERS ----------------
//       <section className="bg-ink" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
//         <div className="container">
//           <div className="bank-partners-label">Who we work with</div>
//           <div className="bank-tags">
//             {BANKS.map((b) => (
//               <span key={b} className="bank-tag">{b}</span>
//             ))}
//           </div>
//         </div>
//       </section> */}

//       {/* ---------------- TESTIMONIALS ---------------- */}
//       <section className="container section-spacing">
//         <Reveal>
//           <Eyebrow>From the ledger margin</Eyebrow>
//         </Reveal>
//         <div className="testimonial-grid">
//           {TESTIMONIALS.map((t, i) => (
//             <Reveal key={t.name} delay={i * 100}>
//               <div className="testimonial-card">
//                 <p className="testimonial-quote">"{t.quote}"</p>
//                 <div className="testimonial-name">{t.name}</div>
//                 <div className="testimonial-tag">{t.tag}</div>
//               </div>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- FAQ ---------------- */}
//       <section id="faq" className="faq-section">
//         <div className="faq-container">
//           <Reveal>
//             <Eyebrow>Before you sign</Eyebrow>
//             <h2 className="section-header">
//               Questions clients ask first.
//             </h2>
//           </Reveal>
//           <Reveal delay={100}>
//             <Faq />
//           </Reveal>
//         </div>
//       </section>

//       {/* ---------------- CONTACT / FOOTER CTA ---------------- */}
//       {/* <section id="contact" className="bg-ink-dark contact-section">
//         <div className="container" style={{ textAlign: "center", maxWidth: "48rem" }}>
//           <Reveal>
//             <h2 className="contact-title">
//               Ready to make the first entry?
//             </h2>
//             <p className="contact-text">
//               Tell us what you need funded — we'll tell you, plainly, what you qualify for.
//             </p>
//             <div className="contact-actions">
//               <a href="tel:917669486600" className="btn-call">
//                 <Phone size={16} /> Call +91-7669486600
//               </a>
//               <a href="https://wa.me/917669486600" className="btn-whatsapp">
//                 <MessageCircle size={16} /> WhatsApp us
//               </a>
//             </div>
//           </Reveal>
//         </div>

//         <div className="container footer-divider">
//           <span>© {new Date().getFullYear()} Loansaarthi Loan Advisory. DSA-registered credit facilitator.</span>
//           <span>Sadipur, New delhi</span>
//         </div>
//       </section> */}

//       {/* ---------------- MOBILE STICKY CTA ---------------- */}
//       <div className="mobile-cta">
//         <a href="tel:917669486600" className="mobile-cta-call">
//           <Phone size={15} aria-hidden="true"/> Call
//         </a>
//         <a href="https://wa.me/917669486600" className="mobile-cta-whatsapp">
//           <MessageCircle  size={15} aria-hidden="true" /> WhatsApp
//         </a>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useEffect, useRef, useState } from "react";
import HeroVerificationCard from "../components/HeroVerificationCard";
import Script from "next/script";

import {
  Phone,
  MessageCircle,
  Check,
  ChevronDown,
  ArrowRight,
  Landmark,
  ShieldCheck,
  Clock3,
  UserCheck,
} from "lucide-react";
import "./main.css"; // Import the CSS file
import Team from "@/components/team";


// ---------------------------------------------------------------
// Design tokens (kept as JS constants for dynamic styling)
// ---------------------------------------------------------------
const COLOR = {
  ink: "#14213D",
  paper: "#EFEADD",
  paperLine: "#D9D0B8",
  brass: "#B8863E",
  brassDeep: "#8F6529",
  emerald: "#1F5C4C",
  stamp: "#A13D2C",
  charcoal: "#2A2720",
};

// ---------------------------------------------------------------
// Scroll-reveal helper — small, dependency-free
// ---------------------------------------------------------------
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const delayClass = delay >= 150 ? "delay-4" : delay >= 100 ? "delay-3" : delay >= 80 ? "delay-2" : delay >= 60 ? "delay-1" : "";

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// Small reusable bits
// ---------------------------------------------------------------
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-line" />
      <span className="eyebrow-text">{children}</span>
    </div>
  );
}

function Stamp({
  children,
  rotate = -8,
  color = COLOR.stamp,
}: {
  children: React.ReactNode;
  rotate?: number;
  color?: string;
}) {
  return (
    <div
      className="stamp"
      style={{
        color,
        borderColor: color,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

function LedgerRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="ledger-row">
      <span className="label">{label}</span>
      <span className="dash" />
      <span className="value">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------
// Data
// ---------------------------------------------------------------
const LOAN_TYPES = [
  {
    n: "01",
    name: "Home Loan",
    desc: "Purchase, construction or balance transfer, arranged with your repayment capacity in mind, not the bank's target.",
    rate: "from 8.10%",
    range: "up to ₹5 Cr",
  },
  {
    n: "02",
    name: "Loan Against Property",
    desc: "Unlock funds against residential or commercial property without giving up ownership.",
    rate: "from 9.25%",
    range: "up to ₹3 Cr",
  },
  {
    n: "03",
    name: "Business Loan",
    desc: "Working capital and expansion funding, matched to your GST filings and cash-flow cycle.",
    rate: "from 11.50%",
    range: "up to ₹1 Cr",
  },
  {
    n: "04",
    name: "Personal Loan",
    desc: "For the expenses that don't wait — medical, wedding, travel — sanctioned in days.",
    rate: "from 9.99%",
    range: "up to ₹25 L",
  },
  {
    n: "05",
    name: "Education Loan",
    desc: "Domestic and overseas study, structured around your course start date and moratorium needs.",
    rate: "from 9.50%",
    range: "up to ₹75 L",
  },
  {
    n: "06",
    name: "Loan Balance Transfer",
    desc: "Move an existing loan to a lower rate. We do the paperwork; you keep the difference.",
    rate: "from 8.05%",
    range: "any amount",
  },
];

const WHY = [
  {
    icon: ShieldCheck,
    title: "Rates worth entering",
    text: "We compare offers across 30+ lenders so the number that goes in your ledger is the lowest one available to you.",
  },
  {
    icon: UserCheck,
    title: "Paperwork we carry",
    text: "Income proof, credit checks, property documents — collected, verified and filed on your behalf.",
  },
  {
    icon: Clock3,
    title: "Days, not months",
    text: "Most sanctions come through in 4–7 working days because your file reaches the right desk the first time.",
  },
  {
    icon: Landmark,
    title: "One advisor, start to finish",
    text: "The person you speak to on day one is the person who hands you the sanction letter.",
  },
];

const STEPS = [
  { label: "Apply", detail: "Share your requirement and documents — in person, on call, or on WhatsApp." },
  { label: "Verify", detail: "We match you to lenders you actually qualify for and prepare your file." },
  { label: "Sanction", detail: "Your application is submitted and tracked until approval is confirmed." },
  { label: "Disburse", detail: "Funds are released to your account, and we stay on for any post-loan queries." },
];

const BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank",
  "Bajaj Finserv", "LIC Housing Finance", "Kotak Mahindra Bank", "PNB Housing",
];

const TESTIMONIALS = [
  {
    quote:
      "They found us a rate 0.4% lower than what our own bank offered, and handled every follow-up call so we didn't have to.",
    name: "Ritu & Sanjay Malhotra",
    tag: "Home Loan, ₹62 L",
  },
  {
    quote:
      "I run a small workshop and don't have time to sit in bank branches. They took the file end to end and called me only when a signature was needed.",
    name: "Deepak Verma",
    tag: "Business Loan, ₹18 L",
  },
  {
    quote:
      "Transparent about what we'd qualify for from day one — no surprises when the sanction letter arrived.",
    name: "Ayesha Khan",
    tag: "Personal Loan, ₹6 L",
  },
];

const FAQS = [
  {
    q: "Is there a fee to consult with Loansaarthi?",
    a: "The initial consultation and eligibility check are free. Our fee, when applicable, is disclosed in writing before you engage us — never deducted silently from your loan amount.",
  },
  {
    q: "What documents do I need to start?",
    a: "Typically PAN, Aadhaar, last 6 months' bank statements, income proof (salary slips or ITR), and property documents where relevant. We'll give you an exact checklist for your loan type on the first call.",
  },
  {
    q: "Will checking my eligibility affect my credit score?",
    a: "No. Our initial eligibility check uses a soft enquiry, which does not impact your credit score. A hard enquiry only happens once you choose to formally apply with a lender.",
  },
  {
    q: "How is Loansaarthi different from applying directly at a bank?",
    a: "We compare offers across our partner lenders instead of one, handle documentation and follow-ups on your behalf, and flag issues in your file before a bank does — which is usually what causes delays or rejections.",
  },
];

// ---------------------------------------------------------------
// EMI calculator
// ---------------------------------------------------------------
function EmiCalculator() {
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(8.6);
  const [years, setYears] = useState(20);

  const r = rate / 12 / 100;
  const n = years * 12;
  const emi = r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPay = emi * n;
  const totalInterest = totalPay - amount;
  const principalShare = Math.round((amount / totalPay) * 100);

  const fmt = (v: number) =>
    "₹" + Math.round(v).toLocaleString("en-IN");

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
            min={100000}
            max={10000000}
            step={50000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
        <div>
          <div className="calc-slider-header">
            <span>Interest rate</span>
            <span className="calc-slider-value">{rate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            aria-label="Interest rate"
            min={7}
            max={16}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
        <div>
          <div className="calc-slider-header">
            <span>Tenure</span>
            <span className="calc-slider-value">{years} yrs</span>
          </div>
          <input
            type="range"
            aria-label="Loan tenure in years"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
      </div>

      <div className="calc-divider">
        <div className="calc-emi-label">Monthly instalment</div>
        <div className="calc-emi-value">{fmt(emi)}</div>

        <div className="calc-breakdown">
          <div className="calc-breakdown-principal" style={{ width: `${principalShare}%` }} />
          <div className="calc-breakdown-interest" style={{ width: `${100 - principalShare}%` }} />
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

// ---------------------------------------------------------------
// FAQ accordion
// ---------------------------------------------------------------
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="faq-item">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="faq-button"
              aria-expanded={isOpen}
            >
              <span className="faq-question">{f.q}</span>
              <ChevronDown
                size={18}
                className={`faq-chevron ${isOpen ? "open" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div className={`faq-answer ${isOpen ? "open" : ""}`}>
              <p className="faq-answer-text">{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
export default function Home() {
  // 1. FAQ Schema yahan generate hoga
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };


  return (
    <main>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ---------------- HERO ---------------- */}
      <section id="home" className="container hero-section">
        <div className="hero-grid">
          <Reveal>
            {/* <Eyebrow>Delhi · Loan Advisory</Eyebrow> */}
            <h1 className="hero-title">
              Get Loans at Lowest Interest Rates –<br />Compare 30+ Banks & NBFCs.
            </h1>
            <p className="hero-text">
              We compare offers across 30+ banks and NBFCs, prepare your file,
              and follow it through to disbursement — so the only thing you
              sign is the sanction letter.
            </p>
            <div className="hero-actions">
              <a href="#calculator" className="btn-primary">
                Check your EMI
              </a>
              <a href="#contact" className="btn-secondary">
                Free Consultation<ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-number">1,200+</div>
                <div className="stat-label">loans placed</div>
              </div>
              <div>
                <div className="stat-number">4–7 days</div>
                <div className="stat-label">avg. sanction</div>
              </div>
              <div>
                <div className="stat-number">30+</div>
                <div className="stat-label">partner lenders</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="hero-card-wrapper">
              <div
                style={{
                  position: "absolute",
                  top: "-1.25rem",
                  right: "-0.75rem",
                  zIndex: 10,
                }}
              >
                {/* <Stamp>Instant Verify</Stamp> */}
              </div>

              {/* Naya TS verification widget */}
              <HeroVerificationCard />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <div className="container">
          <div className="bank-partners-label">Who we work with</div>
          <div className="bank-tags">
            {BANKS.map((b) => (
              <span key={b} className="bank-tag">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LOAN TYPES ---------------- */}
      <section id="Loan" className="container section-spacing">
        <Reveal>
          <Eyebrow>What we arrange</Eyebrow>
          <h2 className="section-header">
            Six lines in the ledger, one for every need.
          </h2>
        </Reveal>
        <div className="loan-grid">
          {LOAN_TYPES.map((l, i) => (
            <Reveal key={l.name} delay={i * 60}>
              <a href="#contact" className="loan-item">
                <div className="loan-header">
                  <span className="loan-number">{l.n}</span>
                  <h3 className="loan-name">{l.name}</h3>
                  <ArrowRight size={15} className="loan-arrow" aria-hidden="true" />
                </div>
                <p className="loan-desc">{l.desc}</p>
                <LedgerRow label={<span className="loan-rate-label">Rate</span>} value={l.rate} />
                <LedgerRow label={<span className="loan-rate-label">Amount</span>} value={l.range} />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- WHY ---------------- */}
      <section className="bg-paper-dark section-spacing">
        <div className="container">
          <Reveal>
            <Eyebrow>Why clients sign with us</Eyebrow>
          </Reveal>
          <div className="why-grid">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <w.icon className="why-icon" aria-hidden="true" />
                <h3 className="why-title">{w.title}</h3>
                <p className="why-text">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

        {/* ----------------------------Team section ---------------------------------*/}

      <Team/>

      {/* ---------------- PROCESS ---------------- */}
      <section id="process" className="container section-spacing">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="section-header">
            Four entries from first call to funds in hand.
          </h2>
        </Reveal>
        <div className="process-grid">
          <div className="process-line" />
          {STEPS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="process-step">
                <div className="process-number">{i + 1}</div>
                <h3 className="process-title">{s.label}</h3>
                <p className="process-detail">{s.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CALCULATOR ---------------- */}
      <section id="calculator" className="container section-spacing">
        <Reveal>
          <Eyebrow>Run the numbers</Eyebrow>
          <h2 className="section-header">
            See what the monthly entry looks like.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <EmiCalculator />
        </Reveal>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="container section-spacing">
        <Reveal>
          <Eyebrow>From the ledger margin</Eyebrow>
        </Reveal>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="testimonial-card">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-tag">{t.tag}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="faq-section">
        <div className="faq-container">
          <Reveal>
            <Eyebrow>Before you sign</Eyebrow>
            <h2 className="section-header">
              Questions clients ask first.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* ---------------- MOBILE STICKY CTA ---------------- */}
      <div className="mobile-cta">
        <a href="tel:917669486600" className="mobile-cta-call">
          <Phone size={15} aria-hidden="true" /> Call
        </a>
        <a href="https://wa.me/917669486600" className="mobile-cta-whatsapp">
          <MessageCircle size={15} aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </main>
  );
}