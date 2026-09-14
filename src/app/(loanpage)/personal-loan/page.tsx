// // app/personal-loan/page.js (or pages/personal-loan.js)

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
// import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
// import "../loan-page.css";
// import { useEffect } from "react";


// export default function PersonalLoanPage() {
//    useEffect(()=>{
//       document.title = "Personal Loan"
//     })
//   return (
//     <main className="lp-page">
//       <div className="lp-container">

//         {/* ================= HERO ================= */}
//         <section className="lp-hero">

//           <div className="lp-hero-main">
//             <div className="lp-breadcrumb" style={{ fontSize: '12px', color: 'var(--lp-desc)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
//               <span>⌂</span>
//               <span>Home</span>
//               <span>›</span>
//               <span style={{ color: 'var(--lp-title)', fontWeight: '600' }}>Personal Loan</span>
//             </div>

//             <h1>Personal Loan</h1>
//             <h2 style={{ fontSize: '20px', color: 'var(--lp-desc)', marginBottom: '16px', fontWeight: '500' }}>
//               Instant Approval. Quick Disbursal.
//             </h2>

//             <p className="lp-desc-txt">
//               HDFC Bank and Tata Capital offer instant personal loans starting at 9.99%. 
//               With a monthly salary of ₹25,000+ and a CIBIL score of 750+, the amount is 
//               disbursed directly to your account within 24 hours — with no collateral required.
//               <span style={{ display: 'block', marginTop: '6px', fontSize: '13px', color: 'var(--lp-green)' }}>
//                 <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
//                 100% paperless process with digital KYC
//               </span>
//             </p>

//             <div className="lp-specs">
//               <div className="lp-spec-item">
//                 <span>Interest Rate</span>
//                 <strong className="lp-color-green">
//                   From 9.99% p.a.
//                 </strong>
//               </div>

//               <div className="lp-spec-item">
//                 <span>Max Amount</span>
//                 <strong>Up to ₹25 L</strong>
//               </div>

//               <div className="lp-spec-item">
//                 <span>Disbursal Time</span>
//                 <strong>Within 24 hrs</strong>
//               </div>
//             </div>

//             <div className="home-loan-benefits" style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--lp-text)' }}>
//               <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                 <CheckCircle2 size={16} className="lp-color-green" />
//                 No Collateral Required
//               </span>
//               <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                 <CheckCircle2 size={16} className="lp-color-green" />
//                 Digital KYC
//               </span>
//               <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                 <CheckCircle2 size={16} className="lp-color-green" />
//                 Instant Disbursal
//               </span>
//             </div>

//             {/* CTA MOVED TO LEFT COLUMN FOR BETTER UX FLOW */}
//             <div style={{ marginTop: '32px', padding: '24px', background: 'var(--lp-box)', borderRadius: '12px', border: '1px solid var(--lp-border)' }}>
//               <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: 'var(--lp-title)' }}>Apply for Personal Loan</h3>
//               <p style={{ fontSize: '14px', color: 'var(--lp-desc)', margin: '0 0 16px' }}>
//                 Get instant approval in just 2 minutes with digital KYC.
//               </p>

//               <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
//                 <Link
//                   href="/#loan-eligibility-form"
//                   className="lp-cta-btn"
//                   style={{ background: 'var(--lp-green)', color: '#fff' }}
//                 >
//                   Check Eligibility
//                   <ArrowRight size={17} />
//                 </Link>

//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--lp-desc)', fontWeight: '500' }}>
//                   <ShieldCheck size={16} className="lp-color-green" />
//                   <span>100% paperless</span>
//                   <span>•</span>
//                   <span>Secure process</span>
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* CLEAN IMAGE CONTAINER */}
//           <div className="lp-hero-side" style={{ padding: '0', overflow: 'hidden', position: 'relative', minHeight: '350px' }}>
//             <Image
//               src="/images/icons/personal_loan.jpg"
//               alt="Personal loan - happy family enjoying financial freedom"
//               fill
//               style={{ objectFit: 'cover' }}
//               priority
//               sizes="(max-width: 768px) 100vw, 50vw"
//             />
//           </div>

//         </section>

//         {/* ================= CALCULATOR + BANKS ================= */}
//         <section className="lp-grid-2">

//           {/* USING YOUR EXISTING LoanEmiCalculator COMPONENT */}
//           <LoanEmiCalculator
//             variant="loan"
//             title="Personal Loan EMI Calculator"
//             amountLabel="Loan Amount"
//             amountDefault={500000}
//             amountMin={50000}
//             amountMax={2500000}
//             amountStep={10000}
//             tenureDefault={3}
//             tenureMin={1}
//             tenureMax={5}
//             rateLabel="Interest Rate (% p.a.)"
//             rateDefault={9.99}
//             rateMin={9.5}
//             rateMax={18.0}
//             rateStep={0.1}
//             emiLabel="Monthly EMI"
//           />

