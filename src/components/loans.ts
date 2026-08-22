export type LoanType = {
  n: string;
  name: string;
  desc: string;
  rate: string;
  range: string;
  href: string;
};

export const LOAN_TYPES: LoanType[] = [
  {
    n: "01",
    name: "Home Loan",
    desc: "Purchase, construction or balance transfer, arranged with your repayment capacity in mind, not the bank's target.",
    rate: "from 8.35%",
    range: "up to ₹5 Cr",
    href: "/loanpage/home-loan",
  },
  {
    n: "02",
    name: "Loan Against Property",
    desc: "Unlock funds against residential or commercial property without giving up ownership.",
    rate: "from 8.95%",
    range: "up to ₹3 Cr",
    href: "/loanpage/loan-against-property",
  },
  {
    n: "03",
    name: "Business Loan",
    desc: "Working capital and expansion funding, matched to your GST filings and cash-flow cycle.",
    rate: "from 10.50%",
    range: "up to ₹1 Cr",
    href: "/loanpage/business-loan",
  },
  {
    n: "04",
    name: "Personal Loan",
    desc: "For the expenses that don't wait — medical, wedding, travel — sanctioned in days.",
    rate: "from 9.99%",
    range: "up to ₹25 L",
    href: "/loanpage/personal-loan",
  },
  {
    n: "05",
    name: "Education Loan",
    desc: "Domestic and overseas study, structured around your course start date and moratorium needs.",
    rate: "from 8.15%",
    range: "up to ₹75 L",
    href: "/loanpage/education-loan",
  },
  {
    n: "06",
    name: "Loan Balance Transfer",
    desc: "Move an existing loan to a lower rate. We do the paperwork; you keep the difference.",
    rate: "from 8.25%",
    range: "any amount",
    href: "/loanpage/loan-balance-transfer",
  },
];
