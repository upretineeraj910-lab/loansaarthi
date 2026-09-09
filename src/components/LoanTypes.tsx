import Link from "next/link";
import Image from "next/image";
import "./LoanTypes.css";

type LoanCard = {
  name: string;
  desc: string;
  href: string;
  icon: string;
};

const SALARIED_LOANS: LoanCard[] = [
  {
    name: "Personal Loan",
    desc: "Get instant approval for affordable personal loans.",
    href: "/personal-loan",
    icon: "/images/icons/personal-loan.png",
  },
  {
    name: "Home Loan for Salaried",
    desc: "It's a secured loan that can be availed for a residential property.",
    href: "/home-loan",
    icon: "/images/icons/h-loan.png",
  },
  {
    name: "Loan Against Property",
    desc: "LAP is a mortgage or secured loan availed after pledging a property.",
    href: "/loan-against-property",
    icon: "/images/icons/lp-loan.png",
  },
];

const BUSINESS_LOANS: LoanCard[] = [
  {
    name: "Business Loan",
    desc: "Apply for instant business loans with flexible repayment options.",
    href: "/business-loan",
    icon: "/images/icons/bu-loan.png",
  },
  {
    name: "Dropline Overdraft",
    desc: "Dropline Overdraft are secured business funding solutions.",
    href: "/dropline-overdraft",
    icon: "/images/icons/d-loan.png",
  },
  {
    name: "Home Loan for Business Owner",
    desc: "Get flexible home loan solutions designed for business owners.",
    href: "/home-loan",
    icon: "/images/icons/h-loan.png",
  },
  {
    name: "Loan Against Property",
    desc: "Get funds against your property with flexible repayment options.",
    href: "/loan-against-property",
    icon: "/images/icons/lp-loan.png",
  },
];

function LoanCard({ loan }: { loan: LoanCard }) {
  return (
    <Link href={loan.href} className="loan-type-card">
      <div className="loan-card-top-shape">
        <span className="loan-card-dots">
          • • •
          <br />
          • • •
          <br />
          • • •
        </span>
      </div>

      <div className="loan-card-bottom-shape" />

      <div className="loan-type-icon">
        <Image
          src={loan.icon}
          alt={loan.name}
          width={55}
          height={55}
        />
      </div>

      <h3>{loan.name}</h3>

      <p>{loan.desc}</p>
    </Link>
  );
}

export default function LoanTypes() {
  return (
    <section className="loan-types-section">
      <div className="loan-types-container">

        {/* SALARIED */}
        <div className="loan-type-group">
          <h2 className="loan-type-heading">
            Are You Salaried?
          </h2>

          <div className="loan-type-grid salaried-grid">
            {SALARIED_LOANS.map((loan) => (
              <LoanCard
                key={loan.name}
                loan={loan}
              />
            ))}
          </div>
        </div>

        {/* BUSINESS OWNER */}
        <div className="loan-type-group">
          <h2 className="loan-type-heading">
            Are You Business Owner?
          </h2>

          <div className="loan-type-grid business-grid">
            {BUSINESS_LOANS.map((loan) => (
              <LoanCard
                key={loan.name}
                loan={loan}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}