//           <div className="lp-card-box">
//             <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>₹</span> 
//               Top Personal Loan Banks
//             </h3>

//             <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
//               <table className="lp-table">
//                 <thead>
//                   <tr>
//                     <th>Bank</th>
//                     <th>Interest Rate</th>
//                     <th>Processing Fee</th>
//                     <th>Tenure</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td><strong>HDFC Bank</strong></td>
//                     <td className="lp-color-green font-semibold">9.99% - 13.50%</td>
//                     <td>Up to ₹4,999</td>
//                     <td>5 Yrs</td>
//                   </tr>
//                   <tr>
//                     <td><strong>ICICI Bank</strong></td>
//                     <td className="lp-color-green font-semibold">10.25% - 14.00%</td>
//                     <td>Up to 1.50%</td>
//                     <td>5 Yrs</td>
//                   </tr>
//                   <tr>
//                     <td><strong>Tata Capital</strong></td>
//                     <td className="lp-color-green font-semibold">10.49% - 15.25%</td>
//                     <td>1.00% - 2.00%</td>
//                     <td>5 Yrs</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Why Choose Personal Loan?</h3>
//             <ul className="lp-ul">
//               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> No collateral or guarantor required</li>
//               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> 100% digital process with video KYC</li>
//               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Funds disbursed within 24 hours</li>
//               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} className="lp-color-green" /> Flexible repayment options up to 5 years</li>
//             </ul>

//             {/* Live info */}
//             <div style={{ marginTop: '16px', background: 'var(--lp-box)', borderRadius: '8px', padding: '10px', fontSize: '13px', borderLeft: '3px solid var(--lp-green)' }}>
//               <CheckCircle2 size={16} className="lp-color-green" style={{ display: 'inline', marginRight: '6px' }} />
//               <strong>Limited period offer:</strong> 9.99% p.a. for salaried professionals with CIBIL ≥ 750.
//             </div>
//           </div>
//         </section>

//         {/* ================= ELIGIBILITY + DOCUMENTS ================= */}
//         <section className="lp-grid-2">

//           <div className="lp-card-box">
//             <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>✓</span> 
//               Eligibility Criteria
//             </h3>
//             <ul className="lp-ul" style={{ gap: '12px' }}>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Age: 21 to 58 years</span></li>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Employment: Full-time Salaried in Pvt / Govt / MNC firm</span></li>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Net Monthly Salary: Minimum ₹25,000</span></li>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>CIBIL Score: 720+ for best rates</span></li>
//             </ul>
//           </div>

//           <div className="lp-card-box">
//             <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <span style={{ background: 'var(--lp-box)', padding: '6px 10px', borderRadius: '8px' }}>▤</span> 
//               Required Documents
//             </h3>
//             <ul className="lp-ul" style={{ gap: '12px' }}>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Aadhaar Card & PAN Card (KYC)</span></li>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Latest 3 Months Salary Slips</span></li>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Last 6 Months Salary Account Bank Statement</span></li>
//               <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={18} className="lp-color-green" style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Official Company ID Card</span></li>
//             </ul>
//           </div>

//         </section>

//         {/* ================= CTA ================= */}
//         <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--lp-card)', border: '1px solid var(--lp-border)', borderRadius: '14px', padding: '32px', marginTop: '24px', flexWrap: 'wrap', gap: '20px' }}>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//             <div style={{ background: 'var(--lp-box)', padding: '16px', borderRadius: '12px', color: 'var(--lp-green)' }}>
//               <ShieldCheck size={32} />
//             </div>
//             <div>
//               <h3 style={{ fontSize: '20px', color: 'var(--lp-title)', margin: '0 0 6px' }}>Need a personal loan for your dream project?</h3>
//               <p style={{ margin: '0', color: 'var(--lp-desc)', fontSize: '15px' }}>Get personalized offers from top banks in minutes.</p>
//             </div>
//           </div>

//           <Link href="/#loan-eligibility-form" className="lp-cta-btn" style={{ background: 'transparent', border: '2px solid var(--lp-title)', color: 'var(--lp-title)' }}>
//             Apply Now
//             <ArrowRight size={17} />
//           </Link>

//         </section>

//       </div>
//     </main>
//   );
// }





