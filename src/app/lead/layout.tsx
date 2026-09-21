import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads | LoanSaarthi",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

