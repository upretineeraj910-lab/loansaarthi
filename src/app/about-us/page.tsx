// app/about-us/page.js
// Drop this file at: app/about-us/page.js  (adjust import paths if your
// project structure differs from the home page you shared)

import Script from "next/script";
import Team from "@/components/team";

import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import LedgerRow from "@/components/LedgerRow";

import { Phone, MessageCircle, ShieldCheck, Users, Building2, Handshake } from "lucide-react";

import { WHY, STEPS, BANKS } from "@/components/content";

import "../main.css"; // same stylesheet as the home page — keeps theme identical

// ---------------------------------------------------------------------------
// SEO METADATA (Next.js App Router — this replaces <head> meta tags)
// ---------------------------------------------------------------------------
export const metadata = {
  title: "About Us | LoanSaarthi — Loan Comparison Experts in Delhi",
  description:
    "LoanSaarthi helps you compare and apply for Personal, Business, and Home loans across 42+ banks and NBFCs. Learn about our story, our team, and why 1,200+ clients trust us for fast, transparent loan approvals.",
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
    canonical: "https://app.loansaarthi.com/about-us",
  },
  openGraph: {
    title: "About Us | LoanSaarthi",
    description:
      "1,200+ loans placed, 42+ partner banks & NBFCs, 4–7 day average sanction. Meet the team behind LoanSaarthi.",
    url: "https://app.loansaarthi.com/about-us",
    siteName: "LoanSaarthi",
    images: [
      {
        url: "https://app.loansaarthi.com/logo.png",
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
    images: ["https://app.loansaarthi.com/logo.png"],
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
        "@id": "https://app.loansaarthi.com/about-us/#aboutpage",
        url: "https://app.loansaarthi.com/about-us",
        name: "About LoanSaarthi",
        description:
          "LoanSaarthi compares and arranges Personal, Business, and Home loans across 42+ banks and NBFCs with instant sanction and lowest interest rates.",
        isPartOf: {
          "@id": "https://app.loansaarthi.com/#organization",
        },
      },
      {
        "@type": "FinancialService",
        "@id": "https://app.loansaarthi.com/#organization",
        name: "LoanSaarthi",
        url: "https://app.loansaarthi.com",
        logo: "https://app.loansaarthi.com/logo.png",
        telephone: "+91-7669486600",
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

      {/* ---------------- HERO ---------------- */}
      <section className="container hero-section">
        <Reveal>
          <Eyebrow>About LoanSaarthi</Eyebrow>
          <h1 className="hero-title">
            We make loan approvals feel <br />
            less like paperwork, more like progress.
          </h1>
          <p className="hero-text">
            LoanSaarthi was built on a simple idea: comparing loans across
            banks shouldn&apos;t take weeks of running between branches. We
            do the comparing, the paperwork, and the follow-up — so you only
            show up to sign the sanction letter.
          </p>
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
              <div className="stat-number">42+</div>
              <div className="stat-label">partner lenders</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- STORY / LEDGER ---------------- */}
      <section className="bg-paper-dark section-spacing">
        <div className="container">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="section-header">
              Started in Delhi, built for borrowers everywhere.
            </h2>
            <p className="section-subheader">
              LoanSaarthi started as a small team helping neighbours and
              friends navigate confusing loan paperwork. Today we work with
              42+ banks and NBFCs, but the job hasn&apos;t changed: get you
              the best sanction, as fast as honestly possible.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ marginTop: "1.5rem" }}>
              <LedgerRow label="Founded :- " value=" New Delhi" />
              <LedgerRow label="Loans placed:- " value=" 1,200+" />
              <LedgerRow label="Partner banks & NBFCs :- " value=" 42+" />
              <LedgerRow label="Average sanction time :- " value=" 4–7 days" />
            </div>
          </Reveal>
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
          <div className="bank-tags flex flex-wrap items-center justify-center gap-6">
            {BANKS.map((b) => (
              <div
                key={b.name}
                className="bank-logo-wrapper relative h-12 w-32 flex items-center justify-center p-2 bg-white/5 rounded-lg"
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
        <div className="container text-center">
          <Reveal>
            <h2 className="contact-title text-white">Ready to compare your loan offers?</h2>
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