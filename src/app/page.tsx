import Script from "next/script";
import Image from "next/image";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";

import HeroVerificationCard from "../components/HeroVerificationCard";
import Team from "@/components/team";
import LoanTypes from "@/components/LoanTypes";
import OurOfferings from "@/components/OurOfferings";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import EmiCalculator from "@/components/loan/LoanEmiCalculator";
import Faq from "@/components/Faq";
import GoogleReviews from "@/components/GoogleReviews";
import WhyChooseUs from "@/components/Experience";
import LuxuryHero from "@/components/LuxuryHero";
import { WHY, BANKS, FAQS } from "@/components/content";

import "./main.css";

/**
 * LoanSaarthi Home Page
 * Central portal featuring luxury hero, lender network, loan comparison engine,
 * interactive EMI calculator, customer testimonials, and verified loan application flow.
 */
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
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
        description:
          "Compare and apply for Personal, Business, and Home loans across 42+ banks and NBFCs with instant sanction and lowest interest rates.",
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.loansaarthi.com/#faq",
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

      {/* ---------------- LUXURY HERO SECTION ---------------- */}
      <LuxuryHero />

      {/* ---------------- PARTNERS NETWORK ---------------- */}
      <section className="bg-ink bank-partners-section">
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

      {/* ---------------- CUSTOMER REVIEWS & TESTIMONIALS ---------------- */}
      <div className="testimonials testimonials-container">
        <GoogleReviews />
      </div>

      {/* ---------------- LOAN PRODUCTS & CATEGORIES ---------------- */}
      <div id="Loan">
        <LoanTypes />
      </div>

      {/* ---------------- OUR OFFERINGS & POLICIES ---------------- */}
      <OurOfferings />

      {/* ---------------- VALUE PROPOSITIONS ---------------- */}
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

      {/* ---------------- VERIFICATION & INSTANT DISTRIBUTION ---------------- */}
      <section id="verification" className="container hero-section verification-section">
        <div className="hero-grid">
          <Reveal>
            <h2 className="hero-title">
              India&apos;s Most Trusted Loan Distribution Partner.<br />
              <strong style={{ fontWeight: "normal" }}>42+ Lenders, One Platform</strong>
            </h2>
            <p className="hero-text">
              We manage the entire digital distribution journey—from lender comparison and documentation to final disbursement.
            </p>
            <div className="hero-actions">
              <a href="#calculator" className="btn-primary">
                Check your EMI
              </a>
              <a href="/talk-to-expert" className="btn-secondary">
                Free Consultation
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-number">30,000+</div>
                <div className="stat-label">loans placed</div>
              </div>
              <div>
                <div className="stat-number">1–2 days</div>
                <div className="stat-label">avg. sanction</div>
              </div>
              <div>
                <div className="stat-number">42+</div>
                <div className="stat-label">partner lenders</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div id="HeroVerification" className="hero-card-wrapper">
              <HeroVerificationCard />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- LEADERSHIP & TEAM ---------------- */}
      <Team />

      {/* ---------------- CLIENT EXPERIENCE & TESTIMONIALS ---------------- */}
      <WhyChooseUs />

      {/* ---------------- INTERACTIVE EMI CALCULATOR ---------------- */}
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

      {/* ---------------- FREQUENTLY ASKED QUESTIONS ---------------- */}
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

      {/* ---------------- MOBILE STICKY CALL-TO-ACTION ---------------- */}
      <div className="mobile-cta">
        <a href="tel:919810168635" className="mobile-cta-call">
          <Phone size={15} aria-hidden="true" /> Call
        </a>
        <a href="https://wa.me/919810168635" className="mobile-cta-whatsapp">
          <MessageCircle size={15} aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </main>
  );
}
