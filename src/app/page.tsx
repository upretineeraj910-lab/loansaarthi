import Link from "next/link";
import Script from "next/script";
import HeroVerificationCard from "../components/HeroVerificationCard";
import Team from "@/components/team";

import { Phone, MessageCircle, ArrowRight } from "lucide-react";

import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import LedgerRow from "@/components/LedgerRow";
import EmiCalculator from "@/components/loan/LoanEmiCalculator";
import Faq from "@/components/Faq";

import { LOAN_TYPES } from "@/components/loans";
import { WHY, STEPS, BANKS, FAQS } from "@/components/content";

import "./main.css";
import GoogleReviews from "@/components/GoogleReviews";
import Image from "next/image";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
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
        description:
          "Compare and apply for Personal, Business, and Home loans across 42+ banks and NBFCs with instant sanction and lowest interest rates.",
      },
      {
        "@type": "FAQPage",
        "@id": "https://app.loansaarthi.com/#faq",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <main>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ---------------- HERO ---------------- */}
      <section id="home" className="container hero-section">
        <div className="hero-grid">
          <Reveal>
            <h1 className="hero-title">
              Get Loans at Lowest Interest Rates –<br />
              Compare 42 Banks & NBFCs.
            </h1>
            <p className="hero-text">
              We compare offers across 42 banks and NBFCs, prepare your file,
              and follow it through to disbursement — so the only thing you
              sign is the sanction letter.
            </p>
            <div className="hero-actions">
              <a href="#calculator" className="btn-primary">
                Check your EMI
              </a>
              <a href="#contact" className="btn-secondary">
                Free Consultation
                <ArrowRight size={15} aria-hidden="true" />
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
                <div className="stat-number">42</div>
                <div className="stat-label">partner lenders</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="hero-card-wrapper">
              <HeroVerificationCard />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- PARTNERS ---------------- */}
      <section
        className="bg-ink"
        style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}
      >
        <div className="container">
          <div className="bank-partners-label">Who we work with</div>
          <div className="bank-tags flex flex-wrap items-center justify-center gap-6">
            {BANKS.map((b) => (
              <div
                key={b.name}
                className="bank-logo-wrapper relative h-12 w-32 flex items-center justify-center p-2 bg-white/5 rounded-lg"
              >
                <Image
                  src={b.logo}
                  alt={b.name}
                  width={120}
                  height={40}
                  className="object-contain max-h-8 w-auto filter brightness-90 hover:brightness-100 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ---------------- LOAN TYPES ---------------- */}
      <section id="Loan" className="container section-spacing">
        <Reveal>
          <Eyebrow>What we arrange</Eyebrow>
          <h2 className="section-header">
            Compare & Apply from Available Loan Categories
          </h2>
        </Reveal>
        <div className="loan-grid">
          {LOAN_TYPES.map((l, i) => (
            <Reveal key={l.name} delay={i * 60}>
              <Link href={l.href} className="loan-item" suppressHydrationWarning>
                <div className="loan-header">
                  <span className="loan-number-badge">{l.n}</span>
                  <h3 className="loan-name">{l.name}</h3>
                  {/* <div className="loan-arrow-wrapper">
                    <ArrowRight size={16} className="loan-arrow" aria-hidden="true" />
                  </div> */}
                </div>

                <p
                  className="loan-desc"
                  dangerouslySetInnerHTML={{ __html: l.desc }}
                />

                {/* Premium Data Footer instead of normal LedgerRow */}
                <div className="loan-stats-footer">
                  <div className="stat-box">
                    <span className="stat-label">Interest Rate</span>
                    <span className="stat-value">{l.rate}</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-box">
                    <span className="stat-label">Max Amount</span>
                    <span className="stat-value">{l.range}</span>
                  </div>
                </div>
              </Link>
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

      {/* ---------------- TEAM ---------------- */}
      <Team />

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
          <EmiCalculator variant="home" />
        </Reveal>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <GoogleReviews />

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="faq-section">
        <div className="faq-container">
          <Reveal>
            <Eyebrow>Before you sign</Eyebrow>
            <h2 className="section-header">Questions clients ask first.</h2>
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
        <button><a href="http://" target="_blank" rel="noopener noreferrer"></a></button>
      </div>
    </main>
  );
}