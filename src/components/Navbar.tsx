"use client";
import { useState } from "react";
import Link from "next/link";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <span className="logo-icon">₹</span>
            <span className="logo-text">Loan<span>Saarthi</span></span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link href="/#home">Home</Link>
          <Link href="/#Loan">Loans</Link>
          <Link href="/Credit_card">Credit Cards</Link>
          <Link href="/#calculator">EMI Calculator</Link>
          <Link href="/Blog">Blog</Link>
          <Link href="/Career">Career</Link>
          <Link href="/Contact_Us">Contact Us</Link>
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
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/#Loan" onClick={closeMenu}>Loans</Link>
          <Link href="/Credit_card" onClick={closeMenu}>Credit Cards</Link>
          <Link href="/#calculator" onClick={closeMenu}>EMI Calculator</Link>
          <Link href="/Blog" onClick={closeMenu}>Blog</Link>
          <Link href="/Career" onClick={closeMenu}>Career</Link>
          <Link href="/Contact_Us" onClick={closeMenu}>Contact Us</Link>
        </div>

        {/* <div className="mobile-menu-cta">
          <a href="tel:917669486600" className="mobile-cta-call">
            📞 Call Now
          </a>
          <a href="https://wa.me/917669486600" className="mobile-cta-whatsapp">
            💬 WhatsApp
          </a>
        </div> */}
      </div>
    </>
  );
}