import Script from "next/script";
import Team from "@/components/team";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { Phone, MessageCircle, ShieldCheck, Users, Building2, Handshake } from "lucide-react";
import { WHY, STEPS, BANKS } from "@/components/content";
import "../main.css"; // Global design system styles
import styles from "./about-us.module.css";

/**
 * SEO Metadata for the About Us page
 * Optimizes ranking for loan distribution, company background, and brand authority.
 */
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

/**
 * AboutUs Page Component
 * Renders company background, debt consolidation capabilities, key stats, corporate values, and lender alliances.
 */
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
      text: "Banks and NBFCs compete for your file behind the scenes, and trained relationship managers guide you to the best offer for your profile and needs.",
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

      {/* ---------------- HERO + STORY SECTION ---------------- */}
      <section className={styles.aboutHero}>
        <div className={styles.aboutContainer}>
          <Reveal>
            <div className={styles.storyBlock}>
              {/* Eyebrow Badge */}
              <span className={styles.pillEyebrow}>
                About LoanSaarthi
              </span>

              {/* Main Headline */}
              <h1 className={styles.mainTitle}>
                Started in Delhi, built for borrowers every where in India.
              </h1>

              {/* Company Story */}
              <p className={styles.storyParagraph}>
                Our journey started in 2020, during Covid, with just 20 people and one idea — to make loans honest, fast, and fully digital. Today, we are a team of 165+ dedicated professionals. Many of our core members have been working together for over 22 years, long before LoanSaarthi was founded.
              </p>
              <p className={styles.storyParagraph}>
                At LoanSaarthi, we don&apos;t just forward your application. We analyse your current situation, find the real reason for rejection, and match you with banks and NBFCs that actually suit your profile — so you don&apos;t have to apply everywhere.
              </p>

              {/* ISO Certification Badge */}
              <p className={styles.isoHighlight}>
                LoanSaarthi is ISO 9001:2015 and ISO 27001:2022 certified,
                tested and verified. Our credibility is validated by genuine reviews on Google.
              </p>

              {/* Debt Consolidation Feature */}
              <h3 className={styles.sectionHeading}>
                Debt Consolidation
              </h3>

              <p className={styles.sectionLead}>
                Simplify Your Finance with Debt Consolidation
              </p>

              <p className={styles.storyParagraph}>
                Loan Saarthi helps you explore debt consolidation solutions by
                combining multiple eligible debts like personal loan, app loan
                and credit card outstanding into one manageable single EMI with
                tenure up to 96 months *. Simplify your finances with a clearer
                view of your monthly obligations. Our experts guide you in
                understanding suitable options based on your financial profile
                and eligibility. Take a step towards better financial
                management with Loan Saarthi —{" "}
                <span className={styles.goldSpan}>
                  Right Guidance. Better Decisions.
                </span>
              </p>

              {/* Digital Journey Card */}
              <div className={styles.digitalBox}>
                <h3 className={styles.digitalHeading}>Digital Journey</h3>
                <p className={styles.digitalText}>
                  Login to Disbursal — Fully Digital Loan Process.
                  Powered by our alliances with leading banks and NBFCs, we process your case in hours, not days or months.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ---------------- 4 KEY METRIC CARDS ---------------- */}
          <div className={styles.statsGrid}>
            {[
              { label: "Founded", value: "New Delhi" },
              { label: "Loans Placed", value: "30,000+" },
              { label: "Partner Banks & NBFCs", value: "42+" },
              { label: "Avg. Sanction Time", value: "1–2 Days" },
            ].map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statLabel}>
                  {s.label}
                </span>
                <span className={styles.statValue}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CORE VALUES ---------------- */}
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

      {/* ---------------- WHY CLIENTS SIGN WITH US ---------------- */}
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

      {/* ---------------- PROCESS STEPS ---------------- */}
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

      {/* ---------------- EXPERT TEAM ---------------- */}
      <Team />

      {/* ---------------- BANK PARTNERS ---------------- */}
      <section className={`bg-ink ${styles.partnersSection}`}>
        <div className="container">
          <div className="bank-partners-label">Lenders in our network</div>
          <div className={styles.partnersGrid}>
            {BANKS.map((b) => (
              <div key={b.name} className={styles.partnerLogoWrap}>
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

      {/* ---------------- CONTACT CALL-TO-ACTION ---------------- */}
      <section className="bg-dark contact-section">
        <div className={`container ${styles.contactCenter}`}>
          <Reveal>
            <h2 className={`contact-title ${styles.contactHeading}`}>
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
