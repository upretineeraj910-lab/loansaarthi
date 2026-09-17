"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "./personal-loan.css";
import HeroVerificationCard from "@/components/HeroVerificationCard";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "@/app/(loanpage)/loan-page.css"

const categories = [
  {
    name: "Salaried",
    shortDescription: "For employees receiving a regular monthly salary.",
    requirements: [
      "Stable employment with a regular source of income Min - 25,000 INR",
      "3 Months Latest salary slips",
      "6 Months bank statements",
      "PAN and Aadhaar or other valid KYC documents",
      "Minimum age and income requirements depend on the lender",
      "1 recent passport-size photograph",
    ],
  },
  {
    name: "Self Employed",
    shortDescription:
      "For individuals running their own business or working independently.",
    requirements: [
      "Last 2 years' ITR (Income Tax Return) — minimum annual income of ₹5–10 lakh",
      "GST Registration Certificate and GST Returns (if applicable)",
      "Udyam Registration Certificate (MSME registration)",
      "Last 6 months' Current Account bank statement",
      "Certificate of Incorporation (COI), for registered businesses/companies",
      "PAN and Aadhaar or other valid KYC documents",
      "1 recent passport-size photograph",
    ],
  },
  {
    name: "Professional",
    shortDescription:
      "For doctors, chartered accountants, architects, and other qualified professionals.",
    requirements: [
      "Minimum annual income of ₹4 lakh",
      "Educational degree / professional qualification certificate",
      "Last 6 months' bank statement",
      "Certificate of Incorporation (COI), if practicing under a registered firm",
      "PAN and Aadhaar or other valid KYC documents",
    ],
  },
  {
    name: "Housewife",
    shortDescription:
      "For homemakers without independent income, based on household or co-applicant financial standing.",
    requirements: [
      "Preapproved offers available with minimal documentation",
      "PAN and Aadhaar or other valid KYC documents",
    ],
  },
  {
    name: "Pensioner",
    shortDescription: "For retired individuals receiving a regular pension.",
    requirements: [
      "Minimum monthly pension of ₹30,000",
      "Maximum age limit: 70 years",
      "Pension account bank statement (last 6 months)",
      "PAN and Aadhaar or other valid KYC documents",
      "Insurance requirement depends on the lender's policy",
    ],
  },
];

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  
  const router = useRouter();



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


    <main className="personal-loan-page">

      {/* <button
      type="button"
      className="loan-back-button"
      onClick={() => router.push("/#Loan")}
    >
      ← Back
    </button> */}
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="personal-loan-hero">
        <div className="hero-badge">⚡ Interest Rates Starting @ 9.99%* p.a.</div>

        <h1>
          Personal Loan Online – Compare Low-Interest Personal Loans in India
        </h1>

        <p className="hero-description">
          Looking for a Personal Loan in India at a competitive interest rate?
          LoanSaarthi helps you compare personal loan options from 42+ Banks and
          NBFCs across India. Explore low-interest personal loan options, check
          your eligibility, calculate your EMI and complete the initial loan
          assistance process through a 100% digital journey.
        </p>

        <div className="hero-points">
          <div className="hero-point">
            <span>01</span>
            <p>Compare options from 42+ banks and NBFCs</p>
          </div>

          <div className="hero-point">
            <span>02</span>
            <p>100% digital initial loan assistance</p>
          </div>

          <div className="hero-point">
            <span>03</span>
            <p>Get assistance based on your profile</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO + EMI CALCULATOR & SEO (SIDE-BY-SIDE)
      ===================================================== */}
      <section className="loan-page-calculator-section">
        <div className="loan-page-row">
          {/* LEFT SIDE: MAIN LOAN INFO TEXT */}
          <div className="loan-info-text">
            <h2>Compare Personal Loan Options in India</h2>

            <p>
              Looking for the <strong>cheapest personal loan in India</strong>?
              LoanSaarthi helps you compare personal loan options from multiple
              Banks and NBFCs based on your profile, eligibility, income and
              financial requirements.
            </p>

            <p>
              As a <strong>loan assistance partner</strong>, LoanSaarthi helps
              you explore suitable loan options from multiple banks and NBFCs
              instead of limiting your application to a single lender.
            </p>

            <p>
              Our team can help you compare available options and proceed with a
              lender that may be suitable for your profile, subject to the
              lender's eligibility criteria, policies and final approval.
            </p>

            <h2>100% Digital Personal Loan Assistance</h2>

            <p>
              The initial personal loan assistance process can be completed{" "}
              <strong>digitally from anywhere in India</strong>. You can
              explore suitable personal loan options, check eligibility and
              begin the application process online without visiting the
              LoanSaarthi office.
            </p>

            <p>
              You also don't necessarily need an existing bank account with the
              selected lender. Account requirements, eligibility, interest
              rate, loan amount and final approval depend on the respective
              bank or NBFC's policies.
            </p>
          </div>

          {/* RIGHT SIDE: CALCULATOR + SEO CONTENT INTEGRATED */}
          <div className="loan-page-calculator-wrapper">
            <div className="loan-page-calculator">
              <LoanEmiCalculator
                variant="loan"
                title="Personal Loan EMI Calculator"
                amountLabel="Loan Amount"
                amountDefault={500000}
                amountMin={50000}
                amountMax={2500000}
                amountStep={10000}
                tenureDefault={3}
                tenureMin={1}
                tenureMax={5}
                rateLabel="Interest Rate (% p.a.)"
                rateDefault={9.99}
                rateMin={9.5}
                rateMax={18.0}
                rateStep={0.1}
                emiLabel="Monthly EMI"
              />
            </div>

            {/* CALCULATOR CONTEXT / SEO DETAILS */}
            <div className="ls-calc-seo-box">
              <span className="ls-seo-label">PERSONAL LOAN CALCULATOR</span>
              <h3>Personal Loan EMI Breakdown</h3>
              <p>
                Use the calculator above to estimate your monthly EMI based on
                loan amount, interest rate, and tenure before selecting a lender.
              </p>
              <div className="ls-seo-keyword-row">
                <span>Personal Loan Online</span>
                <span>Low Interest Personal Loan</span>
                <span>Personal Loan in India</span>
                <span>Personal Loan EMI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ELIGIBILITY SECTION
      ===================================================== */}
      <section className="apply-section">
        <div className="section-heading">
          <h2>Personal Loan Eligibility Criteria in India</h2>
          <p>
            Personal loan eligibility depends on factors such as income,
            employment, age, credit profile, existing financial obligations and
            the requirements of the respective lender. Select your category
            below to understand the typical personal loan eligibility
            requirements.
          </p>
        </div>

        {/* CATEGORY CARDS */}
        <div
          className={`apply_categary ${selectedCategory ? "category-hidden" : ""
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

        {/* SELECTED CATEGORY DETAILS */}
        <div
          className={`category-details ${selectedCategory ? "category-details-visible" : ""
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
                  <h2>Personal Loan for {selectedData.name}</h2>
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
                  Final eligibility, interest rate, loan amount and approval are
                  subject to the respective bank or NBFC's policies.
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

              {/* VERIFICATION FORM */}
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

      {/* =====================================================
          PERSONAL LOAN BENEFITS SEO SECTION
      ===================================================== */}
      <section className="ls-seo-benefits-section">
        <div className="ls-seo-benefits-container">
          <div className="ls-seo-benefits-heading">
            <span className="ls-seo-label">PERSONAL LOAN INDIA</span>
            <h2>Why Explore a Personal Loan Online with LoanSaarthi?</h2>
            <p>
              LoanSaarthi makes it easier to explore personal loan options online
              by connecting customers with suitable Banks and NBFCs based on
              their profile and eligibility.
            </p>
          </div>

          <div className="ls-seo-benefits-grid">
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">01</span>
              <h3>Compare Personal Loan Options</h3>
              <p>
                Explore personal loan options from 42+ Banks and NBFCs instead
                of checking lenders one by one.
              </p>
            </article>

            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">02</span>
              <h3>Low Interest Loan Options</h3>
              <p>
                Compare applicable interest rates and loan terms to explore an
                option that may be suitable for your financial profile.
              </p>
            </article>

            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">03</span>
              <h3>100% Digital Process</h3>
              <p>
                Start the initial personal loan assistance process digitally
                without needing to visit the LoanSaarthi office.
              </p>
            </article>

            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">04</span>
              <h3>Simple Eligibility Check</h3>
              <p>
                Understand typical eligibility requirements based on your
                employment and income category.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ SECTION
      ===================================================== */}
      <section className="ls-faq-section">
        <div className="ls-faq-container">
          <div className="ls-faq-heading">
            <span className="ls-seo-label">PERSONAL LOAN FAQ</span>
            <h2>Frequently Asked Questions About Personal Loans</h2>
          </div>

          <div className="ls-faq-list">
            <details className="ls-faq-item">
              <summary>What is a personal loan?</summary>
              <p>
                A personal loan is generally an unsecured loan that can be used
                for various personal financial requirements. The loan amount,
                interest rate, tenure and approval depend on the respective
                lender's policies and the applicant's eligibility.
              </p>
            </details>

            <details className="ls-faq-item">
              <summary>
                How can I find a low-interest personal loan in India?
              </summary>
              <p>
                You can compare personal loan options from different Banks and
                NBFCs, review applicable interest rates and fees, and select an
                option that may be suitable for your financial profile.
              </p>
            </details>

            <details className="ls-faq-item">
              <summary>Can I apply for a personal loan online?</summary>
              <p>
                Yes. The initial personal loan assistance process through
                LoanSaarthi can be completed digitally. Final application
                processing and approval are subject to the respective lender's
                requirements.
              </p>
            </details>

            <details className="ls-faq-item">
              <summary>Is a personal loan guaranteed to be approved?</summary>
              <p>
                No lender can guarantee approval for every applicant. Personal
                loan approval depends on factors such as income, credit profile,
                eligibility, documentation and the lender's internal policies.
              </p>
            </details>

            <details className="ls-faq-item">
              <summary>Who can apply for a personal loan?</summary>
              <p>
                Salaried employees, self-employed individuals, professionals and
                other eligible applicants may be able to apply for a personal
                loan, depending on the lender's eligibility criteria.
              </p>
            </details>

            <details className="ls-faq-item">
              <summary>
                What documents are generally required for a personal loan?
              </summary>
              <p>
                Depending on the applicant and lender, documents may include
                identity and address proof, income documents, salary slips, bank
                statements, ITR documents and other KYC documents.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL DISCLAIMER
      ===================================================== */}
      <section className="loan-disclaimer">
        <div className="disclaimer-icon">!</div>
        <div>
          <h3>Important Information</h3>
          <p>
            LoanSaarthi assists customers in exploring and comparing loan
            options from partner banks and NBFCs. Loan approval, interest rate,
            loan amount, tenure, fees and other terms are decided by the
            respective lender based on its eligibility criteria and internal
            policies.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Page;