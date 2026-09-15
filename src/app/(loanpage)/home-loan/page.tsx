"use client";

import { useState } from "react";
import "./home-loan-salaried.css";
import HeroVerificationCard from "@/components/HeroVerificationCard";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "@/app/(loanpage)/loan-page.css"

const categories = [
  {
    name: "Government Employees",
    shortDescription:
      "For central and state government employees with a regular salary credit.",
    requirements: [
      "Stable government employment with regular monthly salary",
      "Minimum 3 months' latest salary slips",
      "Last 6 months' salary account bank statement",
      "PAN, Aadhaar and other valid KYC documents",
      "Minimum age: 21 years; Maximum age: 60–65 years (lender-dependent)",
      "1 recent passport-size photograph",
    ],
  },
  {
    name: "Private Sector Employees",
    shortDescription:
      "For employees working with private companies receiving regular salary.",
    requirements: [
      "Minimum net monthly income of ₹25,000 (varies by lender and city)",
      "Minimum 1–2 years of total work experience; 6 months with current employer",
      "Last 3 months' salary slips",
      "Last 6 months' salary account bank statement",
      "PAN, Aadhaar and other valid KYC documents",
      "1 recent passport-size photograph",
    ],
  },
  {
    name: "MNC Employees",
    shortDescription:
      "For employees working with multinational companies in India.",
    requirements: [
      "Stable employment with an MNC having a valid India presence",
      "Minimum 6 months' continuity with the current employer",
      "Last 3 months' salary slips",
      "Last 6 months' bank statement (salary account)",
      "PAN, Aadhaar and other valid KYC documents",
      "Form 16 or ITR (if requested by the lender)",
    ],
  },
  {
    name: "PSU Employees",
    shortDescription:
      "For employees of public sector undertakings and government bodies.",
    requirements: [
      "Stable PSU employment with regular salary credit",
      "Minimum 3 months' latest salary slips",
      "Last 6 months' salary account bank statement",
      "PAN, Aadhaar and other valid KYC documents",
      "Minimum age: 21 years; Maximum age: 60 years (lender-dependent)",
    ],
  },
  {
    name: "Defence & Police Personnel",
    shortDescription:
      "For defence, paramilitary, and police personnel with regular income.",
    requirements: [
      "Serving or retired defence/police personnel with valid ID",
      "Last 3 months' salary slips or pension statement",
      "Last 6 months' bank statement",
      "PAN, Aadhaar and other valid KYC documents",
      "Posting certificate / service certificate (if requested)",
    ],
  },
];

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleClick = (category: string) => {
    setSelectedCategory(category);
    setShowForm(false);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setShowForm(false);
  };

  const selectedData = categories.find(
    (category) => category.name === selectedCategory
  );

  return (
    <main className="hls-page">
      {/* SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "Home Loan for Salaried",
            description:
              "Compare home loan options for salaried employees in India with LoanSaarthi. Explore low-interest home loans from 42+ Banks and NBFCs and complete the initial loan assistance process digitally.",
            brand: { "@type": "Brand", name: "LoanSaarthi" },
            category: "Home Loan",
          }),
        }}
      />

      {/* HERO */}
      <section className="personal-loan-hero">
        <div className="hero-badge">⚡ Home Loan Interest Rates Starting @ 8.35%* p.a.</div>

        <h1>
          Home Loan for Salaried Employees – Compare Low-Interest Home Loans in India
        </h1>

        <p className="hero-description">
          Looking for a Home Loan as a salaried employee in India? LoanSaarthi
          helps you compare home loan options from 42+ Banks and NBFCs across
          India. Explore low-interest home loan options, check your
          eligibility, calculate your EMI and complete the initial loan
          assistance process through a 100% digital journey.
        </p>

        <div className="hero-points">
          <div className="hero-point">
            <span>01</span>
            <p>Compare home loan options from 42+ banks and NBFCs</p>
          </div>
          <div className="hero-point">
            <span>02</span>
            <p>100% digital initial loan assistance</p>
          </div>
          <div className="hero-point">
            <span>03</span>
            <p>Get assistance based on your salary profile</p>
          </div>
        </div>
      </section>

      {/* INTRO + CALCULATOR */}
      <section className="loan-page-calculator-section">
        <div className="loan-page-row">
          <div className="loan-info-text">
            <h2>Compare Home Loan Options for Salaried Employees</h2>
            <p>
              Looking for the <strong>cheapest home loan in India</strong> for
              salaried employees? LoanSaarthi helps you compare home loan
              options from multiple Banks and NBFCs based on your salary,
              eligibility, credit profile and property requirements.
            </p>
            <p>
              As a <strong>loan assistance partner</strong>, LoanSaarthi helps
              you explore suitable home loan options from multiple banks and
              NBFCs instead of limiting your application to a single lender.
            </p>
            <p>
              Our team can help you compare available options and proceed with
              a lender that may be suitable for your salaried profile, subject
              to the lender's eligibility criteria, policies and final
              approval.
            </p>

            <h2>100% Digital Home Loan Assistance for Salaried</h2>
            <p>
              The initial home loan assistance process can be completed{" "}
              <strong>digitally from anywhere in India</strong>. You can
              explore suitable home loan options, check eligibility and begin
              the application process online without visiting the LoanSaarthi
              office.
            </p>
            <p>
              You also don't necessarily need an existing bank account with
              the selected lender. Account requirements, eligibility, interest
              rate, loan amount and final approval depend on the respective
              bank or NBFC's policies.
            </p>
          </div>

          <div className="loan-page-calculator-wrapper">
            <div className="loan-page-calculator">
              <LoanEmiCalculator
                variant="loan"
                title="Home Loan EMI Calculator"
                amountLabel="Loan Amount"
                amountDefault={3000000}
                amountMin={500000}
                amountMax={20000000}
                amountStep={100000}
                tenureDefault={20}
                tenureMin={5}
                tenureMax={30}
                rateLabel="Interest Rate (% p.a.)"
                rateDefault={8.35}
                rateMin={8.0}
                rateMax={14.0}
                rateStep={0.1}
                emiLabel="Monthly EMI"
              />
            </div>

            <div className="ls-calc-seo-box">
              <span className="ls-seo-label">HOME LOAN CALCULATOR</span>
              <h3>Home Loan EMI Breakdown</h3>
              <p>
                Use the calculator above to estimate your monthly EMI based on
                loan amount, interest rate and tenure before selecting a
                lender.
              </p>
              <div className="ls-seo-keyword-row">
                <span>Home Loan for Salaried</span>
                <span>Low Interest Home Loan</span>
                <span>Home Loan in India</span>
                <span>Home Loan EMI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="apply-section">
        <div className="section-heading">
          <h2>Home Loan Eligibility for Salaried Employees</h2>
          <p>
            Home loan eligibility for salaried employees depends on factors
            such as monthly income, employment stability, age, credit profile,
            existing obligations and the requirements of the respective
            lender. Select your employment category below to understand the
            typical requirements.
          </p>
        </div>

        <div
          className={`apply_categary ${
            selectedCategory ? "category-hidden" : ""
          }`}
        >
          <div className="apply_grid">
            {categories.map((category) => (
              <div
                key={category.name}
                className="apply_box"
                onClick={() => handleClick(category.name)}
              >
                <div className="apply_box_number">
                  {String(
                    categories.findIndex(
                      (item) => item.name === category.name
                    ) + 1
                  ).padStart(2, "0")}
                </div>
                <div className="apply_box_content">
                  <h3>{category.name}</h3>
                  <p>{category.shortDescription}</p>
                </div>
                <div className="apply_box_arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`category-details ${
            selectedCategory ? "category-details-visible" : ""
          }`}
        >
          {selectedData && (
            <div className="requirements-card">
              <button
                type="button"
                className="back-button"
                onClick={handleBack}
              >
                ← Back to categories
              </button>

              <div className="requirements-header">
                <div>
                  <div className="section-label">SELECTED CATEGORY</div>
                  <h2>Home Loan for {selectedData.name}</h2>
                  <p>
                    Here are some typical requirements that may apply to your
                    profile.
                  </p>
                </div>
              </div>

              <div className="requirements-list">
                {selectedData.requirements.map((requirement, index) => (
                  <div className="requirement-item" key={requirement}>
                    <span className="requirement-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>{requirement}</p>
                  </div>
                ))}
              </div>

              <div className="requirements-note">
                <strong>Please note:</strong>
                <p>
                  These are general requirements and may vary between lenders.
                  Final eligibility, interest rate, loan amount and approval
                  are subject to the respective bank or NBFC's policies.
                </p>

                {!showForm && (
                  <p className="ls-connect-text">
                    To connect with us{" "}
                    <button type="button" onClick={() => setShowForm(true)}>
                      Click Here
                    </button>
                  </p>
                )}
              </div>

              {showForm && (
                <div className="verification-section">
                  <div className="verification-address">
                    <h4>Our Office</h4>
                    <p>
                      LoanSaarthi
                      <br />
                      Goswami Girdhari Lal Marg,
                      <br />
                      New Patel Nagar, Shadipur,
                      <br />
                      Delhi
                    </p>
                  </div>
                  <div className="verification-form">
                    <HeroVerificationCard />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="ls-seo-benefits-section">
        <div className="ls-seo-benefits-container">
          <div className="ls-seo-benefits-heading">
            <span className="ls-seo-label">HOME LOAN INDIA</span>
            <h2>Why Explore a Home Loan for Salaried with LoanSaarthi?</h2>
            <p>
              LoanSaarthi makes it easier for salaried employees to explore
              home loan options online by connecting customers with suitable
              Banks and NBFCs based on their profile and eligibility.
            </p>
          </div>

          <div className="ls-seo-benefits-grid">
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">01</span>
              <h3>Compare Home Loan Options</h3>
              <p>
                Explore home loan options from 42+ Banks and NBFCs instead of
                checking lenders one by one.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">02</span>
              <h3>Low Interest Home Loans</h3>
              <p>
                Compare applicable interest rates and loan terms to explore an
                option that may suit your salaried profile.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">03</span>
              <h3>100% Digital Process</h3>
              <p>
                Start the initial home loan assistance process digitally
                without visiting the LoanSaarthi office.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">04</span>
              <h3>Long Tenure Options</h3>
              <p>
                Explore home loans with longer repayment tenures to help keep
                your monthly EMI affordable.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ls-faq-section">
        <div className="ls-faq-container">
          <div className="ls-faq-heading">
            <span className="ls-seo-label">HOME LOAN FAQ</span>
            <h2>Frequently Asked Questions About Home Loans for Salaried</h2>
          </div>

          <div className="ls-faq-list">
            <details className="ls-faq-item">
              <summary>Can a salaried employee get a home loan?</summary>
              <p>
                Yes. Salaried employees with a stable income, valid KYC and
                acceptable credit profile may be eligible for a home loan,
                subject to the lender's eligibility criteria and policies.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>What is the maximum home loan tenure for salaried?</summary>
              <p>
                Home loan tenure typically ranges up to 30 years, depending on
                the lender and the applicant's age at the time of loan
                maturity.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>What documents are required for a salaried home loan?</summary>
              <p>
                Common documents include salary slips, bank statements, PAN,
                Aadhaar, Form 16 or ITR, and property-related documents as
                requested by the lender.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>How much home loan can I get on my salary?</summary>
              <p>
                The eligible loan amount depends on your net monthly income,
                existing EMIs, credit profile, age and the lender's internal
                policies. As a general reference, lenders may consider a
                percentage of your income towards EMI obligations.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Is a home loan guaranteed to be approved?</summary>
              <p>
                No lender can guarantee approval for every applicant. Home
                loan approval depends on factors such as income, credit
                profile, eligibility, documentation and the lender's internal
                policies.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Can I apply for a home loan online?</summary>
              <p>
                Yes. The initial home loan assistance process through
                LoanSaarthi can be completed digitally. Final application
                processing and approval are subject to the respective
                lender's requirements.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="loan-disclaimer">
        <div className="disclaimer-icon">!</div>
        <div>
          <h3>Important Information</h3>
          <p>
            LoanSaarthi assists customers in exploring and comparing loan
            options from partner banks and NBFCs. Loan approval, interest
            rate, loan amount, tenure, fees and other terms are decided by
            the respective lender based on its eligibility criteria and
            internal policies.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Page;