export type LoanType = {
  n: string;
  name: string;
  desc: string;
  rate: string;
  range: string;
  href: string;
  icon: string;
  features: string[];
};

export const LOAN_TYPES: LoanType[] = [
  {
    n: "01",
    name: "Home Loan",
    desc: "Purchase, construct, or transfer your home loan effortlessly with flexible EMI options.",
    rate: "from 8.35%",
    range: "up to ₹5 Cr",
    href: "/home-loan",
    icon: "🏠",
    features: ["Flexible EMI", "Minimal Docs", "Quick Disbursal"],
  },
  {
    n: "02",
    name: "Loan Against Property",
    desc: "Unlock high-value funds against your residential or commercial property without giving up ownership.",
    rate: "from 8.95%",
    range: "up to ₹3 Cr",
    href: "/loan-against-property",
    icon: "🏢",
    features: ["High Value", "Minimal Docs", "Quick Disbursal"],
  },
  {
    n: "03",
    name: "Business Loan",
    desc: "Fuel your business expansion and working capital needs perfectly matched to your cash-flow cycle.",
    rate: "from 10.50%",
    range: "up to ₹1 Cr",
    href: "/business-loan",
    icon: "💼",
    features: ["GST Based", "Fast Approval", "Flexible EMI"],
  },
  {
    n: "04",
    name: "Personal Loan",
    desc: "Handle sudden medical emergencies, weddings, or travel expenses instantly with stress-free processing.",
    rate: "from 9.99%",
    range: "up to ₹25 L",
    href: "/personal-loan",
    icon: "👤",
    features: ["Instant Sanction", "Soft CIBIL Check", "Quick Disbursal"],
  },
  {
    n: "05",
    name: "Education Loan",
    desc: "Secure funding for domestic and overseas studies, perfectly structured around your course timeline.",
    rate: "from 8.15%",
    range: "up to ₹75 L",
    href: "/education-loan",
    icon: "🎓",
    features: ["Moratorium", "Minimal Docs", "Quick Disbursal"],
  },
  {
    n: "06",
    name: "Loan Balance Transfer",
    desc: "Move your existing high-interest loan to a lower rate and save big on your monthly payouts.",
    rate: "from 8.25%",
    range: "any amount",
    href: "/loan-balance-transfer",
    icon: "🔄",
    features: ["Lower Rate", "Save EMI", "Minimal Docs"],
  },
];