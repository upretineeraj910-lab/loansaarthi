"use client";

import { useState } from "react";
import "./loan-against-property.css";
import HeroVerificationCard from "@/components/HeroVerificationCard";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import "@/app/(loanpage)/loan-page.css"

import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Residential Property",
    shortDescription:
      "Pledge your self-occupied or rented residential property for a secured loan.",
    requirements: [
      "Clear and marketable title of the residential property",
      "Property should be free from any legal disputes or encumbrances",
      "Original property documents (sale deed, chain of title, etc.)",
      "Latest property tax receipts and maintenance bills",
      "PAN, Aadhaar and other valid KYC documents",
      "Income proof: ITR, salary slips or bank statements (as applicable)",
    ],
  },
  {
    name: "Commercial Property",
    shortDescription:
      "For shops, offices, showrooms and other commercial property owners.",
    requirements: [
      "Clear title of the commercial property",
      "Property should be self-owned or jointly-owned with consent",
      "Latest property tax and commercial usage documents",
      "Rent agreement / lease agreement (if applicable)",
      "PAN, Aadhaar and other valid KYC documents",
      "Business income proof: ITR, P&L, bank statements",
    ],
  },
  {
    name: "Industrial Property",
    shortDescription:
      "For factories, warehouses and industrial units offered as collateral.",
    requirements: [
      "Clear ownership and industrial land use permission",
      "Latest property tax and utility bills",
      "Factory license and applicable registrations",
      "PAN, Aadhaar and other valid KYC documents",
      "Business financials: ITR, balance sheet, bank statements",
      "Project report or business plan (if requested)",
    ],
  },
  {
    name: "Plot / Land",
    shortDescription:
      "Loan against residential or commercial plots and land parcels.",
    requirements: [
      "Clear and marketable title of the plot/land",
      "Approved layout and land use certificate",
      "Latest property tax receipts (if applicable)",
      "PAN, Aadhaar and other valid KYC documents",
      "Income proof: ITR, salary slips or bank statements",
      "No pending litigation on the property",
    ],
  },
  {
    name: "Mixed-Use Property",
    shortDescription:
      "For properties used for both residential and commercial purposes.",
    requirements: [
      "Clear title of the mixed-use property",
      "Approved building plan and usage certificates",
      "Latest property tax receipts",
      "PAN, Aadhaar and other valid KYC documents",
      "Income proof: ITR / salary slips / bank statements",
      "Rent or lease details (if partially leased)",
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
    <main className="lap-page">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "Loan Against Property",
            description:
              "Compare Loan Against Property (LAP) options in India with LoanSaarthi. Explore low-interest secured loans from 42+ Banks and NBFCs by pledging your residential, commercial or industrial property.",
            brand: { "@type": "Brand", name: "LoanSaarthi" },
            category: "Loan Against Property",
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
        <div className="hero-badge">⚡ Loan Against Property Starting @ 9.25%* p.a.</div>

        <h1>
          Loan Against Property – Compare Low-Interest LAP in India
        </h1>

        <p className="hero-description">
          Looking for a Loan Against Property in India at a competitive
          interest rate? LoanSaarthi helps you compare Loan Against Property
          options from 42+ Banks and NBFCs across India. Explore low-interest
          secured loan options, check your eligibility, calculate your EMI
          and complete the initial loan assistance process through a 100%
          digital journey.
        </p>

        <div className="hero-points">
          <div className="hero-point">
            <span>01</span>
            <p>Compare LAP options from 42+ banks and NBFCs</p>
          </div>
          <div className="hero-point">
            <span>02</span>
            <p>Higher loan amount against your property</p>
          </div>
          <div className="hero-point">
            <span>03</span>
            <p>Get assistance based on your property profile</p>
          </div>
        </div>
      </section>

      <section className="loan-page-calculator-section">
        <div className="loan-page-row">
          <div className="loan-info-text">
            <h2>Compare Loan Against Property Options in India</h2>
            <p>
              Looking for the <strong>cheapest Loan Against Property</strong>{" "}
              in India? LoanSaarthi helps you compare LAP options from
              multiple Banks and NBFCs based on your property, income,
              eligibility and financial requirements.
            </p>
            <p>
              As a <strong>loan assistance partner</strong>, LoanSaarthi helps
              you explore suitable secured loan options from multiple banks
              and NBFCs instead of limiting your application to a single
              lender.
            </p>
            <p>
              Our team can help you compare available options and proceed with
              a lender that may be suitable for your profile, subject to the
              lender's eligibility criteria, property valuation, policies and
              final approval.
            </p>

            <h2>100% Digital Loan Against Property Assistance</h2>
            <p>
              The initial Loan Against Property assistance process can be
              completed <strong>digitally from anywhere in India</strong>. You
              can explore suitable LAP options, check eligibility and begin
              the application process online without visiting the LoanSaarthi
              office.
            </p>
            <p>
              Property valuation, legal verification and final approval depend
              on the respective bank or NBFC's policies.
            </p>
          </div>

          <div className="loan-page-calculator-wrapper">
            <div className="loan-page-calculator">
              <LoanEmiCalculator
                variant="loan"
                title="Loan Against Property EMI Calculator"
                amountLabel="Loan Amount"
                amountDefault={5000000}
                amountMin={500000}
                amountMax={50000000}
                amountStep={100000}
                tenureDefault={15}
                tenureMin={3}
                tenureMax={20}
                rateLabel="Interest Rate (% p.a.)"
                rateDefault={9.25}
                rateMin={9.0}
                rateMax={16.0}
                rateStep={0.1}
                emiLabel="Monthly EMI"
              />
            </div>

            <div className="ls-calc-seo-box">
              <span className="ls-seo-label">LAP CALCULATOR</span>
              <h3>Loan Against Property EMI Breakdown</h3>
              <p>
                Use the calculator above to estimate your monthly EMI based on
                loan amount, interest rate and tenure before selecting a
                lender.
              </p>
              <div className="ls-seo-keyword-row">
                <span>Loan Against Property</span>
                <span>LAP in India</span>
                <span>Secured Loan</span>
                <span>Mortgage Loan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="apply-section">
        <div className="section-heading">
          <h2>Loan Against Property Eligibility Criteria</h2>
          <p>
            Loan Against Property eligibility depends on factors such as
            property type, property value, income, credit profile and the
            requirements of the respective lender. Select your property
            category below to understand the typical LAP requirements.
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
                  <h2>Loan Against {selectedData.name}</h2>
                  <p>
                    Here are some typical requirements that may apply to your
                    property profile.
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
                  Final eligibility, interest rate, loan amount, property
                  valuation and approval are subject to the respective bank or
                  NBFC's policies.
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
            <span className="ls-seo-label">LAP INDIA</span>
            <h2>Why Explore Loan Against Property with LoanSaarthi?</h2>
            <p>
              LoanSaarthi makes it easier to explore Loan Against Property
              options online by connecting customers with suitable Banks and
              NBFCs based on their property and eligibility.
            </p>
          </div>

          <div className="ls-seo-benefits-grid">
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">01</span>
              <h3>Compare LAP Options</h3>
              <p>
                Explore Loan Against Property options from 42+ Banks and NBFCs
                instead of checking lenders one by one.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">02</span>
              <h3>Higher Loan Amounts</h3>
              <p>
                Secured loans against property typically offer higher loan
                amounts compared to unsecured personal loans.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">03</span>
              <h3>Lower Interest Rates</h3>
              <p>
                Since LAP is a secured loan, interest rates are generally
                lower than unsecured loan options.
              </p>
            </article>
            <article className="ls-seo-benefit-card">
              <span className="ls-seo-benefit-number">04</span>
              <h3>Longer Repayment Tenure</h3>
              <p>
                Explore LAP options with longer tenures to keep your monthly
                EMI more manageable.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="ls-faq-section">
        <div className="ls-faq-container">
          <div className="ls-faq-heading">
            <span className="ls-seo-label">LAP FAQ</span>
            <h2>Frequently Asked Questions About Loan Against Property</h2>
          </div>

          <div className="ls-faq-list">
            <details className="ls-faq-item">
              <summary>What is a Loan Against Property?</summary>
              <p>
                A Loan Against Property (LAP) is a secured loan where you
                pledge your residential, commercial or industrial property as
                collateral. The loan amount, interest rate and tenure depend
                on the lender's policies and property valuation.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>How much loan can I get against my property?</summary>
              <p>
                Lenders typically offer up to a certain percentage of the
                property's market value, subject to the applicant's income,
                repayment capacity and the lender's internal policies.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>What documents are required for LAP?</summary>
              <p>
                Common documents include property papers, KYC documents,
                income proof (ITR, salary slips, bank statements) and other
                property-related documents as required by the lender.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Is property valuation mandatory for LAP?</summary>
              <p>
                Yes. Lenders generally conduct a technical and legal
                verification of the property along with a valuation before
                sanctioning a Loan Against Property.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Can I apply for LAP on a jointly-owned property?</summary>
              <p>
                Yes, subject to the consent of all co-owners and the lender's
                policies. All co-owners may need to be co-applicants on the
                loan.
              </p>
            </details>
            <details className="ls-faq-item">
              <summary>Is LAP approval guaranteed?</summary>
              <p>
                No lender can guarantee approval. Loan Against Property
                approval depends on property valuation, legal verification,
                income, credit profile and the lender's internal policies.
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