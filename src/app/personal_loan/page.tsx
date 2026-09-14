"use client";

import { useState } from "react";
import "./personal-loan.css"
import HeroVerificationCard from "@/components/HeroVerificationCard";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import '../(loanpage)/loan-page.css'

const categories = [
    {
        name: "Salaried",
        shortDescription: "For employees receiving a regular monthly salary.",
        requirements: [
            "Stable employment with a regular source of income Min - 25,000 INR",
            "3 Months Latest salary slips",
            "6 Months bank statements may be required",
            "PAN and Aadhaar or other valid KYC documents",
            "Minimum age and income requirements depend on the lender",
            "1 recent passport-size photograph",
        ],
    },

    {
        name: "Self Employed",
        shortDescription: "For individuals running their own business or working independently.",
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
        shortDescription: "For doctors, chartered accountants, architects, and other qualified professionals.",
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
        shortDescription: "For homemakers without independent income, based on household or co-applicant financial standing.",
        requirements: [
            "Preapproved offers available with minimal documentation",
            "PAN and Aadhaar or other valid KYC documents",
        ],
    },
    // {
    //     name: "Business Owner",
    //     shortDescription: "For business owners looking for suitable personal loan options.",
    //     requirements: [
    //         "Established and verifiable business income",
    //         "Business and financial documents may be required",
    //         "Recent bank statements may be required",
    //         "ITR or other income proof may be required",
    //         "Business vintage, turnover and other criteria depend on the lender",
    //     ],
    // },
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

const page = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const [showForm, setShowForm] = useState(false)

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

            {/* HERO SECTION */}
            <section className="personal-loan-hero ">
                <div className="hero-badge">
                    ⚡ Interest Rates Starting @ 9.99%* p.a.
                </div>
                <h1>
                    Personal Loan Online – Check Eligibility & Apply Instantly
                </h1>

                <p className="hero-description">
                    Looking for a Personal Loan with competitive interest rates
                    and flexible repayment options? LoanSaarthi helps you compare
                    personal loan options from 42+ Banks and NBFCs across India
                    based on your profile, eligibility and financial requirements.
                </p>

                <div className="hero-points">

                    <div className="hero-point">
                        <span>01</span>
                        <p>Compare options from 42+ banks and NBFCs</p>
                    </div>

                    <div className="hero-point">
                        <span>02</span>
                        <p>Complete the initial process digitally</p>
                    </div>

                    <div className="hero-point">
                        <span>03</span>
                        <p>Get assistance based on your profile</p>
                    </div>

                </div>

            </section>


            {/* INTRO SECTION */}

            <div className="loan-page-row">
                <section className="loan-info-text">
                    <h2>Compare Personal Loan Options Online</h2>

                    <p>
                        As a <strong>loan assistance partner</strong>, LoanSaarthi
                        helps you explore suitable loan options from multiple banks
                        and NBFCs instead of limiting your application to a single
                        lender.
                    </p>

                    <p>
                        Our team can help you compare available options and proceed
                        with a lender that may be suitable for your profile, subject
                        to the lender's eligibility criteria, policies and final
                        approval.
                    </p>

                    <h2>No Office Visit Required</h2>

                    <p>
                        The initial loan assistance process can be completed
                        <strong> digitally from anywhere in India</strong>. You don't
                        need to visit the LoanSaarthi office to begin your application.
                    </p>

                    <p>
                        You also don't necessarily need an existing bank account with
                        the selected lender. Account requirements, eligibility,
                        interest rate, loan amount and final approval depend on the
                        respective bank or NBFC's policies.
                    </p>

                    <p className="content-highlight">
                        <strong>Compare. Choose. Apply — with LoanSaarthi.</strong>
                    </p>
                </section>

                <div className="loan-page-calculator">
                    <LoanEmiCalculator
                        variant="loan"
                        title="Personal Loan EMI Calculator" amountLabel="Loan Amount"
                        amountDefault={500000}
                        amountMin={50000}
                        amountMax={2500000} amountStep={10000}
                        tenureDefault={3}
                        tenureMin={1}
                        tenureMax={5} rateLabel="Interest Rate (% p.a.)"
                        rateDefault={9.99}
                        rateMin={9.5}
                        rateMax={18.0}
                        rateStep={0.1}
                        emiLabel="Monthly EMI"
                    />
                </div>
            </div>


            {/* WHO CAN APPLY SECTION */}
            <section className="apply-section">

                <div className="section-heading">

                    {/* <div className="section-label">
                        ELIGIBILITY
                    </div> */}

                    {/* <h2>
                        Who Can Apply
                    </h2> */}

                    <h2>Eligibility Criteria</h2>

                    <p>
                        Select your employment or income category to understand
                        the typical requirements for a Personal Loan.
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
                                            (item) =>
                                                item.name === category.name
                                        ) + 1
                                    ).padStart(2, "0")}
                                </div>

                                <div className="apply_box_content">

                                    <h3>
                                        {category.name}
                                    </h3>

                                    <p>
                                        {category.shortDescription}
                                    </p>

                                </div>

                                <div className="apply_box_arrow">
                                    →
                                </div>

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

                                    <div className="section-label">
                                        SELECTED CATEGORY
                                    </div>

                                    <h2>
                                        Personal Loan for{" "}
                                        {selectedData.name}
                                    </h2>

                                    <p>
                                        Here are some typical requirements that
                                        may apply to your profile.
                                    </p>

                                </div>

                            </div>


                            <div className="requirements-list">

                                {selectedData.requirements.map(
                                    (requirement, index) => (

                                        <div
                                            className="requirement-item"
                                            key={requirement}
                                        >

                                            <span className="requirement-number">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <p>
                                                {requirement}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>


                            <div className="requirements-note">

                                <strong>
                                    Please note:
                                </strong>

                                <p>
                                    These are general requirements and may vary
                                    between lenders. Final eligibility,
                                    interest rate, loan amount and approval are
                                    subject to the respective bank or NBFC's
                                    policies.
                                </p>

                                <p>to connect us <button className="bg-blue-500 hover:bg-blue-700 hover:pointer" onClick={() => setShowForm(true)}>Click Here</button> </p>
                                {/* <div className={showForm ? "":"hideForm"} ><HeroVerificationCard /></div> */}
                                {/* {showForm && <HeroVerificationCard /> } */}
                            </div>


                            {showForm && (
                                <div className="verification-section">
                                    <div className="verification-address">
                                        <h4>Our Office</h4>
                                        <p>
                                            LoanSaarthi<br />
                                            Goswami Girdhari Lal Marg,<br />
                                            New Patel Nagar, Shadipur,<br />
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


            {/* FINAL DISCLAIMER */}
            <section className="loan-disclaimer">

                <div className="disclaimer-icon">
                    !
                </div>

                <div>

                    <h3>
                        Important Information
                    </h3>

                    <p>
                        LoanSaarthi assists customers in exploring and comparing
                        loan options from partner banks and NBFCs. Loan approval,
                        interest rate, loan amount, tenure, fees and other terms
                        are decided by the respective lender based on its
                        eligibility criteria and internal policies.
                    </p>

                </div>

            </section>

        </main>
    );
};

export default page;