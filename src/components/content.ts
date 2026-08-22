import {
  Landmark,
  ShieldCheck,
  Clock3,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type WhyItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const WHY: WhyItem[] = [
  {
    icon: ShieldCheck,
    title: "Rates worth entering",
    text: "We compare offers across 30+ lenders so the number that goes in your ledger is the lowest one available to you.",
  },
  {
    icon: UserCheck,
    title: "Paperwork we carry",
    text: "Income proof, credit checks, property documents — collected, verified and filed on your behalf.",
  },
  {
    icon: Clock3,
    title: "Days, not months",
    text: "Most sanctions come through in 4–7 working days because your file reaches the right desk the first time.",
  },
  {
    icon: Landmark,
    title: "One advisor, start to finish",
    text: "The person you speak to on day one is the person who hands you the sanction letter.",
  },
];

export type Step = {
  label: string;
  detail: string;
};

export const STEPS: Step[] = [
  {
    label: "Apply",
    detail: "Share your requirement and documents — in person, on call, or on WhatsApp.",
  },
  {
    label: "Verify",
    detail: "We match you to lenders you actually qualify for and prepare your file.",
  },
  {
    label: "Sanction",
    detail: "Your application is submitted and tracked until approval is confirmed.",
  },
  {
    label: "Disburse",
    detail: "Funds are released to your account, and we stay on for any post-loan queries.",
  },
];

export const BANKS: string[] = [
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Axis Finance",
  "IDFC FIRST Bank",
  "Bajaj Finserv",
  "Kotak Mahindra Bank",
  "Tata Capital",
  "Aditya Birla Capital",
  "Piramal Finance",
  "L&T Finance",
];

export type Testimonial = {
  quote: string;
  name: string;
  tag: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "They found us a rate 0.4% lower than what our own bank offered, and handled every follow-up call so we didn't have to.",
    name: "Ritu & Sanjay Malhotra",
    tag: "Home Loan, ₹62 L",
  },
  {
    quote:
      "I run a small workshop and don't have time to sit in bank branches. They took the file end to end and called me only when a signature was needed.",
    name: "Deepak Verma",
    tag: "Business Loan, ₹18 L",
  },
  {
    quote:
      "Transparent about what we'd qualify for from day one — no surprises when the sanction letter arrived.",
    name: "Ayesha Khan",
    tag: "Personal Loan, ₹6 L",
  },
];

export type Faq = {
  q: string;
  a: string;
};

export const FAQS: Faq[] = [
  {
    q: "Is there a fee to consult with Loansaarthi?",
    a: "The initial consultation and eligibility check are free. Our fee, when applicable, is disclosed in writing before you engage us — never deducted silently from your loan amount.",
  },
  {
    q: "What documents do I need to start?",
    a: "Typically PAN, Aadhaar, last 6 months' bank statements, income proof (salary slips or ITR), and property documents where relevant. We'll give you an exact checklist for your loan type on the first call.",
  },
  {
    q: "Will checking my eligibility affect my credit score?",
    a: "No. Our initial eligibility check uses a soft enquiry, which does not impact your credit score. A hard enquiry only happens once you choose to formally apply with a lender.",
  },
  {
    q: "How is Loansaarthi different from applying directly at a bank?",
    a: "We compare offers across our partner lenders instead of one, handle documentation and follow-ups on your behalf, and flag issues in your file before a bank does — which is usually what causes delays or rejections.",
  },
];