import Script from "next/script";
import LoanEmiCalculator from "@/components/loan/LoanEmiCalculator";
import HeroVerificationCard from "@/components/HeroVerificationCard";

const APPLY_CATEGORIES = [
  {
    number: "01",
    title: "Salaried",
    description: "Employees with regular monthly income and salary credits.",
  },
  {
    number: "02",
    title: "Self-Employed",
    description: "Business owners and independent professionals with income proof.",
  },
  {
    number: "03",
    title: "Professional",
    description: "Doctors, lawyers, consultants and other qualified professionals.",
  },
  {
    number: "04",
    title: "Housewife",
    description: "Applicants supported through eligible income or family profile.",
  },
  {
    number: "05",
    title: "Business Owner",
    description: "Established businesses with suitable banking and income records.",
  },
  {
    number: "06",
    title: "Pensioner / Retired",
    description: "Retired applicants with eligible pension or other regular income.",
  },
];

const TRUST_BADGES = [
  {
    number: "01.",
    title: "42+ Lenders",
  },
  {
    number: "02.",
    title: "100% Digital",
  },
  {
    number: "03.",
    title: "Profile Matching",
  },
];

const FAQS = [
  {
    question: "How can I apply for a personal loan online in India?",
    answer:
      "You can start by submitting your basic details online. Loan Saarthi helps assess your profile and identify suitable personal loan options from its partner lenders. Final approval, interest rate and loan amount are subject to the selected lender's eligibility criteria.",
  },
  {
    question: "Can I get a low interest personal loan?",
    answer:
      "The interest rate offered depends on factors such as income, employment profile, credit history, existing obligations, loan amount and lender-specific policies. Comparing suitable lenders can help you identify an appropriate offer.",
  },
  {
    question: "Does checking personal loan eligibility affect my credit score?",
    answer:
      "An initial eligibility assessment may not require a hard credit enquiry. A lender may perform its own credit assessment when you formally apply. The exact process depends on the lender.",
  },
  {
    question: "What documents are generally required for a personal loan?",
    answer:
      "Depending on the lender and applicant profile, commonly requested documents can include PAN, Aadhaar or other KYC documents, bank statements, salary slips or income proof, employment or business details and other supporting documents.",
  },
];

const financialProductSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "Personal Loan",
  description:
    "Compare suitable personal loan options in India based on profile, eligibility, income and requirements.",
  url: "https://app.loansaarthi.com/personal_loan",
  brand: {
    "@type": "Brand",
    name: "Loan Saarthi",
  },
  category: "Personal Loan",
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: "9.99",
    description: "Personal loan interest rates starting from 9.99%, subject to lender eligibility and approval.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const metadata = {
  title: "Personal Loan Starting from 9.99% – Compare 42+ Banks & NBFCs",
  description:
    "Compare personal loan options in India starting from 9.99%. Check suitable lenders, eligibility and apply online without visiting a branch.",
  keywords: [
    "personal loan online apply india",
    "low interest personal loan",
    "personal loan",
    "personal loan eligibility",
    "personal loan interest rate",
    "personal loan online",
  ],
  alternates: {
    canonical: "https://app.loansaarthi.com/personal_loan",
  },
};

