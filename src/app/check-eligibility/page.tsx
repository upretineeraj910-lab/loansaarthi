import Link from "next/link";
import Script from "next/script";
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Percent,
  Clock,
  Banknote,
  ArrowRight,
  HelpCircle,
  Building,
} from "lucide-react";
import EligibilityChecker from "@/components/EligibilityChecker";
import styles from "./check-eligibility.module.css";

const ELIGIBILITY_FAQS = [
  {
    q: "How do banks calculate my loan eligibility?",
    a: "Banks primarily calculate your loan eligibility using the Fixed Obligation to Income Ratio (FOIR). Most banks allow 40% to 50% of your net monthly take-home salary to be utilized towards all loan EMIs (including existing EMIs and the new loan). Your credit score (CIBIL), job stability, age, and loan tenure also decide your final sanctioned limit.",
  },
  {
    q: "What is FOIR and how does it affect my maximum loan amount?",
    a: "FOIR stands for Fixed Obligation to Income Ratio. For example, if your net monthly salary is ₹60,000 and the bank allows 50% FOIR, your total monthly debt capacity is ₹30,000. If you already pay ₹10,000 in existing car/personal EMIs, your available EMI capacity for the new loan is ₹20,000.",
  },
  {
    q: "What is the minimum CIBIL score required for loan approval?",
    a: "A CIBIL score of 750 or higher is considered excellent and unlocks the lowest interest rates, highest FOIR multiplier, and instant pre-approvals across 42+ partner banks. Scores between 650 and 749 are eligible for standard bank and NBFC loans. If your score is below 650, secured loans or adding a credit-worthy co-applicant can secure approval.",
  },
  {
    q: "Can I increase my loan eligibility with a co-applicant?",
    a: "Yes! Adding a earning co-applicant—such as your spouse, parent, or sibling—combines both monthly incomes. This significantly reduces your FOIR ratio and can increase your eligible loan sanction amount by 50% to 100%.",
  },
  {
    q: "Will checking my loan eligibility on LoanSaarthi impact my CIBIL score?",
    a: "No, absolutely not. Using LoanSaarthi's online eligibility calculator is a soft estimate with 0% impact on your official credit score. Your credit report is only queried after you formally proceed with a bank loan application.",
  },
];

