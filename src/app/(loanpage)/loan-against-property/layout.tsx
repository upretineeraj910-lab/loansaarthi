import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Against Property (LAP) | Mortgage Loan Online in India",
  description:
    "Get a Loan Against Property by pledging your residential or commercial property. Compare LAP options from 42+ Banks & NBFCs with low interest rates and 100% digital assistance from LoanSaarthi.",
  keywords: [
    "loan against property",
    "LAP loan",
    "mortgage loan India",
    "property loan online",
    "loan against property interest rate",
    "loan against property eligibility",
    "LAP EMI calculator",
    "secured loan against property",
  ],
  alternates: {
    canonical: "https://loansaarthi.com/loan-against-property",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Loan Against Property (LAP) | Mortgage Loan Online in India",
    description:
      "Compare Loan Against Property options from 42+ Banks & NBFCs with LoanSaarthi. Explore low interest rates and 100% digital loan assistance.",
    url: "https://loansaarthi.com/loan-against-property",
    siteName: "LoanSaarthi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Against Property (LAP) | Mortgage Loan Online in India",
    description:
      "Compare Loan Against Property options from 42+ Banks & NBFCs with LoanSaarthi.",
  },
};

export default function LoanAgainstPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}