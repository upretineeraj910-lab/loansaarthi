import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LoanSaarthi | Instant Loan & EMI Calculator",
    template: "%s | LoanSaarthi",
  },
  description:
    "Calculate instant loan EMIs, interest rates, and loan tenure easily with LoanSaarthi. Get transparent loan breakdown and best rate reviews.",
  keywords: [
    "Loan Calculator",
    "EMI Calculator",
    "Personal Loan",
    "Home Loan Calculator",
    "LoanSaarthi",
    "Interest Rate Calculator",
  ],
  authors: [{ name: "LoanSaarthi" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LoanSaarthi | Instant Loan & EMI Calculator",
    description:
      "Calculate your monthly EMI and total loan interest instantly with LoanSaarthi.",
    siteName: "LoanSaarthi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanSaarthi | Instant Loan & EMI Calculator",
    description:
      "Calculate your monthly EMI and total loan interest instantly with LoanSaarthi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}