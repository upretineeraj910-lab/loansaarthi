import Link from "next/link";
import Image from "next/image";
import "./OurOfferings.css";

type Offering = {
    name: string;
    description: string;
    href: string;
    icon: string;
};

const OFFERINGS: Offering[] = [
    {
        name: "Home Loan",
        description:
            "Secure your dream home with ease through our comprehensive home loan services.",
        href: "/home-loan",
        icon: "/images/icons/home-loan.png",
    },
    {
        name: "Loan Balance Transfer",
        description:
            "Transfer high-cost existing loans to lower interest rates and reduce your monthly EMI payouts.",
        href: "/loan-balance-transfer",
        icon: "/images/icons/business-loan.png",
    },
    {
        name: "Credit Card",
        description:
            "Our credit cards are designed to cater to your lifestyle, offering a seamless payment experience and a host of benefits.",
        href: "/credit-card",
        icon: "/images/icons/credit-card-1.png",
    },
    {
        name: "Vehicle Loan",
        description:
            "Whether you're eyeing a new car, or a motorcycle, we're here to make your dream ride a reality.",
        href: "#",
        icon: "/images/icons/vehicle-loan.png",
    },
    {
        name: "Overdraft Facility",
        description:
            "With competitive interest rates and easy access to funds, our overdraft facility provides you with peace of mind.",
        href: "/dropline-overdraft",
        icon: "/images/icons/overdraft.png",
    },
    {
        name: "Gold Loan",
        description:
            "Cash in on your gold's value with Loan Saarthi's Gold Loan, your trusted financial partner.",
        href: "#",
        icon: "/images/icons/gold-loan.png",
    },
    {
        name: "Loan Against FD",
        description:
            "Don't let your savings stay idle; leverage them to access immediate funds for your financial needs.",
        href: "#",
        icon: "/images/icons/fd-loan.png",
    },
];

export default function OurOfferings() {
    return (
        <section className="offerings-section">
            <div className="offerings-container">

                {/* HEADING */}
                <div className="offerings-heading">
                    <span>OUR OFFERINGS</span>

                    <h2>
                        <strong>Explore Our Range</strong>{" "}
                        of Best Services
                    </h2>
                </div>

                {/* CARDS */}
                <div className="offerings-grid">
                    {OFFERINGS.map((offering) => (
                        <Link
                            href={offering.href}
                            className="offering-card"
                            key={offering.name}
                        >
                            <div className="offering-icon">
                                <Image
                                    src={offering.icon}
                                    alt={`${offering.name} icon`}
                                    width={70}
                                    height={70}
                                />
                            </div>

                            <h3>{offering.name}</h3>

                            <p>{offering.description}</p>
                        </Link>
                    ))}
                </div>

            </div>

            {/* BOTTOM DECORATION */}
            <div className="offerings-wave">
                <span />
                <span />
                <span />
            </div>
        </section>
    );
}