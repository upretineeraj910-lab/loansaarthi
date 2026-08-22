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
    desc: "Purchase, construct, or transfer your home loan effortlessly with interest rates starting from just 8.35%. We prioritize your repayment capacity over bank targets by offering <strong>flexible EMI options</strong>. Experience a hassle-free process with <strong>minimum documentation</strong>, transparent <strong>CIBIL score checks</strong>, and <strong>quick disbursal</strong> so your dream home doesn't wait.",
    rate: "from 8.35%",
    range: "up to ₹5 Cr",
    href: "/loanpage/home-loan",
  },
  {
    n: "02",
    name: "Loan Against Property",
    desc: "Unlock high-value funds up to ₹3 Cr against your residential or commercial property without giving up ownership. Starting at 8.95%, our customized solutions ensure you get the liquidity you need. Benefit from <strong>minimum documentation</strong> and <strong>quick disbursal</strong> for your urgent financial or business requirements.",
    rate: "from 8.95%",
    range: "up to ₹3 Cr",
    href: "/loanpage/loan-against-property",
  },
  {
    n: "03",
    name: "Business Loan",
    desc: "Fuel your business expansion and working capital needs with loans starting at 10.50%. We match funding perfectly to your GST filings and cash-flow cycle. Enjoy a seamless application process featuring <strong>minimum documentation</strong>, fast <strong>CIBIL score checks</strong>, and convenient <strong>EMI options</strong> tailored for business owners.",
    rate: "from 10.50%",
    range: "up to ₹1 Cr",
    href: "/loanpage/business-loan",
  },
  {
    n: "04",
    name: "Personal Loan",
    desc: "Handle sudden expenses like medical emergencies, weddings, or travel instantly with rates from 9.99%. We ensure a smooth experience with a soft <strong>CIBIL score check</strong> that doesn't hurt your rating. Get funds sanctioned in days with <strong>quick disbursal</strong>, <strong>minimum documentation</strong>, and stress-free <strong>EMI options</strong>.",
    rate: "from 9.99%",
    range: "up to ₹25 L",
    href: "/loanpage/personal-loan",
  },
  {
    n: "05",
    name: "Education Loan",
    desc: "Secure funding for domestic and overseas studies with competitive rates starting at 8.15%. We structure the loan around your specific course start date and moratorium needs. With <strong>minimum documentation</strong> and <strong>quick disbursal</strong>, students can focus purely on their education rather than financial paperwork.",
    rate: "from 8.15%",
    range: "up to ₹75 L",
    href: "/loanpage/education-loan",
  },
  {
    n: "06",
    name: "Loan Balance Transfer",
    desc: "Move your existing high-interest loan to a lower rate starting from 8.25% and save big on your monthly payouts. We do all the heavy lifting and paperwork on your behalf with <strong>minimum documentation</strong>. Keep the difference and enjoy better <strong>EMI options</strong> with our smooth transfer process.",
    rate: "from 8.25%",
    range: "any amount",
    href: "/loanpage/loan-balance-transfer",
  },
];