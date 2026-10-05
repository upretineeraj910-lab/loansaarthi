"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./navbar.css";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false); // mobile accordion state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Helper function: Cookie se value read karne ke liye
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    document.body.style.overflow = nextState ? "hidden" : "auto";
  };

  const closeMenu = () => {
    setIsOpen(false);
    setLoansOpen(false);
    document.body.style.overflow = "auto";
  };

  const toggleLoans = () => {
    setLoansOpen((prev) => !prev);
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsLoggedIn(false);
    closeMenu();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <Link href="/" prefetch={false}>
            <Image
              src="/images/icons/image-removebg-preview.png"
              alt="loansaarthi_logo"
              width={120}
              height={150}
              priority={true}
              style={{
                width: "120px",
                height: "auto",
              }}
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link href="/#home" prefetch={false}>Home</Link>
          <div className="nav-item">
            <Link href="/#Loan" prefetch={false}>Loans</Link>
            <div className="dropdown-menu">
              <Link href="/personal-loan" prefetch={false}>Personal Loan</Link>
              <Link href="/home-loan" prefetch={false}>Home Loan for Salaried</Link>
              <Link href="/loan-against-property" prefetch={false}>Loan Against Property</Link>
              <Link href="/business-loan" prefetch={false}>Business Loan</Link>
              <Link href="/dropline-overdraft" prefetch={false}>Dropline Overdraft</Link>
            </div>
          </div>
          <Link href="/#calculator" prefetch={false}>EMI Calculator</Link>
          <Link href="/about-us" prefetch={false}>About Us</Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? "open" : ""}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            Loan<span>Saarthi</span>
          </div>
          <button className="mobile-menu-close" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <div className="mobile-menu-links">
          <Link href="/" prefetch={false} onClick={closeMenu}>
            Home
          </Link>

          {/* Loans — click to expand accordion (no hover on mobile) */}
          <div className={`mobile-nav-item ${loansOpen ? "expanded" : ""}`}>
            <button
              type="button"
              className="mobile-nav-item-trigger"
              onClick={toggleLoans}
              aria-expanded={loansOpen}
            >
              <span>Loans</span>
              <ChevronDown
                size={18}
                className={`mobile-nav-item-chevron ${loansOpen ? "open" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div className={`mobile-submenu ${loansOpen ? "open" : ""}`}>
              <Link href="/personal-loan" prefetch={false} onClick={closeMenu}>
                Personal Loan
              </Link>
              <Link href="/home-loan" prefetch={false} onClick={closeMenu}>
                Home Loan for Salaried
              </Link>
              <Link href="/loan-against-property" prefetch={false} onClick={closeMenu}>
                Loan Against Property
              </Link>
              <Link href="/business-loan" prefetch={false} onClick={closeMenu}>
                Business Loan
              </Link>
              <Link href="/dropline-overdraft" prefetch={false} onClick={closeMenu}>
                Dropline Overdraft
              </Link>
            </div>
          </div>

          <Link href="/#calculator" prefetch={false} onClick={closeMenu}>
            EMI Calculator
          </Link>
          <Link href="/about-us" prefetch={false} onClick={closeMenu}>
            About Us
          </Link>
        </div>
      </div>
    </>
  );
}