import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Loan Online | Cheapest Personal Loan in India",
  description:
    "Compare personal loan options from 42+ Banks & NBFCs in India. Explore low-interest personal loans with 100% digital loan assistance, easy eligibility checks and online processing.",
  keywords: [
    "personal loan",
    "personal loan online",
    "cheapest personal loan in India",
    "personal loan in India",
    "low interest personal loan",
    "100% digital personal loan",
    "personal loan apply online",
    "personal loan eligibility",
    "personal loan EMI calculator",
    "instant personal loan",
    "personal loan interest rate",
  ],
  alternates: {
    canonical: "https://www.loansaarthi.com/personal-loan",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Personal Loan Online | Cheapest Personal Loan in India",
    description:
      "Compare personal loan options from 42+ Banks & NBFCs in India with LoanSaarthi. Explore low-interest personal loans and 100% digital loan assistance.",
    url: "https://www.loansaarthi.com/personal-loan",
    siteName: "LoanSaarthi",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Loan Online | Cheapest Personal Loan in India",
    description:
      "Compare personal loan options from 42+ Banks & NBFCs in India with LoanSaarthi.",
    images: ["/logo.png"],
  },
};

export default function PersonalLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}