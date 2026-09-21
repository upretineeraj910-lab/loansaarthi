import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Loan Online | Instant Business Loans for MSMEs in India",
  description:
    "Apply for a Business Loan with flexible repayment options. Compare business loan offers from 42+ Banks & NBFCs in India with low interest rates and 100% digital loan assistance from LoanSaarthi.",
  keywords: [
    "business loan",
    "business loan online",
    "instant business loan",
    "business loan for MSME",
    "business loan interest rate",
    "business loan eligibility",
    "business loan EMI calculator",
    "unsecured business loan India",
  ],
  alternates: {
    canonical: "https://www.loansaarthi.com/business-loan",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Business Loan Online | Instant Business Loans for MSMEs in India",
    description:
      "Compare Business Loan options from 42+ Banks & NBFCs with LoanSaarthi. Flexible repayment options and 100% digital loan assistance.",
    url: "https://www.loansaarthi.com/business-loan",
    siteName: "LoanSaarthi",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Loan Online | Instant Business Loans for MSMEs in India",
    description:
      "Compare Business Loan options from 42+ Banks & NBFCs with LoanSaarthi.",
    images: ["/logo.png"],
  },
};

export default function BusinessLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}