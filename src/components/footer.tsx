"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./Footer.css";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Helper function: Cookie read karne ke liye
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsLoggedIn(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <footer className="ls-footer">
      <div className="ls-footer-container">
        {/* Brand */}
        <div className="ls-footer-column ls-footer-brand">
          <Link href="/" className="ls-footer-logo">
            Loan<span>Saarthi</span>
          </Link>
          <p>
            LoanSaarthi helps you explore suitable loan and financial
            solutions with a simple and transparent experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="ls-footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/Blog">Blog</Link>
            </li>
            <li>
              <Link href="/Career">Career</Link>
            </li>

            {/* Auth Links: Alag-alag li elements me wrap kiya gaya hai */}
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="ls-footer-logout-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Services */}
        <div className="ls-footer-column">
          <h3>Our Services</h3>
          <ul>
            <li>
              <Link href="/loan">Personal Loan</Link>
            </li>
            <li>
              <Link href="/loan">Business Loan</Link>
            </li>
            <li>
              <Link href="/loan">Home Loan</Link>
            </li>
            <li>
              <Link href="/loan">Education Loan</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="ls-footer-column ls-footer-contact">
          <h3>Contact Us</h3>
          <div className="ls-contact-item">
            <span className="ls-contact-icon">📍</span>
            <p>
              2151/9B Goswami Girdhari Lal Marg,
              <br />
              New Patel Nagar, Shadipur,
              <br />
              Delhi - 110008
            </p>
          </div>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">☎</span>
            <a href="tel:01125792874">011-25792874</a>
          </div>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">📱</span>
            <a href="tel:+917669486600">+91-7669486600</a>
          </div>

          <div className="ls-contact-item">
            <span className="ls-contact-icon">✉</span>
            <a href="mailto:contactus@loansaarthi.com">
              contactus@loansaarthi.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="ls-footer-bottom">
        <div className="ls-footer-bottom-container">
          <p>© {new Date().getFullYear()} LoanSaarthi. All Rights Reserved.</p>
          <div className="ls-footer-bottom-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}