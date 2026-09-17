"use client";

import { useState } from "react";
import "./business-loan.css";
import HeroVerificationCard from "@/components/HeroVerificationCard";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "@/app/(loanpage)/loan-page.css"

import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Proprietorship",
    shortDescription:
      "For single-owner businesses registered as sole proprietorship firms.",
    requirements: [
      "Business vintage: minimum 2–3 years of continuous operation",
      "Last 2 years' ITR with computation of income",
      "Last 6 months' current account bank statement",
      "GST Registration Certificate and latest GST returns",
      "Udyam Registration Certificate (MSME)",
      "PAN, Aadhaar and other valid KYC documents",
      "Business address proof and 1 recent passport-size photograph",
    ],
  },
  {
    name: "Partnership Firm",
    shortDescription:
      "For businesses registered as partnership firms with two or more partners.",
    requirements: [
      "Business vintage: minimum 2–3 years",
      "Partnership deed and firm registration certificate",
      "Last 2 years' ITR of the firm and partners",
      "Last 6 months' current account bank statement",
      "GST Registration Certificate and latest GST returns",
      "PAN, Aadhaar and KYC of all partners",
      "Business address proof",
    ],
  },
  {
    name: "Private Limited Company",
    shortDescription:
      "For private limited companies registered under the Companies Act.",
    requirements: [
      "Business vintage: minimum 2–3 years",
      "Certificate of Incorporation (COI) and MOA/AOA",
      "Last 2 years' audited financials (P&L, balance sheet)",
      "Last 2 years' ITR of the company",
      "Last 6 months' current account bank statement",
      "GST returns and company PAN",
      "KYC of directors and shareholders",
    ],
  },
  {
    name: "LLP (Limited Liability Partnership)",
    shortDescription:
      "For LLPs registered under the LLP Act, 2008.",
    requirements: [
      "Business vintage: minimum 2–3 years",
      "LLP incorporation certificate and LLP agreement",
      "Last 2 years' ITR of LLP and partners",
      "Last 6 months' current account bank statement",
      "GST Registration and returns (if applicable)",
      "PAN, Aadhaar and KYC of designated partners",
    ],
  },
  {
    name: "Self-Employed Professional",
    shortDescription:
      "For doctors, CAs, architects, consultants and other professionals.",
    requirements: [
      "Minimum 2 years of professional practice",
      "Educational degree / professional qualification certificate",
      "Last 2 years' ITR with computation",
      "Last 6 months' bank statement (current or savings)",
      "PAN, Aadhaar and other valid KYC documents",
      "Business address proof and clinic/office registration",
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
    <main className="bl-page">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "Business Loan",
            description:
              "Compare Business Loan options in India with LoanSaarthi. Explore unsecured and secured business loans from 42+ Banks and NBFCs for proprietorship, partnership, Pvt Ltd, LLP and self-employed professionals.",
            brand: { "@type": "Brand", name: "LoanSaarthi" },
            category: "Business Loan",
          }),
        }}
      /> */}

       <button
      type="button"
      className="loan-back-button"
      onClick={() => router.push("/#Loan")}
    >
      ← Back
    </button>


      <section className="personal-loan-hero">
        <div className="hero-badge">⚡ Business Loan Starting @ 11.99%* p.a.</div>

        <h1>
          Business Loan Online – Compare Low-Interest Business Loans in India
        </h1>

        <p className="hero-description">
          Looking for a Business Loan in India at a competitive interest rate?
          LoanSaarthi helps you compare business loan options from 42+ Banks
          and NBFCs across India. Explore low-interest business loan options,
          check your eligibility, calculate your EMI and complete the initial
          loan assistance process through a 100% digital journey.
        </p>

        <div className="hero-points">
          <div className="hero-point">
            <span>01</span>
            <p>Compare business loan options from 42+ banks and NBFCs</p>
          </div>
          <div className="hero-point">
            <span>02</span>
            <p>Collateral-free and secured options available</p>
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
            <h2>Compare Business Loan Options in India</h2>
            <p>
              Looking for the <strong>cheapest business loan in India</strong>?
              LoanSaarthi helps you compare business loan options from multiple
              Banks and NBFCs based on your business type, vintage, turnover
              and financial requirements.
            </p>
            <p>
              As a <strong>loan assistance partner</strong>, LoanSaarthi helps
              you explore suitable business loan options from multiple banks
              and NBFCs instead of limiting your application to a single
              lender.
            </p>
            <p>
              Our team can help you compare available options and proceed with
              a lender that may be suitable for your business profile, subject
              to the lender's eligibility criteria, policies and final
              approval.
            </p>

            <h2>100% Digital Business Loan Assistance</h2>
            <p>
              The initial business loan assistance process can be completed{" "}
              <strong>digitally from anywhere in India</strong>. You can
              explore suitable business loan options, check eligibility and
              begin the application process online without visiting the
              LoanSaarthi office.
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
                title="Business Loan EMI Calculator"
                amountLabel="Loan Amount"
                amountDefault={1000000}
                amountMin={50000}
                amountMax={5000000}
                amountStep={50000}
                tenureDefault={3}
                tenureMin={1}
                tenureMax={5}
                rateLabel="Interest Rate (% p.a.)"
                rateDefault={11.99}
                rateMin={11.0}
                rateMax={20.0}
                rateStep={0.1}
                emiLabel="Monthly EMI"
              />
            </div>

            <div className="ls-calc-seo-box">
              <span className="ls-seo-label">BUSINESS LOAN CALCULATOR</span>
              <h3>Business Loan EMI Breakdown</h3>
              <p>
                Use the calculator above to estimate your monthly EMI based on
                loan amount, interest rate and tenure before selecting a
                lender.
              </p>
              <div className="ls-seo-keyword-row">
                <span>Business Loan Online</span>
                <span>Low Interest Business Loan</span>
                <span>Business Loan in India</span>
                <span>Business Loan EMI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="apply-section">
        <div className="section-heading">
          <h2>Business Loan Eligibility Criteria in India</h2>
          <p>
            Business loan eligibility depends on factors such as business
            vintage, annual turnover, profit, credit profile, existing
            obligations and the requirements of the respective lender. Select
            your business type below to understand the typical eligibility
            requirements.
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
                  <h2>Business Loan for {selectedData.name}</h2>
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

      <section className="ls-seo-benefits-section">
        <div className="ls-seo-benefits-container">
          <div className="ls-seo-benefits-heading">
            <span className="ls-seo-label">BUSINESS LOAN INDIA</span>
            <h2>Why Explore a Business Loan Online with LoanSaarthi?</h2>
            <p>
              LoanSaarthi makes it easier to explore business loan options
              online by connecting business owners with suitable Banks and
              NBFCs based on their profile and eligibility.
            </p>
          </div>

          <div className="ls-seo-benefits-grid">
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">01</span>
              <h3>Compare Business Loan Options</h3>
              <p>
                Explore business loan options from 42+ Banks and NBFCs instead
                of checking lenders one by one.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">02</span>
              <h3>Collateral-Free Options</h3>
              <p>
                Explore unsecured business loan options without pledging any
                business or personal asset as collateral.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">03</span>
              <h3>100% Digital Process</h3>
              <p>
                Start the initial business loan assistance process digitally
                without visiting the LoanSaarthi office.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">04</span>
              <h3>Flexible Repayment Options</h3>
              <p>
                Explore business loan options with flexible tenures to keep
                your monthly EMI affordable.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="ls-faq-section">
        <div className="ls-faq-container">
          <div className="ls-faq-heading">
            <span className="ls-seo-label">BUSINESS LOAN FAQ</span>
            <h2>Frequently Asked Questions About Business Loans</h2>
          </div>

          <div className="ls-faq-list">
            <details className="ls-faq-item">
              <summary>What is a business loan?</summary>
              <p>
                A business loan is a financing option that helps business
                owners meet working capital, expansion, equipment purchase or
                other operational needs. The loan amount, interest rate, tenure
                and approval depend on the lender's policies and the
                applicant's eligibility.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>
                How can I find a low-interest business loan in India?
              </summary>
              <p>
                You can compare business loan options from different Banks and
                NBFCs, review applicable interest rates and fees, and select
                an option that may be suitable for your business profile.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Can I apply for a business loan online?</summary>
              <p>
                Yes. The initial business loan assistance process through
                LoanSaarthi can be completed digitally. Final application
                processing and approval are subject to the respective lender's
                requirements.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Is a business loan guaranteed to be approved?</summary>
              <p>
                No lender can guarantee approval for every applicant. Business
                loan approval depends on factors such as business vintage,
                turnover, profit, credit profile, documentation and the
                lender's internal policies.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Who can apply for a business loan?</summary>
              <p>
                Proprietorships, partnership firms, private limited companies,
                LLPs and self-employed professionals may be able to apply for
                a business loan, depending on the lender's eligibility
                criteria.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>
                What documents are generally required for a business loan?
              </summary>
              <p>
                Depending on the business type and lender, documents may
                include business registration proof, ITR, financials, GST
                returns, bank statements, KYC documents and other business
                documents.
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