export default function PersonalLoanPage() {
  return (
    <>
      {/* =========================
          STRUCTURED DATA
      ========================== */}

      <Script
        id="personal-loan-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(financialProductSchema),
        }}
      />

      <Script
        id="personal-loan-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen bg-white text-gray-900">

        {/* =========================
            HERO
        ========================== */}

        <section
          id="eligibility"
          className="py-8 sm:py-12 lg:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">

              {/* HERO LEFT */}
              <div className="max-w-2xl">

                <div className="mb-3 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:mb-4 sm:px-4 sm:py-1.5">
                  Compare 42+ Top Banks &amp; NBFCs in India
                </div>

                <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
                  Personal Loan Starting from 9.99% – Digital Approval
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                  Compare suitable options across India based on your profile,
                  eligibility, and requirements with zero branch visits.
                </p>

                {/* TRUST BADGES */}
                <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
                  {TRUST_BADGES.map((badge) => (
                    <div
                      key={badge.number}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 sm:p-3"
                    >
                      <div className="text-[10px] font-semibold text-emerald-600 sm:text-xs">
                        {badge.number}
                      </div>

                      <div className="mt-0.5 text-xs font-semibold text-gray-800 sm:text-sm">
                        {badge.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* MOBILE CTA */}
                <a
                  href="#loan-application"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto lg:hidden"
                >
                  Check Eligibility
                </a>
              </div>

              {/* HERO RIGHT / LEAD CAPTURE */}
              <div
                id="loan-application"
                className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Check Your Personal Loan Eligibility
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    Share your details to explore suitable personal loan
                    options.
                  </p>
                </div>

                <HeroVerificationCard />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            QUICK VALUE STRIP
        ========================== */}

        <section className="border-y border-gray-100 bg-gray-50 py-5 sm:py-6">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <div className="text-base font-bold text-emerald-600 sm:text-lg">
                42+
              </div>
              <div className="text-[11px] text-gray-500 sm:text-xs">
                Banks &amp; NBFCs
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <div className="text-base font-bold text-emerald-600 sm:text-lg">
                9.99%
              </div>
              <div className="text-[11px] text-gray-500 sm:text-xs">
                Starting rate
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <div className="text-base font-bold text-emerald-600 sm:text-lg">
                Digital
              </div>
              <div className="text-[11px] text-gray-500 sm:text-xs">
                Application process
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <div className="text-base font-bold text-emerald-600 sm:text-lg">
                0
              </div>
              <div className="text-[11px] text-gray-500 sm:text-xs">
                Branch visits required
              </div>
            </div>

          </div>
        </section>

        {/* =========================
            EMI CALCULATOR
        ========================== */}

        <section
          id="calculator"
          className="py-8 sm:py-12 lg:py-16"
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Plan Your Monthly EMI
              </h2>

              <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
                Estimate your monthly personal loan EMI based on loan amount,
                interest rate and repayment tenure.
              </p>
            </div>

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
        </section>

        {/* =========================
            WHO CAN APPLY
        ========================== */}

        <section
          id="eligibility-categories"
          className="bg-gray-50 py-8 sm:py-12 lg:py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

            <div className="mb-6 text-center sm:mb-8">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Who Can Apply for a Personal Loan?
              </h2>

              <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
                Personal loan eligibility depends on income, credit profile,
                employment, existing obligations and lender policy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {APPLY_CATEGORIES.map((category) => (
                <article
                  key={category.number}
                  className="rounded-xl border border-gray-100 bg-white p-3 transition hover:border-emerald-500 hover:shadow-sm sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 sm:text-xs">
                      {category.number}
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {category.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            HOW IT WORKS
        ========================== */}

        <section className="py-8 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

            <div className="mb-6 text-center sm:mb-8">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                How Personal Loan Assistance Works
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                <span className="text-xs font-bold text-emerald-600">
                  01
                </span>
                <h3 className="mt-2 text-sm font-semibold">
                  Share Details
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Provide basic profile and loan requirement details.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                <span className="text-xs font-bold text-emerald-600">
                  02
                </span>
                <h3 className="mt-2 text-sm font-semibold">
                  Profile Matching
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Suitable lender options are identified for your profile.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                <span className="text-xs font-bold text-emerald-600">
                  03
                </span>
                <h3 className="mt-2 text-sm font-semibold">
                  Document Check
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Required documents are collected according to lender needs.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                <span className="text-xs font-bold text-emerald-600">
                  04
                </span>
                <h3 className="mt-2 text-sm font-semibold">
                  Lender Decision
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Final approval and terms are decided by the lender.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =========================
            FAQ
        ========================== */}

        <section
          id="faq"
          className="bg-gray-50 py-8 sm:py-12 lg:py-16"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6">

            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Personal Loan FAQs
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Answers to common personal loan questions in India.
              </p>
            </div>

            <div className="space-y-2">
              {FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 sm:px-5 sm:py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span>{faq.question}</span>

                      <span className="shrink-0 text-lg text-emerald-600 transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>

                  <div className="border-t border-gray-100 px-4 py-3 sm:px-5">
                    <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

          </div>
        </section>

        {/* =========================
            LENDER POLICY NOTICE
        ========================== */}

        <section className="py-5 sm:py-7">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-500">
              <strong className="font-semibold text-gray-700">
                Lender Policy Notice:
              </strong>{" "}
              Loan Saarthi is a loan assistance and comparison platform.
              Interest rates, loan amounts, processing fees, tenure, eligibility
              requirements and approval decisions are determined by individual
              banks and NBFCs. A starting rate of 9.99% does not guarantee that
              every applicant will receive the same rate. Final approval is
              subject to the lender's credit assessment and applicable policies.
            </div>
          </div>
        </section>

        {/* =========================
            MOBILE STICKY CTA
        ========================== */}

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 p-2 backdrop-blur sm:hidden">
          <a
            href="#loan-application"
            className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            Check Eligibility
          </a>
        </div>

        {/* Bottom spacing for sticky CTA on mobile */}
        <div className="h-14 sm:hidden" />

      </main>
    </>
  );
}