import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.loansaarthi.com"),
  title: {
    default: "LoanSaarthi | Compare 42+ Banks & Lowest Interest Loans",
    template: "%s | LoanSaarthi",
  },
  description:
    "Compare and apply for Personal, Business, Home Loans & Dropline Overdraft across 42+ Banks & NBFCs with LoanSaarthi. Lowest interest rates and 100% digital loan assistance.",
  keywords: [
    "Loan Calculator",
    "EMI Calculator",
    "Personal Loan",
    "Home Loan",
    "Business Loan",
    "Dropline Overdraft",
    "Loan Against Property",
    "LoanSaarthi",
    "Interest Rate Calculator",
  ],
  authors: [{ name: "LoanSaarthi" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LoanSaarthi | Compare 42+ Banks & Lowest Interest Loans",
    description:
      "Compare loan offers across 42+ banks and NBFCs with instant sanctions and lowest interest rates at LoanSaarthi.",
    url: "https://www.loansaarthi.com",
    siteName: "LoanSaarthi",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 600,
        height: 600,
        alt: "LoanSaarthi Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanSaarthi | Compare 42+ Banks & Lowest Interest Loans",
    description:
      "Compare loan offers across 42+ banks and NBFCs with instant sanctions and lowest interest rates at LoanSaarthi.",
    images: ["/logo.png"],
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
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
        <GoogleAnalytics gaId="G-HH4G9YY3LC" />
      </body>
    </html>
  );
}