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
        name: "Personal Loan",
        description:
            "Unlock financial flexibility and achieve your goals with Loan Saarthi's personalized personal loan solutions.",
        href: "/personal-loan",
        icon: "/images/icons/personal-loan-1.png",
    },
    {
        name: "Business Loan",
        description:
            "Fuel your business growth with confidence through Loan Saarthi's tailored business loan solutions.",
        href: "/business-loan",
        icon: "/images/icons/business-loan.png",
    },
    {
        name: "Credit Card",
        description:
            "Our credit cards are designed to cater to your lifestyle, offering a seamless payment experience and a host of benefits.",
        href: "/credit-cards",
        icon: "/images/icons/credit-card-1.png",
    },
    {
        name: "Vehicle Loan",
        description:
            "Whether you're eyeing a new car, or a motorcycle, we're here to make your dream ride a reality.",
        href: "/vehicle-loan",
        icon: "/images/icons/vehicle-loan.png",
    },
    {
        name: "Overdraft Facility",
        description:
            "With competitive interest rates and easy access to funds, our overdraft facility provides you with peace of mind.",
        href: "/overdraft-facility",
        icon: "/images/icons/overdraft.png",
    },
    {
        name: "Gold Loan",
        description:
            "Cash in on your gold's value with Loan Saarthi's Gold Loan, your trusted financial partner.",
        href: "/gold-loan",
        icon: "/images/icons/gold-loan.png",
    },
    {
        name: "Loan Against FD",
        description:
            "Don't let your savings stay idle; leverage them to access immediate funds for your financial needs.",
        href: "/loan-against-fd",
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

                    <h1>
                        <strong>Explore Our Range</strong>{" "}
                        of Best Services
                    </h1>
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

                            <h2>{offering.name}</h2>

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