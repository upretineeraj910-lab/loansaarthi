import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Form | LoanSaarthi",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SharedFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

