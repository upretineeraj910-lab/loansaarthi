import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Loan for Salaried | Best Home Loan Interest Rates in India",
  description:
    "Compare Home Loan options for salaried employees from 42+ Banks & NBFCs in India. Explore low interest rates, easy eligibility checks and 100% digital loan assistance with LoanSaarthi.",
  keywords: [
    "home loan for salaried",
    "home loan online",
    "home loan interest rate",
    "home loan India",
    "home loan eligibility salaried",
    "cheapest home loan",
    "home loan EMI calculator",
    "housing loan for salaried employees",
    "apply home loan online",
  ],
  alternates: {
    canonical: "https://loansaarthi.com/home-loan",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Home Loan for Salaried | Best Home Loan Interest Rates in India",
    description:
      "Compare Home Loan options for salaried employees from 42+ Banks & NBFCs with LoanSaarthi. Explore low interest rates and 100% digital loan assistance.",
    url: "https://loansaarthi.com/home-loan",
    siteName: "LoanSaarthi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Loan for Salaried | Best Home Loan Interest Rates in India",
    description:
      "Compare Home Loan options for salaried employees from 42+ Banks & NBFCs with LoanSaarthi.",
  },
};

export default function HomeLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}