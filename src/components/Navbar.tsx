"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Helper function: Cookie se value read karne ke liye
  const getCookie = (name:string) => {
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
    document.body.style.overflow = "auto";
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
          
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="nav-auth-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-auth-btn login-btn">
              Login
            </Link>
          )}
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

          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <button onClick={handleLogout} className="mobile-auth-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={closeMenu} className="mobile-auth-btn login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}