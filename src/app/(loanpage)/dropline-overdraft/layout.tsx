import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dropline Overdraft Facility | Secured Business Funding in India",
  description:
    "Explore Dropline Overdraft facility for your business — a secured funding solution with a reducing limit over time. Compare offers from 42+ Banks & NBFCs with LoanSaarthi's 100% digital assistance.",
  keywords: [
    "dropline overdraft",
    "dropline overdraft facility",
    "overdraft against property",
    "business overdraft loan",
    "secured overdraft facility India",
    "dropline OD interest rate",
    "dropline overdraft eligibility",
  ],
  alternates: {
    canonical: "https://www.loansaarthi.com/dropline-overdraft",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Dropline Overdraft Facility | Secured Business Funding in India",
    description:
      "Compare Dropline Overdraft facility options from 42+ Banks & NBFCs with LoanSaarthi. Secured funding solution with 100% digital loan assistance.",
    url: "https://www.loansaarthi.com/dropline-overdraft",
    siteName: "LoanSaarthi",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dropline Overdraft Facility | Secured Business Funding in India",
    description:
      "Compare Dropline Overdraft facility options from 42+ Banks & NBFCs with LoanSaarthi.",
    images: ["/logo.png"],
  },
};

export default function DroplineOverdraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}