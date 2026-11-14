import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Eligibility Checker Online | Check Loan Eligibility Across 42+ Banks",
  description:
    "Check your loan eligibility online for Personal, Home, and Business loans across 42+ banks and NBFCs in India. Discover your maximum borrowing limit, monthly EMI, and approval probability instantly with LoanSaarthi.",
  keywords: [
    "loan eligibility checker",
    "check loan eligibility online",
    "personal loan eligibility calculator",
    "home loan eligibility calculator India",
    "business loan eligibility check",
    "loan eligibility calculator India",
    "cibil score loan eligibility",
    "foir loan eligibility calculator",
    "maximum loan eligibility calculator",
    "instant loan eligibility check",
    "LoanSaarthi loan eligibility",
  ],
  alternates: {
    canonical: "https://www.loansaarthi.com/check-eligibility",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Loan Eligibility Checker Online | Check Loan Eligibility Across 42+ Banks",
    description:
      "Check your loan eligibility online across 42+ leading banks and NBFCs with LoanSaarthi. Instant calculation, zero credit impact, and lowest interest rates.",
    url: "https://www.loansaarthi.com/check-eligibility",
    siteName: "LoanSaarthi",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 600,
        height: 600,
        alt: "LoanSaarthi Loan Eligibility Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Eligibility Checker Online | LoanSaarthi",
    description:
      "Check your loan eligibility online across 42+ banks and NBFCs with instant pre-qualification and lowest interest rates at LoanSaarthi.",
    images: ["/logo.png"],
  },
};

export default function CheckEligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
