import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at LoanSaarthi | Join India's Trusted Loan Advisory Team",
  description:
    "Explore exciting career opportunities at LoanSaarthi. Join our team of passionate financial experts, loan advisors, and credit specialists in Delhi and across India.",
  keywords: [
    "LoanSaarthi careers",
    "jobs at LoanSaarthi",
    "fintech jobs Delhi",
    "loan relationship manager jobs",
    "credit analyst jobs",
  ],
  alternates: {
    canonical: "https://www.loansaarthi.com/career",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Careers at LoanSaarthi | Join Our Team",
    description:
      "Build your career in finance and fintech with LoanSaarthi. Discover open positions in Delhi, Mumbai, Bangalore and remote.",
    url: "https://www.loansaarthi.com/career",
    siteName: "LoanSaarthi",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at LoanSaarthi",
    description:
      "Explore exciting careers in fintech and loan advisory with LoanSaarthi.",
    images: ["/logo.png"],
  },
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

