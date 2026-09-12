"use client";

import { useState } from "react";
import "./personal-loan.css"
import HeroVerificationCard from "@/components/HeroVerificationCard";

const categories = [
    {
        name: "Salaried",
        shortDescription: "For employees receiving a regular monthly salary.",
        requirements: [
            "Stable employment with a regular source of income",
            "Latest salary slips may be required",
            "Recent bank statements may be required",
            "PAN and Aadhaar or other valid KYC documents",
            "Minimum age and income requirements depend on the lender",
        ],
    },
    {
        name: "Self Employed",
        shortDescription: "For individuals running their own business or working independently.",
        requirements: [
            "Stable business or self-employment income",
            "Bank statements may be required",
            "ITR or other income proof may be required",
            "PAN and Aadhaar or other valid KYC documents",
            "Business vintage and income criteria depend on the lender",
        ],
    },
    {
        name: "Professional",
        shortDescription: "For eligible professionals with a regular source of income.",
        requirements: [
            "Regular and verifiable professional income",
            "Relevant professional or business documents where applicable",
            "Recent bank statements may be required",
            "PAN and Aadhaar or other valid KYC documents",
            "Professional eligibility criteria depend on the lender",
        ],
    },
    {
        name: "Housewife",
        shortDescription: "Loan options may be available subject to lender-specific eligibility.",
        requirements: [
            "Eligibility depends on the lender's income and profile requirements",
            "A co-applicant or alternate income source may be considered by some lenders",
            "Bank statements may be required",
            "PAN and Aadhaar or other valid KYC documents",
            "Final approval depends on the lender's policies",
        ],
    },
    {
        name: "Business Owner",
        shortDescription: "For business owners looking for suitable personal loan options.",
        requirements: [
            "Established and verifiable business income",
            "Business and financial documents may be required",
            "Recent bank statements may be required",
            "ITR or other income proof may be required",
            "Business vintage, turnover and other criteria depend on the lender",
        ],
    },
    {
        name: "Pensioner / Retired",
        shortDescription: "For eligible pensioners and retired individuals.",
        requirements: [
            "Regular pension or eligible income source",
            "Pension-related documents may be required",
            "Recent bank statements may be required",
            "PAN and Aadhaar or other valid KYC documents",
            "Age and repayment criteria depend on the lender",
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
            <section className="personal-loan-hero">

                <div className="hero-badge">
                    Personal Loan
                </div>

                <h1>
                    Personal Loan Starting from 9.99% – Compare 42+ Banks & NBFCs
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
            <section className="personal-loan-content">

                <div className="section-label">
                    PERSONAL LOAN
                </div>

                <h2>
                    Compare Personal Loan Options Online
                </h2>

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

                <h2>
                    Apply for a Personal Loan Online – No Office Visit Required
                </h2>

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
                    <strong>
                        Compare. Choose. Apply — with LoanSaarthi.
                    </strong>
                </p>

            </section>


            {/* WHO CAN APPLY SECTION */}
            <section className="apply-section">

                <div className="section-heading">

                    <div className="section-label">
                        ELIGIBILITY
                    </div>

                    <h2>
                        Who Can Apply
                    </h2>

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


                            {/* Existing HeroVerificationCard can be placed here later */}
                            {showForm && <HeroVerificationCard />}
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