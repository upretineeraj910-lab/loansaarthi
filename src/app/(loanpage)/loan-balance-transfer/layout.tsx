import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Balance Transfer Online | Reduce EMI with Lowest Interest Rates",
  description:
    "Transfer your existing loan to leading banks & NBFCs starting at 8.25% p.a. Reduce your monthly EMIs and avail Top-Up loans up to ₹50 Lakhs with 100% digital assistance from LoanSaarthi.",
  keywords: [
    "loan balance transfer",
    "home loan balance transfer",
    "personal loan balance transfer",
    "balance transfer interest rate",
    "loan takeover online",
    "lowest interest balance transfer",
    "loan top up facility",
    "reduce loan emi",
  ],
  alternates: {
    canonical: "https://www.loansaarthi.com/loan-balance-transfer",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Loan Balance Transfer Online | Lowest Interest Rates | LoanSaarthi",
    description:
      "Transfer your loan to top banks starting at 8.25% p.a. Lower EMIs and get top-up loans up to ₹50 Lakhs.",
    url: "https://www.loansaarthi.com/loan-balance-transfer",
    siteName: "LoanSaarthi",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Balance Transfer Online | Lowest Interest Rates | LoanSaarthi",
    description:
      "Transfer your loan to top banks starting at 8.25% p.a. Lower EMIs and get top-up loans up to ₹50 Lakhs.",
    images: ["/logo.png"],
  },
};

export default function LoanBalanceTransferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