export default function CheckEligibilityPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://www.loansaarthi.com/check-eligibility/#app",
        name: "LoanSaarthi Loan Eligibility Checker",
        url: "https://www.loansaarthi.com/check-eligibility",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        description:
          "Free online loan eligibility calculator to check maximum loan amounts and monthly EMIs across 42+ partner banks and NBFCs in India.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.loansaarthi.com/check-eligibility/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.loansaarthi.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Check Loan Eligibility",
            item: "https://www.loansaarthi.com/check-eligibility",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.loansaarthi.com/check-eligibility/#faq",
        mainEntity: ELIGIBILITY_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <main className={styles.main}>
      <Script
        id="eligibility-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ---------------- HERO HEADER ---------------- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className={styles.breadcrumbActive}>
              Check Loan Eligibility
            </span>
          </nav>

          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              Free Online Pre-Qualification
            </span>
            <h1 className={styles.heroH1}>
              Check Your Loan Eligibility Across 42+ Banks
            </h1>
            <p className={styles.heroDesc}>
              Calculate your maximum eligible loan amount, monthly EMI, and
              approval chances for Personal, Home, and Business loans in under 2
              minutes.
            </p>

            <div className={styles.heroPills}>
              <span className={styles.heroPill}>
                <ShieldCheck size={14} /> Zero CIBIL Impact
              </span>
              <span className={styles.heroPill}>
                <Percent size={14} /> Lowest Interest Rates
              </span>
              <span className={styles.heroPill}>
                <Building size={14} /> 42+ Partner Lenders
              </span>
              <span className={styles.heroPill}>
                <Clock size={14} /> Instant Assessment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- INTERACTIVE CHECKER ---------------- */}
      <section className={styles.checkerSection}>
        <EligibilityChecker />
      </section>

      {/* ---------------- EDUCATIONAL SEO GUIDE ---------------- */}
      <section className={styles.guideSection}>
        {/* Block 1: How Banks Calculate Loan Eligibility */}
        <article className={styles.contentBlock}>
          <h2 className={styles.blockTitle}>
            How Banks Calculate <span>Loan Eligibility</span> in India
          </h2>
          <p className={styles.blockP}>
            When you apply for a loan—whether it is a Personal Loan, Home Loan, or
            Business Loan—lending institutions evaluate your repayment capability
            before sanctioning funds. The benchmark metric used by Indian banks
            and NBFCs is the <strong>Fixed Obligation to Income Ratio (FOIR)</strong>.
          </p>

          <div className={styles.formulaBox}>
            <div className={styles.formulaTitle}>
              Standard Banking FOIR Formula
            </div>
            <div className={styles.formulaCode}>
              Max Allowable EMI = (Monthly Net Take-Home × FOIR %) - Ongoing EMIs
            </div>
            <p className={styles.formulaDesc}>
              Banks typically cap FOIR between 40% to 50% for standard applicants,
              and up to 60% to 65% for high-income salaried individuals or
              secured property loans.
            </p>
          </div>

          <p className={styles.blockP}>
            Once the maximum allowable EMI is established, lenders apply the
            reverse amortization formula based on the tenure (in years) and the
            applicable annual interest rate to derive your <strong>Maximum Eligible Loan Amount</strong>.
          </p>
        </article>

        {/* Block 2: Salaried vs Self-Employed Criteria */}
        <article className={styles.contentBlock}>
          <h2 className={styles.blockTitle}>
            Eligibility Criteria: <span>Salaried vs. Self-Employed</span>
          </h2>
          <p className={styles.blockP}>
            Documentation and underwriting parameters vary depending on your
            employment profile. Review the core criteria below:
          </p>

          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Salaried Applicants</th>
                  <th>Self-Employed / Business</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Minimum Income</strong>
                  </td>
                  <td>₹25,000 / month net salary</td>
                  <td>₹4 – 5 Lakhs annual net profit (ITR)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Income Proof</strong>
                  </td>
                  <td>3 months salary slips + Form 16</td>
                  <td>Last 2 years ITR with Computation</td>
                </tr>
                <tr>
                  <td>
                    <strong>Bank Statements</strong>
                  </td>
                  <td>Last 6 months salary account</td>
                  <td>Last 6–12 months current account</td>
                </tr>
                <tr>
                  <td>
                    <strong>Work Experience / Vintage</strong>
                  </td>
                  <td>Min 1–2 years total; 6 mo at current job</td>
                  <td>Min 2–3 years continuous business vintage</td>
                </tr>
                <tr>
                  <td>
                    <strong>Ideal CIBIL Score</strong>
                  </td>
                  <td>700+ (750+ for best rates)</td>
                  <td>720+ (750+ for collateral-free)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Block 3: 5 Proven Tips to Boost Eligibility */}
        <article className={styles.contentBlock}>
          <h2 className={styles.blockTitle}>
            5 Proven Ways to <span>Boost Your Loan Limit</span>
          </h2>
          <p className={styles.blockP}>
            If your initial eligibility calculation falls short of your required
            funding, here are actionable strategies our loan specialists recommend:
          </p>

          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <div className={styles.tipCardHeader}>
                <Banknote size={18} className={styles.tipCardIcon} />
                <h3 className={styles.tipCardTitle}>Foreclose Small Debts</h3>
              </div>
              <p className={styles.tipCardText}>
                Paying off credit card balances or small personal loans frees up
                monthly FOIR bandwidth, instantly raising your allowable EMI.
              </p>
            </div>

            <div className={styles.tipCard}>
              <div className={styles.tipCardHeader}>
                <TrendingUp size={18} className={styles.tipCardIcon} />
                <h3 className={styles.tipCardTitle}>Add an Earning Co-Applicant</h3>
              </div>
              <p className={styles.tipCardText}>
                Clubbing incomes with your spouse, father, or mother can double
                your loan eligibility and increase sanction probability.
              </p>
            </div>

            <div className={styles.tipCard}>
              <div className={styles.tipCardHeader}>
                <Clock size={18} className={styles.tipCardIcon} />
                <h3 className={styles.tipCardTitle}>Opt for Longer Tenure</h3>
              </div>
              <p className={styles.tipCardText}>
                A longer repayment period spreads the principal out, decreasing
                the per-month EMI and letting you qualify for higher loan amounts.
              </p>
            </div>

            <div className={styles.tipCard}>
              <div className={styles.tipCardHeader}>
                <ShieldCheck size={18} className={styles.tipCardIcon} />
                <h3 className={styles.tipCardTitle}>Keep CIBIL Score 750+</h3>
              </div>
              <p className={styles.tipCardText}>
                Lenders offer up to 25% higher loan limits and 0.5%–1.5% lower
                interest rates to applicants with strong credit histories.
              </p>
            </div>
          </div>
        </article>

        {/* Block 4: Frequently Asked Questions */}
        <article className={styles.contentBlock}>
          <h2 className={styles.blockTitle}>
            <span>Frequently Asked Questions</span> on Loan Eligibility
          </h2>

          <div className={styles.faqList}>
            {ELIGIBILITY_FAQS.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.q}</h3>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </article>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>
            Need Expert Assistance with Your Application?
          </h2>
          <p className={styles.ctaText}>
            Our experienced loan advisors compare 42+ partner banks to find the
            lowest interest rates, maximum loan limits, and zero upfront processing fees.
          </p>
          <a href="tel:919810168635" className={styles.ctaBtn}>
            <span>Talk to a Loan Specialist (+91 98101 68635)</span>
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
