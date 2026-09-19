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
    "Home Loan",
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
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
        <GoogleAnalytics gaId="G-BJE4D5EX9T" />
      </body>
    </html>
  );
}