// app/about-us/page.js
// Drop this file at: app/about-us/page.js  (adjust import paths if your
// project structure differs from the home page you shared)

import Script from "next/script";
import Team from "@/components/team";

import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

import { Phone, MessageCircle, ShieldCheck, Users, Building2, Handshake } from "lucide-react";

import { WHY, STEPS, BANKS } from "@/components/content";

import "../main.css"; // same stylesheet as the home page — keeps theme identical

// ---------------------------------------------------------------------------
// SEO METADATA (Next.js App Router — this replaces <head> meta tags)
// ---------------------------------------------------------------------------
export const metadata = {
  title: "About Us | LoanSaarthi — Loan Comparison Experts in Delhi",
  description:
    "LoanSaarthi helps you compare and apply for Personal, Business, and Home loans across 42+ banks and NBFCs. Learn about our story, our team, and why 30,000+ clients trust us for fast, transparent loan approvals.",
  keywords: [
    "LoanSaarthi",
    "about LoanSaarthi",
    "loan consultant Delhi",
    "personal loan agent",
    "business loan agent",
    "home loan agent",
    "loan comparison platform India",
    "lowest interest rate loans",
    "NBFC loan partner",
    "loan DSA Delhi",
    "instant loan sanction",
    "42+ banks loan comparison",
  ],
  authors: [{ name: "LoanSaarthi" }],
  alternates: {
    canonical: "https://www.loansaarthi.com/about-us",
  },
  openGraph: {
    title: "About Us | LoanSaarthi",
    description:
      "30,000+ loans placed, 42+ partner banks & NBFCs, 1–2 day average sanction. Meet the team behind LoanSaarthi.",
    url: "https://www.loansaarthi.com/about-us",
    siteName: "LoanSaarthi",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "LoanSaarthi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | LoanSaarthi",
    description:
      "Compare and apply for Personal, Business, and Home loans across 42+ banks and NBFCs.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutUs() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.loansaarthi.com/about-us/#aboutpage",
        url: "https://www.loansaarthi.com/about-us",
        name: "About LoanSaarthi",
        description:
          "LoanSaarthi compares and arranges Personal, Business, and Home loans across 42+ banks and NBFCs with instant sanction and lowest interest rates.",
        isPartOf: {
          "@id": "https://www.loansaarthi.com/#organization",
        },
      },
      {
        "@type": "FinancialService",
        "@id": "https://www.loansaarthi.com/#organization",
        name: "LoanSaarthi",
        url: "https://www.loansaarthi.com",
        logo: "https://www.loansaarthi.com/logo.png",
        telephone: "+91-9810168635",
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: "2151/9B Goswami Girdhari Lal Marg, New Patel Nagar, Shadipur",
          addressLocality: "New Delhi",
          addressRegion: "Delhi",
          postalCode: "110008",
          addressCountry: "IN",
        },
      },
    ],
  };

  const VALUES = [
    {
      icon: ShieldCheck,
      title: "Transparent, always",
      text: "No hidden processing charges, no surprise clauses — every offer is explained in plain language before you sign anything.",
    },
    {
      icon: Users,
      title: "People-first process",
      text: "A dedicated relationship manager stays with your file from the first call to disbursement, not a rotating queue of agents.",
    },
    {
      icon: Building2,
      title: "42+ lender network",
      text: "Banks and NBFCs compete for your file behind the scenes, so you see the best rate they're willing to offer — not just the first one.",
    },
    {
      icon: Handshake,
      title: "Built on referrals",
      text: "Most of our new clients come from past clients. That only happens when the loan actually gets sanctioned on the terms promised.",
    },
  ];

  return (
    <main>
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ---------------- HERO + STORY (merged) ---------------- */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "clamp(3rem, 8vw, 5.5rem) 1.5rem clamp(2.5rem, 6vw, 4rem)",
          boxSizing: "border-box",
          position: "relative",
          background: "transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
          }}
        >
          <Reveal>
            {/* Text wrapper: har child ke beech 1.25rem gap */}
            <div
              style={{
                maxWidth: "880px",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Pill Eyebrow */}
              <span
                style={{
                  alignSelf: "flex-start",
                  padding: "4px 14px",
                  borderRadius: "50px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4ade80",
                  backgroundColor: "rgba(74, 222, 128, 0.1)",
                  border: "1px solid rgba(74, 222, 128, 0.25)",
                }}
              >
                About LoanSaarthi
              </span>

              {/* H1 */}
              <h1
                style={{
                  fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Started in Delhi, built for borrowers everywhere in India.
              </h1>

              {/* Story paragraph */}
              <p
                style={{
                  fontSize: "1rem",
                  color: "#d5dde8",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Our journey started in 2020, during Covid, with just 20 people
                and one idea — to make loans honest, fast, and fully digital.
                Today, we are a team of 165+ dedicated professionals, backed by
                people with over 22 years of industry experience. At
                LoanSaarthi, we don&apos;t just forward your application. We
                analyse your current situation, find the real reason for
                rejection, and match you with banks and NBFCs that actually suit
                your profile — so you don&apos;t have to apply everywhere.
              </p>

              {/* ISO highlight */}
              <p
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#facc15",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                LoanSaarthi is ISO 9001:2015 and ISO 27001:2022 certified,
                tested and verified. Our credibility is validated by thousands
                of genuine reviews on Google.
              </p>

              {/* H3 — upar thoda extra gap taaki naya block alag dikhe */}
              <h3
                style={{
                  fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  margin: "1.5rem 0 0 0",
                }}
              >
                Debt Consolidation
              </h3>

              {/* Para heading line */}
              <p
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#facc15",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Simplify Your Finance with Debt Consolidation
              </p>

              {/* Para body */}
              <p
                style={{
                  fontSize: "1rem",
                  color: "#d5dde8",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Loan Saarthi helps you explore debt consolidation solutions by
                combining multiple eligible debts like personal loan, app loan
                and credit card outstanding into one manageable single EMI with
                tenure up to 96 months *. Simplify your finances with a clearer
                view of your monthly obligations. Our experts guide you in
                understanding suitable options based on your financial profile
                and eligibility. Take a step towards better financial
                management with Loan Saarthi —{" "}
                <span style={{ color: "#facc15", fontWeight: 600 }}>
                  Right Guidance. Better Decisions.
                </span>
              </p>
            </div>
          </Reveal>

          {/* 4 Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {[
              { label: "Founded", value: "New Delhi" },
              { label: "Loans Placed", value: "30,000+" },
              { label: "Partner Banks & NBFCs", value: "42+" },
              { label: "Avg. Sanction Time", value: "1–2 Days" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "1.25rem 1.5rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500, letterSpacing: "0.02em" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="container section-spacing">
        <Reveal>
          <Eyebrow>What we stand for</Eyebrow>
          <h2 className="section-header">The principles behind every file we handle.</h2>
        </Reveal>
        <div className="why-grid">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <v.icon className="why-icon" aria-hidden="true" />
              <h3 className="why-title">{v.title}</h3>
              <p className="why-text">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- WHY CLIENTS SIGN WITH US (reused from home) ---------------- */}
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

      {/* ---------------- PROCESS ---------------- */}
      <section className="container section-spacing">
        <Reveal>
          <Eyebrow>How we work</Eyebrow>
          <h2 className="section-header">Four steps from first call to funds in hand.</h2>
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

      {/* ---------------- TEAM ---------------- */}
      <Team />

      {/* ---------------- BANK PARTNERS ---------------- */}
      <section className="bg-ink" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <div className="container">
          <div className="bank-partners-label">Lenders in our network</div>
          <div
            className="bank-tags"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
            }}
          >
            {BANKS.map((b) => (
              <div
                key={b.name}
                className="bank-logo-wrapper"
                style={{
                  position: "relative",
                  height: "3rem",
                  width: "8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={b.logo}
                  alt={b.name}
                  className="bank-logo-img"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT CTA ---------------- */}
      <section className="bg-dark contact-section">
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <h2 className="contact-title" style={{ color: "#ffffff" }}>
              Ready to compare your loan offers?
            </h2>
            <p className="contact-text">
              Talk to a relationship manager today — no charge for the first
              consultation.
            </p>
            <div className="contact-actions">
              <a href="tel:917669486600" className="btn-call">
                <Phone size={16} aria-hidden="true" /> Call Us
              </a>
              <a href="https://wa.me/917669486600" className="btn-whatsapp">
                <MessageCircle size={16} aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- MOBILE STICKY CTA (same as home) ---------------- */}
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
