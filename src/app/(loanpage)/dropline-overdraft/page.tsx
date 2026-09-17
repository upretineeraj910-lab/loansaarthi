"use client";

import { useState } from "react";
import "./dropline-overdraft.css";
import HeroVerificationCard from "@/components/HeroVerificationCard";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "@/app/(loanpage)/loan-page.css"
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Businesses",
    shortDescription:
      "For business owners needing flexible working capital with a dropline OD.",
    requirements: [
      "Business vintage: minimum 2–3 years of continuous operation",
      "Last 2 years' ITR with computation of income",
      "Last 6–12 months' current account bank statement",
      "GST Registration and latest GST returns",
      "Udyam Registration Certificate (MSME), if applicable",
      "PAN, Aadhaar and other valid KYC documents",
      "Audited financials (P&L, balance sheet)",
    ],
  },
  {
    name: "Self-Employed Professionals",
    shortDescription:
      "For doctors, CAs, architects and consultants requiring flexible credit.",
    requirements: [
      "Minimum 2 years of professional practice",
      "Educational / professional qualification certificate",
      "Last 2 years' ITR with computation",
      "Last 6 months' bank statement",
      "PAN, Aadhaar and other valid KYC documents",
      "Business/clinic registration proof",
    ],
  },
  {
    name: "Traders & Retailers",
    shortDescription:
      "For traders, wholesalers and retailers managing seasonal working capital.",
    requirements: [
      "Business vintage: minimum 2 years",
      "Last 2 years' ITR with computation",
      "Last 6–12 months' current account bank statement",
      "GST Registration and latest GST returns",
      "Udyam Registration Certificate (if applicable)",
      "PAN, Aadhaar and other valid KYC documents",
    ],
  },
  {
    name: "Manufacturers",
    shortDescription:
      "For manufacturing units managing inventory, raw material and cycle needs.",
    requirements: [
      "Business vintage: minimum 3 years",
      "Last 2 years' audited financials (P&L, balance sheet)",
      "Last 12 months' current account bank statement",
      "GST Returns and factory license",
      "Udyam Registration Certificate (MSME)",
      "PAN, Aadhaar and other valid KYC documents",
    ],
  },
  {
    name: "Service Providers",
    shortDescription:
      "For service-based companies and contractors requiring flexible credit.",
    requirements: [
      "Business vintage: minimum 2 years",
      "Last 2 years' ITR with computation",
      "Last 6–12 months' current account bank statement",
      "GST Registration and returns (if applicable)",
      "PAN, Aadhaar and other valid KYC documents",
      "Contracts / purchase orders (if requested)",
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
    <main className="dlo-page">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "Dropline Overdraft",
            description:
              "Compare Dropline Overdraft options in India with LoanSaarthi. Explore flexible working capital credit limits from 42+ Banks and NBFCs with dropline repayment structure.",
            brand: { "@type": "Brand", name: "LoanSaarthi" },
            category: "Dropline Overdraft",
          }),
        }}
      /> */}

       {/* <button
      type="button"
      className="loan-back-button"
      onClick={() => router.push("/#Loan")}
    >
      ← Back
    </button> */}


      <section className="personal-loan-hero">
        <div className="hero-badge">⚡ Dropline Overdraft Starting @ 11.00%* p.a.</div>

        <h1>
          Dropline Overdraft – Compare Flexible Working Capital Credit in India
        </h1>

        <p className="hero-description">
          Looking for a Dropline Overdraft in India at a competitive interest
          rate? LoanSaarthi helps you compare Dropline OD options from 42+
          Banks and NBFCs across India. Explore flexible credit limit options,
          check your eligibility, calculate your EMI and complete the initial
          loan assistance process through a 100% digital journey.
        </p>

        <div className="hero-points">
          <div className="hero-point">
            <span>01</span>
            <p>Compare Dropline OD options from 42+ banks and NBFCs</p>
          </div>
          <div className="hero-point">
            <span>02</span>
            <p>Flexible credit limit with dropline repayment</p>
          </div>
          <div className="hero-point">
            <span>03</span>
            <p>Get assistance based on your business profile</p>
          </div>
        </div>
      </section>

      <section className="loan-page-calculator-section">
        <div className="loan-page-row">
          <div className="loan-info-text">
            <h2>Compare Dropline Overdraft Options in India</h2>
            <p>
              Looking for the <strong>best Dropline Overdraft in India</strong>?
              LoanSaarthi helps you compare Dropline OD options from multiple
              Banks and NBFCs based on your business turnover, vintage,
              financials and working capital requirements.
            </p>
            <p>
              As a <strong>loan assistance partner</strong>, LoanSaarthi helps
              you explore suitable Dropline OD options from multiple banks and
              NBFCs instead of limiting your application to a single lender.
            </p>
            <p>
              Our team can help you compare available options and proceed with
              a lender that may be suitable for your business profile, subject
              to the lender's eligibility criteria, policies and final
              approval.
            </p>

            <h2>100% Digital Dropline Overdraft Assistance</h2>
            <p>
              The initial Dropline Overdraft assistance process can be
              completed <strong>digitally from anywhere in India</strong>. You
              can explore suitable Dropline OD options, check eligibility and
              begin the application process online without visiting the
              LoanSaarthi office.
            </p>
            <p>
              Dropline OD combines the flexibility of an overdraft with the
              discipline of a term loan through a scheduled reducing limit.
              Eligibility, interest rate, credit limit and final approval
              depend on the respective bank or NBFC's policies.
            </p>
          </div>

          <div className="loan-page-calculator-wrapper">
            <div className="loan-page-calculator">
              <LoanEmiCalculator
                variant="loan"
                title="Dropline Overdraft EMI Calculator"
                amountLabel="Credit Limit"
                amountDefault={2500000}
                amountMin={500000}
                amountMax={25000000}
                amountStep={100000}
                tenureDefault={5}
                tenureMin={2}
                tenureMax={10}
                rateLabel="Interest Rate (% p.a.)"
                rateDefault={11.0}
                rateMin={10.5}
                rateMax={18.0}
                rateStep={0.1}
                emiLabel="Approx. Monthly EMI"
              />
            </div>

            <div className="ls-calc-seo-box">
              <span className="ls-seo-label">DROPLINE OD CALCULATOR</span>
              <h3>Dropline Overdraft Repayment Breakdown</h3>
              <p>
                Use the calculator above to estimate your approximate monthly
                repayment based on credit limit, interest rate and tenure
                before selecting a lender.
              </p>
              <div className="ls-seo-keyword-row">
                <span>Dropline Overdraft</span>
                <span>Working Capital</span>
                <span>Overdraft in India</span>
                <span>Business OD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="apply-section">
        <div className="section-heading">
          <h2>Dropline Overdraft Eligibility Criteria in India</h2>
          <p>
            Dropline Overdraft eligibility depends on factors such as business
            vintage, annual turnover, financials, credit profile and the
            requirements of the respective lender. Select your business type
            below to understand the typical Dropline OD requirements.
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
                  <h2>Dropline Overdraft for {selectedData.name}</h2>
                  <p>
                    Here are some typical requirements that may apply to your
                    business profile.
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
                  Final eligibility, interest rate, credit limit and approval
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

      <section className="ls-seo-benefits-section">
        <div className="ls-seo-benefits-container">
          <div className="ls-seo-benefits-heading">
            <span className="ls-seo-label">DROPLINE OD INDIA</span>
            <h2>Why Explore a Dropline Overdraft with LoanSaarthi?</h2>
            <p>
              LoanSaarthi makes it easier to explore Dropline Overdraft
              options online by connecting business owners with suitable Banks
              and NBFCs based on their profile and eligibility.
            </p>
          </div>

          <div className="ls-seo-benefits-grid">
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">01</span>
              <h3>Compare Dropline OD Options</h3>
              <p>
                Explore Dropline Overdraft options from 42+ Banks and NBFCs
                instead of checking lenders one by one.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">02</span>
              <h3>Flexible Working Capital</h3>
              <p>
                Use funds as needed up to your sanctioned limit and pay
                interest only on the utilised amount.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">03</span>
              <h3>Disciplined Repayment</h3>
              <p>
                Dropline OD reduces the available limit at scheduled intervals
                — similar to a term loan repayment structure.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">04</span>
              <h3>100% Digital Process</h3>
              <p>
                Start the initial Dropline OD assistance process digitally
                without visiting the LoanSaarthi office.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="ls-faq-section">
        <div className="ls-faq-container">
          <div className="ls-faq-heading">
            <span className="ls-seo-label">DROPLINE OD FAQ</span>
            <h2>Frequently Asked Questions About Dropline Overdraft</h2>
          </div>

          <div className="ls-faq-list">
            <details className="ls-faq-item">
              <summary>What is a Dropline Overdraft?</summary>
              <p>
                A Dropline Overdraft is a working capital facility that combines
                features of an overdraft and a term loan. The credit limit
                reduces at scheduled intervals, and you pay interest only on
                the utilised amount.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>How is Dropline OD different from a normal OD?</summary>
              <p>
                Unlike a regular overdraft, the Dropline OD limit reduces over
                time as per a scheduled dropline. This helps ensure disciplined
                repayment while still offering flexibility to use funds on
                demand.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>What documents are required for Dropline OD?</summary>
              <p>
                Common documents include business registration proof, ITR,
                audited financials, GST returns, bank statements, KYC documents
                and other business documents as requested by the lender.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Is collateral required for Dropline OD?</summary>
              <p>
                Many Dropline OD facilities are secured against property,
                current assets or other collateral. Some lenders may also offer
                unsecured variants for eligible profiles. Terms depend on the
                respective lender's policies.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Can I apply for Dropline OD online?</summary>
              <p>
                Yes. The initial Dropline OD assistance process through
                LoanSaarthi can be completed digitally. Final application
                processing and approval are subject to the respective lender's
                requirements.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Is Dropline OD approval guaranteed?</summary>
              <p>
                No lender can guarantee approval. Dropline OD approval depends
                on business financials, turnover, credit profile, documentation
                and the lender's internal policies.
              </p>
            </details>
          </div>
        </div>
      </section>

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